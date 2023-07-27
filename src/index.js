import express from 'express';

import { Server } from 'socket.io'
import http from 'http'

import { SignUpUser, LoginUser, UserInfo } from './api_views/user_apis.js'
import { CustomerItemCreation } from './api_views/customer_apis.js'
import { ProviderSignUp, ProviderServiceAddition } from './api_views/provider_apis.js'


const app = express();
const socket_server = http.createServer(app);
const io = new Server(socket_server);


app.use(express.json());

// users API 
app.post('/users/signup', SignUpUser);
app.post('users/login', LoginUser);
app.post('users/user_info', UserInfo);

// customers API 
app.post('/customer-item-creation', CustomerItemCreation);

// providers API 
app.post('/provider/signup', ProviderSignUp);
app.post('/provider/add-service-item', ProviderServiceAddition);


io.on("connection", socket => {

    // customer places a request for the provider , request event name is established by => 'CUSTOMER_REQUEST - CUSTOMER_ID - PROVIDER_ID' 
    socket.on(/^CUSTOMER_REQUEST - (\d+) - (\d+)$/, data => {
        // provider listens the service order requests emitted by customers
        socket.broadcast.emit(`SERVICE_REQUEST - ${data.provider.provider_id}`, data);
    });

    // provider accepts the request for customers , creates unique events by => 'PROVIDER_ACCEPTED - CUSTOMER_ID - PROVIDER_ID'
    socket.on(/^PROVIDER_ACCEPTED - (\d+) - (\d+)$/, (data) => {
        // customer listens the accepted service emitted from the providers
        socket.broadcast.emit(`ACCEPTED_SERVICE - ${data.provider.provider_id}`, data);
    });
});


app.listen(3001, () => { console.log("Server is running on port 3001"); });
