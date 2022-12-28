const express = require('express');
const router = express();
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');

// Delete a Review Image
router.delete('/:id', requireAuth, async (req, res, next)=> {
  const reviewImage = await ReviewImage.findByPk(req.params.id);
  if(!reviewImage){
    res.status(404);
    return res.json({
      "message": "Review Image couldn't be found"
    })
  }
  const review = await Review.findByPk(reviewImage.reviewId);
  if(review.userId !== req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden"
    })
  }else{
    await reviewImage.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted"
    })
  }
})


module.exports = router;
