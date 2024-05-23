const {User, UserProfile , Post, Tag} = require('../models')
const bcrypt = require('bcryptjs');
const {Op} = require('sequelize')
const transporter = require('../email'); // Mengimpor konfigurasi Nodemailer

const { addCmToHeight, addKgToWeight} = require('../helper/helper')



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
            let {errors} = req.query
            res.render('registerForm' , {errors}) //masukkan {error}
        } catch (error) {
            res.send(error)
        }
    }
    static async registerPost(req,res){
        try {
            let {userName , email , password , gender , role} = req.body

            await User.create({userName , email , password ,gender ,role})

             // Kirim email konfirmasi
             const mailOptions = {
                from: 'yourdatingapps@gmail.com', // Ganti dengan alamat email Anda
                to: email, // Alamat email penerima (alamat pengguna yang baru mendaftar)
                subject: 'Selamat, Anda Telah Terdaftar!',
                text: `Halo ${userName},\n\nSelamat datang di aplikasi kami. Anda telah berhasil mendaftar!`
                };
    
                await transporter.sendMail(mailOptions); // Mengirim email
    


            res.redirect('/')
        } catch (error) {
            // if (error.name === "SequelizeValidationError"){
            //     let msg = error.errors.map( el => el.message)
            //     res.redirect(`/register?errors=${msg}`   )
            // } else {

                res.send(error)
            // }
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
            // return res.redirect('/homeLanding1' )  // ingat!!! jgn lupa di unkomen
            const {email, password} = req.body

           let user =  await User.findOne({
                where: {email}
            })
            // console.log(user)
            .then(user =>{
                if (user){


                    const isValidPassword = bcrypt.compareSync(password, user.password);
                    // console.log(isValidPassword)
                    if (isValidPassword){
                        // console.log(user.id + 'iniii')
                        req.session.userId = user.id
                        req.session.role = user.role
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
            console.log(search)

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
            // let dataPost = await User.findAll({where:{ id : req.session.userId},
            // include : Post})
            // res.send(dataPost.Post)
            // console.log(dataPost.Post)
            res.render('UserProfile', {data,addCmToHeight, addKgToWeight})
        } catch (error) {
            res.send(error)
        }
    }


    static async editUserProfile(req,res){
        try {
            let data = await UserProfile.findOne({where : {UserId : req.session.userId}})
            // res.send(data)
            res.render('editUserProfile' ,{data})
        } catch (error) {
            res.send(error)
        }
    }

    static async postEditUserProfile(req,res){
        try {
            let {fullName , city, job,height , weight } = req.body

            await UserProfile.update({fullName , city, job,height , weight } ,{where :{UserId : req.session.userId }})
            res.redirect('/UserProfile')
        } catch (error) {
            res.send(error)
        }
    }






    static async addPost(req,res){
        try {
            let dataTag = await Tag.findAll();
            res.render('formAddPost' , {dataTag})
        } catch (error) {
            res.send(error)
        }
    }



    static async postAddPost(req,res){
        try { 
            let id = req.session.userId
            let { imgUrl , title, caption, tags} = req.body
            let UserId = req.session.userId;
            const posting = await Post.create({imgUrl , title, caption ,UserId : id , like :0 , UserId})

            if (tags && tags.length > 0) {
                const tagInstances = await Tag.findAll({
                  where: { id: tags }
                });
                await posting.addTags(tagInstances);
              }


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





    static async logout(req,res){
        try {
            req.session.destroy(err=>{
                if (err){
                    res.send(err)
                }else{
                    res.redirect('/')
                }
            })


        } catch (error) {
            res.send(error)
        }
    }


    static async landingPage(req,res){
        try {
            res.render('landingPage')
        } catch (error) {
            res.send(error)
        }
    }



    // admin

    static async dataUserProfile(req,res){
        try {
            let data =  await UserProfile.findAll()
            const { deleted } = req.query;
            res.render('dataUserProfile' , {data, deleted})
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteUserProfile(req,res){
        try {let {id} = req.params 
            // let userId = req.session.userId;
                console.log(id)
            let dataUser = await UserProfile.findOne({
                where: {
                    id
                },
            });
            // console.log(dataUser)
            // res.send(dataUser)
            let name = `${dataUser.fullName}`;
            await UserProfile.destroy({where : id})

            res.redirect(`/dataUserProfile?deleted=${name}`)
        } catch (error) {
            res.send(error)
        }
    }



}
module.exports = Controller