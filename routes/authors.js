const express = require("express");
const req = require("express/lib/request");
const { redirect } = require("express/lib/response");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/books");

// ALL authors route
router.get("/", async (req, res) => {
  let searchOptions = {}; //store object from .find to var searchOption
  if (req.query.name != null && req.query.name !== "") {
    //if no name or not equal to '__' ps. have it's have to query instead of body bc get req sent info to query string in routes
    searchOptions = { name: RegExp(req.query.name, "i") }; //if name (equal to name)<<--RegExp  i << case in sensitive
  }
  try {
    const authors = await Author.find(searchOptions); // connect to model Author table and find  // and to use .find nornchamp has to configure searchOptions to -> {}
    //get route from html /
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

//New Authorts route
router.get("/new", (req, res) => {
  //get route from html /
  res.render("authors/new", { author: new Author() });
});

//Create Authors Route
router.post("/", async (req, res) => {
  //get route from html author/index.ejs

  //CODE WITH ASYNC AND AWAIT
  const author = new Author({
    name: req.body.name,
  });
  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
    // res.redirect(`authors`);
  } catch {
    let locals = { errorMessage: "Error Create Author" };
    res.render("authors/new", {
      author: author,
      errorMessage: "Error Creating Author",
    });
  }
  // CODE WITH PROMISE NO ASYNC AND AWAIT

  // author.save((err, newAuthor) =>{
  //     if (err){
  //         let locals = {errorMessage:"Error Create Author"}
  //         res.render('authors/new', {
  //             author: author,
  //             locals:locals
  //         })
  //     } else {
  //         // res.redirect(`authors/${newAuthor.id}`)
  //         res.redirect(`authors`)
  //     }
  // })
});

router.get("/:id", async (req, res) => {
  try{
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author:author.id}).limit(10).exec()
    res.render('authors/show', {
      author: author,
      booksByAuthor: books
    })

  }catch(err){
    console.log(err)
    redirect('/')
  }
});

// EDIT Authors 
router.get("/:id/edit", async (req, res) => {
  try {
                          //findBYId is method from mongoDb
    const author = await Author.findById(req.params.id)
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect('/authors')
  }
  
});

//Update Authors
router.put("/:id", async (req, res) => {
  let author
  try {
    //get author by id 
    author = await Author.findById(req.params.id)
    //then receive data from it
    author.name = req.body.name
    await author.save();
    res.redirect(`/authors/${author.id}`);
    // res.redirect(`authors`);
  } catch {
    if (author == null){ // have to use if in catch because if try find id by author fail we don't want the page to redirect to author/edit/id doesn't exist
      res.redirect('/')
      //if the author does exist
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Couldn't find Author by ID",
      });
    }
  }
});


router.delete("/:id", async (req, res) => {
  let author
  try {
    //get author by id 
    author = await Author.findById(req.params.id)
    await author.remove();
    res.redirect('/authors');
    // res.redirect(`authors`);
  } catch {
    if (author == null){ // have to use if in catch because if try find id by author fail we don't want the page to redirect to author/edit/id doesn't exist
      res.redirect('/')
      //if the author does exist
    } else {
      res.redirect(`authors/${author.id}`)
    }
  }
});

module.exports = router;
