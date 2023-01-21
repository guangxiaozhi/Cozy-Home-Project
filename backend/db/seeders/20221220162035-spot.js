'use strict';
const bcrypt = require("bcryptjs");
const {Op} = require('sequelize')
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const spotseed = [
  {
    ownerId:1,
    address:'137 321TH SE PL',
    city:'Honolulu',
    state:'Hawaii',
    country:'USA',
    lat:54.2,
    lng:98.23,
    name:'Hilton',
    description:'very good',
    price:245
  },
  {
    ownerId:2,
    address:'987 756TH SE PL',
    city:'SanDiego',
    state:'Caniforlia',
    country:'USA',
    lat:12.4,
    lng:37.56,
    name:'Marriott',
    description:'comfortable',
    price:198
  },
  {
    ownerId:3,
    address:'184 94TH SE PL',
    city:'Jackson',
    state:'Wyoming',
    country:'USA',
    lat:190.87,
    lng:65.3,
    name:'Beverly Hills',
    description:'good view',
    price:175
  },
  {
    ownerId:4,
    address:'629 432TH SE PL',
    city:'Bellevue',
    state:'Washington',
    country:'USA',
    lat:435.1,
    lng:87.0,
    name:'Superior',
    description:'convenient to go shopping',
    price:234
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    options.tableName = 'Spots';
    await queryInterface.bulkInsert(options,spotseed)


  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, { [Op.or]: spotseed }, {} )
  }
};
