//require mongoose
const mongoose = require('mongoose');
const marked = require("marked")
const slugify = require('slugify')
//build the mongoose schema to work with database
const articleSchema = new mongoose.Schema({

  // title of the article
  title: {
    type: String,
    required: true,
  },
  image:{
    type:String
  },
  // author of the article
  author:{
    type:String,
    required:true
  },

  //description of the article
  description: {
    type: String,
  },

  // note of the article
  note: {
    type: String,
    required: true,
  },

  //created date of the article
  createdAt: {
    type: Date,
    default: Date.now,
  },

  //slug use to name the article instead of id
  slug:{
    type:String,
    required:true,
    unique:true
  }
});







//This function is going to be ran everytime when we delete,add or edit a blog
articleSchema.pre('validate',function(next){
 if(this.title){
  this.slug = slugify(this.title),{
    lower:true,
    strict:true
  }
 }
 next()
})

//export the module
module.exports = mongoose.model('Article', articleSchema);
