if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  //basic require express and mongoose
  const express = require('express');
  const mongoose = require('mongoose');
  const Article = require("./models/article")
  const methodOverride = require('method-override')
  
  //uri that uses to connect to the database
  const uri =
    'mongodb+srv://wallace:wallace0@cluster.2hwslz8.mongodb.net/Blog?retryWrites=true&w=majority';


  //fucntion try to connect to the DB
  function connect() {
    try {
      mongoose.connect(uri);
      console.log('connected to mongoDB ');
    } catch (error) {
      console.error(error);
    }
  }
    
  //call the connect function
  connect();
  
  //creating routes to use
  const conRouter = require('./routes/contact');
  const articleRouter = require('./routes/articles');
  const app = express();
  
  //some library installations need to be declare
  const passport = require('passport');
  const flash = require('express-flash');
  const session = require('express-session');
  
  //initilize passport to deal with the login function
  const initializePassport = require('./passport-config');
  initializePassport(
    passport,
    (email) => users.find((user) => user.email === email),
    (id) => users.find((user) => user.id === id)
  );
  
  //create an array for storing users account
  const users = [];
  

  //set the engine
  app.set('view engine', 'ejs');
  app.use(express.urlencoded({ extended: false }));
  app.use(methodOverride('_method'))

  //create route
  app.use('/contact', conRouter);
  
  //craete flash and session for login
  app.use(flash());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  //tell the app to work with the passport npm
  app.use(passport.initialize());
  app.use(passport.session());
  

  const commentSchema = new mongoose.Schema({
    author:String,
     comment:String
  
  })

  const Comment = mongoose.model('Comment',commentSchema)


  //app post to save the comments into the database
  app.post('/articles/:id/comments',async (req,res)=>{
    console.log(req.body.comment)
    const comment = new Comment({
      author:req.user.name,
      comment:req.body.comment
    })
    try{
      comment.save()
      res.redirect('/')
    }catch (e) {
      //get the error and render back to the creating state
      console.log(e);
    }

  })

  //render login page with login.ejs
  app.get('/login', checkNotAuthenticated,(req, res) => {
    res.render('login');
  });
  
  //render the /all page once the user clicks the all article nav
  app.get('/all',async (req,res)=>{
    const articles = await Article.find().sort({createdAt:'desc'})
    res.render('articles/all', { articles: articles })
  })


  //render the homepage with index.ejs and show 10 articles from articles
  app.get('/', checkAuthenticated, async(req, res) => {
    const articles = await Article.find().sort({createdAt:'desc'})
    res.render('articles/index', { name:req.user.name,articles: articles});
  });
  
  //when the user clicks login this will run to check if the user exist
  app.post(
    '/login',checkNotAuthenticated,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
    })
  );
  
  //render register page with register.ejs
  app.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('register');
  });
  
  //when user register, the system will record the name, email and password and if success, system will redirect them back to login
  app.post('/register',checkNotAuthenticated, async (req, res) => {
    try {
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });
      //after user create their account successfully, they will be brought to the login page
      res.redirect('/login');
    } catch {
      res.redirect('/register');
    }
    //debug output users info
    console.log(users);
  });

  //tell the app to delete the token if the user wants to logout
    app.delete('/logout',(req,res)=>{
      req.logOut(function(err){
        if(err){return next(err)}
      })
      res.redirect('/login')
    })

  //check if the user is authenticated or not if not, they will be rediect back to login page, they can create post once they log in 
  function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
      return next()
    }

    res.redirect('/login')
  }

  //check if the user is authenticated or not by using passport npm 
  function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
     return res.redirect('/')
    }
    next()
  }


  //article
  app.use('/articles', articleRouter);
  app.listen(3000, () => {
    console.log('Listening to port 3000');
  });
  