/**
 * @module models/UserModel
 * @description Camada de acesso a dados para usuários
 */
const db = require('../config/database');

/**
 * @class UserModel
 */
class UserModel {
  /**
   * Busca usuário por email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    return rows[0];
  }

  /**
   * Cria usuário
   * @param {Object} user
   * @param {string} user.email
   * @param {string} user.password
   * @param {string} user.role
   * @returns {Promise<number>} ID inserido
   */
  static async create(user) {
    const { email, password, role } = user;

    const [result] = await db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [
      email,
      password,
      role,
    ]);

    return result.insertId;
  }
}

module.exports = UserModel;
