const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const e = require("express");
const db = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    }

);

exports.login = (req,res) => {
    const {email, password} = req.body;
    try{
        db.query('Select * from user where email = ?',[email],async (error,results)=>{
            if(!email || !password)
            {
                return res.render("login",{message: 'Enter full details.'});
            }
            else if(!results ||!(await bcrypt.compare(password,results[0].password)))
            {
                return res.render("login",{message: 'Incorrect details'});
            }
            else
            {                 
                    const token = jwt.sign(results[0].id,process.env.ACCESS_TOKEN);
                    const cookieOptions = {
                        httpOnly: true
                    }

                    res.cookie('jwt',token,cookieOptions);
                    const info = results[0];
                    res.cookie('info',info,cookieOptions);
                    res.status(200).redirect("/"); 
                
            }
        })

    }catch(error){
        console.log(error);
    }
}

exports.register = (req,res) => {
    console.log(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passc = req.body.passwordConfirm;
    
    db.query('Select email from user where email = ?',[email],async (error,results)=>{

        if(error)
        {
            console.log(error);
        }
        if(results.length)
        {
            return res.render("register", {message: 'This email is already in use'});
        }
        else if(password!=passc)
        {
            return res.render('register',{message: 'Password doesnot match'});
        }
        
            let hp = await bcrypt.hash(password,8);
            db.query('Insert into user Set ?', {name: name, email: email, password: hp}, (error,results)=>{
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    return res.render("register", {message1: 'Registration successful.'});
                }
            });


       
    });
}

exports.addbook = (req,res) =>{
    console.log(req.body);
    const {bookname, author, publisher, ISBN, Genre} = req.body;
   
    db.query('INSERT INTO books Set ?', {name: bookname, author: author, publisher: publisher, isbn: ISBN, Genre: Genre, owner: 'Admin'},async (error,results)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            return res.render("addbook",{message: 'Book added Successfully'});
        }
    });
}


exports.requestbook = (req,res)=>{
    console.log(req.body);
    const bookname = req.body.bookname;
    const info = req.cookies.info;
    db.query('Select owner from books where name = ?',[bookname],async (error,results)=>{

        if(error)
        {
            console.log(error);
        }
        if(!results.length)
        {
            return res.render("requestbook", {message2: 'There is no such book in database'});
        }
        else
        {
            if(results[0].owner != 'Admin')
        {
            return res.render("requestbook", {message2: 'This book is not available at moment'});
        }
        else if(results[0].owner === info.name)
        {
            return res.render('requestbook',{message1: 'This book is owned by you!!'});
        }
        
        db.query('INSERT INTO request Set ?', {bookname: bookname, request: info.name},async (error,results)=>{
            if(error)
            {
                console.log(error);
            }
            else
            {
                return res.render("requestbook",{message: 'Book requested Successfully'});
            }
        });

        }
        


       
    });
    
}

exports.seerequest = (req,res)=>{
    const bookname = req.body.bookname;
    const request = req.body.request;
    //console.log(req.body.bookname);

    db.query('Delete From request where request = ?', [request],(error,results)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            db.query('Update books Set owner = ? where name = ?',[request,bookname],(error,results)=>{
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    res.render('seerequest',{message: 'Request Approved Successfully.'});
                }
            });
        }
    });
}

exports.returnbook = (req,res)=>{
    const bookname = req.body.bookname;


            db.query('Update books Set owner = "Admin" where name = ?',[bookname],(error,results)=>{
                if(error)
                {
                    console.log(error);
                }
                else
                {
                    res.render('returnbook',{message: 'Returned Book Successfully.'});
                }
            });
}