const mongoose = require('mongoose')
const Book = require('./books')
const  authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})
// THIS IS REALLY IMPORTANT
//if author obj exist in book table 
authorSchema.pre('remove', function(next){  //next function to execute is given to a callback for it to kick-off when it's done. can chane to somethins else
 Book.find({ author: this.id}, (err,books) =>{
     if(err){
         next(err)
     } else if (books.length > 0 ){
         next(new Error('This Authors has stored in books'))
     } else {
         next()
     }
 })
})

module.exports = mongoose.model('Author', authorSchema)  //compact authorSchema to server.js