'use strict';

const Fs = require('fs');
const Path = require('path');
const Util = require('util');

const WriteFolder = Util.promisify(Fs.mkdir);

module.exports = async function (path, data, options) {
	path = Path.resolve(path);

	const folders = path.split('/').slice(1);

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

};
