const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Get all bootcamps data' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    msg: `fetch a single bootcamp with ID of ${req.params.id}`,
  });
});

router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'create a new bootcamp' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    msg: `Update bootcamp with ID of ${req.params.id}`,
  });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    msg: `delete bootcamp with ID of ${req.params.id}`,
  });
});

module.exports = router;
