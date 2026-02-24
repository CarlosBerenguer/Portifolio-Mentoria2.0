export default class Utils {
    // Função para gerar CPF aleatório válido
    generateRandomCPF() {
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
}

    // Função para gerar nome aleatório
    generateRandomName() {
    const names = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Luiza', 'Rafael', 'Isabela', 'Felipe', 'Camila', 'Gustavo', 'Patrícia', 'Eduardo', 'Sofia', 'Thiago'];

    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

    // Função para gerar email aleatório
    generateRandomEmail() {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomName = generateRandomName().toLowerCase().replace(' ', '');
    return `${randomName}@${randomDomain}`;
}

    // Função para gerar senha aleatória
    generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}|:"<>?';
    let password = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}

// Função para gerar data de nascimento aleatória
    generateRandomBirthDate() {
    const year = Math.floor(Math.random() * (2000 - 1950 + 1)) + 1950;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${day}/${month}/${year}`;
}

// Função para gerar número de telefone aleatório no formato (11) 98765-4321
    generateRandomPhoneNumberElevenNumbers() {
    const areaCode = Math.floor(Math.random() * 90) + 10;
    const firstPart = Math.floor(Math.random() * 90000) + 10000;
    const secondPart = Math.floor(Math.random() * 9000) + 1000;
    return `(${areaCode}) ${firstPart}-${secondPart}`;
}

// Função para gerar endereço aleatório
    generateRandomAddress() {
    const streets = ['Rua A', 'Rua B', 'Rua C', 'Rua D', 'Rua E'];
    const randomStreet = streets[Math.floor(Math.random() * streets.length)];
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    const randomCity = generateRandomName();
    const randomState = 'SP';
    const randomCountry = 'Brasil';
    const randomPostalCode = Math.floor(Math.random() * 99999999) + 10000000;
    return `${randomStreet}, ${randomNumber}, ${randomCity}, ${randomState}, ${randomCountry}, ${randomPostalCode}`;
}

    generateRandomCity() {
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre', 'Curitiba', 'Uberaba'];
    const randomIndex = Math.floor(Math.random() * cities.length);
    return cities[randomIndex];
}

    generateRandomState() {
    const states = ['SP', 'RJ', 'MG', 'BA', 'AL', 'SE'];
    const randomIndex = Math.floor(Math.random() * states.length);
    return states[randomIndex];
}

    generateRandomZipCode() {
    const randomNumber = Math.floor(Math.random() * 99999999) + 10000000;
    return randomNumber;
}
    generateRandomCountry() {
    const countries = ['BRAZIL', 'ARGENTINA', 'CANADA', 'FRANCE', 'IRLAND', 'USA'];
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
}

    generateUniqueString(size) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

    generateRandomCRP(size) {
        const randomNumber = Math.floor(Math.random() * 99999999) + 10000000;
        return randomNumber.toString().substring(0, size);
    }
}







