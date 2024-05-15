import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
import Post from "../models/post_model";
import { Express } from "express";
import User from "../models/user_model";
// import Student from "../models/student_model";

let app: Express;


const testUser = {
    email: 'test.auth@gmail.com',
    password: '123456',
    tokens: [],
    faculty: "Software Engineering",
    year: 2,
    profile_picture: "C:/Users/moyal/Desktop/elyaaaa.png",
    full_name: "Elya Atia",
    gender: "Male",
    _id: null,
    posts: [],
    accessToken: ""
};




beforeAll(async () => {
    app = await appInit();
    console.log("beforeAll");
    await Post.deleteMany();
    await User.deleteMany({ email: testUser.email });
    await request(app).post("/auth/register").send(testUser);
    const res = await request(app).post("/auth/login").send(testUser);
    testUser.accessToken = res.body.accessToken;
    const user = await User.findOne({ email: testUser.email })
    testUser._id = user._id;

    // testUser.student = res.body.user.student;
});

afterAll(async () => {
    console.log("afterAll");
    await mongoose.connection.close();
});



describe("Post tests", () => {
   

    const post = {
        owner: testUser._id,
        message: "test message",
        date: Date.now(),
        image: "test/image/path/1.jpg"
    }

    test("Post /post", async () => {
        
        const res = await request(app).post("/post/upload")
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send(post);
        expect(res.statusCode).toBe(201);
    });

    test("Get /my/post - my posts", async () => {
        const res = await request(app).get("/post/my/posts").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("Get /all/post - all posts", async () => {
        const res = await request(app).get("/post/all/posts").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
    });

    test("Put /posts/:_pid", async () => {
        const res = await request(app).get("/post/my/posts").set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        const post = data[0];
        const res2 = await request(app).put("/post/" + post._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken)
            .send({ message: "updated message"});
        expect(res2.statusCode).toBe(200);   
    });


    test("Delete /post/:_pid", async () => {
        const res = await request(app).get("/post/my/posts")
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res.statusCode).toBe(200);
        const data = res.body;
        const post = data[0];
        const res2 = await request(app).delete("/post/" + post._id)
            .set('Authorization', 'Bearer ' + testUser.accessToken);
        expect(res2.statusCode).toBe(200);

    });

  


    // test("Delete /post/:_pid", async () => {
    //     const res = await request(app).get("/post");
    //     expect(res.statusCode).toBe(200);
    //     const data = res.body;
    //     const post = data[0];
    //     const res2 = await request(app).delete("/post/" + post._pid)
    //         .set('Authorization', 'Bearer ' + testUser.accessToken);
    //     expect(res2.statusCode).toBe(200);
    // });


});
