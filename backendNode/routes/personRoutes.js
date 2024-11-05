const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { body, param, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/authMiddleware');

router.post(
    '/persona',
    authenticateToken,
    [
        body('nombre').isString().isLength({ max: 50 }).withMessage('Nombre debe ser un texto de hasta 50 caracteres.'),
        body('edad').isInt({ min: 0 }).withMessage('Edad debe ser un número entero positivo.')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const { nombre, edad } = req.body;
        const edadIncrementada = edad + 1;
        const query = 'INSERT INTO PERSONA (nombre, edad) VALUES (?, ?)';
        db.query(query, [nombre, edadIncrementada], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ mensaje: 'Error al insertar los datos' });
            }
            res.status(201).json({
                id: results.insertId,
                mensaje: 'Registro insertado correctamente'
            });
        });
    }
);

router.put(
    '/persona/:id',
    authenticateToken,
    [
        param('id').isInt().withMessage('ID debe ser un número entero.'),
        body('nombre').isString().isLength({ max: 50 }).withMessage('Nombre debe ser un texto de hasta 50 caracteres.'),
        body('edad').isInt({ min: 0 }).withMessage('Edad debe ser un número entero positivo.')
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() });
        }

        const { id } = req.params;
        const { nombre, edad } = req.body;

        db.query('SELECT * FROM PERSONA WHERE id = ?', [id], (err, results) => {
            if (err) {
                return res.status(500).json({ mensaje: 'Error al verificar los datos' });
            }
            if (results.length === 0) {
                return res.status(404).json({ mensaje: 'Persona no encontrada' });
            }

            const query = 'UPDATE PERSONA SET nombre = ?, edad = ? WHERE id = ?';
            db.query(query, [nombre, edad, id], (err, results) => {
                if (err) {
                    return res.status(500).json({ mensaje: 'Error al actualizar los datos' });
                }
                res.status(200).json({ mensaje: 'Registro actualizado' });
            });
        });
    }
);



router.get('/persona/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM PERSONA WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error al obtener los datos' });
        }
        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Persona no encontrada' });
        }

        const persona = results[0];
        const edadFutura = persona.edad + 1;

        res.status(200).json({
            id: persona.id,
            nombre: persona.nombre,
            edad: persona.edad,
            edadFutura: edadFutura
        });
    });
});


module.exports = router;
