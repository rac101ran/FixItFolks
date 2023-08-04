import pool from '../databases/database.js'
import bcrypt from 'bcrypt'
export class Providers {
    static async verifyProvider(provider_username, provider_title) {
        try {
            const [response] = await pool.query('SELECT * FROM providers WHERE provider_username = ? AND provider_title = ?', [provider_username, provider_title]);
            return { 'status': response === undefined || response.length === 0 ? "BAD" : "OK", 'data': response };
        } catch (err) {
            return { 'status': "BAD" }
        }
    }

    static async verifyProviderLogin(user_name, password) {
        try {

            const [result] = await pool.query('select * from providers WHERE provider_username = ?', [user_name]);
            if (result === undefined || result.length === 0) {
                return { 'data': result, 'status': "BAD" };
            } else {
                const hash_result = await bcrypt.compare(password, result[0].provider_password);
                return hash_result ? { 'status': "OK", 'data': result[0] } : { 'data': result[0], 'status': "BAD" };
            }
        } catch (err) {
            return { 'message': err, 'status': "BAD" };
        }
    }


    static async verifyItemService(provider_username, item_id) {
        try {
            const [response] = await pool.query('SELECT * from providers WHERE provider_username = ? AND provider_item = ?', [provider_username, item_id]);
            return { 'status': response === undefined || response.length === 0 ? "BAD" : "OK", 'data': response };
        } catch (err) {
            return { 'status': "BAD" };
        }
    }

    static async createProvider(provider_title, provider_username, provider_password, landmark, address, phone_number, provider_item, min_price, max_price, in_service, create_hash) {
        try {
            const hashedProviderPassword = create_hash ? await bcrypt.hash(provider_password, 10) : provider_password
            const [response] = await pool.query('INSERT INTO providers (provider_title,provider_username,provider_password,landmark,address,phone_number,provider_item,min_price,max_price,in_service) VALUES (?,?,?,?,?,?,?,?,?,?)', [provider_title,
                provider_username, hashedProviderPassword, landmark, address, phone_number, provider_item, min_price, max_price, in_service]);
            return { 'status': response.affectedRows == 1 ? "OK" : "BAD", 'data': response };
        } catch (err) {
            return { 'status': "BAD" };
        }
    }

    static async getProvidersForItem(provider_item) {
        console.log(provider_item)
        try {
            const [provider_rows] = await pool.query("SELECT provider_title , address , landmark , phone_number , min_price , max_price FROM providers WHERE provider_item = ? AND in_service = ?", [provider_item, 'YES']);
            console.log(provider_rows)
            return provider_rows === undefined ? [] : provider_rows;
        } catch (err) {
            return [];
        }
    }
    static async getProviderForPriceRange(provider_item, min_range, max_range) {
        try {
            const [provider_rows] = await pool.query("SELECT provider_title , address , landmark , phone_number , min_price , max_price FROM providers WHERE provider_item = ? AND min_price <= ? AND max_price >= ? AND in_service = ?", [provider_item, min_range, max_range, "YES"])
            return provider_rows === undefined ? [] : provider_rows
        } catch (err) {
            return [];
        }
    }

    static async getProvidersWithLowestCost(provider_item) {
        try {
            const [provider_rows] = await pool.query("SELECT provider_title , address , landmark , phone_number , min_price , max_price FROM providers WHERE provider_item = ? AND in_service = ? ORDER BY min_price", [provider_item, "YES"]);
            return provider_rows === undefined ? [] : provider_rows
        } catch (err) {
            return [];
        }
    }
}