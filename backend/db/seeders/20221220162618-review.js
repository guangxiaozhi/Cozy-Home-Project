'use strict';
const bcrypt = require("bcryptjs");
const {Op} = require('sequelize')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewseed = [
  {
    spotId:1,
    userId:1,
    review:"good",
    stars:4
  },
  {
    spotId:2,
    userId:2,
    review:"bad",
    stars:1
  },
  {
    spotId:3,
    userId:3,
    review:"not good",
    stars:2
  },
  {
    spotId:4,
    userId:4,
    review:"very good",
    stars:5
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options,reviewseed)
  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, { [Op.or]: reviewseed }, {} )

  }
};
