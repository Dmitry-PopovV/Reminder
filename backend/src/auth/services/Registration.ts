import { google } from "googleapis";
import { config } from "dotenv";
import { User } from "../../entity/User";
config({ path: '../src/env/.env' });

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

google.options({ auth: oauth2Client });

const people = google.people('v1');

export async function Registration(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const info = await people.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses,names',
    });

    if (info.data.emailAddresses && info.data.names && info.data.emailAddresses[0].value && info.data.names[0].displayName) {
        const user = new User();
        user.email = info.data.emailAddresses[0].value;
        user.fullName = info.data.names[0].displayName;
        await User.insertIfNotExist(user);

        return { email: info.data.emailAddresses[0].value, fullName: info.data.names[0].displayName };
    } else {
        throw new Error("Google send wrong data");
    }
}
