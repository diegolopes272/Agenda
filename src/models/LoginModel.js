


const mongoose = require('mongoose');

const validator = require('validator');
const bcryptjs = require('bcryptjs');


const LoginSchema = new mongoose.Schema({
    email: {type: String, require: true},
    password: {type: String, require: true}
});

const LoginModel = mongoose.model('Login', LoginSchema);


class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;

    }

    cleanUp() {
        for (const key in this.body) {
            if ( typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            password: this.body.password
        };

    }

    validate() {
        //email and pass
        this.cleanUp();

        if(!validator.isEmail(this.body.email)) this.errors.push('Invalid email');

        //pass between 3 and 50 chars
        if(this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push('The password need to have betweem 3 and 50 characters');
        }

    }


    async UserExists(){

        const user = await LoginModel.findOne({email: this.body.email });
        if(user) this.errors.push('Usuario ja existe');
    }


    // need to be async due to database transactions
    async register() {
        this.validate();
        if(this.errors.length > 0) {
            console.log('erro validate');
            return;
        }
        
        await this.UserExists();
        if(this.errors.length > 0) {
            console.log('erro UserExists');
            return;
        }
        

        const salt = bcryptjs.genSaltSync();
        this.body.password =  bcryptjs.hashSync(this.body.password, salt);
        this.user = await LoginModel.create(this.body);
    }
    
    async login() {
        this.validate();
        if(this.errors.length > 0) return;
        
        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user) {
            this.errors.push("User or password is invalid");
            return;
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.errors.push("User or password is invalid 2");
            this.user = null;
            return;
        }
        //user ok

    }

}  // Class Login

//export
module.exports = Login;
