const assert = require('chai').assert

const {updateWilder} = require('../public/db.js')

const wilderExpected = {
    slug: 'prenom-test-nom-test',
    firstName: 'prenom-test',
    lastName: 'nom-test',
    title: 'dev javascript',
    bio: 'bio-test',
    image: 'image-test',
    mail: 'mail-test', 
    urlFb: 'fb-test',
    urlTw: 'tw-test', 
    mdp: 'mdp-test'
}

describe('update wilder', () => {
    it('should be a wilder ', () => {
        assert.hasAllDeepKeys(updateWilder(wilderExpected,'firstName','philippe'),wilderExpected)
    })
})