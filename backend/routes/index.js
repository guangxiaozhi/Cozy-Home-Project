// backend/routes/index.js
const express = require('express');
const router = express.Router();


//import the index.js in api into here, and connect it to the this router
const apiRouter = require('./api');

router.use('/api', apiRouter);

//test router
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});


module.exports = router;
