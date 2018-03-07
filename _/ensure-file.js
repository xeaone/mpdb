'use strict';

const Fs = require('fs');
const Path = require('path');
const Util = require('util');

const Stat = Util.promisify(Fs.stat);
const WriteFolder = Util.promisify(Fs.mkdir);
const WriteFile = Util.promisify(Fs.writeFile);

module.exports = async function (path, data, options) {
	path = Path.resolve(path);

	const folders = path.split('/').slice(1, -1);
	const file = path.split('/').slice(-1)[0];

	path = '/';

	for (let folder of folders) {
		path = Path.join(path, folder);

		try {
			await WriteFolder(path);
		} catch (error) {
			if (error.code !== 'EEXIST') {
				throw error;
			}
		}

	}

	path = Path.join(path, file);

	let exists = false;

	try {
		const stat = await Stat(path);
		exists = stat.isFile();
	} catch (error) {
		if (error.code === 'ENOENT') {
			exists = false;
		} else {
			throw error;
		}
	}

	if (!exists) {
		await WriteFile(path, data, options);
	}

};
