import pool from '../databases/database.js'


class UserEvents {
    static async validateSignUpUser(user_name, password) {
        const [row] = await pool.query('select * from users where user_name = ?', [user_name])
        if (row === undefined && password.length >= 8) {
            return true;
        } else {
            return false;
        }
    }

    static async createUser(user_name, password, phone_number, name) {
        try {
            const result = await pool.query('INSERT INTO users (name,user_name,password,phone_num) VALUES (?,?,?,?)', [name, user_name, password, phone_number])
            return { 'data': result, 'status': result === undefined ? "BAD" : "OK" };
        } catch (err) {
            console.error("error: ", err)
            return { 'message': err, 'status': 'BAD' };
        }
    }

    static async verifyUserLogin(user_name, password) {
        try {
            const result = await pool.query('select * from users WHERE user_name = ? AND password = ?'[user_name, password])
            return { 'data': result, 'status': result === undefined ? "BAD" : "OK" };
        } catch (err) {
            console.error("error: ", err)
            return { 'message': err, 'status': 'BAD' };
        }
    }

    static async addUserInformation(address, landmark, user_name) {
        try {
            const result = await pool.query('UPDATE users SET address = ? , landmark = ? WHERE user_name = ?', [address, landmark, user_name])
            return { 'data': result, 'status': result === undefined ? "BAD" : "OK" };
        } catch (err) {
            console.error("error :", err)
            return { 'message': err, 'status': 'BAD' };
        }
    }
}






