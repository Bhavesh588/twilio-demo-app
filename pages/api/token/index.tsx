import path from "path";
import twilio from "twilio";
const AccessToken = twilio.jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const ChatGrant = AccessToken.ChatGrant;
require("dotenv").config;

const videoToken = (identity: string, room: string) => {
    let videoGrant;
    let chatGrant
    if (typeof room !== "undefined") {
        videoGrant = new VideoGrant({ room });
        chatGrant = new ChatGrant({
            serviceSid: process.env.TWILIO_CONVERSATIONS_SERVICE_SID,
        });
    } else {
        videoGrant = new VideoGrant();
    }
    const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY_SID,
        process.env.TWILIO_API_KEY_SECRET
    );
    // const token = generateToken(config);
    token.addGrant(videoGrant);
    token.addGrant(chatGrant);
    token.identity = identity;
    console.log(token);
    return token;
};

const sendTokenResponse = (token, identity, res) => {
    // res.set("Content-Type", "application/json");
    res.send({
        identity: identity,
        token: token.toJwt(),
    });
};

export default function handler(req, res) {
    if (req.method === "POST") {
        // Process a POST request
        const identity = req.body.user_identity;
        const room = req.body.room_name;
        const token = videoToken(identity, room);
        sendTokenResponse(token, identity, res);
    } else {
        // Handle any other HTTP method
    }
    // res.status(200).json({ name: "John Doe" });
}
