const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

function validationId(req, res, next) {
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Id is invalid",
    });
  }
  next();
}

module.exports = validationId;
