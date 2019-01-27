var mongoose = require("mongoose")

var imageSchema = new mongoose.Schema({
imageId: String, imageTitle: String, imageLink: String
})

module.exports = mongoose.model("Image", imageSchema)
