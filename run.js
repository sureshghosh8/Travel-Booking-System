var express=require('express');
var app=express();

const session = require('express-session');
app.use(session({
    secret: '98989898989898',
    resave: false,
    saveUninitialized: false,
  }));
  app.use(function (req, res, next) {
    res.locals.email = req.session.username;
    res.locals.firstName = req.session.useremail;
    
    next();
  });
app.use(express.static('public'));
app.use(express.static('public/images'));
app.use(express.static('public/font'));
app.use(express.static('public/css'));
app.use(express.static('public/js'));
app.use(express.static('public/videos'));

var bd = require('body-parser');  
var ed = bd.urlencoded({ extended: false });
var my = require('mysql');
app.set('view engine','ejs');
var con=my.createConnection(
{
host:'127.0.0.1',
user:'root',
password:'',
database:'travel'
});
con.connect(function(err,data)
{
if(err)
throw err;
console.log("Connect with mysql");
});
app.get("/",function(req,res)
{
res.render('index');
});
app.get("/index",function(req,res)
{
res.render('index');
});
app.post('/Subscribe',ed,function(req,res)
{
    var  subscribed=req.body.Sub;
    
    var q="insert into subscriber values('"+subscribed+"')";
    con.query(q,function(err,result)
    {
        if(err)
        throw err;
    res.render("index");
    });
});
app.get("/contact",function(req,res)
{
res.render('contact');
});
app.post('/send-message',ed,function(req,res)
{
    var name=req.body.na;
    var email=req.body.em;
    var message=req.body.msg;
    var q="insert into contact values('"+name+"','"+email+"','"+message+"')";
    con.query(q,function(err,result)
    {
        if(err)
        throw err;
    res.send("thank you for conatct us");
    });
});
app.get("/blog",function(req,res)
{
res.render('blog');
});
app.get("/gallery",function(req,res)
{
res.render('gallery');
});
app.get("/about",function(req,res)
{
res.render('about');
});
app.get("/admin",function(req,res)
{
res.render('admin');
});
app.post('/adminlogin',ed,function(req,res)
{
    var id=req.body.id;
    var pwd=req.body.pwd;
    var q="select * from admin where id='"+id+"' and pwd='"+pwd+"'";
  con.query(q,function(err,result)
    {
        if(err)
        throw err;
    var L=result.length;
   console.log(result);
   console.log(result.length);
   if(L>0)
   res.render("adpanel");
else
res.send("inValid user");

    });

});
app.get("/registration",function(req,res)
{
res.render('registration');
});
app.post('/register',ed,function(req,res)
{
    var Name=req.body.na;
    var email=req.body.em;
    var password=req.body.pwd;
    var q="insert into trip values('"+Name+"','"+email+"','"+password+"')";
    con.query(q,function(err,result)
    {
        if(err)
        throw err;
    res.send("data insert successfully");
    });
});
app.post('/login',ed,function(req,res)
{
    var email=req.body.em;
    var password=req.body.pwd;
    var q="select * from trip where email='"+email+"'and password='"+password+"'";
    con.query(q,function(err,result)
    {
        if(err)
        throw err;
    var l=result.length;
    console.log(result);
    console.log(result.length);
    if(l>0)
    {
    
    req.session.username = result[0].Name;
    req.session.useremail = email;

res.redirect("viewtrip");

    }
else
res.send("invalid user");
});
});
app.get("/viewtrip",function(req,res)
{
   var q="select * from tour"
    con.query(q,function(err,result)
{
if(err)
throw err;
else
res.render('user',{data:result});
});
});

app.get("/registereduser",function(req,res)
{
   var q="select * from trip"
    con.query(q,function(err,result)
{
if(err)
throw err;
else
res.render('registereduser',{data:result});
});
});
app.get("/contactus",function(req,res)
{
   var q="select * from contact"
    con.query(q,function(err,result)
{
if(err)
throw err;
else
res.render('contactus',{data:result});
});
});
app.get("/Delusers",function(req,res)
{
var e=req.query.em;
var q="delete from trip where email='"+e+"'";
con.query(q,function(err,data)
{
if(err)
throw err;
res.redirect("/registereduser");
}); 
});
app.get("/Deldata",function(req,res)
{
var e=req.query.em;
var q="delete from contact where email='"+e+"'";
con.query(q,function(err,data)
{
if(err)
throw err;
res.redirect("/contactus");
}); 
});
app.get("/addtour",function(req,res)
{
res.render('addtour');
});

app.get("/tourdata",function(req,res)
{
    var idd=req.query.id;
   var q= "select * from tour where id='"+idd+"'";
   con.query(q,function(err,result)
   {
   if(err)
   throw err;
   else
   {
    var username=req.session.username;
    var email=req.session.useremail;
    var trip=result[0].name;
    var category=result[0].category;
    var package=result[0].package;
    var days=result[0].numberofdays;
    var idd=result[0].id;
    var date=result[0].date;
    var q="insert into booking values('"+username+"','"+email+"','"+trip+"','"+category+"','"+package+"','"+days+"','"+idd+"','"+date+"')";
   
   con.query(q,function(err,result)
    {
        if(err)
        throw err;
    
    res.redirect("/viewtrip");
    });
}
});

});
app.get("/viewbooking",function(req,res)
{
   var q="select * from booking"
    con.query(q,function(err,result)
{
if(err)
throw err;
else
res.render('viewbooking',{data:result});
});
});

app.get("/Delbooking",function(req,res)
{
var id=req.query.idd;
var q="delete from booking where idd='"+id+"'";
con.query(q,function(err,data)
{
if(err)
throw err;
res.redirect("/viewbooking");
}); 
});
app.get("/sub",function(req,res)
{
   var q="select * from subscriber"
    con.query(q,function(err,result)
{
if(err)
throw err;
else
res.render('sub',{data:result});
});
});

   

app.post('/get-tour',ed,function(req,res)
{
    var name=req.body.na;
    var category=req.body.cat;
    var package=req.body.rupee;
    var numberofdays=req.body.days;
    var nights=req.body.nights;
    var mornings=req.body.mornings;
    var date=req.body.date;
    var q="insert into tour(name,category,package,numberofdays,nights,mornings,date) values('"+name+"','"+category+"','"+package+"','"+numberofdays+"','"+nights+"','"+mornings+"','"+date+"')";
    con.query(q,function(err,result)
    {
        if(err)
        throw err;
    res.send("data insert successfully");
    });
});

app.listen(1001);