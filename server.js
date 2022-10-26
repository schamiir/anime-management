const express = require('express') // it lets use express 
const app = express() // returns an object -> that has methods of get/post/delete etc

// What is the difference between these two?
// app.get(/* */) -> we need to work on the same "instance" of the object and build on top of it 
// Instance => session / initialized version of the object. 
// express().get(/* */)  -> if we call express() everytime we will be creating a new object we dont want that !== instance object 

const bodyParser = require('body-parser') // middleware > explained on line 43 ~ 45


/* new packages*/
const methodOverride = require('method-override') // use for the delete 
const fetch = require('node-fetch') // lets us use fetch on the server side (using version @2)
// npm install node-fetch@2 => how to install

const PORT = process.env.PORT || 3000 // 3000 for local host but "process.env.PORT" for hosting sites 

const MongoClient = require('mongodb').MongoClient // this let us use MongoDB 


// process an environment so you can put sensitive data while omitting it from the public - protects our information
const dotenv = require('dotenv')
const { MongoDBNamespace, ObjectId } = require('mongodb') // {MongoDBNamespace} -> object destructuring its can be found in the mongodb pacakge
// Object Destructuring: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring
dotenv.config() // this is initializing dotenv 


// setting up and connecting to mongodb -> mongodb url is in env because we have to protect our database from bad people
const MONGODB_URL = process.env.MONGODB_URL // the string is inside the url 
if (!MONGODB_URL) throw new Error('Triggered') // self explanatory if url does not exist throw error

const client = new MongoClient(MONGODB_URL) // MongoClient is an object and we are passing MongoDB URl to the object. The 'new' keyword initializes the 'instances' (branch) of the object


client.connect().then(client => {

    console.log('connected to successfully to the server')
    const db = client.db('AnimeAPI') // this makes our folder / database in MongoDB
    const animeCollection = db.collection('animeData') // it creates a collection inside the database in our MongoDB 


    // for the engine - > ejs 
    app.set('view engine', 'ejs') //'app.set()' sets the Express application settings, 'view engine' is the property that controls which view engine is used

    app.use(express.static('public')) // makes the public folder accessible for the public -> allows to use static files for the ejs ( style.css, regular js, html ) express.static finds where

    app.use(bodyParser.urlencoded({ extended: true })) // Express lets us use middleware with .use method 
    // bodyParser => they help tidy up the request object
    // urlencoded => tells the bodyparser to extract data from the <form> element and attach them to the body property of the request object

    // Taken from https://expressjs.com/en/resources/middleware/method-override.html#custom-logic
    app.use(methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            var method = req.body._method
            delete req.body._method
            return method
        }
    }))

    app.put('/animeData', (req, res) => { // creates the '/animeData' route and expects it to be a 'PUT' method. 
        console.log(`put ${req.body}`)
    })


    app.get('/', (req, res) => {
        animeCollection.find().toArray() // Goes into the COLLECTION and FINDS the documents and turns them into an ARRAY of OBJECTS 
        .then(results => {
        res.render('index.ejs', { // renders the "array of objects" on ejs so we can use it 
            anime: results //to use the results -> we assign the "array of objects" into the variable of "anime" that contains the stuff inside: id, title, img....
        })
    })
    .catch(/* */)
    })

    app.post('/animeData', async (req, res)=> {
        const response = await fetch (`https://kitsu.io/api/edge/anime?filter[text]=${req.body.animeTitle}`)
        const data = await response.json() // changes the data to JSON file
        const attributePath = data.data[0].attributes // path of api data
        console.log(attributePath) 
        // creating an object that we will pass on the the insertOne method 
        const obj = {
            title: req.body.animeTitle,
            img: attributePath.posterImage.medium,
        }

        // posting the object that we created using the insertOne method in the animeCollection
        animeCollection.insertOne(obj)
            .then(() => res.redirect('/')) // we are then redirected to the root
            .catch(error => console.error(error)) 
    })

    app.delete('/animeData', async (req, res) => {
        // Documentation example: https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/#delete-a-single-document
        animeCollection.deleteOne({
            _id: ObjectId(req.body.id)
        }).then(result => {
            console.log(`Deleted ObjectId(${req.body.id})`)
            res.redirect('/') // we are then redirected to the root 
        }).catch(error => console.log(`Error: ${error}`))
    })

    
    // the port is in the env because hosting site such as heroku/vercel/railway etc have their own port environment
    app.listen(PORT, () =>  console.log(`Listening at http://localhost:${PORT}`))
})
