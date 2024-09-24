
const Contact = require('../models/ContactModel');

exports.index = async (req, res) => {
    const contacts = await Contact.findAll();
    res.render('index', {contacts});
};