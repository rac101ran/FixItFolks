import express from 'express';

import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors';

import { SignUpUser, LoginUser, UserInfo } from './api_views/user_apis.js'
import { CustomerItemCreation } from './api_views/customer_apis.js'
import { ProviderSignUp, ProviderServiceAddition, ProviderLogin, GetProvidersForPriceRange, GetProvidersForService, HighestRatedProviders, GetProvidersByLowestPrice } from './api_views/provider_apis.js'
import { AddItem, AllServices, AllItemsForService } from './api_views/item_apis.js'
import { CreateEvent, UpdateEvent } from './api_views/events_apis.js'
import { verifyJWT } from './utils/jwt_auth.js'

const app = express();
const socket_server = http.createServer(app);
const io = new Server(socket_server);


app.use(express.json());
app.use(cors())


// users API 
app.post('/users/signup', SignUpUser);
app.get('/users/login', LoginUser);
app.post('/users/user_info', UserInfo);

// customers API 
app.post('/customer-item-creation', verifyJWT, CustomerItemCreation);

// providers API 
app.post('/provider/signup', ProviderSignUp);
app.post('/provider/login', verifyJWT, ProviderLogin);
app.post('/provider/add-service-item', ProviderServiceAddition);
app.get('/service-provider', GetProvidersForService);
app.get('/service-provider/price-range', GetProvidersForPriceRange);
app.get('/highest-rated-providers', HighestRatedProviders);
app.get('/lowest-price', GetProvidersByLowestPrice);

// items API
app.post('/items/add', AddItem);
app.get('/items/all', AllServices);
app.get('/items/service', AllItemsForService);

// event services API
app.post('/service-event/add', CreateEvent);
app.post('/service-event/update', UpdateEvent);



io.on("connection", (socket) => {
    console.log("connection: ");
    // customer places a request for the provider , request event name is established by => 'CUSTOMER_REQUEST - CUSTOMER_ID - PROVIDER_ID' 
    socket.on("CUSTOMER_REQUEST", (data) => {
        console.log("data:", data)
        try {
            console.log(data.provider.providerID)
            io.emit(`SERVICE_REQUEST:${data.provider.providerID}`, data); // provider listens the request 
        } catch (err) {
            console.log(err);
        }

    });

    // provider accepts the request for customers , creates unique events by => 'PROVIDER_ACCEPTED'
    socket.on("PROVIDER_ACCEPTED", (data) => {
        try {
            io.emit(`ACCEPTED_SERVICE:${data.customer.customerID}`, data);  // customer listens the accepted service emitted from the providers
        } catch (err) {
            console.log(err);
        }
    });
});


socket_server.listen(3000, () => { console.log(`WebSocket server is running on port 3000`); });

app.listen(3001, () => { console.log("Server is running on port 3001"); });





