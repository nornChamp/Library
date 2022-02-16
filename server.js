//check that we are run in environment or not and then process in .env file
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').parse()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

//call route from routes folder (controller)
const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')  // set for reading file ejs
app.set('views', __dirname + '/views') //config file directory to use for views
app.set('layout', 'layouts/layout' ) //config layout in folder layout 
app.use(expressLayouts)
app.use(express.static('public')) //config asset directory from public folder

//connect to mongodb
const mongoose = require('mongoose')
//seting url from .env
mongoose.coonect(process.env.DATABASE_URL, {
    UseNewUrlParser: true
})
const db = mongoose.connection 
db.on('error', error => console.error(error)) //if error console.log(error)
db.once('open', () => console.log("Connected")) //if error console.log(error)



app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)