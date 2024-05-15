import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import { Express } from "express";
import User, {IUser} from "../models/user_model";
// import supertest from "supertest";


const user = {
    email: 'test.auth@gmail.com',
    password: '123456',
    tokens: [],
    student: {
        faculty: "Software Engineering",
        year: 2
    },
    profile_picture: "C:/Users/moyal/Desktop/elyaaaa.png",
    full_name: "Elya Atia",
    gender: "Male",
    _id: null,
    posts: []
}

let app: Express;
let accessToken = "";
let refreshToken = "";

beforeAll(async () => {
    app = await appInit();
    console.log("beforeAll");
    await User.deleteMany({ email: user.email });
});

afterAll(async () => {
    console.log("afterAll");
    await mongoose.connection.close();
});


describe("Auth test", () => {
    test("Post /register", async () => {
        const res = await request(app).post("/auth/register").send(user);
        expect(res.statusCode).toBe(200);
});

    test("Post /login", async () => {
        const res = await request(app).post("/auth/login").send(user);
        expect(res.statusCode).toBe(200);
        // console.log(res.body);
        // console.log(res.body);
        // const userRef = 
        user._id = res.body._id;
        console.log("user._id" + user._id);

        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();

        const res2 = await request(app).get("/student").set('Authorization', 'Bearer ' + accessToken);
        expect(res2.statusCode).toBe(200);

        const fakeToken = accessToken + "0";
        const res3 = await request(app).get("/student").set('Authorization', 'Bearer ' + fakeToken);
        expect(res3.statusCode).not.toBe(200);
    });


    const time_out = (ms: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    jest.setTimeout(100000);

    test("refresh token", async () => {
        const res = await request(app).post("/auth/login").send(user);
        expect(res.statusCode).toBe(200);
        console.log(res.body);

        //const accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        const res2 = await request(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();

        expect(res2.statusCode).toBe(200);
        accessToken = res2.body.accessToken;
        refreshToken = res2.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();

        const res3 = await request(app).get("/student")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res3.statusCode).toBe(200);


    });


    test("refresh token after expiration", async () => {
        //sleep 6 sec check if token is expired
        await time_out(6000);
        const res = await request(app).get("/student")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res.statusCode).not.toBe(200);

        const res1 = await request(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res1.statusCode).toBe(200);
        accessToken = res1.body.accessToken;
        refreshToken = res1.body.refreshToken;

        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();

        const res3 = await request(app).get("/student")
            .set('Authorization', 'Bearer ' + accessToken);
        expect(res3.statusCode).toBe(200);
    });
    
    test("refresh token violation", async () => {
        const res = await request(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        const oldRefreshToken = refreshToken;
        if (oldRefreshToken == res.body.refreshToken) {
            console.log("refresh token is the same");
        }
        expect(res.statusCode).toBe(200);
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
        expect(accessToken).not.toBeNull();
        expect(refreshToken).not.toBeNull();

        const res1 = await request(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + oldRefreshToken)
            .send();
        expect(res1.statusCode).not.toBe(200);

        const res2 = await request(app).get("/auth/refresh")
            .set('Authorization', 'Bearer ' + refreshToken)
            .send();
        expect(res2.statusCode).not.toBe(200);
    });


    // test edeit user
    // using supertest
    test("Put /auth/update/:id", async () => {
        return await request(app)
            .put(`/auth/update/${user._id}`)
            .send({
                email: user.email,
                password: user.password,
                full_name: "Elya Atia updated",
            })
            .expect(200);
    });


    test("Get /auth/logout/:id", async () => {
        const res = await User.find({ _id: user._id}) as IUser[];
        if (res[0].tokens.length > 0) {
            return await request(app)
            .get(`/auth/logout/${user._id}`)
            .set('Authorization', 'Bearer ' + refreshToken)
            .expect(200);
        } else {
            return await request(app)
            .get(`/auth/logout/${user._id}`)
            .set('Authorization', 'Bearer ' + refreshToken)
            .expect(400);
        }
       
        
    });

      // test logout
    //   test("logout", async () => {
    //     await request(app)
    //         .get("/auth/logout")
    //         .set('Authorization', 'Bearer ' + refreshToken)
    //         .expect(200);
    // });

    // test delete user


    //must be the last test!
    test("delete user", async () => {
        return await request(app)
            .delete(`/auth/delete/${user._id}`)
            .set('Authorization', 'Bearer ' + refreshToken)
            .expect(200);
    });


  


});
