// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import Utils from './utils/utils';
const utils = new Utils();

// Comando customizado para gerar CPF aleatório válido
Cypress.Commands.add('generateRandomCPF', () => {
    // Gera os 9 primeiros dígitos aleatoriamente
    const cpfArray = [];
    for (let i = 0; i < 9; i++) {
        cpfArray.push(Math.floor(Math.random() * 10));
    }
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += cpfArray[i] * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    if (firstDigit >= 10) firstDigit = 0;
    cpfArray.push(firstDigit);
    
    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += cpfArray[i] * (11 - i);
    }
    let secondDigit = 11 - (sum % 11);
    if (secondDigit >= 10) secondDigit = 0;
    cpfArray.push(secondDigit);
    
    // Formata o CPF com pontos e hífen
    const cpf = cpfArray.join('');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
});

// Comando customizado para gerar dados de usuário únicos
Cypress.Commands.add('generateUniqueUserData', () => {
    const timestamp = Date.now();
    return {
        fullName: `Usuário Teste ${timestamp}`,
        cpf: Cypress.env('generateRandomCPF') || cy.generateRandomCPF(),
        birthDate: '01/01/1990',
        phone: '(11) 99999-9999',
        email: `teste${timestamp}@email.com`,
        username: `user${timestamp}`
    };
});

Cypress.Commands.add('generateRandomName', () =>{
    return utils.generateRandomName();
})

Cypress.Commands.add('generateRandomEmail', () =>{
    return utils.generateRandomEmail();
})

Cypress.Commands.add('generateRandomPassword', () =>{
    return utils.generateRandomPassword();
})

Cypress.Commands.add('generateRandomBirthDate', () =>{
    return utils.generateRandomBirthDate();
})

Cypress.Commands.add('generateRandomPhoneNumber', () =>{
    return utils.generateRandomPhoneNumberElevenNumbers();
})

Cypress.Commands.add('generateRandomAddress', () =>{
    return utils.generateRandomAddress();
})

Cypress.Commands.add('generateRandomCity', () =>{
    return utils.generateRandomCity();
})

Cypress.Commands.add('generateRandomState', () =>{
    return utils.generateRandomState();
})

Cypress.Commands.add('generateRandomZipCode', () =>{
    return utils.generateRandomZipCode();
})

Cypress.Commands.add('generateRandomCountry', () =>{
    return utils.generateRandomCountry();
})

Cypress.Commands.add('generateUniqueString', (size) =>{
    return utils.generateUniqueString(size);
})

Cypress.Commands.add('generateRandomCRP', (size) =>{
    return utils.generateRandomCRP(size);
})