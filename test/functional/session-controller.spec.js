"use strict";

const { test, trait, before } = use("Test/Suite")("SessionController");
const User = use("App/Models/User");

const Mail = use("Mail");
trait("Test/ApiClient");

before(async () => {
  Mail.fake();
  await User.create({
    username: "matheus2",
    email: "matheus2@gmail.com",
    password: "123",
    gender: "M",
    activated: true
  });

  Mail.restore();
});

test("authenticate user", async ({ client }) => {
  //teste

  const response = await client
    .post("/sessions")
    .send({
      email: "matheus2@gmail.com",
      password: "123"
    })
    .end();

  response.assertStatus(200);
});
