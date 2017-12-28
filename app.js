const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require('cors');
const mongoose = require('mongoose');
const Bing = require('node-bing-api')({accKey:'5aedfe5b46e64630b88fe7cc5e8fbd1d'});
const searchTerm = require('./models/searchTerm.js')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/searchTerms', { useMongoClient: true });

app.use(bodyParser.json());
// app.use(cors());

app.get('/api/imagesearch/:searchTerm*', function(req, res, next){
  var search = new searchTerm({
    searchTerm: req.params.searchTerm,
    searchDate: new Date()
  });
  search.save(function(err, data){
    if(err){
      res.send('error saving to database; '+err)
    }
    // res.json(data);
  });
  Bing.images(req.params.searchTerm, {count:10}, function(err, data){
    res.json(data);
  })
});

app.get('/api/latest/imagesearch', function(req, res, next){
  searchTerm.find(function(err, data){
    if(err){
      res.send('error saving to database; '+err)
    }
    res.json(data);
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log('server running...')
})
