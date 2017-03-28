const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	return Database.findAll('veggies', {
		value: 'red',
		path: 'details.color'
	});

}).then(function (item) {
	console.log(item);
}).catch(function (error) {
	console.log(error);
});
