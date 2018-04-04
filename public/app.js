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
        <a class="btn btn-primary" href="/users/${item.id}">${item.prenom}'s profile &raquo;</a>
      </div>
    </div>
  </div>`

const controllers = {

  '/': () =>
    fetch('/wilders')
    .then(res => res.json())
    .then(wilders => wilders.reduce((carry, wilders) => carry + makeCard(wilders), ''))
    .then(album => render(
    ` </div>
      <div class="row">${album}</div>
    </div>`)

  ),
    

    '*': () => render('<h1>Not Found</h1>')
}


// gére l'execution du routing coté client
const routing = () => {
  const routes = [
    '/',
    '*'
  ]
  routes.forEach(
    path => page(path, controllers[path])
  )
  page()
}

//appel cette fonction pour gérer les routes
routing()