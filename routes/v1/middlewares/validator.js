const Ajv = require("ajv")
const ajv = new Ajv()

// Response
const { resp } = require("../data/response");

// Validate Menu Add
const schemaMenuAdd = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 256 },
    food_type: { type: "string", enum : ['chinese','indian','arabic'] },
    per_day_quantity: { type: "number", minimum: 1, maximum: 2000 },
    price: { type: "number", minimum: 1, maximum: 50000 }
  },
  required: ["name", "food_type", "per_day_quantity", "price"],
  additionalProperties: false
}

const menuAdd = ajv.compile(schemaMenuAdd)

function isMenuAdd(req, res) {
  return new Promise((resolve, reject) => {
    const valid = menuAdd(req.body)
    if (!valid) {
      resolve(false)
    } else {
      resolve(true)
    }
  })
}

module.exports = {
  isMenuAdd
};