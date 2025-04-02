const express = require('express');
const { getViewerToken, getInternalToken } = require('../services/aps.js');

let router = express.Router();

router.get('/api/auth/token', async function (req, res, next) {
    try {
        res.json(await getViewerToken());
    } catch (err) {
        next(err);
    }
});

router.get('/api/getToken', async function (req, res, next) {
    try {
        const accessToken = await getInternalToken();
        res.json({ access_token: accessToken });
    } catch (err) {
        next(err);
    }
});

module.exports = router;