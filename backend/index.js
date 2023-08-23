const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
const cors = require('cors')


app.use(express.json());
app.use(cors())


const authRoute = require('./routes/auth')
const orderRoute = require('./routes/order')

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL)
  .then(() => { console.log("DB connection Successfull") })
  .then(() => app.listen(process.env.PORT || 8800, () => {
    console.log("Backend server is running")
  }))
  .catch((err) => { console.log(err) });

app.get("/", (req,res)=>{
  res.send("Welcome to Voosh api v1")
})

app.use("/api/auth",authRoute)
app.use("/api", orderRoute)

