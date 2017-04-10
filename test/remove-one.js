const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {
	console.time('removeOne');

	return Database.removeOne('veggies', {
		value: 'peas',
		path: 'name'
	});

}).then(function (result) {
	console.timeEnd('removeOne');
	console.log(result);
}).catch(function (error) {
	console.log(error);
});
