const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const https = require('https');
const app = express();

const uri = "mongodb+srv://hibiki:test123@cluster0.akkrkpr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to MongoDB Atlas cluster");
  }
});


app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true, limit: '3mb'}));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.send('Homepage');
});

app.post('/insert', (req, res) => {
  const data = req.body;
  console.log(data);
  const value = data.value;
  const user = data.user;

  if (!user) {
    return res.status(400).send("Missing user parameter in request body");
  }

  const collection = client.db("test").collection(user);
  collection.insertOne({ value })
        .then(result => {
            console.log("Value inserted into database");
            console.log(res.headersSent); // Outputs: false
            res.send("Value inserted into database: " + value);
            console.log(res.headersSent); // Outputs: true
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send("Error inserting data into database");
        });
});

app.post('/getData', (req, res) => {
  const user = req.body.user;
  const collection = client.db("test").collection(user);

  collection.find({}).toArray()
    .then(docs => {
      console.log("Data retrieved from database:", docs);
      res.send(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("Error retrieving data from database");
    });
});

app.post('/delete', (req, res) => {
  const data = req.body;
  const user = data.user;
  const value = data.value;

  if (!user) {
    return res.status(400).send("Missing user parameter in request body");
  }

  if (!value) {
    return res.status(400).send("Missing value parameter in request body");
  }

  const collection = client.db("test").collection(user);
  collection.deleteOne({ value })
    .then(result => {
      console.log("Value deleted from database");
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send("Error deleting data from database");
    });
});

const port = process.env.PORT || 3000;
https.createServer(options, app).listen(port, console.log(`Listening on port ${port}...`));
