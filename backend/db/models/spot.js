'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {

    static associate(models) {
      // define association here
      Spot.belongsTo(models.User,{
        foreignKey:'ownerId'
      });
      Spot.belongsToMany(models.User,{
        through:models.Booking,
        foreignKey:'spotId',
        otherKey:'userId'
      });
      Spot.belongsToMany(models.User,{
        through:models.Review,
        foreignKey:'spotId',
        otherKey:'userId'
      });

      Spot.hasMany(models.SpotImage,{
        foreignKey:'spotId'
      })
    }
  }
  Spot.init({
    ownerId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.DECIMAL,
    lng: DataTypes.DECIMAL,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
