import express from 'express';
import { UserEvents } from './repository/users_repository.js'
import { CustomerEvents } from './repository/customer_repository.js';
import { Items } from './repository/items_repository.js'
const app = express();
app.use(express.json());



// sign up API 
app.post('/signup', async (req, res) => {
    try {
        if (await UserEvents.validateSignUpUser(req.user_name, req.password)) {
            const createUser = await UserEvents.createUser(req.user_name, req.password)
            if (createUser.status == "OK") {
                res.status(201).json({ 'status': "Success", 'message': "user signed up successfully" })
            } else {
                res.status(400).json({ 'status': "failure", 'message': "bad request" });
            }
        } else {
            res.status(400).json({ 'status': "failure", 'message': "user cannot sign in" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }

});

// login API 
app.post('/login', async (req, res) => {
    try {
        if (await UserEvents.verifyUserLogin(req.user_name, req.password).status === "OK") {
            res.status(200).json({ 'status': "success", 'message': "user logged in" });
        } else {
            res.status(404).json({ 'status': "failure", 'message': "user not found" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }

});

// user info API
app.post('/user-info', async (req, res) => {
    try {
        if (await UserEvents.verifyUserLogin(req, res).status === "OK") {
            if ((await UserEvents.addUserInformation(req.address, req.landmark, req.user_name)).status === "OK") {
                res.status(200).json({ 'status': "Success", 'message': "user details updated successfully" })
            } else {
                res.status(400).json({ 'status': "failure", 'message': "user details not updated" });
            }
        } else {
            res.status(404).json({ 'status': "failure", 'message': "user not found" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
});

// customer item API 
app.post('/customer-item-creation', async (req, res) => {
    let createdCustomerItems = 0;
    try {
        for (let item = 0; item < req.fixing_items.length; item++) {
            if ((await CustomerEvents.verifyCustomerForCreation(req.customer_id, req.fixing_items[item])) && (await Items.verifyItem(req.fixing_items[item]))) {
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
        res.status(500).json({ 'status': "failure", 'message': "internal server error" })
    }

});


// provider item API 
app.post('/provider-signup', async (req,res) => {
    


});






















app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
