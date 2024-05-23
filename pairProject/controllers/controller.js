const bcrypt = require('bcryptjs');
const { User, Post, PostTag, Tag, UserProfile } = require('../models/index');
const { where } = require('sequelize');

class Controller {

    static async users(req, res) {
        try {
            let data = await UserProfile.findAll({
                include: User
            })
            // res.render('users', {data});
            

        res.render('users', {data})
        // res.send(data)
            // res.send(data.UserProfile)
        } catch (error) {
            res.send(error)
        }
    }

    static async userProfile(req, res) {
        try {
            let userId = req.session.userId;
            console.log('User ID from session:', userId);
    
            if (!userId) {
                return res.status(401).send('Anda harus login untuk melihat profil ini');
            }
    
            let data = await UserProfile.findOne({
                where: {
                    UserId: userId
                }
            });
            if (!data) {
                return res.render('updateProfile', { userId });
                //  res.render('userProfile', {data})

            }
            
            // res.render('userProfile', {data})
            res.render('userProfile', {data}) //nanti ke beranda
        } catch (error) {
            console.log(error);
            res.send(error)
        }
    }

    static async updateProfile(req, res) {
        try {
            let userId = req.session.userId;
            let { fullName, city, job, height, weight, BirthOfDate } = req.body;
    
            // Lakukan proses update data profil pengguna
            // Contoh menggunakan Sequelize:
            await UserProfile.update(
                { fullName, city, job, height, weight, BirthOfDate },
                { where: { UserId: userId } }
            );

            await UserProfile.create({
                UserId: userId,
                fullName, city, job, height, weight, BirthOfDate
                // tambahkan field lainnya
            });
    
            res.redirect('/users/profile'); // Redirect kembali ke halaman userProfile
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).send('Terjadi kesalahan saat memperbarui profil');
        }
    }

    static async renderRegister(req, res) {
        try {
            res.render('register-form/register')
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerRegister(req, res) {
        try {
            let { email, userName, password, gender, role } = req.body
            await User.create({email, userName, password, gender, role})
            res.redirect('/login')
        } catch (error) {
            res.send(error)
        }
    }

    static async renderLogin(req, res) {
        try {
            let { errors } = req.query
            res.render('login-form/login', {errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerLogin(req, res) {
        try {
            let { userName, password } = req.body
            const user = await User.findOne({where:{userName}})
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);

                if(isMatch) {
                    //case berhasil login

                    req.session.userId = user.id
                    req.session.role = user.role
                    return res.redirect('/users/profile')
                } else {
                    throw new Error("Password tidak sesuai");
                }
            } else {
                throw new Error("Username tidak sesuai");
            }
            
        } catch (error) {
            if (error.message === "Password tidak sesuai") {
                return res.redirect('/login?errors=Password tidak sesuai');
            } else if (error.message === "Username tidak sesuai") {
                return res.redirect('/login?errors=Username tidak sesuai');
            } else if (error.name === "SequelizeValidationError") {
                // Jika terjadi kesalahan validasi Sequelize, kirim pengguna kembali ke halaman login dengan pesan error validasi
                let errors = error.errors.map(el => el.message);
                return res.redirect(`/login?errors=${errors}`);
            } else {
                res.send(error)
            }
        }
    }

    static getLogout(req, res) {
        try {
            req.session.destroy((err) => {
                if (err) console.log(err)
                    else {
                res.redirect('/login')}
            })
        } catch (error) {
            res.send(error)
        }
    }

    static async renderTag(req, res) {
        try {
            let data = await Tag.findAll()
            res.render('tag-form/formTag', {data})
        } catch (error) {
            res.send(error)
        }
    }

    static async addTag(req, res) {
        try {
            res.render('tag-form/formAddTag')
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerTag(req, res) {
        try {
            let { nameTag } = req.body
            await Tag.create({nameTag})
            res.redirect('/tags')
        } catch (error) {
            res.send(error)
        }
    }

    static async renderEditUser(req, res) {
        try {
            // Mendapatkan ID pengguna dari sesi
            let userId = req.session.userId;
    
            if (!userId) {
                return res.status(401).send('Anda harus login untuk mengakses halaman ini');
            }
    
            // Dapatkan data pengguna berdasarkan ID dari sesi
            let data = await UserProfile.findOne({
                where:{
                    UserId: userId
                }
            });
    
            if (!data) {
                return res.status(404).send('Pengguna tidak ditemukan');
            }
    
            res.render('editUser', { data }); // Kirim data pengguna ke template EJS
            // res.send(user)
        } catch (error) {
            res.send(error)
        }
    }

    static async handlerEditUser(req, res) {
        try {
            let userId = req.session.userId; // Mendapatkan ID pengguna dari sesi
            let { fullName, city, job, height, weight, BirthOfDate } = req.body
            await UserProfile.update(
                { fullName, city, job, height, weight, BirthOfDate },
            { where: { UserId: userId } }
            )
            res.redirect('/users/profile')
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteUser(req, res) {
        try {
            let { id } = req.params
            
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = Controller;