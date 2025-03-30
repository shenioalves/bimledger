const express = require('express');
const formidable = require('express-formidable');
const { listObjects, uploadObject, translateObject, getManifest, urnify, getInternalToken } = require('../services/aps.js');

let router = express.Router();

router.get('/api/models', async function (req, res, next) {
    try {
        const objects = await listObjects();
        res.json(objects.map(o => ({
            name: o.objectKey,
            urn: urnify(o.objectId)
        })));
    } catch (err) {
        next(err);
    }
});

router.get('/api/models/:urn/status', async function (req, res, next) {
    try {
        const manifest = await getManifest(req.params.urn);
        if (manifest) {
            let messages = [];
            if (manifest.derivatives) {
                for (const derivative of manifest.derivatives) {
                    messages = messages.concat(derivative.messages || []);
                    if (derivative.children) {
                        for (const child of derivative.children) {
                            messages.concat(child.messages || []);
                        }
                    }
                }
            }
            res.json({ status: manifest.status, progress: manifest.progress, messages });
        } else {
            res.json({ status: 'n/a' });
        }
    } catch (err) {
        next(err);
    }
});

router.post('/api/models',formidable({ maxFileSize: Infinity }), async function (req, res, next) {
    try {
        const file = req.files['model-file'];
        if (!file) {
            res.status(400).send('The required field ("model-file") is missing.');
            return;
        }
        const obj = await uploadObject(file.name, file.path);
        const urn = urnify(obj.objectId);

        await translateObject(urn, req.fields['model-zip-entrypoint']);

        res.json({ name: obj.objectKey, urn });
    } catch (err) {
        next(err);
    }
});

router.get('/api/models/:urn/properties', async function (req, res, next) {
    try {
        const accessToken = await getInternalToken();
        const urn = req.params.urn;
        
        // Chamar a API da Autodesk para obter propriedades
        const response = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const metadata = await response.json();

        if (!metadata || !metadata.data || !metadata.data.metadata) {
            return res.status(404).json({ message: "Metadados não encontrados." });
        }

        // Pegando o primeiro viewable (ajuste se necessário)
        const guid = metadata.data.metadata[0].guid;
        
        const propertiesResponse = await fetch(`https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${guid}/properties`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const properties = await propertiesResponse.json();

        // Filtrar propriedades que contenham Pavimento e Status
        const pavimentos = properties.data.collection.filter(item =>
            item.properties["Dados de identidade"]?.Pavimento !== undefined &&
            item.properties["Dados de identidade"]?.Status !== undefined
        ).map(item => ({
            pavimento: item.properties["Dados de identidade"].Pavimento,
            status: item.properties["Dados de identidade"].Status
        }));

        const result = processPavimentoStatus(pavimentos);

        res.json(result);
    } catch (err) {
        next(err);
    }
});

function processPavimentoStatus(data) {
    const pavimentosMap = {};
    
    // Agrupar os status por pavimento
    data.forEach(({ pavimento, status }) => {
        if (pavimento && pavimento.startsWith("P")) {
            if (!pavimentosMap[pavimento]) {
                pavimentosMap[pavimento] = [];
            }
            pavimentosMap[pavimento].push(status);
        }
    });
    
    // Verificar se todos os status são "Yes" para cada pavimento
    const resultado = Object.entries(pavimentosMap).map(([pavimento, statuses]) => {
        return {
            pavimento,
            status: statuses.every(status => status === "Yes")
        };
    });

    return resultado;
}

module.exports = router;
