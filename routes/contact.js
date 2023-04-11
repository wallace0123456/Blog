//basic require
const express = require('express');
const contact = express();
const router = express.Router();

//render the page with contact.ejs
router.get('/', (req, res) => {
  res.render('contact');
});

//try to work with post method when user clicks the submit buuton
contact.post('/', async (req, res) => {
  try {
    await res.send('Thank you for ur respond!');
    await res.redirect('/');
  } catch {
    res.redirect('/contact');
  }
});


//export the route
module.exports = router;
