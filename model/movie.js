var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movie = new Schema({
    title: String,
    category: String,
    years: Number
});

module.exports = mongoose.model('Movie', movie);