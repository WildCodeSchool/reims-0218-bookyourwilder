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

      </div>
      <form id="add-wilder">
        <div class="form-group">
          <label for="inputFirstName">First name</label>
          <input name="firstName" type="text" class="form-control" id="inputFirstName" placeholder="Enter first name">
        </div>
        <div class="form-group">
          <label for="inputLastName">Last name</label>
          <input name="lastName" type="text" class="form-control" id="inputLastName" placeholder="Enter last name">
        </div>
        <div class="form-group">
          <label for="inputImageUrl">Image URL</label>
          <input name="image" type="text" class="form-control" id="inputImageUrl" placeholder="Enter image URL">
        </div>
        <div class="form-group">
          <label for="inputBio">Bio</label>
          <textarea name="bio" class="form-control" id="inputLastName" placeholder="Bio"></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
      </form>`
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
    `<div class="jumbotron">
        <h1 class="display-3">Hello, world!</h1>
        <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        <p><a class="btn btn-primary btn-lg" href="/about" role="button">Learn more »</a></p>
        <p><a class="btn btn-success btn-lg" href="/" role="button">Add a wilder »</a></p>
      </div>
      <div class="row">${album}</div>
    `)
  ),

  //redirection vers le profil d'un wilder (pour philippe)
  '/profil/:slug': ctx => {
    const { slug } = ctx.params
    fetch('/wilders')   // besoin du tableau de wilders
    .then(res => res.json())   // tableau de wilders dans un json
    // on trouve le wilder tel que le wilder.slug corresponde au slug du parametre
    .then(wilders => wilders.find(wilder => wilder.slug === slug))   
    .then(wilder => render(`
    <div class="jumbotron">
      <h1 class="display-4">${wilder.firstName} ${wilder.lastName}</h1>
      <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
      <hr class="my-4">
      <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
      <p class="lead">
        <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
      </p>
    </div>
    `))
  },

  '/notification': () => render(`<h1>page notification</h1>`),

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
    '/notification',
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