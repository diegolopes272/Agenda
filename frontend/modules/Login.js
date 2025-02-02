
export default class Login {
    constructor(formClass){
        this.form = document.querySelector(formClass);
    }

    init(){
        this.events();
    }

    events(){
        if(!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        });
    }
    validate(e){
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]');
        const passInput = el.querySelector('input[name="password"]');
        console.log(emailInput.value);
        console.log(passInput.value);

        //valida campos pode importar do controller validador

        el.submit(); //se tudo certo

    }
}