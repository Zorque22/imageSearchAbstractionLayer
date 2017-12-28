const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const searchTermSchema = new Schema({
  searchTerm: String,
  searchDate: Date
});

const SearchTermModel = mongoose.model('searchTerm', searchTermSchema);

module.exports = SearchTermModel;
