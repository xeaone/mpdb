var Mpdb = require('../index');

var Database = new Mpdb({
	name: 'db',
	sync: true,
	path: __dirname
});

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
