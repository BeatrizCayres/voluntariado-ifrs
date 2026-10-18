/**
 * @module models/VolunteerModel
 * @description Camada de acesso a dados para voluntários
 */
const db = require('../config/database');

/**
 * @class VolunteerModel
 */
class VolunteerModel {
  /**
   * Lista voluntários
   * @returns {Promise<Array<Object>>}
   */
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM volunteers ORDER BY name');

    return rows;
  }

  /**
   * Busca voluntário por ID
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<Object|undefined>}
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM volunteers WHERE id = ?', [id]);

    return rows[0];
  }

  /**
   * Busca voluntário por e-mail
   * @param {string} email - E-mail do voluntário
   * @returns {Promise<Object|undefined>}
   */
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM volunteers WHERE email = ?', [email]);

    return rows[0];
  }

  /**
   * Cria voluntário
   * @param {Object} volunteer - Dados do voluntário
   * @param {string} volunteer.name - Nome
   * @param {string} volunteer.email - E-mail
   * @param {string} volunteer.telephone - Telefone
   * @returns {Promise<number>} ID inserido
   */
  static async create(volunteer) {
    const { name, email, telephone } = volunteer;

    const [result] = await db.query(
      'INSERT INTO volunteers (name, email, telephone) VALUES (?, ?, ?)',
      [name, email, telephone],
    );

    return result.insertId;
  }

  /**
   * Atualiza voluntário
   * @param {number|string} id - ID do voluntário
   * @param {Object} volunteer - Dados atualizados
   * @returns {Promise<number>} Linhas afetadas
   */
  static async update(id, volunteer) {
    const { name, email, telephone } = volunteer;

    const [result] = await db.query(
      'UPDATE volunteers SET name = ?, email = ?, telephone = ? WHERE id = ?',
      [name, email, telephone, id],
    );

    return result.affectedRows;
  }

  /**
   * Exclui voluntário
   * @param {number|string} id - ID do voluntário
   * @returns {Promise<number>} Linhas afetadas
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM volunteers WHERE id = ?', [id]);

    return result.affectedRows;
  }
}

module.exports = VolunteerModel;
