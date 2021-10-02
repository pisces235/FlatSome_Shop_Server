const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')

const User = require('../models/User')
// Passport JWT
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
}, async (payload, done) => { 
    try {
        const user = await User.findById(payload.sub)

        if(!user) return done(null, false);

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))

// Passport Google
passport.use(new GooglePlusTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => { 
    try {
        // check whether this user exists in our database
        const user = await User.findOne({ 
            authGoogleID: profile.id,
            authType: 'google'
        })

        if(user) return done(null, user)

        const newUser = new User({
            authType: 'google',
            authGoogleID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
        })

        await newUser.save()

        done(null, newUser)
    } catch (error) {
        done(error, false)
    }
}))

// Passport Facebook
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    fbGraphVersion: 'v3.0'
}, async (accessToken, refreshToken, profile, done) => { 
    try {
        // check whether this user exists in our database
        const user = await User.findOne({ 
            authFacebookID: profile.id,
            authType: 'facebook'
        })

        if(user) return done(null, user)

        const newUser = new User({
            authType: 'facebook',
            authFacebookID: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
        })

        await newUser.save()

        done(null, newUser)
    } catch (error) {
        done(error, false)
    }
}))

// Passport local
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email })

        if (!user) return done(null, false)

        const isCorrectPassword = await user.isValidPassword(password)

        if (!isCorrectPassword) return done(null, false)

        done(null, user)
    } catch (error) {
        done(error, false)
    }
}))