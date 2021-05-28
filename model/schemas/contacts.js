const Contact = require("c:/Users/ADMIN-1/Downloads/nodeJS-rest-api-05-images/nodeJS-rest-api-05-images/model/schemas/contact");

const listContacts = async (
  userId,
  { sortBy, sortByDesc, filter, sub, limit = "10", page = "1" }
) => {
  const options = { owner: userId };
  if (sub) {
    options.subscription = { $all: [sub] };
  }
  const result = await Contact.paginate(options, {
    limit,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}), // name: 1 --- if sortBy = name
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}), // name: -1
    },
    select: filter ? filter.split("|").join(" ") : "",
    populate: {
      path: "owner",
      select: "email subscription -_id",
    },
  });
  const { docs: contacts, totalDocs: total } = result;
  return { total: total.toString(), limit, page, contacts };
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "email subscription -_id",
  });
  return result;
};

const addContact = async (body) => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { contactId, owner: userId },
    ...body,
    { new: true }
  );
  return result;
};

const removeContact = async (contactId, userId) => {
  const result = await Contact.findOneAndRemove({ contactId, owner: userId });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
