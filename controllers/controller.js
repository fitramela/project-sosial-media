const {User, UserProfile , Post, Tag} = require('../models')
const bcrypt = require('bcryptjs');


class Controller{

    static async home(req,res){
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }
    static async registerForm(req,res){
        try {
            res.render('registerForm')
        } catch (error) {
            res.send(error)
        }
    }
    static async registerPost(req,res){
        try {
            let {userName , email , password , gender} = req.body

            await User.create({userName , email , password ,gender})
            res.redirect('/')
        } catch (error) {
            res.send(error)
        }
    }

    static async loginPage(req,res){
        try {
            const {error} = req.query 
            res.render('loginPage' , {error})
        } catch (error) {
            res.send(error)
        }
    }
    static async loginPagePost(req,res){
        try {
            
            const {email, password} = req.body

           let user =  await User.findOne({
                where: {email}
            })
            // console.log(user)
            .then(user =>{
                if (user){


                    const isValidPassword = bcrypt.compareSync(password, user.password);
                    console.log(isValidPassword)
                    if (isValidPassword){
                        // console.log(user.id + 'iniii')
                        req.session.userId = user.id
                        return res.redirect('/homeLanding1' )
                    } else {
                        const error = 'Invalid email/password'
                       return res.redirect(`/login?error=${error}`)
                    }
                } else{
                    const error = 'Invalid email/password'
                    return res.redirect(`/login?=error=${error}`)
                }
            })
            .catch(error => {return res.send(error)})

            


        } catch (error) {
            res.send(error)
        }
        

    }
    
    static async homeLanding1(req,res){
        try {
            let {email} = req.params

            let {search} = req.query
            

            let option = {
                where :{},
                include: User
            }

            if (search){
                option.where.title = {
                    [Op.iLike]: `%${search}%`
                } 
            }


            let data = await Post.findAll(option)
            // res.send(data)
            res.render('homeLanding1' ,{data , email})
        } catch (error) {
            res.send(error)
        }
        
    }


    static async UserProfile(req,res){
        try {
           
            let data  =  await UserProfile.findOne({where: {UserId : req.session.userId},
            include: User})
            // res.send(data)
            res.render('UserProfile', {data})
        } catch (error) {
            res.send(error)
        }
    }



    static async addPost(req,res){
        try {
            res.render('formAddPost')
        } catch (error) {
            res.send(error)
        }
    }



    static async postAddPost(req,res){
        try { 
            let id = req.session.userId
            let { imgUrl , title, caption} = req.body
            await Post.create({imgUrl , title, caption ,UserId : id , like :0})

            res.redirect('/homeLanding1')
        } catch (error) {
            res.send(error)
        }
    }

    static async likePost(req,res) {
        try {
            let id = req.params.id;
       
            // console.log(await Post.findAll({where: id}))
            await Post.increment({ like : 1 }, { where: { id} }); 

           
            res.redirect('/homeLanding1')
        
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }


    
}
module.exports = Controller