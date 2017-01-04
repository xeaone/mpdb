const PromiseTool = require('promise-tool');
const Mpdb = require('../index');

var options = { name: 'db', path: __dirname };
var Database = Mpdb(options);

Promise.resolve().then(function () {
	return Database.collection('fruit');
}).then(function () {
	return Database.removeAll('fruit');
}).then(function () {
	return Database.insertOne('fruit', { name: 'apple' });
}).then(function () {
	return Database.insertOne('fruit', { name: 'mango' });
}).then(function () {
	return Database.insertOne('fruit', { name: 'potato' });
}).then(function () {
	return PromiseTool.setTimeout(3000);
}).then(function () {
	return Database.updateOne('fruit', { name: 'mango' }, { name: 'grape' });
}).then(function () {
	return PromiseTool.setTimeout(3000);
}).then(function () {
	return Database.removeOne('fruit', { name: 'potato' });
}).catch(function (error) {
	console.error(error);
});
