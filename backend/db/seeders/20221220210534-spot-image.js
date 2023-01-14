'use strict';
const bcrypt = require("bcryptjs");
const {Op} = require('sequelize')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const spotImageSeeds = [
  {
    spotId:1,
    url:'https://a0.muscache.com/im/pictures/950e2e18-1331-4e22-8026-a6f7a5de22a4.jpg?im_w=1440',
    preview:true
  },
  {
    spotId:2,
    url:'https://a0.muscache.com/im/pictures/miso/Hosting-739807825225924253/original/b03c3578-0b65-43a5-b89d-da5d7bc8f559.jpeg?im_w=1200',
    preview:false
  },
  {
    spotId:3,
    url:'https://a0.muscache.com/im/pictures/5716db99-af8e-4081-88ef-d33fe5728ef3.jpg?im_w=1200',
    preview:false
  },
  {
    spotId:4,
    url:'https://a0.muscache.com/im/pictures/miso/Hosting-37019642/original/0ebde664-c9d0-43b1-bc6d-68571095ac5f.jpeg?im_w=1200',
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
