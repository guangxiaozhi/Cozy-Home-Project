const express = require('express');
const {sequelize, Op } = require('sequelize')
const router = express();
const { validateReview, requireAuth } = require("../../utils/auth");
const { User, Review, ReviewImage, Spot, SpotImage } = require('../../db/models');

// Add an Image for a Review
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
  };
  if(review.userId !== req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden"
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
        attributes:['id', 'ownerId', 'address','city','state', 'country', 'lat', 'lng', 'name', 'price'],
        include:{
          model:SpotImage
        }
      },
      {
        model:ReviewImage,
        attributes:['id', 'url']
      }
    ],
    order:['id']
  })

  const reviewsList = [];
  reviews.forEach(review => {
    reviewsList.push(review.toJSON());
  });
  reviewsList.forEach(review => {
    review.Spot.SpotImages.forEach(image =>{
      if(image.preview === true){
        review.Spot.previewImage = image.url
      }
    })
    if(!review.Spot.previewImage){
      review.Spot.previewImage = "no preview image found"
    }
    delete review.Spot.SpotImages
  })
  res.json(
    {
      "reviews": reviewsList
    }
  );
})

// Edit a Review
router.put('/:id',validateReview, requireAuth, async (req, res, next) => {
  const specialReview = await Review.findByPk(req.params.id);

  if(!specialReview){
    res.status = 404;
    return res.json({
      "message": "Review couldn't be found"
    })
  };
  if(specialReview.userId !== req.user.id){
    res.status = 404;
    return res.json({
      "message": "Forbidden"
    })
  };

  const {review, stars} = req.body;
  specialReview.update({
    review,
    stars
  })

  res.json(specialReview);
})

// Delete a Review
router.delete('/:id', requireAuth, async (req, res, next) => {
  const review = await Review.findByPk(req.params.id);
  if(!review){
    res.status(404);
    return res.json({
      "message": "Review couldn't be found"
    })
  }

  if(review.userId !== req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden"
    })
  }else{
    await review.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted"
    })
  }
})
module.exports = router;
