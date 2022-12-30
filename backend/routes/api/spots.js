const express = require('express');
const {sequelize, Op } = require('sequelize')
const router = express();
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { requireAuth, validateReview, validateBooking } = require("../../utils/auth");
const {handleValidationErrors} = require('../../utils/validation');
const { check} = require("express-validator");


// Get all Spots
const validateQuery = [
  check('page')
    .isInt({ min: 1 })
    .withMessage('Page must be greater than or equal to 1'),
  check('size')
    .isInt({ min: 1 })
    .withMessage('Size must be greater than or equal to 1'),
  check('maxLat')
    .optional()
    .isDecimal()
    .withMessage('Maximum latitude is invalid'),
  check('minLat')
    .optional()
    .isDecimal()
    .withMessage('Minimum latitude is invalid'),
  check('minLng')
    .optional()
    .isDecimal()
    .withMessage('Minimum longitude is invalid'),
    check('maxLng')
    .optional()
    .isDecimal()
    .withMessage('Maximum longitude is invalid'),
  check('minPrice')
    .optional()
    .isNumeric({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice')
    .optional()
    .isNumeric({ min: 0 })
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];
router.get('/', validateQuery, async (req, res, next)=> {
  let {page, size} = req.query;
  if( !page ) page = 1;
  if( !size || +size > 20 ) size = 20;
  if( +page >10 ) page = 10;
  const pagination = {};
  pagination.limit = size;
  pagination.offset = size * (page - 1);

  const {minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
  const where = {}

  if(minLat && !maxLat){
    where.lat = {[Op.gte]:+minLat};
  }else if(!minLat && maxLat){
    where.lat = {[Op.lte]:+maxLat};
  }else if(minLat && maxLat){
    where.lat = {[Op.between]:[+minLat, +maxLat]};
  }

  if(minLng && !maxLng){
    where.lng = {[Op.gte]:+minLng};
  }else if(!minLng && maxLng){
    where.lng = {[Op.lte]:+maxLng};
  }else if(minLng && maxLng){
    where.lng = {[Op.between]:[+minLat, +maxLng]};
  }


  if(minPrice && !maxPrice){
    if(minPrice < 0){
      minPrice = 0;
    }
    where.price = {[Op.gte]:+minPrice};
  }else if(!minPrice && maxPrice){
    where.price = {[Op.lte]:+maxPrice};
  }else if(minPrice && maxPrice){
    where.price = {[Op.between]:[+minPrice, +maxPrice]};
  }
console.log(where);
  const allSpots = await Spot.findAll({
    where,
    include:[
      {
        model:Review,
      },
      {
        model:SpotImage
      }
    ],
    order:['id'],
    ...pagination
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
    delete spot.SpotImages;
    let i = 0;
    let count = 0;
    spot.Reviews.forEach(review =>{
      i++;
      count = count + review.stars;
    })
    spot.avgRating = count/i;
    delete spot.Reviews;
  });


  res.json({
    "Spots": Spots,
    "page": page,
    "size":size
  });
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
    ],
    order:['id']
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
    if(!spot.previewImage){
      spot.previewImage = "spot doesn't have spotImage"
    }
    let i = 0;
    let count = 0;
    spot.Reviews.forEach(review =>{
      i++;
      console.log(review);
      count = count + review.stars;
    })
    if(i === 0){
      spot.avgRating = 0;
    }else{
      spot.avgRating = count/i;
    }
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
  res.statusCode = 201;
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
      message:"spot couldn't be find"
    })
  }
  if(spot.ownerId !== req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden"
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
router.get('/:id', async (req, res, next) => {
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
    jsonSpot.avgStarRating = sum/jsonSpot.numReviews;
  }else{
    jsonSpot.avgStarRating = 0;
  }
  delete jsonSpot.Reviews;
  res.json(jsonSpot);
})

// Edit a spot
router.put('/:id',requireAuth, validateSpot, async (req, res, next) => {
  const updateSpot = await Spot.findOne({
    where:{
      id: req.params.id
    }
  })
  if(!updateSpot){
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found"
    })
  }
  if(updateSpot.ownerId !== req.user.id){
    res.status(403);
    return res.json({"message": "Forbidden"})

  }
  const {address, city, state, country, lat, lng, name, description, price} = req.body;

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
router.post('/:id/reviews', requireAuth, validateReview, async (req, res, next) => {
  const spot = await Spot.findOne({
    where:{
      id:req.params.id
    }
  })
  if (!spot){
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found"
    })
  }
  const {review, stars} = req.body;
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
  res.status(201)
  res.json(newReview);
})

// Get Reviews by Spot Id
router.get('/:id/reviews', async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.id);
  if(!spot){
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found"
    })
  }
  const reviews = await Review.findAll({
    where:{
      spotId:req.params.id
    },
    include:[
      {
        model:User,
        attributes:["id", "firstName", "lastName"]
      },
      {
        model:ReviewImage,
        attributes:["id","url"]
      }
    ],
    order:['id']
  })
  res.json(
    {
    "Reviews":reviews
    }
  );
})

// Create a Booking Based on a Spot Id

router.post('/:id/bookings', requireAuth, validateBooking, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.id);
  if(!spot){
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found"
    })
  }
  if(spot.ownerId === req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden",
      "errors":[
        "Spot must NOT belong to the current user"
      ]
    })
  }
  const {startDate, endDate} = req.body;
  const now = new Date();
  if(new Date(startDate) < now || new Date(endDate) < now){
    res.status(400);
    return res.json({
      "message": "Validation error",
      "errors": [
        "startDate and endDate can not be past time"
      ]
    })
  }
  if(startDate >= endDate){
    res.status(400);
    return res.json({
      "message": "Validation error",
      "errors": [
        "endDate cannot be on or before startDate"
      ]
    })
  }
  const allBookings = await Booking.findAll({
    where:{
      spotId:spot.id
    }
  })
  allBookings.forEach(booked => {
    const bookedStartDate = booked.startDate;
    const bookedEndDate = booked.endDate;
    if(startDate >= bookedStartDate && startDate < bookedEndDate){
      res.status(403);
      return res.json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": [
          "Start date conflicts with an existing booking"
        ]
      })
    }else if(endDate > bookedStartDate && endDate <= bookedEndDate){
      res.status(403);
      return res.json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": [
          "End date conflicts with an existing booking"
        ]
      })
    }else if(startDate < bookedStartDate && endDate > bookedEndDate){
      res.status(403);
      return res.json({
        "message": "Sorry, this spot is already booked for the specified dates",
        "errors": [
          "Start date conflicts with an existing booking",
          "End date conflicts with an existing booking"
        ]
      })
    }
  })
  const booking = await spot.createBooking({
    spotId:spot.id,
    userId:spot.ownerId,
    startDate,
    endDate
  })
  res.json(booking)
})

// Get all Bookings for a Spot based on the Spot's id
router.get('/:id/bookings', requireAuth, async (req, res,next) => {
  const spot = await Spot.findByPk(req.params.id);
  if(!spot){
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found"
    })
  }
  const bookings = await Booking.findAll({
    where:{
      spotId:req.params.id
    },
    include:{
      model:User,
      attributes: ["id", "firstName", "lastName"]
    }
  });
  if(bookings.length === 0){
    res.status(404);
    return res.json({
      "message": "This spot hasn't been booked."
    })
  }
  if(bookings[0].toJSON().userId !== req.user.id){
    const bookingsList = [];
    bookings.forEach(booking => {
      booking.toJSON();
      const bookingMessage = {
        "spotId":booking.spotId,
        "startDate":booking.startDate,
        "endDate":booking.endDate
      }
      bookingsList.push(bookingMessage);
    })
    res.status = 200;
    return res.json(
      {
        "Bookings":bookingsList
      }
      )
  }else{
    res.status = 200;
    res.json({"Bookings":bookings});
  }
})

// Delete a Spot
router.delete('/:id', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.id);
  if(!spot){
    res.status(404);
    return res.json({
      "message": "Spot couldn't be found"
    })
  }

  if(spot.ownerId !== req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden"
    })
  }else{
    await spot.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted"
    })
  }
})
module.exports = router;
