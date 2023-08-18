import { Console } from 'console';
import { ServiceEvents } from '../repository/service_event_repository.js'


export async function CreateEvent(req, res) {
    console.log(req.body.order_cost)
    try {
        const result = (await ServiceEvents.verifyServiceEvent(req.body.customer.customer_id, req.body.provider.provider_id, req.body.item.item_id))
        console.log("res", result)
        if (result === false) {
            if ((await ServiceEvents.createServiceEvent(req.body.customer.customer_id, req.body.provider.provider_id, req.body.item.item_id, req.body.order_cost))) {
                res.status(200).json({ 'status': "success", 'message': "service request has been initiated." });
            } else {
                res.status(301).json({ 'status': "success", 'message': "service request is not initiated" });
            }
        } else {
            res.status(400).json({ 'status': "failure", 'message': "bad request" });
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}

export async function UpdateEvent(req, res) {
    try {
        if ((await ServiceEvents.verifyServiceEvent(req.body.customer_id, res.body.provider_id, req.body.item_id))) {
            const response = await ServiceEvents.updateServiceEvent(req.body.customer_id, res.body.provider_id, req.body.item_id, req.body.status);
            if (response.status === "OK") {
                res.status(200).json({ 'status': "success", 'message': "service event has been updated.", 'data': response.data });
            } else {
                res.status(400).json({ 'status': "failure", 'message': "bad request" });
            }
        } else {
            res.status(400).json({ 'status': "failure", 'message': "bad request" });
        }
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}

export async function AllCurrentEvent(req, res) {
    try {
        res.status(200).json({ 'status': "success", 'message': "all events listed.", 'data': (await ServiceEvents.getAllEventsForUser(req.query.user_id)) })
    } catch (err) {
        res.status(500).json({ 'status': "failure", 'message': "internal server error" });
    }
}