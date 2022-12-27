const express = require('express');
const {sequelize, Op } = require('sequelize')
const router = express();
const { requireAuth } = require("../../utils/auth");
const { User, Review, ReviewImage, Spot } = require('../../db/models')

//Create an Image for a Review
router.post('/:id/images', requireAuth, async (req, res, next) => {
  const review = await Review.findOne({
    where:{
      id:req.params.id
    },
    include:{
      model: ReviewImage
    }
  });
  if(!review){
    res.status(404);
    return res.json({
      "message": "Review couldn't be found"
    })
  }
  if(review.ReviewImages.length >= 10){
    res.status(403);
    return res.json({
      "message": "Maximum number of images for this resource was reached"
    })
  }
  const { url } = req.body;

  const reviewImage = await review.createReviewImage({
    reviewId:review.id,
    url
  })
  res.json({
    "id": reviewImage.id,
    "url":reviewImage.url
  });
})

// Get Reviews of current user
router.get('/current', requireAuth, async (req, res, next) => {
  const currentUserId = req.user.id;
  const reviews = await Review.findAll({
    where:{
      userId:currentUserId
    },
    include:[
      {
        model:User,
        attributes:['id', 'firstName', 'lastName']
      },
      {
        model:Spot,
        attributes:['id', 'ownerId', 'address','city','state', 'country', 'lat', 'lng', 'name', 'price']
      },
      {
        model:ReviewImage,
        attributes:['id', 'url']
      }
    ]
  })

  reviews.forEach(review =>{
    review.toJSON();
    review.Spot.previewImage = '';
    if(review.ReviewImages){
      let urlValue;
      const reviewImages = review.ReviewImages;
      reviewImages.forEach(reviewImage =>{
        reviewImage.toJSON();
        urlValue = reviewImage.url;
      })
      // review.Spot[0]['previewImage'] = urlValue;
      // console.log("befor toJSON: ", review.Spot)
      // review.Spot.toJSON();
      // console.log("after toJSON: ",review.Spot)
      console.log(Object.keys(review.Spot));
      review.Spot["previewImage"] = urlValue;
      console.log(Object.keys(review.Spot.toJSON()));

    }else{
      review.Spot["previewImage"] = "No image available"
    }

  })
  res.json(
    {
      "reviews": reviews
    }
  );
})
module.exports = router;
