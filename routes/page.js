const { request, response } = require("express");
const express = require("express");
const mysql = require("mysql");
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }

);
router.get("/",(req,res)=>{
   if(req.cookies.jwt === jwt.sign(1,process.env.ACCESS_TOKEN))
   {
       
       return res.render("adminportal");
   }
   if(req.cookies.jwt)
   {
       return res.render("clientportal");
   } 
   res.render('index');
});
router.get("/register",(req,res)=>{
    if(req.cookies.jwt === jwt.sign(1,process.env.ACCESS_TOKEN))
   {
       
       return res.render("adminportal");
   }
   if(req.cookies.jwt)
   {
       return res.render("clientportal");
   } 
   res.render('register');
});
router.get("/login",(req,res)=>{
    
    if(req.cookies.jwt === jwt.sign(1,process.env.ACCESS_TOKEN))
   {
       
       return res.render("adminportal");
   }
   if(req.cookies.jwt)
   {
       return res.render("clientportal");
   } 
   res.render('login');
    
});
router.get("/logout",(req,res)=>{
        const cookieOptions = {
            httpOnly: true
        }

    res.clearCookie('jwt',cookieOptions);
    res.clearCookie('info',cookieOptions);
    res.redirect('/');
});
router.get("/adminportal",(req,res)=>{
    if(req.cookies.jwt === jwt.sign(1,process.env.ACCESS_TOKEN))
    {
        res.render('adminportal');
    }
    else
    {
        res.send("Illegal Access");
    }
   
});
router.get("/clientportal",(req,res)=>{
    if(req.cookies.jwt && req.cookies.jwt != jwt.sign(1,process.env.ACCESS_TOKEN))
    {
        const info = req.cookies.info;
        res.render('clientportal',{info: info});
    }
    else
    {
        res.send("Illegal Access");
    }
   
});

router.get("/addbook",(req,res)=>{
    if(req.cookies.jwt === jwt.sign(1,process.env.ACCESS_TOKEN))
    {
        db.query('Select * From books',(error,results)=>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render("addbook",{data: results});
            }
    
        });
    }
    else
    {
        res.send("Illegal Access");
    }
   
});

router.get("/requestbook",(req,res)=>{
    if(req.cookies.jwt && req.cookies.jwt != jwt.sign(1,process.env.ACCESS_TOKEN))
    {
        const info = req.cookies.info;
        const user = info.user;
        const Admin = 'Admin';
        db.query('Select * From books where owner = ?',[Admin],(error,results)=>{
            
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render("requestbook",{data: results});
            }
    
        });
    }
    else
    {
        res.send("Illegal Access");
    }

});

router.get("/seerequest",(req,res)=>{
    if(req.cookies.jwt === jwt.sign(1,process.env.ACCESS_TOKEN))
    {
        db.query('Select * From request',(error,results)=>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render("seerequest",{data: results});
            }
    
        });
    }
    else
    {
        res.send("Illegal Access");
    }
   
});

router.get("/returnbook",(req,res)=>{
    if(req.cookies.jwt && req.cookies.jwt != jwt.sign(1,process.env.ACCESS_TOKEN))
    {
        db.query('Select * From books where owner = ?',[req.cookies.info.name],(error,results)=>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.render("returnbook",{data: results});
            }
    
        });
    }
    else
    {
        res.send("Illegal Access");
    }
   
});
module.exports = router;