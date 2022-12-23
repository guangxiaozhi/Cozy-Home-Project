const express = require('express');
const sequelize = require('sequelize')
const router = express();
const { Spot, Review, SpotImage } = require('../../db/models');
const { requireAuth } = require("../../utils/auth");
const {handleValidationErrors} = require('../../utils/validation')
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
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required.'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required.'),
  check('lat')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal()
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isDecimal()
    .withMessage('Price per day is required'),
  handleValidationErrors
];
router.post('/', [requireAuth, validateSpot], async (req, res, next)=>{
  const {user} = req;
  const {address, city, state, country, lat, lng, name ,description, price} = req.body;
  const spot = await Spot.create({
    ownerId:user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });
  res.json(spot);

});

router.post('/:id/images',requireAuth, async (req, res, next) => {
  const spotId = req.params.id;
  const {url, preview} = req.body;
  const spot = await Spot.findOne({
    where:{
      id:spotId
    }
  })
  if(!spot){
    res.status(404);
    return res.json({
      message:"spot couldn't find"
    })
  }
  let newImage;
  if(spot.ownerId !== req.user.id){
    res.status(400);
    return res.json({
      message:'spot is not current user\'s spot'
    })
  }else{
    newImage = await spot.createSpotImage({
      spotId:spot.id,
      url,
      preview
    })
  }

  res.json({
    id:newImage.id,
    url:newImage.url,
    preview:newImage.preview
  });
})

module.exports = router;
