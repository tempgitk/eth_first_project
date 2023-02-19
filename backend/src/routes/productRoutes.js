// products.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware');
const Product = require('../models/product');
const { createFilecoinDeal } = require('../controllers/filecoin');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    console.log("error");
  };
})
