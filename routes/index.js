const Controller = require("../controllers/controller");
const router = require('express').Router();



router.get('/',Controller.home)


router.get('/register',Controller.registerForm)
router.post('/register',Controller.registerPost)









router.get('/login',Controller.loginPage)
router.post('/login',Controller.loginPagePost)



router.use((req, res, next) => {
    console.log( req.session)

  console.log('Time:', Date.now())
  if (!req.session.userId){

      const error = 'login dulu'
      res.redirect(`/login?error=${error}`)
    } else{
      next()
  }
})

router.get('/homeLanding1', Controller.homeLanding1)



router.get('/UserProfile', Controller.UserProfile)
router.get('/editUserProfile', Controller.editUserProfile)
router.post('/editUserProfile', Controller.postEditUserProfile)




router.get('/addPost', Controller.addPost)
router.post('/addPost', Controller.postAddPost)


router.get('/like/:id', Controller.likePost )
// router.get('/', (req, res) => {
//   res.send('Hello World!')
// })
router.get('/logout', Controller.logout)

router.get('/landingPage' , Controller.landingPage)


router.use(function (req, res, next) {
    // console.log(req.session);
    if(req.session.userId && req.session.role !== "admin") {
        const error = 'Kamu bukan admin, tidak ada akses'
        res.redirect(`/login?errors=${error}`)
    } else {
        next()
    }
    
})
router.get('/dataUserProfile' , Controller.dataUserProfile)


router.get('/deleteUserProfile/:id' , Controller.deleteUserProfile)

module.exports = router
