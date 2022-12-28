const express = require('express');
const { Model } = require('sequelize');
const router = express();

const { Booking, Spot, SpotImage } = require('../../db/models');
const { requireAuth, validateBooking } = require('../../utils/auth');

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
  res.json(
    {
    "Bookings":bookingsList
    }
  );
})

//Edit a Booking
router.put('/:id', requireAuth, validateBooking, async (req, res, next) => {
  const updateBooking = await Booking.findByPk(req.params.id);
  if(!updateBooking){
    res.status(404);
    return res.json({
      "message": "Booking couldn't be found"
    })
  }
  if(updateBooking.userId !== req.user.id){
    res.status(403);
    return res.json({
      "message": "Forbidden"
    })
  }
  const {startDate, endDate} = req.body;
  if(startDate >= endDate){
    res.status(400);
    return res.json({
      "message": "Validation error",
      "errors": [
        "endDate cannot come before startDate"
      ]
    })
  }
  const now = new Date();
  if(new Date(endDate) < now){
    res.status(403);
    return res.json({
      "message": "Past bookings can't be modified",
    })
  }

  const bookingsSpecialSpot = await Booking.findAll({
    where:{
      spotId:updateBooking.spotId
    }
  })
  bookingsSpecialSpot.forEach(booked => {
    if(booked.id !== updateBooking.id){
      const bookedStartDate = booked.startDate;
      const bookedEndDate = booked.endDate;
      console.log("bookedStartDate: ", bookedStartDate);
      console.log("bookedEndDate", bookedEndDate);
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
    }
  })
  updateBooking.update({
    startDate,
    endDate
  })
  res.json(updateBooking);
})

module.exports = router;
