var Mpdb = require('../index');
var Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {
	console.time('find one');

	return Database.findOne('veggies', {
		value: 're',
		path: 'details.color'
	});

}).then(function (item) {
	console.timeEnd('find one');
	console.log(item);
}).catch(function (error) {
	console.log(error);
});
