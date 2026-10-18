# Voluntariado IFRS

Sistema monolítico para gerenciamento de ações de voluntariado (campanhas de doação, arrecadação de alimentos, mutirões ambientais) e de voluntários. Back-end em **Node.js/Express** com **MySQL**, front-end em **React** (Vite).

## 1. Preparação

Execute o arquivo `database.sql` no MySQL.

Ajuste  o arquivo `.env` de acordo com suas configurações:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=voluntariado_db

PORT=3000
JWT_SECRET=sua_chave_secreta
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

## 2. Usuários iniciais

Usuário comum:

- e-mail: `usuario@ifrs.edu.br`
- senha: `123456`

Administrador:

- e-mail: `admin@ifrs.edu.br`
- senha: `admin123`

## 3. Organização

O fluxo principal é:

`Routes -> Controllers -> Services -> Models -> MySQL`

As rotas estão divididas como no Capítulo 5:

- `/auth`: cadastro e login;
- `/public`: consultas que não exigem JWT;
- `/protected`: funcionalidades que exigem autenticação.

As operações POST, PUT e DELETE de eventos também utilizam
`authorizeRole('admin')`.

## 4. Testes

Use o arquivo:

`src/tests/events_api_test.rest`

Depois do login, copie os tokens para as variáveis `tokenUser` e `tokenAdmin`
no início do arquivo.
