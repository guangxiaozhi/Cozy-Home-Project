'use strict';
const bcrypt = require("bcryptjs");
const {Op} = require('sequelize')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const spotImageSeeds = [
  {
    id:1,
    spotId:1,
    url:'spot1.png',
    preview:true
  },
  {
    id:2,
    spotId:2,
    url:'spot2.png',
    preview:false
  },
  {
    id:3,
    spotId:3,
    url:'spot3.png',
    preview:false
  },
  {
    id:4,
    spotId:4,
    url:'spot4.png',
    preview:true
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options,spotImageSeeds);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';
    await queryInterface.bulkDelete(options,{[Op.or]:spotImageSeeds},{})
  }
};
