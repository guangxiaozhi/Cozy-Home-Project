const express = require('express');
const {sequelize, Op } = require('sequelize')
const router = express();
const { Spot, Review, SpotImage, User } = require('../../db/models');
const { requireAuth } = require("../../utils/auth");
const {handleValidationErrors} = require('../../utils/validation')
const { check} = require("express-validator");


// Get all Spots
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
      if (spotImage.url){
        spot.previewImage = spotImage.url;
      }
    })
    let i = 0;
    let count = 0;
    spot.Reviews.forEach(review =>{
      i++;
      count = count + review.stars;
    })
    spot.avgRating = count/i;
    delete spot.SpotImages;
    delete spot.Reviews;
  });

  res.json({Spots});
})

// Get Spots owned by the Current User
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

// Create a spot
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

// Add an Image to a Spot based on the Spot's id
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

// Get details for a Spot from an id
router.get('/:id',requireAuth, async (req, res, next) => {
  const spot = await Spot.findOne({
    where:{
      id:req.params.id
    },
    include:[
      {
      model:Review
      },
      {
        model:SpotImage,
        attributes:['id', 'url', 'preview']
      },
      {
        model:User,
        as:'Owner',
        attributes:['id', 'firstName', 'lastName']
      }
    ],
  })
  if (!spot){
    res.status(404);
    res.json({
      "message": "Spot couldn't be found"
    })
  }
  let sum = 0;
  const jsonSpot = spot.toJSON();
  jsonSpot.numReviews = spot.Reviews.length;
  for(let review of jsonSpot.Reviews){
    sum = sum + review.stars;
  }
  if(jsonSpot.numReviews){
    jsonSpot.avgStarTating = sum/jsonSpot.numReviews;
  }else{
    jsonSpot.avgStarTating = 0;
  }
  delete jsonSpot.Reviews;
  res.json(jsonSpot);
})

// Edit a spot
router.put('/:id',requireAuth, async (req, res, next) => {
  const updateSpot = await Spot.findOne({
    where:{
      id: req.params.id
    }
  })
  if(!updateSpot){
    res.status = 404;
    return res.json({
      "message": "Spot couldn't be found"
    })
  }
  const {address, city, state, country, lat, lng, name, description, price} = req.body;
  if(!(address && city && state && country && lat && lng && name && description && price)){
    res.status(400);
    return res.json({
      "message": "Validation Error",
      "errors": [
        "Street address is required",
        "City is required",
        "State is required",
        "Country is required",
        "Latitude is not valid",
        "Longitude is not valid",
        "Name must be less than 50 characters",
        "Description is required",
        "Price per day is required"
      ]
    })
  }
  updateSpot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  })

  res.json(updateSpot)
})

// Create a Review for a Spot
router.post('/:id/reviews', requireAuth, async (req, res, next) => {
  const spot = await Spot.findOne({
    where:{
      id:req.params.id
    }
  })
  if (!spot){
    res.status = 404;
    return res.json({
      "message": "Spot couldn't be found"
    })
  }
  const {review, stars} = req.body;
  if(!(review && stars)){
    res.status = 400;
    return res.json({
      "message": "Validation error",
      "errors": [
        "Review text is required",
        "Stars must be an integer from 1 to 5",
      ]
    })
  }
  const existReview = await Review.findOne({
    where:{
      [Op.and]:[
        {
          userId:spot.ownerId
        },
        {
          spotId:req.params.id
        }
      ]
    }
  })
  if(existReview){
    res.status(403)
    return res.json({
      "message": "User already has a review for this spot"
    })
  }

  const newReview = await spot.createReview({
    userId:spot.ownerId,
    spotId:req.params.id,
    review,
    stars
  })
  res.json(newReview);
})



module.exports = router;
