var express = require('express');
var router = express.Router();
var db = require('../db.js');

var app = router;



router.get('/', function(req, res, next) {


    db.delivery.findAll({where: {state:'Delivered'} }).done(function (deliveries) {
        var count = 0;
        var statisticsbyuser = new Object();
        var keys = new Array();

        for(var j = 0 ; j < deliveries.length; j++){
            keys.push(deliveries[j].courier_uid);
            statisticsbyuser[deliveries[j].courier_uid] = 0;
        }

        for(var i = 0; i < deliveries.length; i++){
            count++;
            statisticsbyuser[deliveries[i].courier_uid]++;
        }

        res.render('statistics', { keys: keys, dictionary : statisticsbyuser });
    });


});


module.exports = router;
