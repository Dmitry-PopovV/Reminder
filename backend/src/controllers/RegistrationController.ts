import { Request, Response } from "express";
import { google } from "googleapis";
import { config } from "dotenv";
import { User } from "../entity/User";
config({ path: '../src/env/.env' });

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

google.options({ auth: oauth2Client });

const people = google.people('v1');

export async function RegistrationController(req: Request, res: Response) {
    const { tokens } = await oauth2Client.getToken(req.body.code);
    oauth2Client.setCredentials(tokens);

    const info = await people.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names',
    });
    console.log(info.data);

    if (info.data.emailAddresses && info.data.names && info.data.emailAddresses[0].value && info.data.names[0].displayName) {
        const user = {
            email: info.data.emailAddresses[0].value,
            fullName: info.data.names[0].displayName
        }

        const db_user = new User();
        db_user.email = user.email;
        db_user.fullName = user.fullName;
        await User.insertIfNotExist(db_user);
        res.status(201).json(user);
    } else {
        throw new Error("Google send wrong data");
    }
}
