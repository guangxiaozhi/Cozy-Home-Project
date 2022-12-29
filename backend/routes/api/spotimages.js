const express = require('express');
const router = express();

const { SpotImage, Spot } = require('../../db/models')
const { requireAuth } = require('../../utils/auth.js')

// Delete a Spot Image
router.delete('/:id', requireAuth, async (req, res, next) => {
  const spotImage = await SpotImage.findOne(
    {
      where:{
        id:req.params.id
      }
    }
  );
  if(!spotImage){
    res.status(404);
    return res.json({
      "message": "Spot Image couldn't be found"
    })
  }
const spot = await Spot.findByPk(spotImage.spotId);
 if(spot.ownerId !== req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden"
    })
 }else {
    await spotImage.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted"
    })
 }
})

module.exports = router;
