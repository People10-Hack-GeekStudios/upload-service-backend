const express = require('express');
const router = express.Router();

// Token middleware
const { verifyAccessToken } = require("./middlewares/token");

// Token middleware
const { isMenuAdd } = require("./middlewares/validator");

// Database connectivity validator middleware
const { mongoDBping } = require("./middlewares/mongodb");

// User middleware
const { validateUserByID } = require("./middlewares/shop");

// Uploader middleware
const { uploadMulter, uploader } = require("./middlewares/aws");

// Response
const { resp } = require("./data/response");
const menu = require('../../models/menu');

//Routes
router.post('/add/', verifyAccessToken, mongoDBping, validateUserByID, async (req, res) => {
  await uploadMulter(req, res, async (err) => {
    if (err) return res.status(200).json({ "response_code": 400, "message": resp["upload-exceed"], "response": null });
    req.body.per_day_quantity = parseInt(req.body.per_day_quantity)
    req.body.price = parseFloat(req.body.price)
    let ok = await isMenuAdd(req, res)
    if (!ok) {
      return res.status(200).json({ "response_code": 400, "message": resp[400], "response": null })
    }
    try {
      var arr = []
      if (req.files === undefined) {
        return res.status(200).json({ "response_code": 400, "message": "Please attach a image.", "response": null });
      }
      else {
        let files = req.files.file
        for (const key in files) {
          let originalFile = files[key]
          let newName = Date.now();
          let ext = originalFile.originalname.split('.').pop()
          await uploader(req.temp_user._id, originalFile.buffer, originalFile.mimetype, newName + '.' + ext)
          arr.push('https://api.fud4.me/upload/v1/cdn/' + newName + '.' + ext)
        }
      }
      let new_menu = new menu()
      new_menu.owner = req.temp_user._id
      new_menu.geojson = req.temp_user.geojson
      new_menu.image = arr[0]
      new_menu.name = req.body.name
      new_menu.food_type = req.body.food_type
      new_menu.per_day_quantity = req.body.per_day_quantity
      new_menu.quantity = req.body.per_day_quantity
      new_menu.price = req.body.price
      new_menu.save()
        .then(data => {
          return res.status(200).json({ "response_code": 200, "message": resp["menu-added"], "response": null });
        })
        .catch(err => {
          console.log(err);
          return res.status(200).json({ "response_code": 500, "message": resp[500], "response": null });
        })
    } catch (err) {
      console.log(err);
      return res.status(200).json({ "response_code": 500, "message": resp[500], "response": null });
    }
  })

});

module.exports = router;