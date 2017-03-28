var Mpdb = require('../index');
var Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {
	console.time('find all');

	return Database.findAll('veggies', {
		value: 'red',
		path: 'details.color'
	});

}).then(function (item) {
	console.timeEnd('find all');
	console.log(item);
}).catch(function (error) {
	console.log(error);
});
