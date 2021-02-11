// load dependencies
const express = require('express')
const bodyParser = require('body-parser');
const app = express()

// initial setup
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

// connect to cloud MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
MongoClient.connect('mongodb+srv://admin:admin@webapp.embs9.mongodb.net', (err, client) => {
    db = client.db('lessons')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

// retrieve all the objects from a collection
app.get('/collection/:collectionName', (req, res) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})
