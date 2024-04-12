require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const res = require('express/lib/response');
const { MongoClient } = require("mongodb");
const dns = require("dns");
const urlparser = require("url");


const client= new MongoClient( process.env.DB_URL);
const db = client.db("urlShortner");
const newUrl = db.collection("newUrl");

app.use(bodyParser.urlencoded({extended:false}));



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


// var count=0;

// // var newUrl=[];

app.post("/api/shorturl", function(req,res,next){
  // const url = String(req.body.url);
  // const hostname = new URL(url).hostname;
  const dnslookup = dns.lookup(urlparser.parse(req.body.url).hostname, async function(err, address){
    if (!address)
    {
      res.json({
        "error": "invalid url"
      })
    }
    else
    {
      const urlCount= await newUrl.countDocuments({});
      // if( await newUrl.findOne({original_url:req.body.rl}))
      // {
      //   const urlDoc= await newUrl.findOne({original_url:req.body.rl});
      // }
      // else{
        const urlDoc={
          original_url: req.body.url,
          short_url: urlCount
        };
      // }
      const result = await newUrl.insertOne(urlDoc);
      console.log(result);
      res.json(urlDoc);
    } 
  })
  // newUrl.push({
  //   "original_url": req.body.url,
  //   "shorturl": ++count
  // });

  // res.json(newUrl.find(url=> url.shorturl === count));
  // next();
  // generateShortUrl(newUrl, count);
});

// const generateShortUrl= (newUrl, count)=>{
app.get("/api/shorturl/:shorturl", async function(req,res){
  const urlDoc= await newUrl.findOne({short_url:+req.params.shorturl});
  res.redirect(urlDoc.original_url);   
});
// };

