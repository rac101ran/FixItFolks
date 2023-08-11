import pool from '../databases/database.js'

// CREATION OF RELATIONAL TABLES
// export class FixItFolksTables {
//     static async createItemTable() {
//         return [await pool.query(`
//             CREATE TABLE IF NOT EXISTS items
//             ( 
//                 item_name VARCHAR(50),
//                 item_id INT PRIMARY KEY,
//                 image_url VARCHAR(200)    
//             )
//         `)];
//     }

//     static async createUserTable() {
//         return [await pool.query(`
//             CREATE TABLE IF NOT EXISTS users 
//             (  
//                 name VARCHAR(30),
//                 user_id INT AUTO_INCREMENT PRIMARY KEY,
//                 username VARCHAR(30), 
//                 password VARCHAR(20),
//                 phone_number TEXT,
//                 history INT,
//                 landmark varchar(200),
//                 address varchar(200),
//             )
//         `)];
//     }

//     static async createCustomerTable() {
//         return [await pool.query(`
//             CREATE TABLE IF NOT EXISTS customers (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 customer_id INT,
//                 fixing_item INT,
//                 FOREIGN KEY (customer_id) REFERENCES users(user_id),
//                 FOREIGN KEY (fixing_item) REFERENCES items(item_id)
//             )
//         `)];
//     }

//     static async createProviderTable() {
//         return [await pool.query(`
//             CREATE TABLE IF NOT EXISTS providers   
//             (
//                 provider_id INT AUTO_INCREMENT PRIMARY KEY,
//                 provider_title VARCHAR(50),
//                 provider_username VARCHAR(50),
//                 provider_password VARCHAR(50),
//                 landmark VARCHAR(50),
//                 address VARCHAR(50),
//                 phone_number TEXT,
//                 provider_item INT,
//                 min_price INT,
//                 max_price INT,
//                 in_service VARCHAR(3),
//                 FOREIGN KEY (provider_item) REFERENCES items(item_id) 
//             )
//         `)];
//     }

//     static async createEventStatusTable() {
//         return [await pool.query(`
//             CREATE TABLE IF NOT EXISTS current_event  
//             (
//                 event_id INT AUTO_INCREMENT PRIMARY KEY,
//                 event_consumer_id INT,
//                 event_provider_id INT,
//                 event_item_id INT,
//                 status VARCHAR(255),
//                 event_timestamp VARCHAR(100),
//                 FOREIGN KEY (event_consumer_id) REFERENCES consumers(id),
//                 FOREIGN KEY (event_provider_id) REFERENCES providers(provider_id),
//                 FOREIGN KEY (event_item_id) REFERENCES items(item_id) 
//             )
//         `)];
//     }

// }



// async function Script() {
//     //  const categoryScript = ["Home Appliances", "Home furniture", "Electronic Gadgets", "Massage Therapy", "Cosmetics", "Plumbing", "Interior Design"]
//     const items = [

//         { item_id: 42, service_id: 2, item_name: 'Bookshelf' },
//         { item_id: 43, service_id: 2, item_name: 'Dining Table' },
//         { item_id: 44, service_id: 2, item_name: 'Couch' },
//         { item_id: 45, service_id: 2, item_name: 'Dresser' },
//         { item_id: 46, service_id: 2, item_name: 'Nightstand' },
//         { item_id: 47, service_id: 2, item_name: 'Shoe Rack' },
//         { item_id: 48, service_id: 3, item_name: 'Smartwatch' },
//         { item_id: 49, service_id: 3, item_name: 'Tablet' },
//         { item_id: 50, service_id: 3, item_name: 'Camera' },
//         { item_id: 51, service_id: 3, item_name: 'Headphones' },
//         { item_id: 52, service_id: 3, item_name: 'Gaming Console' },
//         { item_id: 53, service_id: 4, item_name: 'Aromatherapy Diffuser' },
//         { item_id: 54, service_id: 4, item_name: 'Hot Stone Set' },
//         { item_id: 55, service_id: 4, item_name: 'Massage Oil' },
//         { item_id: 56, service_id: 5, item_name: 'Eyeshadow Palette' },
//         { item_id: 57, service_id: 5, item_name: 'Lip Gloss' },
//         { item_id: 58, service_id: 5, item_name: 'Blush' },
//         { item_id: 59, service_id: 6, item_name: 'Sump Pump' },
//         { item_id: 60, service_id: 6, item_name: 'Water Heater' },
//         { item_id: 61, service_id: 6, item_name: 'Garbage Disposal' },
//         { item_id: 62, service_id: 7, item_name: 'Clock' },
//         { item_id: 63, service_id: 7, item_name: 'Picture Frame' },
//         { item_id: 64, service_id: 7, item_name: 'Sculpture' }
//     ];
//     for (let i = 0; i < items.length; i++) {
//         await pool.query('INSERT INTO items (item_name,service) VALUES(?,?)', [items[i].item_name, items[i].service_id])
//     }
// }

// Script()



// ALTER TABLE items ADD COLUMN service INT, ADD CONSTRAINT fk_service FOREIGN KEY (service) REFERENCES ServiceCategory(service_id);


