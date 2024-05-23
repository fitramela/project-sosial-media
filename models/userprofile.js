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
      return this.BirthOfDate.toISOString().split('T')[0]
    }

    get formatAge() {
      const tahunLahir = new Date(this.BirthOfDate).getFullYear();
      const tahunSekarang = new Date().getFullYear();
      return tahunSekarang - tahunLahir;
    }



  }
  UserProfile.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'Fullname harus diisi bro!'
        },
        notEmpty: {
          msg : 'Fullname harus diisi bro!'
        },
        len: {
          args: [3, 25],
          msg : 'Karakter Fullname minimal 3 dan maksimal 25'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'City harus diisi!'
        },
        notEmpty: {
          msg : 'City harus diisi!'
        },
        len: {
          args: [2, 25],
          msg: 'Panjang karakter city dari minimal 2 dan maksimal 25'
        }
      }
    },
    age: DataTypes.INTEGER,
    job: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'Job harus diisi!'
        },
        notEmpty: {
          msg : 'Job harus diisi!'
        },
        len: {
          args: [2, 25],
          msg: 'Panjang karakter Job dari minimal 2 dan maksimal 25'
        }
      }
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'Height harus diisi!'
        },
        notEmpty: {
          msg : 'Height harus diisi!'
        },
        isNumeric: {
          msg : 'Inputan harus angka!'
        },
        min: {
          args: [0],
          msg : 'Inputan tidak boleh 0'
        }
      }
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'Weight harus diisi!'
        },
        notEmpty: {
          msg : 'Weight harus diisi!'
        },
        isNumeric: {
          msg : 'Inputan harus angka!'
        },
        min: {
          args: [0],
          msg : 'Inputan tidak boleh 0'
        }
      }
    },  birthOfDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg : 'BirthOfDate harus diisi!'
        },
        notEmpty: {
          msg : 'BirthOfDate harus diisi!'
        },
        isBefore: new Date().toISOString().split('T')[0]
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserProfile',
  });
  return UserProfile;
};