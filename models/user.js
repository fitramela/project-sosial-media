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
    email: DataTypes.STRING,
    password: DataTypes.STRING,
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