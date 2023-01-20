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
    userId:2,
    review:"Most beautiful place you will ever stay at period.",
    stars:4
  },
  {
    spotId:2,
    userId:3,
    review:"Such a beautiful location and everything we needed was accounted for. The host was amazing to communicate with. Will definitely look her up when we’re back!!",
    stars:4
  },
  {
    spotId:3,
    userId:4,
    review:"Small but lovely unit with everything you need even coffee and tea.",
    stars:4
  },
  {
    spotId:4,
    userId:1,
    review:"This home is amazing and exactly how shown and described, although you can't really capture the beauty of the view and such through photos. Every window and every angle is/has an amazing view of the hills and the ocean. The home is very spacious and great for having guests over for dinner. Katherine (host) and her family are very friendly, super helpful, and great at ongoing communication. We will definitely stay here again in the future. It's a great place to bring your well-behaved furry friend as well.",
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
