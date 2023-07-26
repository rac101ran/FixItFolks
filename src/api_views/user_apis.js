
import { UserEvents } from '../repository/users_repository.js'

// sign up API 
export async function SignUpUser(req, res) {
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
}

// login API 
export async function LoginUser(req, res) {
    try {
        if (await UserEvents.verifyUserLogin(req.user_name, req.password).status === "OK") {
            res.status(200).json({ 'status': "success", 'message': "user logged in" });
        } else {
            res.status(404).json({ 'status': "failure", 'message': "user not found" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }

}

// user info API
export async function UserInfo(req, res) {
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
}
