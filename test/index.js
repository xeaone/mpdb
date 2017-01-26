// const PromiseTool = require('promise-tool');
const Mpdb = require('../index');

var Database = Mpdb({ name: 'db', path: __dirname });

// Promise.resolve().then(function () {
// 	return Database.removeAll('fruit');
// }).then(function () {
// 	return Database.insertOne('fruit', { name: 'apple' });
// }).then(function () {
// 	return Database.insertOne('fruit', { name: 'grape', color: 'yellow' });
// }).then(function () {
// 	return Database.insertOne('fruit', { name: 'potato' });
// }).then(function () {
// 	return Database.updateOne('fruit', { name: 'grape' }, { name: 'mango' });
// }).then(function () {
// 	return Database.removeOne('fruit', { name: 'potato' });
// }).then(function () {
// 	return Database.findOne('fruit', { name: 'apple' });
// }).then(function (item) {
// 	console.log(item);
// }).then(function () {
// 	return Database.updateOne('fruit', { name: 'apple' }, { color: 'yellow' });
// }).then(function () {
// 	return Database.findAll('fruit', { color: 'yellow' });
// }).then(function (items) {
// 	console.log(items);
// }).catch(function (error) {
// 	throw error;
// });

Promise.resolve().then(function () {
	return Database.insertOne('veggies', { name: 'green beans' });
}).then(function () {
	return Database.findOne('veggies', { name: 'green beans', $all: true });
}).then(function (item) {
	console.log(item);
}).catch(function (error) {
	throw error;
});
