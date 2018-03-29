const express = require('express')
const bodyParser = require('body-parser')
const resource = require('./public/resource.js')
const app_modules = require('./public/app.js')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

let contenuAjout = ""

const html = (contenuAjout) => `
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
    
    <div id='output'>
      ${contenuAjout}
    </div>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="contenu.js"></script>
  </body>
</html>`

// i will do something when receiving the homepage request
app.get('/', (req, res) => {
  const HtmlAjout = `
  <div>HTML homepage</div>
  `
  res.send(html(HtmlAjout+htmlFooter))
  res.end()
})

app.get('/connect', (req, res) => {
  res.send(html(`contenu HTML ajouté pour page connect`))
  res.end()
})

app.get('/profil', (req, res) => {

  res.send(html(app_modules.htmlHeader+app_modules.htmlProfilePage+app_modules.htmlFooter))
  res.end()
})

app.get('/admin', (req, res) => {
  res.send(html(`contenu HTML ajouté pour page admin`))
  res.end()
})

app.get('/notif', (req, res) => {
  res.send(html(``))
  res.end()
})

app.get('/offre', (req, res) => {
  res.send(html(``))
  res.end()
})

app.get('/actu', (req, res) => {
  res.send(html(``))
  res.end()
})

// i'm sending the skeleton of the page (when i'm receiving any of the routes)
app.get('*', (req, res) => {
  res.send(html(``))
  res.end()
})


app.listen(8080)
