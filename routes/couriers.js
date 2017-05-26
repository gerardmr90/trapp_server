var express = require('express');
var couriers = require('./routes/couriers');
var bodyParser = require('body-parser');

var db = require('./db.js');
var app = express();

module.exports = app;
app.use(bodyParser.json());

// GET /couriers
app.get('/couriers', function (req, res) {
    var query = req.query;
    var where = {};

    db.delivery.findAll({where: where}).then(function (couriers) {
        res.json(couriers);
    }, function (e) {
        res.status(500).send();
    });
});

// POST /couriers
app.post('/couriers', function (req, res) {
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