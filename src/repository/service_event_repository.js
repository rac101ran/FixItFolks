import pool from '../databases/database.js'

export class ServiceEvents {
    static async verifyServiceEvent(customer_id, provider_id, item_id) {
        const [row] = await pool.query('SELECT * FROM current_event WHERE event_provider_id = ? AND event_item_id = ? AND event_customer_id = ?', [provider_id, item_id, customer_id]);
        return (row === undefined || row.length === 0);
    }
    static async createServiceEvent(customer_id, provider_id, item_id,order_cost) {
        const [row] = await pool.query('INSERT INTO current_event (event_provider_id , event_item_id , event_customer_id , event_timestamp , status,order_cost)  VALUES (?,?,?,?,?)', [provider_id, item_id, customer_id, (Date.now() / 1000).toString(), "requested",order_cost]);
        return row.affectedRows === 1;
    }
    static async updateServiceEvent(customer_id, provider_id, item_id, current_status) {
        const [row] = await pool.query('UPDATE current_event SET status = ? , event_timestamp = ? WHERE event_customer_id = ? AND event_provider_id = ? AND event_item_id = ?', [current_status, (Date.now() / 1000).toString(), customer_id, provider_id, item_id]);
        if (row.affectedRows === 1) {
            const [result] = await pool.query('SELECT * FROM current_event WHERE event_customer_id = ? AND event_provider_id = ? AND event_item_id = ?', [customer_id, provider_id, item_id]);
            return { 'status': "OK", 'data': result[0] };
        } else {
            return { 'status': "BAD", 'data': {} };
        }
    }
    static async deleteServiceEvent(customer_id, provider_id, item_id) {
        const [row] = await pool.query('DELETE FROM current_event WHERE event_customer_id = ? AND event_provider_id = ? AND event_item_id = ?', [customer_id, provider_id, item_id]);
        return row.affectedRows === 1;
    }
}
