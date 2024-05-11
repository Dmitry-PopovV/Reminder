import request from "supertest";
import { AppDataSource } from "../data-source";
import { proceses as procesesP } from "../app";

type Proceses = {
    server: any,
    emailSendingJob: any
}

describe("User Router", () => {
    let proceses: Proceses;
    let cookie: string;
    beforeAll(async () => {
        proceses = (await procesesP) as Proceses;

        const res = await request(proceses.server)
            .post("/api/auth/registration")
            .send({
                code: "1000000000100000000010000000001000000000100000000010000000001000000000100"
            })
            .expect(201);
        cookie = res.header["set-cookie"];
    })

    afterAll(() => {
        proceses.server.close();
        proceses.emailSendingJob.stop();
        AppDataSource.destroy();
    })


    test("GET user", async () => {
        const response = await request(proceses.server)
            .get("/api/user")
            .set("Cookie", cookie)
            .expect(200);

        expect(response.body.email).toEqual('test@email.com');
    })
})
