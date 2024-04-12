require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const res = require('express/lib/response');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.use(bodyParser.urlencoded({extended:false}));

var count=0;

app.post("/api/shorturl", function(req,res){

  const newUrl={
    "original_url": req.body.url,
    "shorturl": ++count
  }

  res.json(newUrl);

  generateShortUrl(newUrl, count);
});

const generateShortUrl= (newUrl, count)=>{
  app.get("/api/shorturl/"+ count, function(req,res){
    res.redirect(newUrl["original_url"]);
  });
};

