const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	return Database.removeOne('veggies', {
		value: 'red',
		path: 'details.color'
	});

}).then(function () {
	return Database.collection('veggies');
}).then(function (collection) {
	console.log(collection);
}).catch(function (error) {
	console.log(error);
});
