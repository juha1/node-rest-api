var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var request = require('request')
var Image = require("./models/image")
var images = require("./routes/images")

mongoose.connect("mongodb://localhost:27017/api")
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("Connected to database")
})

var app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(images.router)

app.listen(3000) {
    console.log("Server started")
}

request ({
    url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
    Authorization: {
        'Client-ID': ""
    }
}, function (err, res) {
    var obj = JSON.parse(res.body)
    var newImagesToSave = []
    var maxValue = 100
    for (var i = 0; i < obj.data.length; i++) {
        if (i > maxValue) {
            break
        }
        if (obj.data[i].isAlbum == false) {
            var id = obj.data[i].id
            var link = obj.data[i].link
            var title = obj.data[i].title
            var newImage = new Image({ imageId: id, imageLink: link, imageTitle: title })
            newImagesToSave.push(newImage)
        }
    }
    Image.remove({}, function (err, deletedImages) {
        if (err) {
            console.log(err)
        }
        Image.create(newImagesToSave, function (err, newImages) {
            if (err) {
                console.log(err)
            }
        })
    })
})

app.get("/", function (req, res) {
    res.render("index", { images: []})
})

app.get("/search/", function (req, res) {
    var keyword = req.params.keyword
    images.getAllImages(function (imagesArray) {
        res.render("index", { images: imagesArray })
    })
})

module.exports = app
