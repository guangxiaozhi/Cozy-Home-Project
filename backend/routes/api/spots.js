const express = require('express');
const sequelize = require('sequelize')
const router = express();
const { Spot, Review, SpotImage } = require('../../db/models');
const { requireAuth ,handleValidationErrors} = require("../../utils/auth");
const { check} = require("express-validator");


router.get('/', requireAuth, async (req, res, next)=> {
  const allSpots = await Spot.findAll({
    include:[
      {
        model:Review,
      },
      {
        model:SpotImage
      }
    ]
  })
  const Spots = [];
  allSpots.forEach(spot => {
    Spots.push(spot.toJSON());
  })
  Spots.forEach((spot) => {
    spot.SpotImages.forEach(spotImage =>{
      console.log(spotImage.url);
      if (spotImage.url){
        spot.previewImage = spotImage.url;
      }
    })
    let i = 0;
    let count = 0;
    spot.Reviews.forEach(review =>{
      i++;
      console.log(review);
      count = count + review.stars;
    })
    spot.avgRating = count/i;
    delete spot.SpotImages;
    delete spot.Reviews;
  });

  res.json({Spots});
})

router.get('/current', requireAuth, async (req, res, next) =>{
  const userId = req.user.id;
  const allSpots = await Spot.findAll({
    where: {
      ownerId: userId
  },
    include:[
      {
        model:Review
      },
      {
        model:SpotImage
      }
    ]
  })
  const Spots = [];
  allSpots.forEach(spot => {
    Spots.push(spot.toJSON());
  })
  Spots.forEach((spot) => {
    spot.SpotImages.forEach(spotImage =>{
      console.log(spotImage.url);
      if (spotImage.url){
        spot.previewImage = spotImage.url;
      }
    })
    let i = 0;
    let count = 0;
    spot.Reviews.forEach(review =>{
      i++;
      console.log(review);
      count = count + review.stars;
    })
    spot.avgRating = count/i;
    delete spot.SpotImages;
    delete spot.Reviews;
  });

  res.json({Spots});
})
const validateSpot = [
  check('address')
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
  .notEmpty()
  .withMessage('City is required.'),
  check('state')
  .notEmpty()
  .withMessage('State is required.'),
  check('country')
  .notEmpty()
  .withMessage('Country is required.'),
  check('lat')
  .notEmpty()
  .isDecimal()
  .withMessage('Latitude is not valid'),
  check('lng')
  .notEmpty()
  .isDecimal()
  .withMessage('Longitude is not valid'),
  check('name')
  .isLength({ max: 50 })
  .withMessage('Name must be less than 50 characters')
  .notEmpty()
  .withMessage('Name is required'),
  check('description')
  .notEmpty()
  .withMessage('Description is required'),
  check('price')
  .notEmpty()
  .isDecimal()
  .withMessage('Price per day is required'),
  handleValidationErrors
];
router.post('/', requireAuth,validateSpot, async (req, res, next)=>{
  const {user} = req;
  console.log(user);
  const {address, city, state, country, lat, lng, name ,description, price} = req.body;
  const spot = await user.createSpot({ownerId:user.id,address, city, state, country, lat, lng, name ,description, price});
  res.json(spot);

})

module.exports = router;
