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
  const { firstName, lastName, bio, image, slug, mail, mdp } = w
  return db.get('INSERT INTO users(slug, firstName, lastName, bio, image, mail, mdp) VALUES(?, ?, ?, ?, ?, ?, ?)', slug, firstName, lastName, bio, image, mail, mdp)
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
    <link href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" rel="stylesheet">
    <link rel="stylesheet" href=style.css>
    </head>
  <body>

  <!-- barnav -->
  <div class="container-fluid bg-dark mb-5">
    <nav class="navbar navbar-expand-lg navbar-dark ">
      <a class="navbar-brand" href="/home"><img src="/images/logo.png" width="30" height="30" class="d-inline-block align-top mr-3" alt="">BookYourWilder</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link" href="/home">Acceuil</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/flux">Flux</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/notification">Notification</a>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarProfil" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Profil
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarProfil">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Action 2</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Action 3</a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/admin">Admin</a>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Recherche" aria-label="Recherche">
          <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Recherche</button>
        </form>
      </div>
    </nav>
  </div>

    <!-- contenu -->
      <div id="main"></div>


    <!-- footer -->
    <footer class="container-fluid mt-5">
        <div class="row justify-content-center text-center">
            <div class="col-12">
                <img src="/images/logo.png" class="image-footer image-fluid" alt="#">
            </div>
        </div>
        <div class="row justify-content-around text-center">
            <div class="col-12 col-md-6 col-lg-4 mt-5">
                <h5>Les autres projets de la <br>Wild Code School Reims</h5>
                <div class="list-group mt-4">
                    <a href="#" class="mt-1 mb-1">
                        <p>L'environnement de dév - <span>Team Artemap</span></p>
                    </a>
                    <a href="#" class="mt-1 mb-1">
                        <p>Blog journée d'intégration - <span>Team Artefact</span></p>
                    </a>
                    <a href="#" class="mt-1 mb-1">
                        <p>Playlist Wild Code School Reims - <span>Team Artezic</span></p>
                    </a>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mt-5">
                <h5>Plus d'infos</h5>
                <a href="https://wildcodeschool.fr/" target="_blank"><button type="button" class="btn btn-primary mt-2 mb-2">Plus d'infos</button></a>
                <h5>Déposer une offre de stage</h5>
                <a href="https://wildcodeschool.fr/recruter-un-developpeur/" target="_blank"><button type="button" class="btn btn-primary mt-2 mb-2">Déposer une offre de stage</button></a>
            </div>
            <div class="col-12 col-md-6 col-lg-4 mt-5">
                <h5>Suivez-nous sur les réseaux sociaux</h5>
                <div class="d-flex flex-row justify-content-center mt-3">
                    <div class="p-4">
                        <a href="https://www.facebook.com/wildcodeschool/" target="_blank"><i class="fab fa-facebook-square rounded-circle"></i></a>
                    </div>
                    <div class="p-4">
                        <a href="https://twitter.com/wildcodeschool" target="_blank"><i class="fab fa-twitter rounded-circle"></i></a>
                    </div>
                    <div class="p-4">
                        <a href="https://www.instagram.com/wildcodeschool/" target="_blank"><i class="fab fa-instagram rounded-circle"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="row justify-content-around text-center">
            <div class="col-12 mt-5">
                <p class="copyright">Made with Love by Wild Code School Reims - <span>Team Artésien (Anahita - Arnaud G. - Maxence - Pierre)</span></p>
            </div>
        </div>
    </footer>

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
