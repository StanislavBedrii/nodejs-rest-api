const express = require("express");
const router = express.Router();

const contactsController = require("c:/Users/ADMIN-1/Downloads/nodeJS-rest-api-05-images/nodeJS-rest-api-05-images/controllers/contacts.js");
const validate = require("./validation.js");
const validateId = require("./validationId.js");
const guard = require("../../../helpers/guard");

router.get("/", guard, contactsController.listContacts);

router.get("/:contactId", guard, validateId, contactsController.getContactById);

router.post("/", guard, validate.createContact, contactsController.addContact);

router.delete(
  "/:contactId",
  guard,
  validateId,
  contactsController.removeContact
);

router.patch(
  "/:contactId",
  guard,
  validateId,
  validate.updateContact,
  contactsController.updateContact
);

module.exports = router;
