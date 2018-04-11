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
        <a class="btn btn-primary" href="/profile/${item.id}">${item.prenom}'s profile &raquo;</a>
      </div>
    </div>
  </div>`

const controllers = {

  '/': () => render('<h1>Page Login</h1>'),

  '/home': () => 
    fetch('/wilders')
      .then(res => res.json())
      .then(wilders => wilders.reduce((carry, wilders) => carry + makeCard(wilders), ''))
      .then(album => render(
      ` </div>
        <div class="row">${album}</div>
      </div>`)
    ),

    '/profile/:wilderNumber': ctx => { // fonction anonyme qui prend en parametre ctx
      const { wilderNumber } = ctx.params // objet anonyme qui a une propriété wilderNumber égale à params
      fetch('/wilders') // dans la page profile aussi on a besoin des wilders existants
        .then(res => res.json())  // le fetch me renvoit une reponse en json
        .then(wilders => {        // résolution de la promesse précédente 
          const currentWilder = wilders[wilderNumber]
          htmlAdded = `
            <div class="jumbotron text-center">
              <h1 class="display-4">${currentWilder.prenom} ${currentWilder.nom}</h1>
              <p class="lead">${currentWilder.bio.substr(0,100)}</p> <!--bio limited to 100 caractere-->
              <hr class="my-4">
              <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
              <p class="lead">
                <a class="btn btn-primary btn-lg" href="#" role="button">detailed informations</a>
              </p>
            </div>
        `
        render(htmlAdded)
        })
    },

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
    '/profile/:wilderNumber',
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