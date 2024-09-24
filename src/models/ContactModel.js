



const mongoose = require('mongoose');
const validator = require('validator'); 
const { use } = require('../../routes');

const ContactSchema = new mongoose.Schema({
    name: {type: String, require: true},
    lastname: {type: String, require: false, default: ''},
    email: {type: String, require: false, default: ''},
    phone: {type: String, require: false, default: ''},
    createdOn: {type: Date, default: Date.now }
});




const ContactModel = mongoose.model('Contact', ContactSchema);

// Geralmente classe mas esse vai ser com contructor function para treinar

function Contact(body){
    this.body = body;
    this.errors = [];
    this.contact = null;
}

Contact.prototype.register = async function() {
    this.validate();
    if(this.errors.length > 0) return;

    this.contact = await ContactModel.create(this.body);

};


Contact.prototype.validate = function() {
    
    // Initial adjustments
    this.cleanUp();

    // 3 validations
    if(!this.body.name) this.errors.push("Name is mandatory");
    
    // email or phone is required is this case
    if(!this.body.email && !this.body.phone) {
        this.errors.push("At last an email or a phone number is required");
    }
    
    if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Invalid email');

};

Contact.prototype.cleanUp = function() {
    for (const key in this.body) {
        if ( typeof this.body[key] !== 'string') {
            this.body[key] = '';
        }
    }

    this.body = {
        name: this.body.name,
        lastname: this.body.lastname,
        email: this.body.email,
        phone: this.body.phone
    };

}

Contact.prototype.edit = async function(id){
    if (typeof id !== 'string') return;

    this.validate();
    if(this.errors.length > 0) return;
    
    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, {new: true});
}


// static methods dont need to be in prototype
Contact.findById = async function(id) {
    
    if (typeof id !== 'string') return;

    const contact = await ContactModel.findById(id);
    return contact;
}

Contact.findAll = async function() {

    const contacts = await ContactModel.find().sort( {createdOn: -1} );
    return contacts;
}


Contact.delete = async function(id) {

    if (typeof id !== 'string') return;
    const deleteContact = await ContactModel.findOneAndDelete({_id: id});
    return deleteContact;
}


// export the model
module.exports = Contact;

