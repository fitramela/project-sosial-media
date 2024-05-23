'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User , {foreignKey : 'UserId'})
    }

    formatEditDate() {
      return this.birthOfDate.toISOString().split('T')[0]
    }

    get formatAge() {
      const tahunLahir = new Date(this.birthOfDate).getFullYear();
      const tahunSekarang = new Date().getFullYear();
      return tahunSekarang - tahunLahir;
    }



  }
  UserProfile.init({
    fullName: DataTypes.STRING,
    city: DataTypes.STRING,
    age: DataTypes.INTEGER,
    job: DataTypes.STRING,
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    birthOfDate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};