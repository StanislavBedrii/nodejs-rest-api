const Contact = require("./schemas/contact");

const listContacts = async () => {
  const result = await Contact.find({}, { __v: 0 });
  return result;
};

const getContactById = async (contactId) => {
  const result = await Contact.findOne({ _id: contactId }).select("-__v");
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate(contactId, ...body, {
    new: true,
  });
  return result;
};

const removeContact = async (contactId) => {
  const result = await Contact.findByIdAndRemove(contactId);
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
