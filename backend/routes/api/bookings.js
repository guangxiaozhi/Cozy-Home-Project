const express = require('express');
const { Model } = require('sequelize');
const router = express();

const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// Get All Current User's Bookings
router.get('/current', requireAuth, async (req, res, next) => {
  const bookings = await Booking.findAll({
    where:{
      userId: req.user.id
    },
    include: {
      model: Spot,
      attributes:['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
      include:{
        model:SpotImage
      }
    }
  })

  if(bookings.length === 0){
    res.status = 404;
    return res.json({
      "message": "User has no bookings."
    })
  }
  const bookingsList = [];
  bookings.forEach(booking => {
    bookingsList.push(booking.toJSON());
  })
  bookingsList.forEach(booking => {
    booking.Spot.SpotImages.forEach(spotImage => {
      if(spotImage.preview)
      {
        booking.Spot.previewImage = spotImage.url;
      }
    })
    if(!booking.Spot.previewImage){
      booking.Spot.previewImage = "No PreviewImage"
    }
    delete booking.Spot.SpotImages;
  })
  res.json(bookingsList);
})



module.exports = router;
