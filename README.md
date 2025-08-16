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

- **Usuário**: admin
- **Senha**: admin123

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.

## Autor

Desenvolvido como parte do portfólio para a Mentoria 2.0 de Julio de Lima.