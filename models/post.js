'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User , {foreignKey: 'UserId'}),
      Post.hasMany(models.PostTag , { foreignKey : 'PostId'})
      Post.belongsToMany(models.Tag, { through: models.PostTag })
    }
  }
  Post.init({
    imgUrl: DataTypes.STRING,
    title: DataTypes.STRING,
    caption: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    like: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};