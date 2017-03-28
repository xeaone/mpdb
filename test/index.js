// const PromiseTool = require('promise-tool');
const Mpdb = require('../index');

const Database = Mpdb({ name: 'db', path: __dirname, sync: true });

// Promise.resolve().then(function () {
// 	return Database.insertOne('veggies', { name: 'beans', details: { color: 'red' } });
// }).then(function () {
// 	return Database.insertOne('veggies', { name: 'potato', details: { color: 'brown' } });
// }).then(function () {
// 	return Database.insertOne('veggies', { name: 'apples', details: { color: 'red' } });
// }).then(function () {
// 	return Database.findAll('veggies', { 'details.color': 'red' });
// }).then(function (item) {
// 	console.log(item);
// }).catch(function (error) {
// 	console.log(error);
// });
