const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const{User, Comment} = require('./models');
const morgan = require('morgan');
const app = express();
const routes = require('./Routes/routes');
const seedDatabase= require('./Seeders/seed');

//imports Seeded data from data.json
seedDatabase();


app.use(express.json())
app.use(morgan('dev'));
app.use('/api',routes);


app.get('/', (req,res,) =>{
   res.json({
    message:'Welcome to My Portfolio'
   })
})

//404 ERROR HANDLER
app.use((req,res,) => {
    res.status(404).json({
       message:' Route Not Found', 
    })
});
//GLOBAL ERROR HANDLER
app.use((err,req,res,next)=>{
    res.status(500).json({
        message: "Internal server error occurred"
    })
    next();
})

//Port to our database
app.listen(5000, ()=> {
    console.log('Running on Port:5000')
});