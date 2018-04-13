const mainDiv = document.getElementById('main')

const render = html => {
  mainDiv.innerHTML = html
}

// renvoit le html d'une card bootstrap pour un wilder
const makeCard = item => `
  <div class="col-md-4">
    <div class="card mb-4 box-shadow">
      <img class="card-img-top" src="${item.image}" alt="Thumbnail [100%x225]" />
      <div class="card-body">
        <p class="card-text" style="height: 80px">${item.bio}</p>
        <a class="btn btn-primary" href="/profil/${item.slug}">${item.firstName}'s profile &raquo;</a>
      </div>
    </div>
  </div>`

  const makeNotification = item => `
  <div class="col-12">
    <div class="jumbotron">
      <h2>${item.texte}</h2>
    </div>
  </div>`

const serializeForm = form => {
  const data = {}
  const elements = form.getElementsByClassName('form-control')
  for(el of elements) {
    data[el.name] = el.value
  }
  return data
}

//routing coté client
const controllers = {

  //route login a modifier l'exemple (pour florian)
  '/': () => {
    render(`
      <div class="container-fluid text-center">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <a class="navbar-brand" href="#">Déjà inscrit ?</a>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <form class="form-inline my-2">
                  <div>
                      <input type="text" class="form-control" id="inputLoginMail" aria-describedby="mailHelp" placeholder="Mail">
                      <input type="password" class="form-control" id="inputLoginPass" aria-describedby="passHelp" placeholder="Mot de passe">
                      <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Se Connecter</button>
                  </div>
              </form>
          </div>
      </nav>
  </div>
  <div class="container">
    <div id="alert-box" class="hidden"></div>
      <div class="jumbotron formblock mt-5 mb-5" style="width: 50%; margin: 0 auto;">
        <form id="add-wilder" method="POST">
          <h1 class="display-4">Inscrivez-vous</h1>
          <p class="lead">Il est nécessaire de s'inscrire pour accéder aux contenus.</p>
          <hr class="my-4">
          <div class="form-group">
            <label for="inputFirstName">Prenom</label>
            <input required name="firstName" type="text" class="form-control" id="inputFirstName" placeholder="Entrer votre prenom">
          </div>
          <div class="form-group">
            <label for="inputLastName">Nom</label>
            <input required name="lastName" type="text" class="form-control" id="inputLastName" placeholder="Entrer votre nom">
          </div>
          <div class="form-group">
              <label for="inputMail">Adresse mail</label>
              <input required name="mail" type="mail" class="form-control" id="inputMail" placeholder="Votre adresse mail (ex: john.doe@a.co)">
          </div>
          <div class="form-group">
              <label for="password">Choisissez un mot de passe</label>
              <input required name="password" type="password" class="form-control" id="inputPassword" placeholder="Privilégiez un mot de passe compliqué (au moins 8 caractères)">
          </div>
          <div class="form-group">
              <label for="confirmPassword">Confirmez ce mot de passe</label>
              <input required name="confirmPassword" type="password" class="form-control" id="inputConfirmPassword" placeholder="Confirmez le mot de passe saisi ci-dessus">
          </div>
          <div class="form-group">
              <label for="inputBio">Description</label>
              <textarea required name="bio" class="form-control" id="inputBio" placeholder="Une brève description de vous"></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Valider l'inscription</button>
      </form>
    </div>
</div>`
  )
    const form = document.getElementById('add-wilder')
    form.addEventListener('submit', e => {
      e.preventDefault()
      const data = serializeForm(form)
      if(! data.image) {
        const fullName = encodeURIComponent(`${data.firstName} ${data.lastName}`)
        data.image = `https://via.placeholder.com/640x480/?text=${fullName}`
      }
      fetch('/wilders', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(wilder => {
        const alertBox = document.getElementById('alert-box')
        alertBox.className = 'alert alert-success'
        alertBox.innerHTML = `Successfully created wilder ${wilder.firstName} (${wilder.id})`
      })
    })
  },
  
  //page d'acceuil (et bouton temporaire en attendant la navbar)
  '/home': () =>
    fetch('/wilders')
    .then(res => res.json())
    .then(wilders => wilders.reduce((carry, wilder) => carry + makeCard(wilder), ''))
    .then(album => render(
    `<div class="container">
      <div class="jumbotron">
        <h1 class="display-3">Hello, Wilders !</h1>
        <p><a class="btn btn-success btn-lg" href="/" role="button">Add a wilder »</a></p>
      </div>
      <div class="row">${album}</div>
    </div>`)
  ),

  //redirection vers le profil d'un wilder (pour philippe)
  '/profil/:slug': ctx => {
    const { slug } = ctx.params
    fetch('/wilders')
    .then(res => res.json())
    .then(wilders => wilders.find(wilder => wilder.slug === slug))
    .then(wilder => render(`<div class="container">
      <div class="row">
        <div class="col-md-6">
          <img src="${wilder.image}" alt="${wilder.firstName} ${wilder.lastName}" class="img-fluid" />
        </div>
        <div class="col-md-6">
          <h1>${wilder.firstName} ${wilder.lastName}</h1>
          <p>${wilder.bio}</p>
        </div>
      </div>
    </div>`))
  },

  '/page-notification': () => {
  fetch('/notifications')
  .then(res => res.json())
  .then(notifications => notifications.reduce((carry, notifications) => carry + makeNotification(notifications), ''))
  .then(listNotifications => {
    render(
  `<div class="container">
    <div id="alert-box" class="hidden"></div>
    <form method="POST" id="add-notifications" class="form-inline mt-4 mb-4">
      <input required name="notifications" type="text" class="form-control" id="inputNotifications" placeholder="Message" style="width:90%">
      <button class="btn btn-success my-2 my-sm-0" type="submit">Envoyer</button>
    </form>
    <div class="row" id="listNotifications">${listNotifications}</div>
  </div>`)

  const form = document.getElementById("add-notifications")
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = serializeForm(form)
    fetch('/notifications', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    fetch('/notifications')
    .then(res => res.json())
    .then(notifications => notifications.reduce((carry, notifications) => carry + makeNotification(notifications), ''))
    .then(notifications => {
      const alertBox = document.getElementById('alert-box')
      const listNotifications = document.getElementById('listNotifications')
      alertBox.className = 'alert alert-success'
      alertBox.innerHTML = `Successfully`
      listNotifications.innerHTML = `${notifications}`
    })
  })
})},

  '/flux': () => render('<h1>page flux</h1>'),

  '/admin': () => render('<h1>page admin</h1>'),

  '*': () => render('<h1>Not Found</h1>')
}

// gére l'execution du routing coté client
const routing = () => {
  const routes = [
    '/',
    '/home',
    '/profil/:slug',
    '/page-notification',
    '/flux',
    '/admin',
    '*'
  ]
  routes.forEach(
    path => page(path, controllers[path])
  )
  page()
}

//appel cette fonction pour gérer les routes
routing()