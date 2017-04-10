const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	return Database.updateOne('veggies', {
		value: 'potato',
		path: 'name',
		data: {
			'more.stuff': 'yah',
			'details.color': 'brown'
		}
	});
}).then(function (result) {
	console.log(result);
}).catch(function (error) {
	console.log(error);
});
