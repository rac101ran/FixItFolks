import express from 'express';

import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors';

import { SignUpUser, LoginUser, UserInfo } from './api_views/user_apis.js'
import { CustomerItemCreation } from './api_views/customer_apis.js'
import { ProviderSignUp, ProviderServiceAddition, ProviderLogin, GetProvidersForPriceRange, GetProvidersForService } from './api_views/provider_apis.js'
import { AddItem, AllServices } from './api_views/item_apis.js'

const app = express();
const socket_server = http.createServer(app);
const io = new Server(socket_server);


app.use(express.json());
app.use(cors())


// users API 
app.post('/users/signup', SignUpUser);
app.post('/users/login', LoginUser);
app.post('/users/user_info', UserInfo);

// customers API 
app.post('/customer-item-creation', CustomerItemCreation);

// providers API 
app.post('/provider/signup', ProviderSignUp);
app.post('/provider/login', ProviderLogin);
app.post('/provider/add-service-item', ProviderServiceAddition);
app.get('/service-provider', GetProvidersForService);
app.get('/service-provider/price-range', GetProvidersForPriceRange);

// items API
app.post('/items/add', AddItem);
app.get('/items/all', AllServices);

io.on("connection", (socket) => {
    console.log("connection: ");
    // customer places a request for the provider , request event name is established by => 'CUSTOMER_REQUEST - CUSTOMER_ID - PROVIDER_ID' 
    socket.on("CUSTOMER_REQUEST", (data) => {

        socket.emit(`SERVICE_REQUEST:${data.provider.providerID}`, data); // provider listens the request 
    });

    // provider accepts the request for customers , creates unique events by => 'PROVIDER_ACCEPTED'
    socket.on("PROVIDER_ACCEPTED", (data) => {

        socket.emit(`ACCEPTED_SERVICE:${data.customer.customerID}`, data);  // customer listens the accepted service emitted from the providers
    });
});


socket_server.listen(3000, () => { console.log(`WebSocket server is running on port 3000`); });

app.listen(3001, () => { console.log("Server is running on port 3001"); });

