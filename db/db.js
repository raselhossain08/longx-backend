const mongoose = require('mongoose');
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB).then(con =>{
        console.log(`MongoDB database connected successfully with url: ${con.connection.host}`);
    })
}

module.exports= connectDatabase