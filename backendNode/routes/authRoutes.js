const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


router.post('/get-token', (req, res) => {
    const { password } = req.body;

    if (password === 'hardcodedPassword') {
        const token = jwt.sign({ user: 'authorizedUser' }, 'secretKey', { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(403).json({ mensaje: 'Contraseña incorrecta' });
    }
});

module.exports = router;
