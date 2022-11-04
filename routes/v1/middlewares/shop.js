const mongoose = require('../../../services/mongo_db');
const user = require('../../../models/user');

// Response
const { resp } = require("../data/response");

// Uploader middleware
const { deleteFromAWS } = require("./aws");

function validateUserByID(req, res, next) {

  user.findById(req.token.id)
    .then(data => {
      if (data == null) {
        return res.status(200).json({ "response_code": 404, "message": resp["account-not-found"], "response": null });
      } else {
        if (data.is_blocked) {
          return res.status(200).json({ "response_code": 403, "message": resp["you-are-blocked"], "response": null });
        }
        if(data.account_type != 'admin'){
          return res.status(200).json({ "response_code": 400, "message": resp["action-cannot-performed"], "response": null });
        }
        req.temp_user = data;
        req.temp_user.updation_ip = req.ip
        next();
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(200).json({ "response_code": 500, "message": resp[500], "response": null });
    })
}

module.exports = {
  validateUserByID
};