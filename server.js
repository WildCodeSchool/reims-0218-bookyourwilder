const express = require('express')
const bodyParser = require('body-parser')
const resource = require('/resource')
const app = express()

app.use(express.static('public'))
app.use(bodyParser.json())

const html = `
<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <title>NodeJS server</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  </head>
  <body>
    <div id="main">

    </div>
    <script src="page.js"></script>
    <script src="app.js"></script>
  </body>
</html>`

// i'm sending the skeleton of the page (when i'm receiving any of the routes)
app.get('*', (req, res) => {
  res.send(html)
  res.end()
})

// i will do something when receiving the homepage request
app.get('/', (req, res) => {

})

app.listen(8000)
