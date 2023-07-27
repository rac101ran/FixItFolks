import pool from '../databases/database.js'


// TODO
export class CustomerEvents {
    static async verifyCustomerForCreation(customer_id, fixing_item) {
        try {
            const row = await pool.query('SELECT * FROM customers WHERE customer_id = ? and fixing_item = ?'[customer_id, fixing_item])
            return row === undefined ? true : false;
        } catch (err) {
            console.log("error: ", err);
            return false;
        }
    }
    static async createCustomer(customer_id, fixing_item) {
        try {
            const response = await pool.query('INSERT INTO customers (customer_id,fixing_item) VALUES (?,?) ', [customer_id, fixing_item]);
            return { 'status': response.affectedRows === 1 ? "OK" : "BAD" };
        } catch (err) {
            console.log("error: ", err);
            return { 'status': "BAD" };
        }
    }
}
