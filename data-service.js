const db = require('./firebase-config');

async function getPavimentoData() {
    const ref = db.ref('Pavimento');
    try {
        const snapshot = await ref.once('value');
        return snapshot.val();
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        throw error;
    }
}

module.exports = { getPavimentoData };