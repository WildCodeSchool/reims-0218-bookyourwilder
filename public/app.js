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
        <a class="btn btn-primary" href="/profil/${item.id}">${item.firstName}'s profile &raquo;</a>
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

/* const displayWilder = (w,idZone) =>{
  // je sélectionne tous les input situés dans le fieldset wilder
  const inputs = document.querySelectorAll(`#${idZone} input`)
  console.log(inputs)
  console.log(w)
  for (let index=0; index<6; index++) {

  }

} */

//routing coté client
const controllers = {

  //route login a modifier l'exemple (pour florian)
  '/': () => {
    render(`
  <div class="container-fluid text-center" id="navbarDejaInscrit"></div>
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
          <div id="alert-box"></div>
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
    const navbarDejaInscrit = document.getElementById("navbarMenu")
    navbarDejaInscrit.innerHTML = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Déjà inscrit ?</a>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form action="/wilders" method="POST" class="form-inline my-2">
            <div>
                <input type="text" class="form-control" id="inputLoginMail" aria-describedby="mailHelp" placeholder="Mail">
                <input type="password" class="form-control" id="inputLoginPass" aria-describedby="passHelp" placeholder="Mot de passe">
                <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Se Connecter</button>
            </div>
        </form>
    </div>
</nav>`
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
        console.log(input)
      })

      const data = serializeForm(formProfile)
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

  '/page-notification': () => render('<h1>Page Notification</h1>'),

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
