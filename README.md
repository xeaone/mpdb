# Mpdb

A persistent in memory database. A database that is kept in memory and immediately persistent.

## Install
`npm install mpdb --save`

## API

### Mpdb
A initializes the files and directories. Collections are loaded annd kept in memory on demand. The data is stored in a json format.

- `options: Object`
	- `name: String` The name of the database. Default is `'default'`.
	- `sync: String` Initalize sync or async. Default is `false`.
	- `path: String` The path to the persistent data. Default is `~/{username}/.mpdb/.`

### Mpdb.findAll
- Returns `Promise`

### Mpdb.findOne
- Returns `Promise`

### Mpdb.removeAll
- Returns `Promise`

### Mpdb.removeOne
- Returns `Promise`

### Mpdb.updateAll
- Returns `Promise`

### Mpdb.updateOne
- Returns `Promise`

### Mpdb.insertAll
- Returns `Promise`

### Mpdb.insertOne
- Returns `Promise`

### Mpdb.collection
- Returns `Promise`

### Mpdb.collectionLoad
- Returns `Promise`

### Mpdb.collectionSave
- Returns `Promise`

### Mpdb.collectionPath
