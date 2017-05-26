var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');

var index = require('./routes/index');

var _ = require('underscore');
var db = require('./db.js');

var app = express();

app.use('/static', express.static('/public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

module.exports = app;

var PORT = process.env.PORT || 3000;
var todos = [];
var deliveries = [];
var couriers = [];
var todoNextId = 1;
var deliveryNextId = 1;
var courierNextId = 1;

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

// GET /couriers
app.get('/couriers', function (req, res) {
    var query = req.query;
    var where = {};

    db.courier.findAll({where: where}).then(function (couriers) {
        res.json(couriers);
    }, function (e) {
        res.status(500).send();
    });
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function (e) {
        res.status(500).send();
    });
});

// GET /deliveries/:id
app.get('/deliveries/:id', function (req, res) {
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

// GET /couriers/:id
app.get('/couriers/:id', function (req, res) {
    var id = parseInt(req.params.id, 10);

    db.todo.findById(id).then(function (courier) {
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

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (!matchedTodo) {
        res.status(404).json({
            "error": "no todo found with that id"
        });
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log('Express listening on port ' + PORT + '!');
    });
});
