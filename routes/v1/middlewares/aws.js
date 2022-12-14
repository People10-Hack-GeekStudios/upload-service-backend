const sharp = require('sharp')
const multer = require('multer')
const path = require('path')
require('dotenv').config()

const fs = require('fs');

// Response
const { resp } = require("../data/response");

/* type validator */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/bmp" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File format should be PNG,JPG,JPEG,BMP"), false); // if validation failed then generate error
  }
}

/* limits */
const limits = { fileSize: 2024000 } //2MB

/* Multer specs */
const multerSpecs = {
  limits: limits,
  fileFilter: fileFilter
}

const uploadMulter = multer(multerSpecs).fields([{ name: 'file', maxCount: 1 }]);
const uploadMulters = multer(multerSpecs).fields([{ name: 'file', minCount: 1 }]);

const sharpify = async originalFile => {
  try {
    const image = sharp(originalFile.buffer)
    const meta = await image.metadata()
    const { format } = meta
    const config = {
      jpeg: { quality: 100 },
      webp: { quality: 100 },
      png: { quality: 100 }
    }
    const newFile = await image[format](config[format])
      .resize({ width: 150, withoutEnlargement: true })
      .toBuffer()
    return newFile
  } catch (err) {
    console.log(err);
    throw err;
  }
}

const uploader = (id, file, type, name) => {

  fs.writeFileSync('/home/geekadmin/apiservices/fud4me/uploads/'+name, file, err => {
    if (err) {
      return false
    }
    return true
  });
}

module.exports = {
  uploadMulter,
  uploader,
  sharpify,
  uploadMulters
};