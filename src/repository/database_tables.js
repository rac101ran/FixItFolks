import pool from '../databases/database.js'


export class FixItFolksTables {
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
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(30), 
                password VARCHAR(20),
                phone_number TEXT,
                history INT,
                landmark varchar(200),
                address varchar(200),
            )
        `)];
    }

    static async createCustomerTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT,
                fixing_item INT,
                FOREIGN KEY (customer_id) REFERENCES users(user_id),
                FOREIGN KEY (fixing_item) REFERENCES items(item_id)
            )
        `)];
    }

    static async createProviderTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS providers   
            (
                provider_id INT AUTO_INCREMENT PRIMARY KEY,
                provider_title VARCHAR(50),
                provider_username VARCHAR(50),
                provider_password VARCHAR(50),
                landmark VARCHAR(50),
                address VARCHAR(50),
                phone_number TEXT,
                provider_item INT,
                min_price INT,
                max_price INT,
                in_service VARCHAR(3),
                FOREIGN KEY (provider_item) REFERENCES items(item_id) 
            )
        `)];
    }

    static async createEventStatusTable() {
        return [await pool.query(`
            CREATE TABLE IF NOT EXISTS current_event  
            (
                event_id INT AUTO_INCREMENT PRIMARY KEY,
                event_consumer_id INT,
                event_provider_id INT,
                event_item_id INT,
                status VARCHAR(255),
                event_timestamp VARCHAR(100),
                FOREIGN KEY (event_consumer_id) REFERENCES consumers(id),
                FOREIGN KEY (event_provider_id) REFERENCES providers(provider_id),
                FOREIGN KEY (event_item_id) REFERENCES items(item_id) 
            )
        `)];
    }

}
