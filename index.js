// imports
const express = require('express');
const authRouter = require('./src/routes/authRouter')
const mongoose = require('mongoose');

// properties
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Connected to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/CodeParivaar", {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

// Using express routers
app.use(authRouter);

// Server creation
app.listen(3000, ()=> {
  console.log('listening on port 3000');
});