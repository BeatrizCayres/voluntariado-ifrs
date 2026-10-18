/**
 * @module models/EventModel
 * @description Camada de acesso a dados para eventos
 */
const db = require('../config/database');

/**
 * @class EventModel
 */
class EventModel {
  /**
   * Lista eventos
   * @param {string} [category]
   * @returns {Promise<Array<Object>>}
   */
  static async findAll(category) {
    // A consulta muda somente se o usuario digita uma categoria
    if (category) {
      const [rows] = await db.query('SELECT * FROM events WHERE category = ? ORDER BY eventDate', [
        category,
      ]);

      return rows;
    }

    const [rows] = await db.query('SELECT * FROM events ORDER BY eventDate');

    return rows;
  }

  /**
   * Busca evento por ID
   * @param {number|string} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [id]);

    return rows[0];
  }

  /**
   * Cria evento
   * @param {Object} event
   * @returns {Promise<number>} ID inserido
   */
  static async create(event) {
    const { name, category, location, eventDate, capacity } = event;

    const [result] = await db.query(
      `INSERT INTO events
        (name, category, location, eventDate, capacity)
       VALUES (?, ?, ?, ?, ?)`,
      [name, category, location, eventDate, capacity],
    );

    return result.insertId;
  }

  /**
   * Atualiza evento
   * @param {number|string} id
   * @param {Object} event
   * @returns {Promise<number>} Linhas afetadas
   */
  static async update(id, event) {
    const { name, category, location, eventDate, capacity } = event;

    const [result] = await db.query(
      `UPDATE events
       SET name = ?,
           category = ?,
           location = ?,
           eventDate = ?,
           capacity = ?
       WHERE id = ?`,
      [name, category, location, eventDate, capacity, id],
    );

    return result.affectedRows;
  }

  /**
   * Exclui evento
   * @param {number|string} id
   * @returns {Promise<number>} Linhas afetadas
   */
  static async delete(id) {
    const [result] = await db.query('DELETE FROM events WHERE id = ?', [id]);

    return result.affectedRows;
  }
}

module.exports = EventModel;
