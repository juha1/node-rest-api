var express = require('express')
var router = express.Router()
var Image = require("../models/image")

router.get("/images/search", function (req, res) {
    var keyword = req.params.keyword
    getImagesByKeyword(keyword, function (images) {
        if (images != null)
            res.json({ success: true, images })
        else
            res.json({ success: false })
    })
})

router.get("/images", function (req, res) {
    getImages(function (images) {
        if (images != null)
            res.json({ success: true, images })
        else
            res.json({ success: false })
    })
})

router.get("/images/:imageId", function (req, res) {
    var imageId = req.params.imageId
    getImageByImageId(imageId, function (image) {
        if (image != null)
            res.json({success: true, image})
        else
            res.json({success: false})
    })
})

router.post("/images", function (req, res) {
    var imageId = req.body.imageId
    var imageTitle = req.body.imageTitle
    var imageLink = req.body.imageLink
    createImage(imageId, imageTitle, imageLink, function (image) {
        if (image != null)
            res.json({success: true, image: image})
        else
            res.json({success: false})
    })
})

router.put("/images/:imageId", function (req, res) {
    var imageId = req.params.imageId
    var imageTitle = req.body.imageTitle
    var imageLink = req.body.imageLink
    updateImage(imageId, imageTitle, imageLink, function (image) {
        if (image != null)
            res.json({success: true, image: image})
        else
            res.json({success: false})
    })
})

router.delete("/images/:imageId", function (req, res) {
    var imageId = req.params.imageId
    deleteImage(imageId, function (success) {
        if (success)
            res.json({success: true})
        else
            res.json({success: false })
    })
})

router.delete("/images", function (req, res) {
    deleteImages(function (success) {
        if (success)
            res.json({success: true})
        else
            res.json({success: false})
    })
})

/**
 * Get Images by keyword.
 * @param {String} Keyword
 * @param {Function} Callback Function
 * @return {Function(images: images)} Callback Function with Images
 */
var getImagesByKeyword = function (keyword, callback) {
    var keywordString = keyword + ""
    Image.find({imageTitle: new RegExp(keywordString, "i")}, function (err, images) {
        if (err) {
            console.log(err)
            return callback(null)
        }
        callback(images)
    })
}

/**
 * Get all Images.
 * @param {Function} Callback Function
 * @return {Function(images: images)} Callback Function with Images
 */
var getImages = function (callback) {
    Image.find().sort({ _id: -1 }).exec(function (err, images) {
        if (err) {
            console.log(err)
            return callback(null)
        }
        callback(images)
    })
}

/**
 * Get Image by imageId.
 * @param {Number} Imageid
 * @param {Function} Callback Function
 * @return {Function(image: image)} Callback Function with Image
 */
var getImageByImageId = function (imageId, callback) {
    Image.findOne({ imageId: imageId }, function (err, image) {
        if (err) {
            console.log(err)
            return callback(null)
        }
        callback(image)
    })
}

/**
 * Creates a new Image.
 * @param {Number} imageId
 * @param {String} imageTitle
 * @param {String} imageLink
 * @param {Function} Callback Function
 * @return {Function(image: createdImage)} Callback Function with new Image
 */
var createImage = function (imageId, imageTitle, imageLink, callback) {
    var newImage = new Image({ imageId: imageId, imageTitle: imageTitle, imageLink: imageLink })
    newImage.save(function (err, createdImage) {
        if (err) {
            console.log(err)
            return callback(null)
        }
        callback(createdImage)
    })
}

/**
 * Updates Image.
 * @param {Number} imageId
 * @param {String} imageTitle
 * @param {String} imageLink
 * @param {Function} Callback Function
 * @return {Function(image: updatedImage)} Callback Function with updated Image
 */
var updateImage = function (imageId, imageTitle, imageLink, callback) {
    Image.findOneAndUpdate({ 'imageId': imageId }, { $set: { imageTitle: imageTitle, imageLink: imageLink } }, { new: true }, function (err, updatedImage) {
        if (err) {
            console.log(err)
            return callback(null)
        }//if err
        callback(updatedImage)
    })
}

/**
 * Deletes all Images from database.
 * @return {Function(success: Boolean)} Callback Function
 */
var deleteImages = function (callback) {
    Image.remove({}, function (err, images) {
        if (err) {
            console.log(err)
            return callback(false)
        }
        callback(true)
    })
}

/**
 * Updates Image.
 * @param {Number} imageId
 * @param {Function} Callback Function
 * @return {Function(success: Boolean)} Callback Function
 */
var deleteImage = function (imageId, callback) {
    Image.findOneAndRemove({ imageId: imageId }, function (err, image) {
        if (err) {
            console.log(err)
            return callback(false)
        }
        callback(true)
    })
}

module.exports = {
    router: router,
    getImagesByKeyword: getImagesByKeyword,
    getImages: getImages,
    getImageByImageId: getImageByImageId,
    createImage: createImage,
    updateImage: updateImage,
    deleteImages: deleteImages,
    deleteImage: deleteImage
}
