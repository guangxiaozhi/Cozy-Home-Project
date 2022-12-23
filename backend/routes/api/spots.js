const express = require('express');
const sequelize = require('sequelize')
const router = express();
const { Spot, Review, SpotImage } = require('../../db/models');
const { requireAuth } = require("../../utils/auth");


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


module.exports = router;
