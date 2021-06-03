const express = require("express");
const jwt = require('jsonwebtoken');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require("path");
dotenv.config({ path:'./.env'});
const app = express();
app.use(cookieParser());
const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }

);



const publicDirectory = path.join(__dirname,'./public');

app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());



app.set('view engine', 'hbs');

db.connect((error)=>{
    if(error)
    {
        console.log(error)
    }
    else
    {
        console.log("mysql is connected.")
    }
});


app.use('/', require('./routes/page'));
app.use('/auth', require('./routes/auth'));





app.listen(3000, () =>{
    console.log("Server Started at port 3000");
})