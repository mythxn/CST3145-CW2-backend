// load dependencies
const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const app = express()

// initial setup
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

// logger middleware
app.use((req, res, next) => {
    console.log("LOGGER: " + req.url)
    next()
})

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

// deploy /public
app.use(express.static(path.resolve(__dirname, 'public')));

// 404 middleware
// app.use((req, res) => {
//     res.status(404).send("Page not found!")
// });

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})
