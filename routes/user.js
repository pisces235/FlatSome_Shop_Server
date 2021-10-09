const express = require('express')
// const router = express.Router()
const router = require("express-promise-router")()

const UserController = require('../controllers/user')

const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers')

const passport = require('passport')
const passportConfig = require('../middleware/passport')

router.route('/')
    .get(UserController.index)
    .post(
        validateBody(schemas.userSchema),
        UserController.newUser
    )

router.route('/auth/google').post(passport.authenticate('google-plus-token', { session: false }), UserController.authGoogle)

router.route('/auth/facebook').post(passport.authenticate('facebook-token', { session: false }), UserController.authFacebook)

router.route('/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret)

router.route('/signin').post(
    validateBody(schemas.authSigninSchema), 
    passport.authenticate('local', { session: false }),
    UserController.signin
)

router.route('/signup').post(validateBody(schemas.authSignupSchema), UserController.signup)

router.route('/:userID')
    .get(
        validateParam(schemas.idSchema, 'userID'),
        UserController.getUser
    )
    .put(
        validateParam(schemas.idSchema, 'userID'),
        validateBody(schemas.userSchema),
        UserController.replaceUser
    )
    .patch(
        validateParam(schemas.idSchema, 'userID'),
        UserController.updateUser
    )
router.route('/edit/billing-address')
        .patch(UserController.updateUserAddress)

module.exports = router
