const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000

const session = require('express-session')


app.set('view engine' , 'ejs')
app.use(express.urlencoded({extended : true}))


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false ,
    sameSite: true 
}
}))



app.get('/',Controller.home)


app.get('/register',Controller.registerForm)
app.post('/register',Controller.registerPost)









app.get('/login',Controller.loginPage)
app.post('/login',Controller.loginPagePost)



app.use((req, res, next) => {
    console.log( req.session)

  console.log('Time:', Date.now())
  if (!req.session.userId){

      const error = 'login dulu'
      res.redirect(`/login?error=${error}`)
    } else{
      next()
  }
})

app.get('/homeLanding1', Controller.homeLanding1)



app.get('/UserProfile', Controller.UserProfile)
app.get('/editUserProfile', Controller.editUserProfile)
app.post('/editUserProfile', Controller.postEditUserProfile)




app.get('/addPost', Controller.addPost)
app.post('/addPost', Controller.postAddPost)


app.get('/like/:id', Controller.likePost )
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.get('/logout', Controller.logout)





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})