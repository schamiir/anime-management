const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000 // 3000 for local host but "process.env.PORT" for hosting sites 


const MongoClient = require('mongodb').MongoClient

// process an environment so you can put sensitive data while omitting it from the public - protects our information
const dotenv = require('dotenv')
const { MongoDBNamespace } = require('mongodb')
dotenv.config()


// setting up and connecting to mongodb -> mongodb url is in env because we have to protect our database from bad people
const MONGODB_URL = process.env.MONGODB_URL
if(!MONGODB_URL) throw new Error('Triggered')
const client = new MongoClient(MONGODB_URL)


client.connect().then(client => {

    console.log('connected to successfully to the server')
    const db = client.db('AnimeAPI')
    const animeCollection = db.collection('animeData')


    // for the egine - > ejs 
    app.set('view engine', 'ejs') //starts the view engine which is ejs
    app.use(express.static('public')) // makes the public folder accessible for the public -> allows to use static files for the ejs ( style.css, regular js, html )
    app.use(bodyParser.urlencoded({ extended: true }))

    app.put('/animeData', (req, res) => {
        console.log(req.body)
    })

    app.post('/animeData', async (req, res)=> {
        const response = await fetch (`https://kitsu.io/api/edge/anime?filter[text]=${userInput}`)
        const data = await response.json() // changes the data to JSON file
        const attributePath = data.data[0].attributes // path of api data
        //attributePath.posterImage.medium 
        const obj = {
            title: req.body.animeTitle,
            img: attributePath.posterImage.medium,
        }
        animeCollection.insertOne(obj)
         // posing a quote from the quotes selections 
        .then(result => {
            res.redirect('/') // we are then redirected to the root 
        })
        .catch (error => console.error(error)) 
            console.log(req.body)
        })

    app.get('/', (req, res) => {
    animeCollection.find().toArray()
        .then(results => {
        res.render('index.ejs', {
            anime: results
        })

    })
    .catch(/* */)
    })


    
    


    // the port is in the env because hosting site such as heroku/vercel/railway etc have their own port environment
    app.listen(PORT, () =>  console.log(`Listening at http://localhost:${PORT}`))
})

    





// http://localhost:3000/
// app.get('/', (req, res) => {
//     res.render('index.ejs') //renders the index.ejs when the endpoint is correct
// })

// app.get('/', (req, res) => {
//     // res.sendFile(__dirname + '/index.html') // do not need this because of res.render 

//     animeCollection.find().toArray()
//     .then(results => {
//         res.render('index.ejs', {nameTitle: results})
//     })
//     .catch(/* */)
// })


