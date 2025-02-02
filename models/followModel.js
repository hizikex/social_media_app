const { DataTypes, Model } = require('sequelize');
const sequelize = require("../database/config");
const User = require('./userModel');

class Follow extends Model { }

Follow.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    follower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Table name should match exactly
        key: 'id'
      }
    },
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    modelName: 'Follow',
    tableName: "follows",
    timestamps: true
  }
);

Follow.belongsTo(User, { through: Follow, foreignKey: 'follower_id', as: 'follower' });
Follow.belongsTo(User, { through: Follow, foreignKey: 'following_id', as: 'following' });

module.exports = Follow;
