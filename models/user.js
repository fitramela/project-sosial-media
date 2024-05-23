'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs')



module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for jobdefining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserProfile , { foreignKey:"UserId"})
      User.hasMany(models.Post , {foreignKey : 'UserId'})
    }
  }
  User.init({
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg : 'Username sudah terdaftar'
      },
      validate: {
        notNull: {
          msg : 'Username harus diisi bro!'
        },
        notEmpty: {
          msg : 'Username harus diisi bro!'
        },
        len: {
          args: [5, 15],
          msg : 'Username minimal 3 karakter dan maksimal 15 karakter!'
        },
        is: {
          args: /^[a-zA-Z0-9_]+$/i,
          msg: "Username hanya bisa mengandung huruf, angka, and underscores"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg : 'Email tersebut sudah terdaftar!'
      },
      validate: {
        notNull: {
          msg : 'Email harus diisi bro!'
        },
        notEmpty: {
          msg : 'Email harus diisi bro!'
        },
        isEmail: {
          msg : 'Harus input email yang valid bro!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password harus diisi bro!'
        },
        notEmpty: {
          msg : 'Password harus diisi bro!'
        },
        len: {
          args: [10, 25],
          msg : 'Panjang password 10 sampai 25 karakter!'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'Gender harus diisi bro!'
        },
        notEmpty: {
          msg: 'Gender harus diisi bro!'
        },
        isIn : {
          args : [
            ['Pria', 'Wanita']
          ],
          msg : 'Gender cuman 2 ya antara Pria dan Wanita saja!'
        }
      }
    },
  }, {
    hooks:{
      beforeCreate(instance){
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(instance.password, salt);
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};