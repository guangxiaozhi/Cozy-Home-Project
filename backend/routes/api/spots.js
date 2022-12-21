const express = require('express');
const router = express();
const { Spot, Review } = require('../../db/models');

router.get('/', async (req, res, next)=> {
  const allSpots = await Spot.findAll(
    
  )
  res.json({Spots:allSpots});
})

module.exports = router;
