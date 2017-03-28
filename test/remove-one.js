const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {
	console.time('removeOne');

	return Database.removeOne('veggies', {
		value: 'red',
		path: 'details.color'
	});

}).then(function () {
	console.timeEnd('removeOne');
}).then(function (collection) {
	console.log(collection);
}).catch(function (error) {
	console.log(error);
});
