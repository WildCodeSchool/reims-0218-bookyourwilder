const sqlite = require('sqlite')
const express = require('express')
const bodyParser = require('body-parser')
const wilders = require('./public/wilders.json')
const app = express()
let db

app.use(express.static('public'))
app.use(bodyParser.json())

const html = `
<!doctype html>
<htmusersSeedl lang="en">
  <head>
    <title>FaceYourWilder</title>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
  <body>
  
  <div id="main" class="container" ></div>
      
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="/page.js"></script>
    <script src="/app.js"></script>
  </body>
</html>`

app.get('/wilders', (req, res) => {
  //renvoyer un arrayjson de  wilders
  res.json(wilders)
  res.end()
})

// i'm sending the skeleton of the page (when i'm receiving any of the routes)
app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

app.listen(8080)
