const mongoose = require("mongoose");
const path = require("path")
const coverImageBasePath = "uploads/bookCovers";

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
    reqired: true,
    default: Date.now,
  },
  coverImageName: {
    type: String,
    reqired: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, //connect to database in AUTHOR.id
    required: true,
    ref: "Author",
  },
});

//when something try to get coverImagename from books db its will call function
bookSchema.virtual('coverImagePath').get(function() {
  if(this.coverImageName != null){
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})

module.exports = mongoose.model("Book", bookSchema); //compact bookSchema to server.js
module.exports.coverImageBasePath = coverImageBasePath;
