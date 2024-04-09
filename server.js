// server .js
const express = require('express');
const app = express();
const port = 3000;

// Import the user router
const userRouter = require('./userrouter');



// Use the user router for routes starting with '/user'
app.use('/', userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
