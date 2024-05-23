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
    userName: DataTypes.STRING,
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
    gender: DataTypes.STRING,
    role: DataTypes.STRING,
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