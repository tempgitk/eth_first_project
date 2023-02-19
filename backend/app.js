const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const Filecoin = require('filecoin-api-client');
const jwt = require('jsonwebtoken');

// Load the smart contract ABI
const contractABI = require('./contracts/SupplyChain.json').abi;

// Initialize web3 with Ganache local blockchain
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

// Initialize Filecoin API client
const filecoin = Filecoin({
  apiAddress: 'http://localhost:7777/rpc/v0',
});

// Set up the Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify token with JWT
    const decodedToken = jwt.verify(token, 'SECRET_KEY');

    // Attach user data to request object
    req.userData = { userId: decodedToken.userId };

    // Proceed to next middleware
    next();
  } catch (error) {
    // Return error if authentication fails
    res.status(401).json({ message: 'Authentication failed!' });
  }
};

// Set up routes for interacting with the smart contract and Filecoin network

// Get product details
app.get('/api/product/:id', authMiddleware, async (req, res) => {
  try {
    const contractAddress = '0x123456789...'; // Replace with the deployed contract address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Call the getProduct function on the smart contract
    const result = await contract.methods.getProduct(req.params.id).call();

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error!' });
  }
});

// Add new product to supply chain
app.post('/api/product', authMiddleware, async (req, res) => {
  try {
    const contractAddress = '0x123456789...'; // Replace with the deployed contract address
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Call the addProduct function on the smart contract
    const result = await contract.methods.addProduct(req.body.id, req.body.name, req.body.description).send({
      from: web3.eth.defaultAccount,
      gas: 3000000,
    });

    // Add file to Filecoin network
    const file = Buffer.from(req.body.file, 'base64');
    const cid = await filecoin.client.add(file, { pin: true });

    res.status(201).json({ message: 'Product added!', result, cid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error!' });
  }
});

