import pool from '../databases/database.js'
import bcrypt from 'bcrypt'

import { join, dirname } from 'path';
const __filename = new URL(import.meta.url).pathname;
const __dirname = dirname(__filename);


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
            const [provider_rows] = await pool.query("SELECT provider_title , provider_username , address , landmark , phone_number , min_price , max_price , rating FROM providers WHERE provider_item = ? AND in_service = ?", [provider_item, 'YES']);
            const [item_info] = await pool.query('SELECT item_name FROM items WHERE item_id = ?', [provider_item])
            return provider_rows === undefined || item_info === undefined ? [] : { provider: provider_rows, services: item_info };
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
            const [provider_rows] = await pool.query("SELECT provider_title , provider_username , rating , address , landmark , phone_number , min_price , max_price FROM providers WHERE provider_item = ? AND in_service = ? ORDER BY min_price", [provider_item, "YES"]);
            const [item_info] = await pool.query('SELECT item_name FROM items WHERE item_id = ?', [provider_item])
            return provider_rows === undefined || item_info === undefined ? [] : { provider: provider_rows, services: item_info };
        } catch (err) {
            return [];
        }
    }

    static async getHighestRatedProviders() {
        try {
            let topProviders = 0;
            const mp = new Map();
            const [providersResult] = await pool.query('SELECT p1.provider_username, p1.provider_title, p1.address, p1.landmark, p1.phone_number, p1.min_price, p1.max_price, p1.rating FROM providers p1 ORDER BY rating DESC');
            for (let i = 0; i < providersResult.length && topProviders < 10; i++) {
                const user_name = providersResult[i].provider_username
                if (mp.has(user_name) === false) {
                    mp.set(user_name, providersResult[i])
                    topProviders++;
                }
            }
            const response = []
            for (const [key, value] of mp) {
                const items = []
                const [items_response] = await pool.query('SELECT DISTINCT(ServiceCategory.service_name) FROM ServiceCategory WHERE ServiceCategory.service_id IN (SELECT items.service FROM items LEFT JOIN providers ON items.item_id = providers.provider_item WHERE providers.provider_username = ?)', [key])
                console.log(items_response)
                for (let i = 0; i < items_response.length; i++) items.push(items_response[i].service_name)
                response.push({ provider: value, services: items });
            }
            return response
        } catch (err) {
            console.error("Error executing query:", err);
            return []
        }
    }

}






