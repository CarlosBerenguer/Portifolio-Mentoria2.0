# PsyControl - Sistema de Gerenciamento para Psicólogos

O PsyControl é um sistema web desenvolvido para auxiliar psicólogos no gerenciamento de seus pacientes e evoluções clínicas. O sistema permite o cadastro de pacientes, registro de evoluções de consultas, e oferece uma interface intuitiva para o acompanhamento do histórico de atendimentos.

## Funcionalidades

- **Autenticação de Usuários**: Sistema seguro de login e registro para psicólogos.
- **Gerenciamento de Pacientes**: Cadastro, edição, visualização e exclusão de pacientes.
- **Registro de Evoluções**: Documentação de consultas e acompanhamento clínico.
- **Upload de Imagens**: Possibilidade de adicionar fotos de perfil para usuários e pacientes.
- **API Documentada**: Documentação completa da API com Swagger.

## Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- MySQL
- JWT para autenticação
- Multer para upload de arquivos
- Swagger para documentação da API

### Frontend
- HTML5
- CSS3
- JavaScript
- MaterializeCSS

## Instalação e Configuração

### Pré-requisitos
- Node.js (v14 ou superior)
- MySQL (v5.7 ou superior)

### Passos para Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/psycontrol.git
   cd psycontrol
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`
   - Preencha as informações de conexão com o banco de dados e outras configurações necessárias

4. Inicialize o banco de dados:
   ```
   npm run init-db
   ```

5. (Opcional) Popule o banco de dados com dados de exemplo:
   ```
   npm run seed
   ```

6. Inicie o servidor:
   ```
   npm run dev
   ```

7. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

```
├── docs/                  # Documentação do projeto
├── src/
│   ├── backend/
│   │   ├── config/        # Configurações do servidor e banco de dados
│   │   ├── controllers/   # Controladores da aplicação
│   │   ├── middlewares/   # Middlewares personalizados
│   │   ├── models/        # Modelos de dados
│   │   ├── routes/        # Rotas da API
│   │   ├── uploads/       # Diretório para armazenar arquivos enviados
│   │   ├── app.js         # Configuração da aplicação Express
│   │   └── server.js      # Ponto de entrada do servidor
│   └── frontend/          # Arquivos do frontend (HTML, CSS, JS)
├── .env                   # Variáveis de ambiente
├── .env.example          # Exemplo de variáveis de ambiente
└── package.json          # Dependências e scripts
```

## Documentação da API

A documentação da API está disponível em `http://localhost:3000/api-docs` quando o servidor estiver em execução.

## Usuário Padrão (após executar o seed)

- **Usuário**: carlos
- **Senha**: 123

## Testes e Quality Assurance (QA)

O projeto inclui uma suíte completa de testes automatizados para garantir a qualidade e confiabilidade do sistema.

### Estrutura de Testes

```
QA/
├── Cypress/              # Testes E2E com Cypress
├── Supertest-API/         # Testes de API com Supertest
└── K6-Performance/        # Testes de Performance com K6
```

### 1. Testes E2E com Cypress

Testes de interface do usuário e fluxos completos da aplicação.

#### Instalação e Execução:

```bash
# Navegue para o diretório do Cypress
cd QA/Cypress

# Instale as dependências
npm install

# Execute os testes em modo headless
npx cypress run

# Execute os testes em modo interativo
npx cypress open
```

#### Funcionalidades Testadas:
- ✅ Registro de usuários com CPF aleatório
- ✅ Login e autenticação
- ✅ Navegação entre páginas
- ✅ Validação de formulários

#### Correções Implementadas:
- Corrigidos seletores CSS no Page Object Model
- Implementada geração de CPF aleatório para testes
- Configurada baseUrl correta
- Corrigidos comandos customizados assíncronos

### 2. Testes de API com Supertest

Testes automatizados para validar endpoints da API.

#### Instalação e Execução:

```bash
# Navegue para o diretório do Supertest
cd QA/Supertest-API

# Instale as dependências
npm install 

# Execute os testes
npm test
```

#### Endpoints Testados:
- ✅ POST /api/auth/login - Login com credenciais válidas (200)
- ✅ POST /api/auth/login - Login com credenciais inválidas (401)

#### Correções Implementadas:
- Resolvido erro ERR_REQUIRE_ESM com downgrade do chai (6.0.1 → 4.5.0)
- Corrigidas URLs dos endpoints da API
- Ajustado formato das requisições HTTP

### 3. Testes de Performance com K6

Testes de carga e performance para avaliar o comportamento da aplicação sob stress.

#### Instalação do K6:

```bash
# Windows (via Chocolatey)
choco install k6

# Ou baixe diretamente de: https://k6.io/docs/get-started/installation/
```

#### Execução:

```bash
# Navegue para o diretório do K6
cd QA/K6-Performance

# Execute o teste de login
k6 run tests/login.k6.js

# Execute com relatório HTML
k6 run --out html=html-report.html tests/login.k6.js
```

#### Métricas Avaliadas:
- ✅ Tempo de resposta da API
- ✅ Taxa de sucesso das requisições
- ✅ Throughput (requisições por segundo)
- ✅ Latência e tempo de conexão

#### Correções Implementadas:
- Corrigida URL da API de login
- Implementado JSON.stringify para payload correto
- Habilitadas verificações de status HTTP

## Correções e Melhorias Implementadas

### Frontend
- ✅ Corrigidos IDs inconsistentes entre HTML e JavaScript
- ✅ Implementada validação de dados na página de visualização de pacientes
- ✅ Melhorada experiência do usuário com mensagens de erro apropriadas

### Backend
- ✅ Validação robusta de endpoints da API
- ✅ Tratamento adequado de erros HTTP
- ✅ Otimização de performance para consultas de banco

### Testes
- ✅ Implementação completa de testes E2E com Cypress
- ✅ Testes de API automatizados com Supertest
- ✅ Testes de performance com K6
- ✅ Geração de dados aleatórios para testes (CPF, nomes, etc.)

## Como Executar Todo o Projeto

### 1. Configuração Inicial

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd Portifolio-Mentoria2.0

# Instale dependências do projeto principal
npm install

# Configure o banco de dados
npm run init-db
npm run seed
```

### 2. Executar a Aplicação

```bash
# Inicie o servidor
npm run dev

# A aplicação estará disponível em http://localhost:3000
```

### 3. Executar Todos os Testes

```bash
# Testes E2E (Cypress)
cd QA/Cypress
npm install
npx cypress run

# Testes de API (Supertest)
cd ../Supertest-API
npm install
npm test

# Testes de Performance (K6)
cd ../K6-Performance
k6 run tests/login.k6.js
```

## Dependências dos Testes

### Cypress
- cypress: ^13.16.1
- @badeball/cypress-cucumber-preprocessor: ^21.0.2
- @bahmutov/cypress-esbuild-preprocessor: ^2.2.3

### Supertest-API
- chai: ^4.5.0 (downgrade para compatibilidade CommonJS)
- mocha: ^11.7.1
- supertest: ^7.1.4

### K6-Performance
- k6 (instalação global necessária)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Autor

Desenvolvido como parte do portfólio para a Mentoria 2.0 de Julio de Lima.