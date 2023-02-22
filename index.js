require('dotenv').config();
const express = require('express');
const app = express();
const { port = 3000 } = process.env;
const cors = require('cors');
const morgan = require('morgan');

// is the server running?
app.get('/', (req, res, next) => {
    res.send("I'm alive!");
    next();
})

//  middleware
app.use(express.json());  // can read JSON in req.body
app.use(express.urlencoded({extended:true})) // can red url-encoded data in req.body
app.use(cors()); // enable CORS
app.use(morgan('dev')); // log requests to console


// error handling middleware
app.use((error, req, res, next) => {
    console.error('SERVER ERROR: ', error);
    if(res.statusCode < 400) res.status(500);
    res.send({error: error.message, name: error.name, message: error.message});
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
});