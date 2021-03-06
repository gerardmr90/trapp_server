var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-api.sqlite'
	});
}

var db = {};

db.courier = sequelize.import(__dirname + '/models/courier.js');
db.delivery = sequelize.import(__dirname + '/models/delivery.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;