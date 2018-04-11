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

  //route login a modifier l'exemple (pour florian)
  '/': () => {
    render(
    `<div class="container">
      <div id="alert-box" class="hidden">

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
      </form>
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
        <h1 class="display-3">Hello, world!</h1>
        <p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>
        <p><a class="btn btn-primary btn-lg" href="/about" role="button">Learn more »</a></p>
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
    .then(wilder => {
      const options_wilder = [{
        "nom": "hobby",
        "affichage": true,
        "texte": "reading"
      }, {
        "nom": "reading",
        "affichage": false,
        "texte": "foundation"
      }]

      const displayOptionsWilder = (tableauOptions) => {
        let htmlLis = ""
        tableauOptions.forEach(option => htmlLis += (option["affichage"])?`<li>${option["nom"]}: ${option["texte"]}</li>`:''
        )
        console.log(htmlLis)
        return htmlLis
      }
      render(`<div class="container text-center">
      <div class="modal" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>Modal body text goes here.</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary">Save changes</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <div class="jumbotron">
        <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#exampleModal">
          Edit list of options
        </button>
        <h1 class="display-4">${wilder.firstName} ${wilder.lastName}</h1>
        <p>${wilder.title}</p><!-- Button trigger modal -->

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                ...
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <hr class="my-4">
        <!-- si la bio est plus longue que 50, alors afficher ... sinon rien -->
        <p class="lead">${wilder.bio.substr(0,50)}${(wilder.bio.length>50)?'...':''}</p>
        <p class="lead">
          <a class="btn btn-primary btn-lg" href="#" role="button">Read more</a>
        </p>
      </div>

      <div class="jumbotron">
      <h2>en option a affiche</h2>
      <form>
        <ul>
          ${displayOptionsWilder(options_wilder)}
        </ul>
      </form>
    </div>
    </div>`)})
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