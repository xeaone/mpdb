const Mpdb = require('../index');

const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	return Database.insert('veggies', {
		data: {
			name: 'carrot',
			details: {
				color: 'orange'
			}
		}
	});

}).catch(function (error) {
	console.log(error);
});
