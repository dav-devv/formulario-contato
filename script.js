const form = document.querySelector('.contact-us');

// 1. Funções de Validação
function validateFirstName() {
    const firstName = document.getElementById('first-name');
    const firstNameValue = firstName.value.trim();

    if (firstNameValue === "") {
        setError(firstName, 'Este campo é obrigatório');
    } else {
        setSuccess(firstName);
    }
}

function validateLastName() {
    const lastName = document.getElementById('last-name');
    const lastNameValue = lastName.value.trim();

    if (lastNameValue === "") {
        setError(lastName, 'Este campo é obrigatório');
    } else {
        setSuccess(lastName);
    }
}

function validateEmail(){
    const email = document.getElementById('email-address');
    const emailValue = email.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === ""){
        setError(email, 'Endereço de Email é obrigatório');
    } else if (!emailPattern.test(emailValue)) {
        setError(email, 'Por favor coloque um endereço de email válido')
    } else {
        setSuccess(email);
    }
}

function validateRadioGroup() {
    const queryTypes = document.getElementsByName('query-type');
    const formGroup = queryTypes[0].closest('.form-group');
    let selected = false;

    for (const radio of queryTypes) {
        if (radio.checked){
            selected = true;
            break;
        }
    }
    if (!selected) {
        formGroup.classList.add('invalid');
    } else {
        formGroup.classList.remove('invalid');
    }
}

function validateMessage() {
    const message = document.getElementById('message');
    const messageValue = message.value.trim();

    if (messageValue === "") {
        setError(message, 'Este campo é obrigatório');
    } else {
        setSuccess(message);
    }
}

function validateConsent() {
    const consent = document.getElementById('consent');
    const consentContainer = consent.parentElement;

    if (!consent.checked) {
        consentContainer.classList.add('invalid');
    } else {
        consentContainer.classList.remove('invalid');
    }
}

// 2. Funções de Sucesso e Erro
function setError(element, message) {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error-message');

    errorDisplay.innerText = message;
    element.classList.add('error');
    inputControl.classList.add('invalid');
}

function setSuccess(element) {
    const inputControl = element.parentElement;

    element.classList.remove('error');
    inputControl.classList.remove('invalid');
}


// 3. O ÚNICO Evento de Submit (que valida e envia para o Google Sheets)
const scriptURL = 'https://script.google.com/macros/s/AKfycbyvSg9vHXitfw--o59WGJjUadkmhUaFmj40v4YYiFf3dO-3P1PTsOj8MWeC5aO7wdE9/exec';

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Chamamos as validações
    validateFirstName();
    validateLastName();
    validateEmail();
    validateRadioGroup();
    validateMessage();
    validateConsent();

    // Verifica se existe alguma classe 'invalid' ou 'error' ativa
    const allValid = !form.querySelectorAll('.invalid, .error').length;
    
    if(allValid) {
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'A enviar...';

        const formData = new FormData(form);

        // Faz o envio dos dados para o google sheets
        fetch(scriptURL, { 
            method: 'POST', 
            body: formData, 
            mode: 'no-cors' // <-- ESTA É A PALAVRA MÁGICA
        })
        .then(response => {
            // Com 'no-cors', o navegador não consegue ler a resposta do Google, 
            // mas sabemos que o envio foi feito com sucesso.
            alert("Sucesso! A sua mensagem foi enviada!");
            form.reset(); // Limpa o formulário
            submitBtn.innerText = originalText; //Restaura o botão
        })
        .catch(error => {
            console.error('Erro!', error.message);
            alert("Ocorreu um erro ao tentar enviar os dados. Tente novamente.");
            submitBtn.innerText = originalText; // Restaura o botão
        });
    }
});