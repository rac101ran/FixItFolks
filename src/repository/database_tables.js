import pool from '../databases/database.js'


class TableCreation {
    static async createItemTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS items
            ( 
                item_name VARCHAR(50),
                item_id INT PRIMARY KEY,
                image_url VARCHAR(200)    
            )
        `)];
    }

    static async createUserTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS users 
            (  
                name VARCHAR(30),
                user_id INT PRIMARY KEY,
                username VARCHAR(30), 
                password VARCHAR(20),
            )
        `)];
    }

    static async createCustomerTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT PRIMARY KEY,
                customer_id INT,
                fixing_item INT,
                history INT,
                customer_landmark TEXT,
                customer_address TEXT,
                FOREIGN KEY (customer_id) REFERENCES users(user_id),
                FOREIGN KEY (fixing_item) REFERENCES items(item_id)
            )
        `)];
    }

    static async createProviderTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS providers   
            (
                provider_id INT PRIMARY KEY,
                provider_name VARCHAR(50),
                landmark VARCHAR(50),
                address VARCHAR(50),
                phone_number INT(10),
                provider_item INT,
                FOREIGN KEY (provider_item) REFERENCES items(item_id) 
            )
        `)];
    }

    static async createEventStatusTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS current_event  
            (
                event_id INT PRIMARY KEY,
                event_consumer_id INT,
                event_provider_id INT,
                event_item_id INT,
                status VARCHAR(255),
                event_timestamp VARCHAR(100),
                FOREIGN KEY (event_consumer_id) REFERENCES users(user_id),
                FOREIGN KEY (event_provider_id) REFERENCES providers(provider_id),
                FOREIGN KEY (event_item_id) REFERENCES items(item_id) 
            )
        `)];
    }
}

export default TableCreation;