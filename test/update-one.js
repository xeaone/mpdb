const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	return Database.updateOne('veggies', {
		value: 'brown',
		path: 'details.color',
		data: {
			value: 'brownish',
			path: 'details.color'
		}
	});

}).catch(function (error) {
	console.log(error);
});
