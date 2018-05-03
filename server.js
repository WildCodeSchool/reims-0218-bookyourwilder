const sqlite = require('sqlite')
const express = require('express')
const methodOverride = require("method-override")
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const passport = require('passport')
const nodemailer = require("nodemailer")
const app = express()
const wildersSeed = require('./public/wilders.json')
const fluxsSeed = require('./public/fluxs.json')

let db

require('./public/passport-strategy')
const auth = require('./public/auth')

// permet de servir les ressources statiques du dossier public
app.use(express.static('public'))
app.use(bodyParser.json())
app.use('/auth', auth)
app.use(methodOverride("_method"))

// insertWilder dans la db
const insertWilder = w => {
    const { firstName, lastName, title, projet, bio, coteWild, image, slug, mail, urlLi, urlGh, password, mobility, adress } = w
    return db.get('INSERT INTO users(slug, firstName, lastName, title, projet, bio, coteWild, image, mail, urlLi, urlGh, password, mobility, adress) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', slug, firstName, lastName, title, projet, bio, coteWild, image, mail, urlLi, urlGh, password, mobility, adress)
    .then(() => db.get('SELECT last_insert_rowid() as id'))
    .then(({ id }) => db.get('SELECT * from users WHERE id = ?', id))
  }

// updateWilder dans la db
const updateWilder = w => {
    const { firstName, lastName, title, projet, bio, coteWild, image, slug, mail, urlLi, urlGh, password, adress, mobility, wilderChange_id } = w
    console.log(w)
    return db.get(`UPDATE users SET slug=?, firstName=?, lastName=?, title=?, projet=?, bio=?, coteWild=?, image=?, mail=?, urlLi=?, urlGh=?,password=?, adress=?, mobility=? where id=?;`,slug, firstName,lastName,title, projet, bio, coteWild, image, mail, urlLi, urlGh, password, adress, mobility, wilderChange_id)
    }

// insertflux dans la db
const insertflux = f => {
    const { fluxs } = f
    return db.get('INSERT INTO fluxs( texte, wilder_id, date_message ) VALUES(?, ?, date("now"))', fluxs)
    .then(() => db.get('SELECT last_insert_rowid() as id'))
    .then(({ id }) => db.get('SELECT * from fluxs WHERE id = ?', id))
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
            <title>BookYourWilder</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
            <link href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" rel="stylesheet">
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <header class="container-fluid bg-dark" id="navbarMenu">
                <nav class="navbar navbar-expand-lg navbar-dark ">
                    <a class="navbar-brand" href="/home"><img src="/images/logo.png" width="30" height="30" class="d-inline-block align-top mr-3" alt="">BookYourWilder</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                    <div class="collapse navbar-collapse text-center" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/home">Acceuil</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/">Inscription</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/flux">Flux</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarProfil" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Profil</a>
                                <div class="dropdown-menu" aria-labelledby="navbarProfil">
                                <a class="dropdown-item" href="#">Mon profil</a>
                                <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" id="disconnect" href="/">Déconnection</a>
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
            </header>
            
            <div id="main"></div>

            <footer class="container-fluid pt-2 bg">
                <div class="row justify-content-around text-center">
                    <div class="col-12 col-sm-6 col-md-4 mt-5">
                        <h5>Les autres projets de la <br>Wild Code School Reims</h5>
                        <div class="list-group mt-4">
                            <a href="#" class="mt-1 mb-1">
                                Mario Kart Contest
                            </a>
                            <a href="#" class="mt-1 mb-1">
                                Artezic Reloaded
                            </a>
                            <a href="#" class="mt-1 mb-1">
                                World Cup Pronostics
                            </a>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 mt-5">
                        <h5>Plus d'infos sur l'école</h5>
                        <a href="https://wildcodeschool.fr/" target="_blank"><button type="button" class="btn btn-primary mt-2 mb-2">Plus d'infos</button></a>
                    </div>
                    <div class="col-12 col-sm-6 col-md-4 mt-5">
                        <h5>Suivez-nous sur les réseaux sociaux !</h5>
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
                        <p class="copyright">Made with Love by Wild Code School Reims - <span>Team Book Your Wilder (Maxence - Florian - Philippe)</span></p>
                    </div>
                </div>
            </footer>

            <script>
            //stores the token
            document.getElementById('disconnect').addEventListener('click', () => {
                localStorage.removeItem('token')
                localStorage.removeItem('tokenId')
            })

            </script>

        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
        <script src="/page.js"></script>
        <script src="/app.js"></script>
    </body>
</html>`



//routing coté Serveur

//routes de l'api REST qui répondent par du

//CREATE
app.post('/wilders', (req, res) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secureConnection: false,
        tls: {
          ciphers: "SSLv3"
        },
        auth: {
            user: "WildCodeSchool@hotmail.com",
            pass: "Wi1dC0d35h001"
        }
      });
    
      let mailOptions = {
        from: "<WildCodeSchool@hotmail.com>",
        to: `${req.body.mail}`,
        subject: "Bienvenue sur BookYourWilder !",
        text: `Hey ${req.body.firstName} ${req.body.lastName} !
        Bienvenue dans le comité très restreint des Wilders !
        Vous pouvez désormais vous authentifier avec votre adresse mail (${req.body.mail}) et le mot de passe que vous avez défini.
        Sur ce, à bientôt sur BookYourWilder !
        
        (En cas de questions, vous pouvez envoyer un mail à WildCodeSchool@hotmail.com. Les spams, je les dévore tous crus !)`,
        html: `Hey <strong>${req.body.firstName} ${req.body.lastName}</strong> !<br/>
        Bienvenue dans le comité très restreint des Wilders !<br/>
        Vous pouvez désormais vous authentifier avec votre <u>adresse mail</u> (${req.body.mail}) et le <u>mot de passe</u> que vous avez défini.<br/>
        Sur ce, à bientôt sur BookYourWilder !<br/><br/>
        
        <em>(En cas de questions, vous pouvez envoyer un mail à WildCodeSchool@hotmail.com. Les spams, je les dévore tous crus !)</em>`
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
    })
  return insertWilder(req.body)
  .then(record => res.json(record))
})

app.post('/fluxs', (req, res) => {
  return insertflux(req.body)
  .then(record => res.json(record))
})

//READ
app.get('/wilders', (req, res) => {
  db.all('SELECT * from users ORDER BY lastName')
  .then(records => res.json(records))
})

app.get('/fluxs', (req, res) => {
  db.all('SELECT * FROM fluxs ORDER BY Id DESC LIMIT 20')
  .then(records => res.json(records))
})

// app.get('/test', passport.authenticate('jwt', {session: false}), (req, res) => {
//     res.send(`authorized for user ${req.user.username} with id ${req.user.id}`)
//     console.log(req.user)
//   })

//update
app.put('/wilders', (req, res) => {
    return updateWilder(req.body)
    .then(record => res.json(record))
  })

// route par défaut qui renvoit le code html/css/js complet de l'application
app.get('*', (req, res) => {
  // to test log du path
  res.send(html)
  res.end()
})

app.listen(8080)
