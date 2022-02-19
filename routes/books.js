const express = require("express");
const router = express.Router();
  // nolonger need multer becauses we USING CDN brings FilePond in ours project
// const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Book = require("../models/books");
const Author = require("../models/author");
// const uploadPath = path.join("public", Book.coverImageBasePath); <- no longer needed

// config type of images like jpeg gif png
const imageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

// //Config Multer to use in project and find the destination to put files
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype));
//   },
// });
// ALL Books route
router.get("/", async (req, res) => {
  //to find books in db
  let query = Book.find()
  //then check if req = title or empty
  if(req.query.title != null && req.query.title != '' ){
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  //then check if req = publishedBefore or empty
  if(req.query.publishedBefore != null && req.query.publishedBefore != '' ){
    //lte is (<=) Or it's can implement like db.example.find( { col1: { $lte: 20 } } )
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  //then check if req = title or empty
  if(req.query.publishedAfter != null && req.query.publishedAfter != '' ){
    // gte is (>=) Or it's can implement like db.example.find( { col1: { $gte: 20 } } ) ps. thanks to www.poolsawat.com/mongodb-กับ-query-และ-คำย่อของเครื่อ/
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const books = await query.exec()
    res.render("books/index", {
    books: books,
    searchOptions: req.query
  })
  } catch (err) {
    res.render('/')
  }
})

//New books route
router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

//Create books Route //upload single file
router.post("/",  async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null; // create variable for check that a file have upload to the server
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description,
  });

  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save();
    // res.redirect(`books/&{newBook.id}`)
    res.redirect(`books`);
  } catch {
    // // if we choose file and submit from books/new it will automatically save file that catch err so allow its to call function removeBookCover
    // if(book.coverImageName != null) {
    //   removeBookCover(book.coverImageName)
    // }
    //set function renderNewpage hashError to true
    renderNewPage(res, book, true);

  }
});

//to Delete bookcover if the name not match
// function removeBookCover(fileName){
// //fs.unlink call filesystem to manage file and unlink is a remove func to find the directory uploadPath to call coverImageName in db
//   fs.unlink(path.join(uploadPath, fileName), err =>{
//     if(err) console.error(err)
//   })
// }

// to easy render the pages  and throw err
//          hash Error is to show error message
async function renderNewPage(res, book, hashError = false) {
  try {
    const authors = await Author.find({}); //select the author that we need
    // create prarams to send back to views
    const params = {
      authors: authors,
      book: book,
    };
    if (hashError) params.errorMessage = "You have to fill all the input here!";
    res.render("books/new", params); //send params to pages
  } catch {
    res.redirect("/books");
  }
}

function saveCover(book, coverEncoded) {
  if(coverEncoded == null ) return
  const cover = JSON.parse(coverEncoded)
  if(cover != null && imageMimeTypes.includes(cover.type)){
    // covert data String to Buffer by Buffer.from()
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = router;
