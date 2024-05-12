import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import Post from "../models/post_model";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;


const testUser = {
    email: "post@gmail.com",
    password: "123456",
    accessToken: null
}


beforeAll(async () => {
    app = await appInit();
    console.log("beforeAll");
    await Post.deleteMany();
    await User.deleteMany({ email: testUser.email });
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
});

afterAll(async () => {
    console.log("afterAll");
    await mongoose.connection.close();
});



describe("Post tests", () => {
    test("Get /post - empty collection", async () => {
        const res = await request(app).get("/post");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data).toEqual([]);
    });

    const post = {
        title: "this is post title",
        message: "this is my post message ..... ",
        owner: "Moshe"
    }

    test("Post /post - empty collection", async () => {
        const res = await request(app).post("/post")
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send(post);
        expect(res.statusCode).toBe(201);
    });

    test("Get /post - not empty collection", async () => {
        const res = await request(app).get("/post");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        expect(data.length).toEqual(1);
    });

    test("Get /post/:_sid", async () => {
        const res = await request(app).get("/post");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        const post = data[0];
        const res2 = await request(app).get("/post/" + post._id);
        expect(res2.statusCode).toBe(200);
        expect(res2.body.title).toEqual(post.title);
    });

    test("Delete /post/:_pid", async () => {
        const res = await request(app).get("/post");
        expect(res.statusCode).toBe(200);
        const data = res.body;
        const post = data[0];
        const res2 = await request(app).delete("/post/" + post._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);
    });


});