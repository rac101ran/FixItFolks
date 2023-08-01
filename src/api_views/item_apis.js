import dotenv from 'dotenv'
dotenv.config()

import { Items } from '../repository/items_repository.js'


export async function AddItem(req, res) {
    try {
        if ((await Items.verifyForUniqueness(req.body.item_name)) && req.body.admin_username === process.env.ADMIN_USERNAME
            && req.body.admin_password === process.env.ADMIN_PASSWORD) {

            const result = await Items.createItems(req.body.item_name, req.body.item_url);
            if (result.status === "OK") {
                res.status(201).json({ 'status': "success", 'message': result.message });
            } else {
                res.status(400).json({ 'status': "failure", 'message': result.message });
            }
        } else {
            res.status(400).json({ 'status': "failure", 'message': "bad request" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}

export async function AllServices(req, res) {
    try {
        res.status(200).json({ 'status': 200, 'data': Items.getAllServiceItems() });
    } catch (err) {
        res.status(200).json({ 'status': 500, 'data': [] });
    }
}
