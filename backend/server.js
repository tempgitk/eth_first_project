const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const path = require('path');
const config = require('./config');
const connectToDB = require('./util/db');
const routes = require('./routes');
const { getFilecoinClient } = require('./util');

const app = express();
const port = config.port;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Connect to MongoDB
connectToDB();

// Use routes
app.use('/api', routes);

// Serve the React app for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// Set the Filecoin client as a global variable
global.filecoinClient = getFilecoinClient();
