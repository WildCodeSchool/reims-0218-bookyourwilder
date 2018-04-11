const mainDiv = document.getElementById('main')

const render = html => {
  mainDiv.innerHTML = html
}

const makeCard = item => `
  <div class="col-md-4">
    <div class="card mb-4 box-shadow">
      <img class="card-img-top img-fluid" style="height: 150px" src="${item.img + item.nom}" alt="Thumbnail [100%x225]" />
      <div class="card-body">
        <p class="card-text" style="height: 80px">${item.bio}</p>
        <a class="btn btn-primary" href="/wilders/${item.id}">${item.prenom}'s profile &raquo;</a>
      </div>
    </div>
  </div>`

const controllers = {

  '/': () => render(`
  <div class="container-fluid">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand" href="#">Déjà inscrit ?</a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form action="" method="POST" class="form-inline my-2">
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
    <div class="jumbotron formblock mt-5 mb-5" style="width: 50%; margin: 0 auto;">
      <form action="" method="POST">
        <h1 class="display-4">Inscrivez-vous</h1>
        <p class="lead">Il est nécessaire de s'inscrire pour accéder aux contenus.</p>
        <hr class="my-4">
        <div class="form-group">
          <input type="text" class="form-control" id="inputFirstName" aria-describedby="firstNameHelp" placeholder="Votre prénom" required>
          <input type="text" class="form-control" id="inputName" aria-describedby="nameHelp" placeholder="Votre nom" required>
          <input type="url" class="form-control" id="inputAvatar" aria-describedby="avatarHelp" placeholder="Lien vers une image de vous" required>
          <textarea class="form-control" id="inputBio" aria-describedby="bioHelp" placeholder="Une petite description rapide de vous" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Valider</button>
      </form>
    </div>
  </div>`),

  '/home': () => 
    fetch('/wilders')
      .then(res => res.json())
      .then(wilders => wilders.reduce((carry, wilders) => carry + makeCard(wilders), ''))
      .then(album => render(
      ` </div>
        <div class="row">${album}</div>
      </div>`)
    ),

    '/profile': () => render('<h1>Page profile</h1>'),

    '/notification': () => render('<h1>Page notification</h1>'),

    '/flux': () => render('<h1>Page flux</h1>'),

    '/offre': () => render('<h1>Page offre</h1>'),

    '/admin': () => render('<h1>Page admin</h1>'),

  '*': () => render('<h1>Not Found</h1>')
}


// gére l'execution du routing coté client
const routing = () => {
  const routes = [
    '/',
    '/home',
    '/profile',
    '/notification',
    '/flux',
    '/offre',
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