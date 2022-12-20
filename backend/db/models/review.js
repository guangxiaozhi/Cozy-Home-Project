'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {

    static associate(models) {
      // define association here
      Review.hasMany(
        models.ReviewImage,{
          foreignKey: 'reviewId',
          onDelete: 'CASCADE',
          hooks: true
      });
    
    }
  }
  Review.init({
    spotId: {
      type:DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
