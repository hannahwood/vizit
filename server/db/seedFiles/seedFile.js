'use strict';

var Promise = require('bluebird');
var path = require('path');
var fs = require("fs");
var readDir = Promise.promisify(fs.readdir);
var readFile = Promise.promisify(fs.readFile);
var startdbPromise = require('../');
const mongoose = require('mongoose');
var User = mongoose.model('User');
var Code = mongoose.model('Code');
var fakeUsers = require('./mock_user_data.json');
var fileContents;

function seed(files) {
	var users = fakeUsers.map(function(userObj){
		return new User(userObj);
	});

	var code = [];
	files.forEach(function(file, i){
		var codeObj = {};
		i >= files.length-3 ? codeObj.author = users.find(function (user) { return user.email === 'lauraweiner@icloud.com'}) : codeObj.author = users[((Math.random() * users.length) | 0)]._id;
		var numRevisions = (Math.random() * 8 | 0) + 1;
		codeObj.revisions = [];
		for (var j = 0; j < numRevisions; j++){
			codeObj.revisions.push({content: file + '\n//' + 'revision #' + j, date: Date.now()});
		}
		code.push(new Code(codeObj));
	})
	var docs = users.concat(code);
	return Promise.map(docs, function (doc) {
		return doc.save();
	});
}


readDir(path.join(__dirname,'./codeExamples'))
.then(fileNames => {
	return Promise.all(fileNames.map(function(file){
		return readFile(path.join(__dirname,'./codeExamples/',file),'utf8')
	}))
}).then(files => {
	fileContents = files;
	return startdbPromise
})
.then(db => Promise.promisify(db.db.dropDatabase.bind(db.db))())
.then(() => seed(fileContents))
.then(function () {
	console.log('Seeding successful');
}, function (err) {
	console.error('Error while seeding');
	console.error(err.stack);
})
.then(function () {
	process.exit();
});
