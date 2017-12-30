const express = require('express');
const app = express();
const request = require('request');
const mongoose = require('mongoose');
const searchTerm = require('./models/searchTerm.js')
const cseUrl = 'https://www.googleapis.com/customsearch/v1';
const cseKey = 'AIzaSyDnM1DGqcAJf52Yi5U_28LG8WWveaMGUoU';
const cseCx = '012119060989287235528:jozati9g1s0';
const cseSearchType = 'image';
var url = cseUrl+'?key='+cseKey+'&cx='+cseCx+'&searchType=image&q=';
var query;
var offset;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://zorque:VerySecurePassword@ds235877.mlab.com:35877/heroku_hnhx6qcf', { useMongoClient: true });
mongoose.Promise = global.Promise;
app.get('/', function(req,res){
  res.send('boe');
})
app.get('/api/searchHistory', function(req, res){
  searchTerm.find().sort('-searchDate').exec(function(err, data) {
    res.json(data);
  });
});

app.get('/api/imagesearch/:searchTerm*', function(req, res, next){
  query = req.params.searchTerm;
  offset = req.query.offset ? '&start='+req.query.offset : '&start='+1;

  // create dataset for insert into database
  var search = new searchTerm({
    searchTerm: query,
    searchDate: new Date()
  });
  // save search data to database
  search.save(function(err, data){
    if(err){
      res.send('error saving to database; '+err)
    }
    res.send(url+query+offset);
  });
  // call googleapis
  request(url+query+offset, function(err, resp, body){
    if(err){
      res.send(err);
    }
    var data = JSON.parse(body);
    var items = data.items.map(function(item){
      return {
          url: item.link,
          snippet: item.snippet,
          thumbnail: item.image.thumbnailLink,
          context: item.image.contextLink
      };
    });
    res.send(items);
  })

});

app.listen(process.env.PORT || 3000, function(){
  console.log('server running...')
})
