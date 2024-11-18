'user strict'

const {Model, DataTypes, } = require('sequelize')
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
        class User extends Model{
            static associate(models){
                User.hasMany(models.Comment,{
                   foreignKey: 'userId',
                    as: 'comments'
                });
            }
        }
User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "First name is required" },
        notEmpty: { msg: "First name cannot be empty" }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Last name is required" },
        notEmpty: { msg: "Last name cannot be empty" }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'The email address you entered already exists'
      },
      validate: {
        notNull: { msg: "Email address is required" },
        isEmail: { msg: "Must be a valid email address" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password is required" },
        notEmpty: { msg: "Password cannot be empty" }
      }, set(value) {
        // Hash password
        const hashedPassword = bcrypt.hashSync(value, 10);
        this.setDataValue('password', hashedPassword);
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};