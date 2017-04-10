const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	return Database.updateAll('veggies', {
		value: 'brown',
		path: 'details.color',
		data: {
			'more.stuff': 'yah',
			'details.color': 'brown'
		}
	});

}).catch(function (error) {
	console.log(error);
});
