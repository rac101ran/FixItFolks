import pool from '../databases/database.js'
import bcrypt from 'bcrypt'

export class UserEvents {
    static async validateSignUpUser(user_name, password) {
        const [result] = await pool.query('SELECT * from users WHERE username = ?', [user_name])
        if ((result === undefined || result.length === 0) && password.length >= 8) {
            return true;
        } else {
            return false;
        }
    }

    static async createUser(user_name, password, phone_number, name) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await pool.query('INSERT INTO users (name,username,password,phone_number) VALUES (?,?,?,?)', [name, user_name, hashedPassword, phone_number])
            return { 'data': result, 'status': result.affectedRows === 0 ? "BAD" : "OK" };
        } catch (err) {
            return { 'message': err, 'status': 'BAD' };
        }
    }

    static async verifyUserLogin(user_name, password) {
        try {
            let [result] = await pool.query('select * from users WHERE username = ? LIMIT 1', [user_name])
            if (result === undefined || result.length === 0) {
                return { 'data': result, 'status': "BAD" };
            } else {
                const result_hash = await bcrypt.compare(password, result[0].password)
                if (result_hash) result[0].password = password
                return result_hash ? { 'status': "OK", 'data': result[0] } : { 'data': result[0], 'status': "BAD" };
            }
        } catch (err) {
            return { 'message': err, 'status': 'BAD' };
        }
    }

    static async addUserInformation(address, landmark, user_name) {
        try {
            const [result] = await pool.query('UPDATE users SET address = ? , landmark = ? WHERE username = ?', [address, landmark, user_name])
            return { 'data': result, 'status': result.affectedRows === 1 ? "OK" : "BAD" };
        } catch (err) {
            return { 'message': err, 'status': 'BAD' };
        }
    }
}




