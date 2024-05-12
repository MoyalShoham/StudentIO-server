import request from "supertest";
import appInit from "../App";
import mongoose from "mongoose";
// import Student from "../models/student_model";
import { Express } from "express";
import User from "../models/user_model";

const testUser = {
  email: "test.student@gmail.com",
  password: "123456",
  accessToken: null,
  profile_picture: "uploads/elya.jpg",
  full_name: "Elya Atia",
  gender: "Male",
  posts: [],
  student: {
    faculty: "Software Engineering",
    year: 1
  },

}

let app: Express;
beforeAll(async () => {
  app = await appInit();
  console.log("beforeAll");
  await User.deleteMany({ email: testUser.email });
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.accessToken = res.body.accessToken;
});

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});



describe("Student", () => {
  // test("Get /student - empty collection", async () => {
  //   const res = await request(app).get("/student")
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res.statusCode).toBe(200);
  //   const data = res.body;
  //   expect(data).toEqual([]);
  // });

  // test("POST /student", async () => {
  //   const res = await request(app).post("/student")
  //     .send(students[0]).set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res.statusCode).toEqual(201);
  //   expect(res.body.name).toEqual(students[0].name);
  //   // studentId = res.body._id; // Save the ID for later tests
  //   const res2 = await request(app).get("/student")
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res2.statusCode).toBe(200);
  //   const data = res2.body;
  //   expect(data[0].name).toBe(students[0].name);
  //   // expect(data[0]._id).toBe(students[0]._id);
  //   expect(data[0].year).toBe(students[0].year);
  // });

  // test("GET /student/:id", async () => {
  //   const res = await request(app).get("/student")
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res.statusCode).toBe(200);
  //   const data = res.body;
  //   const studentId = data[0]._id;
  //   const res2 = await request(app).get(`/student/${studentId}`)
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res2.statusCode).toBe(200);
  //   expect(res2.body.full_name).toBe(testUser.full_name);
  // });

  // test("PUT /student/:id", async () => {
  //   const res = await request(app).get("/student")
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res.statusCode).toBe(200);
  //   const data = res.body;
  //   const studentId = data[0]._id;
  //   const res2 = await request(app).put(`/student/${studentId}`)
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res2.statusCode).toBe(400);
  // });

  // test("DELETE /student/:id", async () => {
  //   const res = await request(app).get("/student")
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res.statusCode).toBe(200);
  //   const data = res.body;
  //   const studentId = data[0]._id;
  //   const res2 = await request(app).delete(`/student/${studentId}`)
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res2.statusCode).toBe(200);
  //   const res3 = await request(app).get("/student")
  //     .set('Authorization', 'Bearer ' + testUser.accessToken);
  //   expect(res3.statusCode).toBe(200);
  //   const data2 = res3.body;
  //   expect(data2).toEqual([]);
  // });

});
