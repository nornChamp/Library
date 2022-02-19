//check that we are run in environment or not and then process in .env file
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
app.use(express.urlencoded({ limit:'5mb', extended: false })) //express new ver. doesn't need to require body-parser anymore it's now bundle with Express
app.use(express.json())  


//call route from routes folder (controller)
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

app.set('view engine', 'ejs')  // set for reading file ejs
app.set('views', __dirname + '/views') //config file directory to use for views
app.set('layout', 'layouts/layout' ) //config layout in folder layout 
app.use(expressLayouts)
app.use(express.static('public')) //config directory from public folder

//connect to mongodb
const mongoose = require('mongoose')
//seting url from .env
mongoose.connect(process.env.DATABASE_URL, {
    UseNewUrlParser: true
})
const db = mongoose.connection 
db.on('error', error => console.error(error))  //if error console.log(error)
db.once('open', () => console.log("Connected"))  //if error console.log(error)

app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3000)