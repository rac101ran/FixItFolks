import pool from '../databases/database.js'

class Providers {
    static async verifyProvider(provider_username, provider_title) {
        try {
            const response = await pool.query('SELECT * FROM providers WHERE provider_username = ? AND provider_title = ?'[provider_username, provider_title]);
            return { 'status': response === undefined || response.length == 0 ? "BAD" : "OK", 'data': response };
        } catch (err) {
            console.err("error :", err)
            return { 'status': "BAD" }
        }
    }
    static async verifyItemService(provider_username, item_id) {
        try {
            const response = await pool.query('SELECT * from providers WHERE provider_username = ? AND provider_item = ?', [provider_username, item_id]);
            return { 'status': response === undefined || response.length === 0 ? "OK" : "BAD" };
        } catch (err) {
            return { 'status': 'BAD' };
        }
    }

    static async createProvider(provider_title, provider_username, provider_password, landmark, address, phone_number, provider_item, min_price, max_price) {
        try {
            const response = await pool.query('INSERT INTO providers (provider_title,provider_username,provider_password,landmark,address,phone_number,provider_item,min_price,max_price) VALUES (?,?,?,?,?,?,?)', [provider_title,
                provider_username, provider_password, landmark, address, phone_number, provider_item, min_price, max_price]);
            return { 'status': "OK" };
        } catch (err) {
            return { 'status': "BAD" };
        }
    }

    static async addItemService(provider_username, provider_items) {
        const { provider_title, provider_password, landmark, address, phone_number } = await pool.query("SELECT provider_title , provider_password , landmark , address , phone_number FROM providers WHERE provider_username = ?", [provider_username]);
        let addedItems = 0
        try {
            for (let item = 0; item < provider_items.length; item++) {
                if ((await this.verifyItemService(provider_username, provider_items[item][0])).status === "OK") {
                    const response = await this.createProvider(provider_title, provider_username, provider_password, landmark, address, phone_number, provider_items[item][0], provider_items[item][1], provider_items[item][2]);
                    addedItems++;
                }
            }
            return { 'status': "OK", 'data': { 'addedItems': addedItems } };
        } catch (err) {
            console.log("error :", err);
            return { 'status': "BAD", 'data': {} };
        }
    }

}

// provider_id INT PRIMARY KEY,
// provider_title VARCHAR(50),
// provider_username VARCHAR(50),
// provider_password VARCHAR(50),
// landmark VARCHAR(50),
// address VARCHAR(50),
// phone_number INT(10),
// provider_item INT,
// FOREIGN KEY (provider_item) REFERENCES items(item_id) 