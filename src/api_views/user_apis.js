
import { UserEvents } from '../repository/users_repository.js'
import jsonwebtoken from 'jsonwebtoken'

// sign up API 
export async function SignUpUser(req, res) {
    console.log("sign up API")
    // console.log("req: ", req.body.user_name, req.body.password)
    try {
        if (await UserEvents.validateSignUpUser(req.body.user_name, req.body.password)) {
            const createUser = await UserEvents.createUser(req.body.user_name, req.body.password, req.body.phone_number, req.body.name)
            if (createUser.status == "OK") {
                res.status(201).json({ 'status': "Success", 'message': "user signed up successfully" })
            } else {
                res.status(400).json({ 'status': "failure", 'message': "bad request" });
            }
        } else {
            res.status(400).json({ 'status': "failure", 'message': "user cannot sign in" });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}

// login API 
export async function LoginUser(req, res) {
    console.log("LOGIN API")
    try {
        if ((await UserEvents.verifyUserLogin(req.body.user_name, req.body.password)).status === "OK") {
            res.status(200).json({ 'status': "success", 'message': "user logged in" });
        } else {
            res.status(404).json({ 'status': "failure", 'message': "invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }

}

// user info API
export async function UserInfo(req, res) {
    try {
        if ((await UserEvents.verifyUserLogin(req.body.user_name, req.body.password)).status === "OK") {
            if ((await UserEvents.addUserInformation(req.body.address, req.body.landmark, req.body.user_name)).status === "OK") {
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
}
