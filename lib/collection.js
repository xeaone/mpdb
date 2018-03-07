'use strict';

const Fs = require('fs');
const Path = require('path');
const Buffer = require('buffer');

module.exports = class Collection {

	constructor (options) {
		options = options || {};
		this.reader = null;
		this.writer = null;
		this.data = options.data || [];
		this.space = options.space || '\t';
		this.path = Path.resolve(options.path);
	}

	parse (data) {
		return JSON.parse(data);
	}

	string (data) {
		return JSON.stringify(data, null, this.space);
	}

	_read (reader) {
		return new Promise(function (resolve, reject) {
			const chunks = [];

			reader.on('error', function (error) {
				if (error.code === 'ENOENT') {
					resolve('[]');
				} else {
					reject(error);
				}
			});

			reader.on('end', function () {
				resolve(Buffer.concat(chunks).toString());
			});

			reader.on('data', function (chunk) {
				chunks.push(chunk);
			});

		});
	}

	_write (writer, data) {
		return new Promise(function (resolve, reject) {

			writer.on('error',  function (error) {
				reject(error);
			});

			writer.on('finish', function () {
				resolve();
			});

			writer.end(data);
		});
	}

	async load () {
		this.reader = this.reader || Fs.createReadStream(this.path);
		const data = await this._read(this.reader);
		this.data = this.parse(data);
	}

	async save () {
		this.writer = this.writer || Fs.createWriteStream(this.path);
		const data = this.string(this.data);
		await this._write(this.writer, data);
	}
	
};
