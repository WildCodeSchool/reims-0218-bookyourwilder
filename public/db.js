const sqlite = require('sqlite')
const Promise = require('bluebird')
const bodyParser = require('body-parser')
const wildersSeed = require('./wilders.json')
const notificationsSeed = require('./notifications.json')
let db

const dbPromise = Promise.resolve()
.then(() => sqlite.open('./database.sqlite', { Promise }))
.then(_db => {
  db = _db
  return db.migrate({ force: 'last' })
})
.then(() => Promise.map(wildersSeed, w => insertWilder(w)))
.then(() => Promise.map(notificationsSeed, n => insertNotification(n)))

const insertWilder = w => {
  const { firstName, lastName, title, bio, image, slug, urlFb, urlTw, mail, mdp } = w
  return db.get('INSERT INTO users(slug, firstName, lastName, title, bio, image, urlFb, urlTw, mail, mdp) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', slug, firstName, lastName, title, bio, image, urlFb, urlTw, mail, mdp)
  .then(() => db.get('SELECT last_insert_rowid() as id'))
  .then(({ id }) => db.get('SELECT * from users WHERE id = ?', id))
}

// insertNotification dans la db
const insertNotification = n => {
  const { notifications } = n
  return db.get('INSERT INTO notifications( texte ) VALUES(?)', notifications)
  .then(() => db.get('SELECT last_insert_rowid() as id'))
  .then(({ id }) => db.get('SELECT * from notifications WHERE id = ?', id))
}

// updateWilder dans la db
const updateWilder = (w, propertyName, propertyValue) => {
  const { firstName, lastName, title, bio, image, slug, urlFb, urlTw, mail, mdp } = w
  return db.get('UPDATE users SET (slug, firstName, lastName, title, bio, image, urlFb, urlTw, mail, mdp) = (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', slug, firstName, lastName, title, bio, image, urlFb, urlTw, mail, mdp)
  .then(() => {
    const sqliteQuery = `SELECT id from users where ${propertyName}='${propertyValue}'`
    console.log(sqliteQuery)
    return db.get(sqliteQuery)})
  .then(({ id }) => db.get('SELECT * from users WHERE id = ?', id))
}

module.exports = {
  updateWilder
}