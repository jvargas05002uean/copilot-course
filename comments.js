// Create web server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

app.post('/comments', async (req, res) => {
  const { name, email, comment } = req.body;

  try {
    await client.connect();
    const database = client.db('commentsDB');
    const collection = database.collection('comments');

    const newComment = { name, email, comment };
    const result = await collection.insertOne(newComment);

    res.status(201).json({ message: 'Comment added successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding comment' });
  } finally {
    await client.close();
  }
});

app.get('/comments', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('commentsDB');
    const collection = database.collection('comments');

    const comments = await collection.find({}).toArray();

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching comments' });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});