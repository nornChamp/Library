const express = require("express");
const router = express.Router();
const Author = require("../models/author");

// ALL authors route
router.get("/", async (req, res) => {
  let searchOptions = {} //store object from .find to var searchOption
  if (req.query.name != null && req.query.name !== '') {
    //if no name or not equal to '__' ps. have it's have to query instead of body bc get req sent info to query string in routes
    searchOptions = { name: RegExp(req.query.name, 'i')}; //if name (equal to name)<<--RegExp  i << case in sensitive 
  } 
  try {
    const authors = await Author.find(searchOptions); // connect to model Author table and find  // and to use .find nornchamp has to configure searchOptions to -> {}
    //get route from html /
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query
    });
  } catch (err) {
      console.log(err)
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
    // res.redirect(`authors/${newAuthor.id}`);
    res.redirect(`authors`);
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

module.exports = router;
