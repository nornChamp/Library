const mongoose = require("mongoose");
// const path = require("path")  <-- nolonger needed
// const coverImageBasePath = "uploads/bookCovers"; <-- nolonger needed

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  coverImageType:{
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, //connect to table author by id
    required: true,
    ref: "Author",
  },
});

//when something try to get coverImagename from books db its will call function  <-- nologer use anymore because we create TYPE 
bookSchema.virtual('coverImagePath').get(function() {
  if(this.coverImage != null && this.coverImageType != null){
    // return path.join('/', coverImageBasePath, this.coverImageName) 
    //data object allow to take buffer obj in coverImageType
    return `data:${this.coverImageType};chartset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model("Book", bookSchema); //compact bookSchema to server.js
// module.exports.coverImageBasePath = coverImageBasePath;
