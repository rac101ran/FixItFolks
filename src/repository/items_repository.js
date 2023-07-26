import pool from '../databases/database.js'


class Items {
    static async verifyForUniqueness(item_name) {
        try {
            const response = await pool.query("SELECT * FROM items WHERE item_name LIKE %?%", [item_name])
            return response === undefined || response.length == 0;
        } catch (err) {
            return false;
        }
    }
    static async createItems(item_name, image_url) {
        try {
            if (this.verifyForUniqueness(item_name)) {
                const response = await pool.query('INSERT INTO items (item_name,image_url) VALUES (?,?)', [item_name, image_url])
                return { 'status': "OK", 'message': "item created" };
            } else {
                return { 'status': "OK", 'message': "already created" };
            }
        } catch (err) {
            console.log("error :", err);
            return { 'status': "BAD", 'message': err };
        }
    }

}