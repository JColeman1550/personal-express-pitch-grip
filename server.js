const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID; // Import ObjectID for proper ID handling

let db;

// MongoDB connection URL and DB name
const url = "mongodb+srv://myUser:mpYoBumyguLsMmXn@cluster0.1p9jm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "pitchGrips";

app.listen(1000, () => {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
      throw error;
    }
    db = client.db(dbName);
    console.log("Connected to `" + dbName + "`!");
  });
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// GET route to render the notes page
app.get('/', (req, res) => {
  db.collection('notes').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.render('index.ejs', { notes: result });
  });
});

// POST route to add a new note
app.post('/notes', (req, res) => {
  const { title, description, handedness, armSlot } = req.body;
  db.collection('notes').insertOne({ title, description, handedness, armSlot }, (err, result) => {
    if (err) return console.log(err);
    console.log('Note saved to database');
    res.redirect('/');
  });
});

// PUT route to update a note
app.put('/notes', (req, res) => {
  const { title, description, handedness, armSlot, id } = req.body;
  db.collection('notes').findOneAndUpdate(
    { _id: new ObjectID(id) },
    { $set: { title, description, handedness, armSlot } },
    { upsert: true },
    (err, result) => {
      if (err) return res.send(err);
      res.send(result);
    }
  );
});

// DELETE route to remove a note
app.delete('/notes', (req, res) => {
  const { id } = req.body;
  db.collection('notes').deleteOne({ _id: new ObjectID(id) }, (err, result) => {
    if (err) return res.send(500, err);
    res.send('Note deleted!');
  });
});
