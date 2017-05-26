var express = require('express');
var router = express.Router();
var db = require('../db.js');

// GET /couriers
router.get('/', function (req, res) {
    var query = req.query;
    var where = {};

    db.courier.findAll({where: where}).then(function (couriers) {
        res.json(couriers);
    }, function (e) {
        res.status(500).send();
    });
});


// GET /couriers/:id
router.get('/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);

    db.courier.findById(id).then(function (courier) {
        if (courier) {
            res.json(courier.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });
});


// POST /couriers
router.post('/', function (req, res) {
    var query = req.query;
    db.courier.create({
        uid: query.uid,
        name: query.name,
        email: query.email,
        latitude: query.latitude,
        longitude: query.longitude
    }).then(function (courier) {
        res.json(courier.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});



// DELETE /couriers/:uid
router.delete('/:uid', function (req, res) {
    var where = {};
    var uid = req.params.uid;

    where.uid = {$eq: uid};

    db.courier.destroy({where: where})
    return res.status(204).send();
});

module.exports = router;
