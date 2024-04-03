import {
    google
} from 'googleapis'
import jwt from 'jsonwebtoken'
import {
    findFirst,
    insertOne
} from '../repository/baseRepository.js';
import {
    tbl_user
} from '../utils/prismaSchema.js';

const callbackGoogle = async (req, res) => {

    const oauthClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'http://localhost:8080/api/service-vascomm/auth/google/callback'
    )

    const {
        code
    } = req.query;
    try {

        const {
            tokens
        } = await oauthClient.getToken(code)

        oauthClient.setCredentials(tokens)

        const oauth = google.oauth2({
            auth: oauthClient,
            version: "v2"
        })

        const {
            data
        } = await oauth.userinfo.get();

        let existing = await findFirst(tbl_user, {
            where: {
                email: data?.email
            }
        })

        let token;
        if (existing !== null) {
            token = await jwt.sign(existing, process.env.JWT_SECRET)
            return res.jsonf(200, true, "Successfully", {token : token})
        }

        // create user
        let payload = {
            email: data.email,
            name : data.name,
            role: 'user',
            status : 'active'
        }

        let newUser = await insertOne(tbl_user, payload)
        token = await jwt.sign(newUser, process.env.JWT_SECRET)
        return res.jsonf(200, true, "Successfully", {token : token})

    } catch (error) {
        console.log(error);
        return res.jsonf(500, false, "Internal Server Error")
    }
}

export {
    callbackGoogle
}