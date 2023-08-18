import { Items } from '../repository/items_repository.js'
import { CustomerEvents } from '../repository/customer_repository.js'


export async function CustomerItemCreation(req, res) {
    let createdCustomerItems = 0;
    try {
        for (let item = 0; item < req.body.fixing_items.length; item++) {
            if (((await Items.verifyItem(req.body.fixing_items[item])).status === "OK") && (await CustomerEvents.verifyCustomerForCreation(req.body.customer_id, req.body.fixing_items[item]))) {
                if ((await CustomerEvents.createCustomer(req.body.customer_id, req.body.fixing_items[item])).status === "OK") {
                    createdCustomerItems++;
                }
            } else {
                console.log("user maybe already taking this service or item not present")
                continue;
            }
        }
        if (createdCustomerItems > 0) {
            res.status(201).json({ 'status': "success", 'data': { 'created_customers_item': createdCustomerItems }, 'message': "customer items created" });
        } else {
            res.status(200).json({ 'status': "success", 'data': { 'created_customers_item': 0 }, 'message': "no customer item created" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }

}

