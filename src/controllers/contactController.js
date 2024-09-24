
const Contact = require('../models/ContactModel');

exports.index = (req, res) => {
    // res.send('hello');
    return res.render('contact', {
        contact: {}      //render empty contact to avoid erros on contact.ejs
    });
};


exports.register = async (req, res) => {
    try {   
        const contact = new Contact(req.body);
        await contact.register();

        if(contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contact/index'));
            return;
        }

        req.flash('success', "Succefull contact register");
        req.session.save( () => res.redirect(`/contact/index/${contact.contact.id}`) );
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }

};

exports.editIndex = async function (req, res) {

    if(!req.params.id) return res.render('404');    //id error

    const readContact = await Contact.findById(req.params.id);

    if(!readContact)  return res.render('404'); 

    res.render('contact', {
        contact: readContact        //render contact at contact.ejs
    });

};


// post edit
exports.edit = async function (req, res) {
    if(!req.params.id) return res.render('404');    //id error

    try {
        // model contruct and edit
        const contact = new Contact(req.body);
        await contact.edit(req.params.id);

        // same as register validation
        if(contact.errors.length > 0) {
            req.flash('errors', contact.errors);
            req.session.save(() => res.redirect('/contact/index'));
            return;
        }

        req.flash('success', "Succefull edited contact");
        req.session.save( () => res.redirect(`/contact/index/${contact.contact.id}`) ); //contact.this.id (id mongo)
        return;
    } catch (e) {
        console.log(e);
        return res.render('404');
    }

};


//get delete
exports.delete = async function (req, res) {

    if(!req.params.id) return res.render('404');

    const deleteContact = await Contact.delete(req.params.id);
    if(!deleteContact)  return res.render('404'); 

    req.flash('success', "Succefull deleted contact");
    req.session.save( () => res.redirect('back') );
    return;

};