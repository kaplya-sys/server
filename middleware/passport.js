const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('config');
const User = require('../models/users.model');
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('jwt')
};

module.exports = passport => {
    passport.use(
        new JwtStrategy(options, async(payload, done) => {
            console.log(payload.userId)
            try {
                const user = await User.findById(payload.userId).select('email id');
                if (user) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            } catch (e) {
                console.log(e)
            }
        })
    )
};