var express = require('express');
var router = express.Router();
var db = require('../db.js');

var app = router;

// GET /deliveries
app.get('/', function (req, res) {
    var query = req.query;
    var where = {};

    db.delivery.findAll({where: where}).then(function (deliveries) {
        res.json(deliveries);
    }, function (e) {
        res.status(500).send();
    });
});

// GET /deliveries/:id
app.get('/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);

    db.delivery.findById(id).then(function (delivery) {
        if (delivery) {
            res.json(delivery.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });
});

// POST /deliveries
app.post('/', function (req, res) {
    var query = req.query;
    db.delivery.create({
        delivery_uid: query.delivery_uid,
        courier_uid: query.courier_uid,
        receiver_uid: query.receiver_uid,
        company_uid: query.company_uid,
        company_name: query.company_name,
        address: query.address,
        date: query.company_name,
        state: query.state
    }).then(function (delivery) {
        res.json(delivery.toJSON());
    }, function (e) {
        res.status(400).json(e);
    });
});

// DELETE /deliveries/:delivery_uid
app.delete('/:delivery_uid', function (req, res) {
    var where = {};
    var delivery_uid = req.params.delivery_uid;

    where.delivery_uid = {$eq: delivery_uid};

    db.delivery.destroy({where: where})
    return res.status(204).send();
});

module.exports = router;
