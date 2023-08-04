import { Items } from '../repository/items_repository.js'
import { Providers } from '../repository/providers_repository.js'

import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// provider sign up API
export async function ProviderSignUp(req, res) {
    try {
        if ((await Providers.verifyProvider(req.body.provider_username, req.body.provider_title)).status != "OK" && (await Items.verifyItem(req.body.provider_item)).status === "OK") {
            const response = await Providers.createProvider(req.body.provider_title, req.body.provider_username, req.body.provider_password, req.body.landmark, req.body.address, req.body.phone_number,
                req.body.provider_item, req.body.min_price, req.body.max_price, req.body.in_service, 1);

            if (response.status === "OK") {
                res.status(201).json({ 'status': "success", 'message': "provider's account created" });
            } else {
                res.status(400).json({ 'status': "failure", 'message': "bad request" });
            }
        } else {
            res.status(404).json({ 'status': "failure", 'message': "provider username/title is registered already or service not found" });
        }
    } catch (err) {
        console.log("error: ", err);
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}

// provider login API
export async function ProviderLogin(req, res) {
    try {
        if ((await Providers.verifyProviderLogin(req.body.provider_username, req.body.provider_password)).status === "OK") {

            const token = jsonwebtoken.sign({ user_name: req.body.user_name }, process.env.SECRET_ACCESS_TOKEN, { expiresIn: '1h' });

            res.status(200).json({ 'status': "success", 'message': "provider logged in", 'token': token });
        } else {
            res.status(404).json({ 'status': "failure", 'message': "invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}


// provider service integration API 
export async function ProviderServiceAddition(req, res) {
    try {
        const login_response = await Providers.verifyProviderLogin(req.body.provider_username, req.body.provider_password);
        if (login_response && login_response.status === "OK") {
            let services_added = 0;
            for (let item = 0; item < req.body.provider_items.length; item++) {
                console.log(req.body.provider_items[item]["id"])
                if ((await Providers.verifyItemService(req.body.provider_username, req.body.provider_items[item]["id"])).status != "OK") {
                    console.log(req.body.provider_items[item]["id"])
                    const response = await Providers.createProvider(login_response?.data.provider_title,
                        login_response?.data.provider_username, login_response?.data.provider_password, login_response?.data.landmark,
                        login_response?.data.address, login_response?.data.phone_number, req.body.provider_items[item]["id"], req.body.provider_items[item]["min_price"],
                        req.body.provider_items[item]["max_price"], login_response?.data.in_service, 0);
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
            res.status(404).json({ 'status': "failure", 'message': "provider credentials doesn't exist" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}


// get all providers for a particular service
export async function GetProvidersForService(req, res) {
    try {
        res.status(200).json({ 'status': "success", 'data': { 'providers': await Providers.getProvidersForItem(req.query.provider_item) } });
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'data': { 'providers': await Providers.getProvidersForItem(req.query.provider_item) } });
    }
}

// get providers for a price range
export async function GetProvidersForPriceRange(req, res) {
    try {
        res.status(200).json({ 'status': "success", 'data': { 'providers': await Providers.getProviderForPriceRange(req.query.provider_item, req.query.min_price, req.query.max_price) } });
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'data': { 'providers': await Providers.getProviderForPriceRange(req.query.provider_item, req.query.min_price, req.query.max_price) } });
    }
}

// providers for a particular service with low costs
export async function GetProvidersByLowestPrice(req, res) {
    try {
        res.status(200).json({ 'status': "success", 'data': { 'providers': await Providers.getProvidersWithLowestCost(req.body.provider_item) } });
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'data': { 'providers': await Providers.getProvidersWithLowestCost(req.body.provider_item) } });
    }
}