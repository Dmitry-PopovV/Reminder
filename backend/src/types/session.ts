import "./a";

declare module "express-session" {
    interface SessionData {
        user: {
            email: string;
            fullName: string;
        };
    }
}
