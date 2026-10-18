/**
 * @module models/EventVolunteerModel
 * @description Camada de acesso a dados das inscrições de voluntários em eventos
 */
const db = require('../config/database');

/**
 * @class EventVolunteerModel
 */
class EventVolunteerModel {
  /**
   * Conta quantos voluntários estão inscritos em um evento
   * @param {number|string} eventId - ID do evento
   * @returns {Promise<number>} Quantidade de inscritos
   */
  static async countByEvent(eventId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS total FROM event_volunteers WHERE event_id = ?',
      [eventId],
    );

    return Number(rows[0].total);
  }

  /**
   * Verifica se o voluntário já está inscrito no evento
   * @param {number|string} eventId - ID do evento
   * @param {number|string} volunteerId - ID do voluntário
   * @returns {Promise<boolean>}
   */
  static async exists(eventId, volunteerId) {
    const [rows] = await db.query(
      'SELECT 1 FROM event_volunteers WHERE event_id = ? AND volunteer_id = ?',
      [eventId, volunteerId],
    );

    return rows.length > 0;
  }

  /**
   * Inscreve um voluntário em um evento
   * @param {number|string} eventId - ID do evento
   * @param {number|string} volunteerId - ID do voluntário
   * @returns {Promise<void>}
   */
  static async add(eventId, volunteerId) {
    await db.query('INSERT INTO event_volunteers (event_id, volunteer_id) VALUES (?, ?)', [
      eventId,
      volunteerId,
    ]);
  }

  /**
   * Lista os voluntários inscritos em um evento
   * @param {number|string} eventId - ID do evento
   * @returns {Promise<Array<Object>>}
   */
  static async findVolunteersByEvent(eventId) {
    const [rows] = await db.query(
      `SELECT v.id, v.name, v.email, v.telephone
       FROM event_volunteers ev
       JOIN volunteers v ON v.id = ev.volunteer_id
       WHERE ev.event_id = ?
       ORDER BY v.name`,
      [eventId],
    );

    return rows;
  }
}

module.exports = EventVolunteerModel;
