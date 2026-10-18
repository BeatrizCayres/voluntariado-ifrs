/**
 * @module services/UserService
 * @description Camada de regras de negócio para usuários/autenticação
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/userModel');

/**
 * @class UserService
 */
class UserService {
  // Método para registrar um novo usuário
  /**
   * Registra novo usuário
   * @param {Object} user - Dados do usuário
   * @param {string} user.email
   * @param {string} user.password
   * @param {string} user.role
   * @returns {Promise<Object>} Resultado do registro
   * @throws {Error} Se usuário já existe
   */
  static async registerUser(user) {
    const { email, password, role } = user;
    // Verifica se o e-mail já está cadastrado
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw new Error('Usuário já existe');
    }
    // Criptografa a senha
    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;

    const id = await UserModel.create(user);

    return { message: 'Usuário registrado com sucesso', id };
  }

  // Método para autenticar o usuário e gerar token JWT
  /**
   * Autentica usuário e gera token JWT
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{token: string, user: {email: string, role: string}}>} Token JWT e dados do usuário
   * @throws {Error} Se usuário não encontrado ou senha inválida
   */
  static async loginUser({ email, password }) {

    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Senha inválida');
    }

    const payload = { email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Retorna o token e os dados do usuário para o controller
    return { token, user: payload };
  }
}

module.exports = UserService;
