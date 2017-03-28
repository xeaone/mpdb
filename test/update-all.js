const Mpdb = require('../index');
const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	var options = {
		all: false,
		update: true,
		value: 'brown',
		path: 'veggies.details.color',
		data: {
			'details.color': 'brownish'
		}
	};

	return Database.interact(options);

}).catch(function (error) {
	console.log(error);
});
