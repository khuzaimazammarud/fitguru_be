
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserModel = require("../models/user");
const SECRET_KEY = "FITGURUAPI"

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

module.exports = function (passport) {
    passport.use(
        new JWTStrategy(opts, (jwt_payload, cb) => {
            UserModel.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return cb(null, user);
                    }

                    return cb(null, false)
                })
                .catch(err => console.log(err));
        }
        )
    )
}