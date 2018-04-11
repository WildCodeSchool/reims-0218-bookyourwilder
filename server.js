const sqlite = require('sqlite')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const app = express()
const wildersSeed = require('./public/wilders.json')
let db

// permet de servir les ressources statiques du dossier public
app.use(express.static('public'))
app.use(bodyParser.json())

const insertWilder = w => {
  const { firstName, lastName, bio, image, slug } = w
  return db.get('INSERT INTO users(slug, firstName, lastName, bio, image) VALUES(?, ?, ?, ?, ?)', slug, firstName, lastName, bio, image)
  .then(() => db.get('SELECT last_insert_rowid() as id'))
  .then(({ id }) => db.get('SELECT * from users WHERE id = ?', id))
}

const dbPromise = Promise.resolve()
.then(() => sqlite.open('./database.sqlite', { Promise }))
.then(_db => {
  db = _db
  return db.migrate({ force: 'last' })
})
.then(() => Promise.map(wildersSeed, w => insertWilder(w)))

const html = `
<!doctype html>
<html lang="en">
  <head>
    <title>FaceYourWilder</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
  <body>
    <div class="container">

      <div id="main"></div>
    </div>
      
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="/page.js"></script>
    <script src="/app.js"></script>
  </body>
</html>`


//routing coté Serveur

//routes de l'api REST qui répondent par du

//CREATE
app.post('/wilders', (req, res) => {
  return insertWilder(req.body)
  .then(record => res.json(record))
})

//READ
app.get('/wilders', (req, res) => {
  db.all('SELECT * from users')
  .then(records => res.json(records))
})

// route par défaut qui renvoit le code html/css/js complet de l'application
app.get('*', (req, res) => {
  // to test log du path
  res.send(html)
  res.end()
})

app.listen(8080)