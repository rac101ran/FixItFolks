import express from 'express';

import { SignUpUser, LoginUser, UserInfo } from './api_views/user_apis.js'
import { CustomerItemCreation } from './api_views/customer_apis.js'
import { ProviderSignUp, ProviderServiceAddition } from './api_views/provider_apis.js'


const app = express();
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



app.listen(3001, () => { console.log("Server is running on port 3001"); });
