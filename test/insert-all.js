const Mpdb = require('../index');

const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

Promise.resolve().then(function () {

	return Database.insertAll('veggies', [
		{
			path: 0,
			value: {
				name: 'carrot',
				details: {
					color: 'orange'
				}
			}
		},
		{
			value: {
				name: 'pears',
				details: {
					color: 'green'
				}
			}
		}
	]);

}).catch(function (error) {
	console.log(error);
});
