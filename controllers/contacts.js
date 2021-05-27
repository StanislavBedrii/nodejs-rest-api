const Contacts = require("../model/contacts.js");
const { HttpCode } = require("../helpers/constants");

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contacts.listContacts(userId, req.query);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        ...contacts,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(req.params.id, userId);
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        data: "Not Found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res.status(201).json({
      status: "success",
      code: HttpCode.CREATED,
      data: {
        contact,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      req.params.id,
      req.body,
      userId
    );
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        data: "Not Found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(req.params.id, userId);
    if (contact) {
      return res.json({
        status: "success",
        code: HttpCode.OK,
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: "error",
        code: HttpCode.NOT_FOUND,
        data: "Not Found",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
