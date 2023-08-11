import pool from '../databases/database.js'


export class Items {
    static async verifyItem(item_id) {
        try {
            const [response] = await pool.query("SELECT * FROM items WHERE item_id = ?", [item_id])
            return { 'status': response === undefined || response.length === 0 ? "BAD" : "OK", 'data': response }
        } catch (err) {
            return { 'status': "BAD", 'data': {} };
        }
    }
    static async verifyForUniqueness(item_name) {
        try {
            const [response] = await pool.query('SELECT * FROM items WHERE item_name LIKE ?', [`%${item_name}%`])
            return response === undefined || response.length === 0;
        } catch (err) {
            return false;
        }
    }
    static async createItems(item_name, image_url) {
        try {
            const [response] = await pool.query('INSERT INTO items (item_name,image_url) VALUES (?,?)', [item_name, image_url])
            return { 'status': response.affectedRows === 1 ? "OK" : "BAD", 'message': response.affectedRows === 1 ? "item created" : "item not created" };
        } catch (err) {
            return { 'status': "BAD", 'message': err };
        }
    }

    static async getAllServiceItems() {
        try {
            const [rows] = await pool.query('SELECT * FROM items');
            return rows;
        } catch (err) {
            return [];
        }
    }
    static async getAllItemsPerService(serviceId) {
        try {
            const [rows] = await pool.query('SELECT item_name,item_id,service FROM items WHERE service = ?', [serviceId]);
            console.log(rows)
            return rows;
        } catch (err) {
            return [];
        }
    }

}