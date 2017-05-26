var express = require('express');
var deliveries = require('./routes/deliveries');

var db = require('./db.js');
var app = express();

module.exports = app;
app.use(bodyParser.json());

// GET /deliveries
app.get('/deliveries', function (req, res) {
    var query = req.query;
    var where = {};

    db.delivery.findAll({where: where}).then(function (deliveries) {
        res.json(deliveries);
    }, function (e) {
        res.status(500).send();
    });
});

// POST /deliveries
app.post('/deliveries', function (req, res) {
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
