const mainDiv = document.getElementById('main')

const render = html => {
  mainDiv.innerHTML = html
}

// renvoit le html d'une card bootstrap pour un wilder
const makeCard = item => `
  <div class="card text-center mb-5 box-shadow">
      <div class="card-body">
          <img src="${item.image}" alt="#" class="img-fluid rounded-circle w-50 mb-3 image">
          <h4 class="card-title">${item.firstName}</h4>
          <h4 class="card-title">${item.lastName}</h4>
          <h5 class="card-text text-muted">Curieuse, passionnée, observatrice</h5>
          <p class="card-text taille">${item.bio}</p>
          <div class="d-flex flex-row justify-content-center">
              <div class="p-4">
                  <a href="#" target="_blank">
                    <i class="fab fa-linkedin-in rounded-circle"></i>
                  </a>
              </div>
              <div class="p-4">
                  <a href="#" target="_blank">
                    <i class="fab fa-github rounded-circle"></i>
                  </a>
              </div>
              <div class="p-4">
                  <a href="#">
                    <i class="fas fa-envelope rounded-circle"></i>
                  </a>
              </div>
          </div>
      </div>
      <div class="card-footer">
        <a class="btn btn-warning" href="/profil/${item.id}">${item.firstName}'s profile &raquo;</a>
      </div>
    </div>
  </div>`

  const makeflux = item => `
  <div class="col-12">
    <div class="jumbotron msg-flux">
      <p>${item.texte}</p>
    </div>
  </div>
  `

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
  <div class="container-fluid" id="navbarDejaInscrit"></div>
  <div class="container-fluid inscription pt-5 pb-5">
    <div id="alert-box" class="hidden"></div>
      <div class="jumbotron formblock" style="width: 50%; margin: 0 auto;">
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
          <button type="submit" class="btn btn-success btn-lg btn-block mt-5">Valider l'inscription</button>
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
        data.image = `https://via.placeholder.com/480x480/?text=${fullName}`
      }
      fetch('/wilders', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      // window.setTimeout(() =>
      // { window.location = "/home"; },250);
    })
    const navbarDejaInscrit = document.getElementById("navbarMenu")
    navbarDejaInscrit.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
    <a class="navbar-brand" href="#">Déjà inscrit ?</a>
    <form method="POST" class="form-inline my-2">
            <div class="justify-content-center">
                <input type="text" class="form-control" id="inputLoginMail" aria-describedby="mailHelp" placeholder="Mail">
                <input type="password" class="form-control" id="inputLoginPass" aria-describedby="passHelp" placeholder="Mot de passe">
                <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Se Connecter</button>
            </div>
        </form>
    </div>
    </nav>`
  },
  
  '/home': () =>
  fetch('/wilders')
    .then(res => res.json())
    .then(wilders => wilders.reduce((carry, wilder) => carry + makeCard(wilder), ''))
    .then(album => render(
    `<div class="container">
      <div class="row mt-5 mb-5">
          <div class="col">
              <div class="info-header mb-5 text-center">
                  <h1 class="text-warning pb-3">Nos Wilders</h1>
                  <p class="lead pb-3">La Wild Code School forme ses élèves au métier de développeur web en 5 mois suivis d’un stage en entreprise. Vous trouverez sur ce site web, réalisé par eux, les profils des élèves “Wilders” de Reims et les liens vers leurs Linkedin etc. respectifs. Cette 1ère promotion "Artémis", avide de connaissance, se forme intensivement au métier du développeur web. Bientôt Javascript et React n'auront plus aucun secret pour eux.</p>
              </div>
          </div>
      </div>
      <div class="row">${album}</div>
    </div>`)
  ),

  //redirection vers le profil d'un wilder (pour philippe)
  '/profil/:wilder_id': ctx => {
    const { wilder_id } = ctx.params
    fetch('/wilders') // demande au serveur de récupérer un json de la select avec join
    .then(res => res.json())
    .then(wilders => {
      return wilders.find(wilder => wilder.id == wilder_id)
    })
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

      const displayOptionsWilder = (tableauOptions, useDisplay, displayOrChange) => {
        let htmlLis = ""
        // si mon option["affichage"] OU mon useDisplay est faux, alors j'ajoute la li contenant eventuellement la checkbox
        tableauOptions.forEach(option => htmlLis += (option["affichage"] || !useDisplay)?`<li><input type="text" value="${option["nom"]}" ${(displayOrChange)?"":"readonly"}>: <input type="text" value="${option["texte"]}" ${(displayOrChange)?"":"readonly"}></li>`:""
        )
        return htmlLis
      }
      render(`<div class="container text-center">
      <div class="jumbotron">
        <button type="button" class="btn btn-primary float-right" data-toggle="modal" data-target="#exampleModal">
          Edit profile
        </button>
        <h1 class="display-4">${wilder.firstName} ${wilder.lastName}</h1>
        <p>${wilder.title}</p><!-- Button trigger modal -->

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="modal-title" id="exampleModalLabel">Edit profile</h3>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body" id="editeur">
                <form id="changeProfile">
                  <fieldset id="fsWilder">
                    <input type="hidden" name="wilderChange_id" class="form-control">
                    <fieldset class="form-group" id="nameWilder">
                      <div class="row justify-content-around">
                        <label for="inputFirstName" class="col-12 col-sm-5">First Name</label>
                        <label for="inputLastName" class="col-12 col-sm-5">Last name</label>
                      </div>
                      <div class="row justify-content-around">
                        <input name="firstName" type="text" value="" class="form-control col-12 col-sm-5" id="inputFirstName" placeholder="${wilder.firstName}">
                        <input name="lastName" type="text" class="form-control col-12 col-sm-5" id="inputLastName" placeholder="${wilder.lastName}">
                      </div>
                    </fieldset>
                    <fieldset class="form-group row justify-content-around">
                      <label for="inputTitle" class="col-11">Title</label>
                      <input name="title" type="text" class="form-control col-11" id="inputTitle" placeholder="${wilder.title}">
                    </fieldset>
                    <fieldset class="form-group row justify-content-around">
                      <label for="inputImageUrl" class="col-11">Image URL</label>
                      <input name="image" type="text" class="form-control col-11" id="inputImageUrl" placeholder="${wilder.image}">
                    </fieldset>
                    <fieldset class="form-group row justify-content-around">
                      <label for="inputBio" class="col-11">Bio</label>
                      <textarea name="bio" class="form-control col-11" id="txtBio" placeholder="${wilder.bio}"></textarea>
                    </fieldset>
                    <fieldset class="form-group">
                      <div class="row justify-content-around">
                        <label for="inputMail" class="col-12 col-sm-5">Mail</label>
                        <label for="inputMdp" class="col-12 col-sm-5">Mdp</label>
                      </div>
                      <div class="row justify-content-around">
                        <input name="mail" type="text" class="form-control col-12 col-sm-5" id="inputMail" placeholder="${wilder.mail}">
                        <input name="mdp" type="text" class="form-control col-12 col-sm-5" id="inputMdp" placeholder="${wilder.mdp}">
                      </div>
                    </fieldset>
                    <fieldset class="form-group" id="links">
                      <div class="row justify-content-around">
                        <label for="inputLinkedin" class="col-12 col-sm-5">Linkedin</label>
                        <label for="inputGithub" class="col-12 col-sm-5">Github</label>
                      </div>
                      <div class="row justify-content-around">
                        <input name="urlLi" type="text" class="form-control col-12 col-sm-5" id="inputLinkedin" placeholder="${wilder.urlLi}">
                        <input name="urlGh" type="text" class="form-control col-12 col-sm-5" id="inputGithub" placeholder="${wilder.urlGh}">
                      </div>
                    </fieldset>
                  </fieldset>
                  <hr>
                  <fieldset id="fsOptions">
                    <div class="modal-header">
                      <h3 class="modal-title" id="exampleModalLabel">Edit options of profile</h3>
                    </div>
                    <ul>
                      ${displayOptionsWilder(options_wilder, false, true)}
                    </ul>
                  </fieldset>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary" id="btnChangeOption">Save changes</button>
              </div>
            </div>
          </div>
        </div>
        <hr class="my-4">
        <!-- si la bio est plus longue que 50, alors afficher ... sinon rien -->
        <p class="lead" id="bioArea">${wilder.bio.substr(0,50)}${(wilder.bio.length>50)?'...':''}</p>
        ${(wilder.bio.length>50)?'<button type="button" class="btn btn-primary" id="displayBio">Read more</button>':''}
      </div>
      
      <div class="jumbotron">
      <h2>options to display:</h2>
      <form>
        <ul>
          ${displayOptionsWilder(options_wilder, true, false)}
        </ul>
      </form>
    </div>
    </div>`)
    const formProfile = document.getElementById('changeProfile')
    const nameWilder = document.getElementById('nameWilder')
    // click sur "save changes"
    const btnSaveChanges = document.getElementById('btnChangeOption')
    btnSaveChanges.addEventListener('click',e => {
      e.preventDefault()

      // je doit remplir les champs vide avec les valeur du wilder
      const inputs = document.querySelectorAll(`#fsWilder input`)
      inputs.forEach(input => {
        if (input.attributes['value']===' ') 
          input.setAttribute('value',input.attributes['placeholder'])
      })

      const data = serializeForm(formProfile)

      // je dois remplir les champs vides dans l'objet data

      const proprietes = Object.keys(data)

      proprietes.forEach(propriete => {
        if (data[propriete]==='') data[propriete]=wilder[propriete]
      })

      if(! data.image) {
        const fullName = encodeURIComponent(`${data.firstName} ${data.lastName}`)
        data.image = `https://via.placeholder.com/640x480/?text=${fullName}`
      }
      fetch('/wilders', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      window.setTimeout(() =>
      { window.location = `/profil/${wilder_id}`; },250);
    })

    // je dois avoir un champ caché id afin que le formulaire l'envoie
    const champCache = document.getElementsByName('wilderChange_id')
    champCache[0].setAttribute('value',wilder.id)

    const btnReadMore = document.getElementById('displayBio')
    const pBio = document.getElementById('bioArea')
    // si j'ai un bouton Read more, je peux faire des échanges de contenu entre bio complete et bio limitée
    if (typeof(btnReadMore) !== 'undefined') {
      btnReadMore.addEventListener('click', e => {
        if (btnReadMore.innerHTML==='Read more') {
          btnReadMore.innerHTML='Read less'
          pBio.innerHTML=wilder.bio
        }
        else {
          btnReadMore.innerHTML='Read more'
          pBio.innerHTML=wilder.bio.substr(0,50)+'...'
        }
      })
    }
  }) // fermeture du dernier then
  },  // fermeture de la route


  '/flux': () => {
  fetch('/fluxs')
  .then(res => res.json())
  .then(fluxs => fluxs.reduce((carry, fluxs) => carry + makeflux(fluxs), ''))
  .then(listFluxs => {
    render(
  `<div class="container">
    <div id="alert-box" class="hidden"></div>
    <form method="POST" id="add-fluxs" class="form-inline mt-4 mb-4">
      <input required name="fluxs" type="text" class="form-control " id="inputFluxs" placeholder="Message" style="width:90%">
      <button class="btn btn-success ml-2" type="submit">Envoyer</button>
    </form>
    <div class="row" id="listFluxs">${listFluxs}</div>
  </div>`)

  const form = document.getElementById("add-fluxs")
  form.addEventListener('submit', e => {
    e.preventDefault()
    const data = serializeForm(form)
    fetch('/fluxs', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    fetch('/fluxs')
    .then(res => res.json())
    .then(fluxs => fluxs.reduce((carry, fluxs) => carry + makeflux(fluxs), ''))
    .then(fluxs => {
      const alertBox = document.getElementById('alert-box')
      const listFluxs = document.getElementById('listFluxs')
      alertBox.className = 'alert alert-success'
      alertBox.innerHTML = `Successfully`
      listFluxs.innerHTML = `${fluxs}`
    })
  })
})},

  '/notification': () => render('<h1>Page notification</h1>'),

  '/admin': () => render(`<nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-between d-flex">
      <a class="navbar-brand p-3" href="#">Administration</a>
      <p class="p-6">Bienvenue sur votre panneau d'administration.</p>
      <button class="btn btn-outline-danger my-2 my-sm-0 p-3" type="submit">Se déconnecter</button>
    </nav>

    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-xs-12 col-md-5 mt-2 mb-2">
          <div class="adminPanel bg-info jumbotron">
            <h1 class="display-4">Bloc 1</h1>
            <p class="lead">Je suis désolé sensei, c'est parce que Monsieur Youpi est parti boire un verre dans la fosse à scorpions à cause d'une reconnaissante carte piège qui est apparue comme par magie...</p>
          </div>
        </div>
        <div class="col-xs-12 col-md-5 md-offset-2  mt-2 mb-2">
          <div class="adminPanel bg-info jumbotron">
            <h1 class="display-4">Bloc 2</h1>
            <p class="lead">Je suis désolé sensei, c'est parce que Monsieur Youpi est parti boire un verre dans la fosse à scorpions à cause d'une reconnaissante carte piège qui est apparue comme par magie...</p>
          </div>
        </div>
        <div class="col-xs-12 col-md-5 mt-2 mb-2">
          <div class="adminPanel bg-info jumbotron">
            <h1 class="display-4">Bloc 3</h1>
            <p class="lead">Je suis désolé sensei, c'est parce que Monsieur Youpi est parti boire un verre dans la fosse à scorpions à cause d'une reconnaissante carte piège qui est apparue comme par magie...</p>
          </div>
        </div>
        <div class="col-xs-12 col-md-5 md-offset-2 mt-2 mb-2">
          <div class="adminPanel bg-info jumbotron">
            <h1 class="display-4">Bloc 4</h1>
            <p class="lead">Je suis désolé sensei, c'est parce que Monsieur Youpi est parti boire un verre dans la fosse à scorpions à cause d'une reconnaissante carte piège qui est apparue comme par magie...</p>
          </div>
        </div>
      </div>
    </div>`),

  '*': () => render('<h1>Not Found</h1>')
}

// gére l'execution du routing coté client
const routing = () => {
  const routes = [
    '/',
    '/home',
    '/profil/:wilder_id',
    '/flux',
    '/notification',
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
