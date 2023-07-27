import pool from '../databases/database.js'

export class Providers {
    static async verifyProvider(provider_username, provider_title) {
        try {
            const response = await pool.query('SELECT * FROM providers WHERE provider_username = ? AND provider_title = ?'[provider_username, provider_title]);
            return { 'status': response === undefined || response.length == 0 ? "BAD" : "OK", 'data': response };
        } catch (err) {
            console.err("error :", err)
            return { 'status': "BAD" }
        }
    }

    static async verifyProviderLogin(user_name, password) {
        try {
            const result = await pool.query('select * from users WHERE provider_username = ? AND provider_password = ?'[user_name, password])
            return { 'data': result, 'status': result === undefined ? "BAD" : "OK" };
        } catch (err) {
            console.error("error: ", err)
            return { 'message': err, 'status': 'BAD' };
        }
    }


    static async verifyItemService(provider_username, item_id) {
        try {
            const response = await pool.query('SELECT * from providers WHERE provider_username = ? AND provider_item = ?', [provider_username, item_id]);
            return { 'status': response === undefined || response.length === 0 ? "BAD" : "OK", 'data': response };
        } catch (err) {
            return { 'status': "BAD" };
        }
    }

    static async createProvider(provider_title, provider_username, provider_password, landmark, address, phone_number, provider_item, min_price, max_price, in_service) {
        try {
            const response = await pool.query('INSERT INTO providers (provider_title,provider_username,provider_password,landmark,address,phone_number,provider_item,min_price,max_price,in_service) VALUES (?,?,?,?,?,?,?,?)', [provider_title,
                provider_username, provider_password, landmark, address, phone_number, provider_item, min_price, max_price, in_service]);
            return { 'status': response.affectedRows == 1 ? "OK" : "BAD", 'data': response };
        } catch (err) {
            return { 'status': "BAD" };
        }
    }

    static async getProvidersForItem(provider_item) {
        try {
            const [provider_rows] = await pool.query("SELECT provider_title , address , landmark , phone_number , min_price , max_price FROM providers WHERE provider_item = ? AND in_service = ?", [provider_item, 'YES']);
            return provider_rows;
        } catch (err) {
            console.log("error: ",err);
            return [];
        }
    }
    static async getProviderForPriceRange(provider_item , min_range , max_range) {
        try {
            const [provider_rows] = await pool.query("SELECT provider_title , address , landmark , phone_number , min_price , max_price FROM providers WHERE provider_item = ? AND min_price <= ? AND max_price >= ?",[provider_item,min_range,max_range])
            return provider_rows;
        }catch(err) {
            return [];
        }
    }

}