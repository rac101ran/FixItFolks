import express from 'express';
import { UserEvents } from './repository/users_repository.js'

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
        res.status(404).json({ 'status': "failure", 'message': "not found" });
    }

});









app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
