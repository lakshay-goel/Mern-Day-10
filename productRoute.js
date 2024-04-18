const express = require('express');

const fsPromises = require('fs/promises');
const productRouter = require('./routes/productRoute.js');
const app = express();

app.use(express.json());
app/use(req, res);