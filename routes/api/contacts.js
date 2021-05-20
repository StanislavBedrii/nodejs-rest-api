const express = require("express");
const router = express.Router();

const contactsContreller = require("../../controllers/contacts.js");
const validate = require("./validation.js");
const validateId = require("./validationId.js");

router.get("/", contactsContreller.listContacts);

router.get("/:contactId", validateId, contactsContreller.getContactById);

router.post("/", validate.createContact, contactsContreller.addContact);

router.delete("/:contactId", validateId, contactsContreller.removeContact);

router.patch(
  "/:contactId",
  validateId,
  validate.updateContact,
  contactsContreller.updateContact
);

module.exports = router;
