const sqlite = require('sqlite')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require("passport-jwt")
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

let db
sqlite.open('./database.sqlite', { Promise }).then(_db => db = _db)

getUserWithPassword = (mail, password) => {
    return db.get(`SELECT id, firstName, lastName, mail, password FROM users WHERE mail ="${mail}" AND password="${password}"`)
}

passport.use(new LocalStrategy({
        usernameField: 'loginMail',
        passwordField: 'loginPassword'
    },
    function(mail, password, cb) {
        getUserWithPassword(mail, password)
            .then(user => {
                if (!user) {
                    return cb(null, false, { message: 'Incorrect mail or password.' })
                } else {
                    return cb(null, user, { message: 'Logged In Successfully' })
                }
            })
    }
))

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'your_jwt_secret'
    },
    function(jwtPayload, cb) {
        const user = jwtPayload
            //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        return cb(null, user)
    }))