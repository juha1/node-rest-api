var mongoose = require("mongoose")
var Image = require('../models/image')
var images = require("../routes/images")
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should()
var app = require("../app")

mongoose.Promise = global.Promise
chai.use(chaiHttp)

describe('Images', function () {
    beforeEach(function (done) {
        Image.collection.drop()
        done()
    })

    describe('.get /images/search', function () {
        it('should get all images by keyword', function (done) {
            var testImage = new Image({
                imageId: "img123",
                imageTitle: "title",
                imageLink: "www.google.com"
            })
            testImage.save(function (err, savedImage) {
                chai.request(app)
                    .get('/images/search?keyword=title')
                    .end(function (err, res) {
                        res.body.should.have.property("success")
                        res.body.success.should.be.true
                        res.body.should.have.property("images")
                        res.body.images.should.be.a('array')
                        res.body.images.should.not.be.empty
                        done()
                    })
            })
        })
    })

    describe('.get /images', function () {
        it('should get all images', function (done) {
            var testImage = new Image({
                imageId: "img123",
                imageTitle: "title",
                imageLink: "www.google.com"
            })
            testImage.save(function (err, savedImage) {
                chai.request(app)
                    .get('/images')
                    .end(function (err, res) {
                        res.body.should.have.property("success")
                        res.body.success.should.be.true
                        res.body.should.have.property("images")
                        res.body.images.should.be.a('array')
                        res.body.images.should.not.be.empty
                        done()
                    })
            })
        })
    })

    describe('.get /images/:imageId', function () {
        it('should get image by id', function (done) {
            var testImage = new Image({
                imageId: "img123",
                imageTitle: "title",
                imageLink: "www.google.com"
            })
            testImage.save(function (err, savedImage) {
                chai.request(app)
                    .get('/images/img123')
                    .end(function (err, res) {
                        res.body.should.have.property("success")
                        res.body.success.should.be.true
                        res.body.should.have.property("image")
                        res.body.image.should.have.property('imageTitle')
                        res.body.image.should.have.property('imageLink')
                        res.body.image.should.have.property('imageId').eql("img123")
                        done()
                    })
            })
        })
    })

    describe('.post /images', function () {
        it('should create a new image', function (done) {
            chai.request(app)
                .post('/images')
                .send({ imageId: "id123", imageTitle: "title", imageLink: "yahoo.com" })
                .end(function (err, res) {
                    res.body.should.have.property("success")
                    res.body.success.should.be.true
                    res.body.should.have.property("image")
                    res.body.image.should.be.a('object')
                    res.body.image.should.have.property('imageTitle')
                    res.body.image.should.have.property('imageLink')
                    res.body.image.should.have.property('imageId').eql("id123")
                    done()
                })
        })
    })

    describe('.put /images/', function () {
        it('should update image by id', function (done) {
            var testImage = new Image({
                imageId: "img123",
                imageTitle: "title",
                imageLink: "www.google.com"
            })
            testImage.save(function (err, savedImage) {
                chai.request(app)
                    .put('/images/img123')
                    .send({ imageTitle: "new image title", imageLink: "www.yahoo.com" })
                    .end(function (err, res) {
                        res.body.should.have.property("success")
                        res.body.success.should.be.true
                        res.body.should.have.property("image")
                        res.body.image.should.be.a('object')
                        res.body.image.should.have.property('imageTitle').eql("new image title")
                        res.body.image.should.have.property('imageLink').eql("www.yahoo.com")
                        res.body.image.should.have.property('imageId').eql("img123")
                        done()
                    })
            })
        })
    })

    describe('.delete /images/:imageId', function () {
        it('should delete one image by imageId', function (done) {
            var testImage = new Image({
                imageId: "img123",
                imageTitle: "title",
                imageLink: "www.google.com"
            })
            testImage.save(function (err, savedImage) {
                chai.request(app)
                    .delete('/images/img123')
                    .end(function (err, res) {
                        res.body.should.have.property("success")
                        res.body.success.should.be.true
                        done()
                    })
            })
        })
    })

    describe('.delete /images/all', function () {
        it('should delete all images', function (done) {
            var testImage = new Image({
                imageId: "img123",
                imageTitle: "title",
                imageLink: "www.google.com"
            })
            testImage.save(function (err, savedImage) {
                chai.request(app)
                    .delete('/images/all')
                    .end(function (err, res) {
                        res.body.should.have.property("success")
                        res.body.success.should.be.true
                        done()
                    })
            })
        })
    })
    
})
