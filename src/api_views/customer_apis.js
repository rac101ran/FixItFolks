import { Items } from '../repository/items_repository.js'
import { CustomerEvents } from '../repository/customer_repository.js'





export async function CustomerItemCreation(req, res) {
    let createdCustomerItems = 0;
    try {
        for (let item = 0; item < req.fixing_items.length; item++) {
            if (((await Items.verifyItem(req.fixing_items[item])).status === "OK") && (await CustomerEvents.verifyCustomerForCreation(req.customer_id, req.fixing_items[item]))) {
                if ((await CustomerEvents.createCustomer(req.customer_id, req.fixing_items[item])).status === "OK") {
                    createdCustomerItems++;
                }
            } else {
                continue;
            }
        }
        if (createdCustomerItems > 0) {
            res.status(201).json({ 'status': "success", 'data': { 'created_customers_item': createdCustomerItems }, 'message': "customer items created" });
        } else {
            res.status(404).json({ 'status': "failure", 'data': {}, 'message': "no customer item created" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }

}