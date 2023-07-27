import { Providers } from '../repository/providers_repository.js'
import { Items } from '../repository/items_repository.js'


// provider sign up API
export async function ProviderSignUp(req, res) {
    try {
        if ((await Providers.verifyProvider(req.user_name, req.provider_title)).status != "OK" && (await Items.verifyItem(req.provider_item)).status === "OK") {

            const response = await Providers.createProvider(req.provider_title, req.provider_username, req.provider_pass, req.landmark, req.address, req.phone_number,
                req.provider_item, req.min_price, req.max_price, req.in_service);

            if (response.status === "OK") {
                res.status(201).json({ 'status': "success", 'message': "provider's account created" })
            } else {
                req.status(400).json({ 'status': "failure", 'message': "bad request" });
            }
        } else {
            req.status(404).json({ 'status': "failure", 'message': "not found" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}

// provider service integration API 
export async function ProviderServiceAddition(req, res) {

    try {
        const login_response = await Providers.verifyProviderLogin(req.provider_username, req.provider_password);
        if (login_response.status === "OK") {
            let services_added = 0;
            for (let item = 0; item < req.provider_items.length; item++) {

                if ((await Providers.verifyItemService(req.provider_username, req.provider_items[item]["name"])).status != "OK") {

                    const response = await Providers.createProvider(login_response?.data.provider_title,
                        login_response?.data.provider_username, login_response?.data.provider_password, login_response?.data.landmark,
                        login?.data.address, login?.data.phone_number, req.provider_items[item]["name"], req.provider_items[item]["min_price"],
                        req.provider_items[item]["max_price"], req.in_service);
                    if (response.status === "OK") {
                        services_added++;
                    }
                }
            }

            if (services_added > 0) {
                res.status(201).json({ 'status': "success", 'data': { "created_services": services_added }, 'message': "services created" });
            } else {
                res.status(301).json({ 'status': "failure", 'data': {}, 'message': "no services created" });
            }
        } else {
            res.status(404).json({ 'status': "failure", 'message': "provider not logged in" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}