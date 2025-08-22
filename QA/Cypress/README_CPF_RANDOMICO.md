# Geração de CPF Aleatório no Cypress

Este documento explica como foi implementada a geração de CPF aleatório para evitar o erro "CPF já existe" durante os testes de cadastro.

## Implementações Realizadas

### 1. Step Definitions para Register (`register.cy.js`)

Foi criado o arquivo `cypress/e2e/support/steps/register.cy.js` com:

- **Função `generateRandomCPF()`**: Gera CPFs válidos aleatoriamente
- **Steps do Cucumber**: Implementa os passos para o teste de registro
- **Dados únicos**: Adiciona timestamp ao username e email para evitar duplicatas

### 2. Comandos Customizados (`commands.js`)

Foram adicionados dois comandos customizados:

- **`cy.generateRandomCPF()`**: Gera um CPF válido formatado
- **`cy.generateUniqueUserData()`**: Gera um objeto com todos os dados únicos do usuário

### 3. Feature File Atualizado (`register.feature`)

O arquivo foi atualizado com:

- Cenário simples com CPF aleatório
- Scenario Outline para múltiplos usuários
- Exemplos de diferentes combinações de dados

## Como Funciona a Geração de CPF

### Algoritmo de Validação

1. **Gera 9 dígitos aleatórios**
2. **Calcula o primeiro dígito verificador**:
   - Multiplica cada dígito por (10 - posição)
   - Soma todos os resultados
   - Calcula: 11 - (soma % 11)
   - Se resultado >= 10, usa 0

3. **Calcula o segundo dígito verificador**:
   - Inclui o primeiro dígito verificador
   - Multiplica cada dígito por (11 - posição)
   - Aplica a mesma lógica

4. **Formata o CPF**: XXX.XXX.XXX-XX

### Exemplo de Uso

```javascript
// Usando o comando customizado
cy.generateRandomCPF().then((cpf) => {
    cy.get('#cpf-input').type(cpf);
});

// Usando dados completos
cy.generateUniqueUserData().then((userData) => {
    cy.get('#nome').type(userData.fullName);
    cy.get('#cpf').type(userData.cpf);
    cy.get('#email').type(userData.email);
    // ... outros campos
});
```

## Vantagens da Implementação

1. **CPFs sempre válidos**: Segue o algoritmo oficial de validação
2. **Dados únicos**: Timestamp garante unicidade
3. **Reutilizável**: Comandos podem ser usados em outros testes
4. **Flexível**: Funciona com Scenario Outline
5. **Manutenível**: Código centralizado e documentado

## Executando os Testes

```bash
# Abrir Cypress
npm run cy:open

# Executar testes em modo headless
npm test
```

## Estrutura de Arquivos

```
cypress/
├── e2e/
│   ├── Features/
│   │   └── register.feature
│   └── support/
│       ├── steps/
│       │   ├── login.cy.js
│       │   └── register.cy.js
│       ├── pageObjects/
│       │   ├── POLogin.js
│       │   ├── PORegister.js
│       │   └── POPages.js
│       ├── commands.js
│       └── e2e.js
└── fixtures/
    └── example.json
```

## Notas Importantes

- Os CPFs gerados são **matematicamente válidos** mas **fictícios**
- Cada execução gera dados completamente únicos
- A implementação é compatível com Cypress Cucumber Preprocessor
- Os comandos customizados ficam disponíveis globalmente