//require the basic feature to use express
const express = require('express');
const Article = require('./../models/article');
const Comment = require('./../app');

const router = express.Router();

//render the page if user clicks new article button if they want to create a new post
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() });
});


//render the page if user clicks edit button with /edit/id of the post
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id) 
  res.render('articles/edit', { article: article});
});

//get article by id
router.get('/:slug', async (req, res) => {
  const article =await Article.findOne({slug:req.params.slug})
  if(article == null) res.redirect('/')
  res.render('articles/show',{article:article ,name:req.user.name})
});

//Use post method to input article into database
router.post('/', async (req, res) => {
  let article = new Article({
    title: req.body.title,
    author:req.body.author,
    description: req.body.description,
    note: req.body.note,
    image:req.body.image
  });

  try {
    //save the article that is created to the database
    article = await article.save();
    res.redirect(`/articles/${article.slug}`);
  } catch (e) {
    //get the error and render back to the creating state
    console.log(e);
    res.render('articles/new', { article: article });
  }
});

//this is function for the new article button
router.post('/',async (req,res,next)=>{
  req.article = new Article()
  next()
},saveArticleAndRedirect('new'))

//this is edit function for the edit button
router.put('/:id', async (req,res,next)=>{
  req.article = await Article.findById(req.params.id)
  next()
},saveArticleAndRedirect('edit'))

//this is delete function for the delete button
router.delete('/:id',async (req,res)=>{
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

//function that save the article once the user finishes creating one and redirect them after creating a new article
function saveArticleAndRedirect(path){
  return async(req,res)=>{
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.note= req.body.note
    article.author =req.body.author
    article.image = req.body.image

    //save the data to database
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  }
}




module.exports = router;
