const Mpdb = require('../index');

const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {
	console.time('insertOne');

	return Database.insertOne('veggies', {
		path: 0,
		value: {
			name: 'carrot',
			details: {
				color: 'orange'
			}
		}
	});

}).then(function () {
	console.timeEnd('insertOne');

	return Database.findOne('veggies', {
		value: 'red',
		path: 'details.color'
	});

}).then(function (result) {
	console.log(result);
}).catch(function (error) {
	console.log(error);
});
