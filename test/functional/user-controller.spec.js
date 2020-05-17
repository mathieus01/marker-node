"use strict";

const { test, trait } = use("Test/Suite")("UserController");
const User = use("App/Models/User");
const Mail = use("Mail");

trait("Test/ApiClient");
trait("Auth/Client");

test("create a user", async ({ client }) => {
  Mail.fake();

  const response = await client
    .post("/users")
    .send({
      username: "Matheus",
      email: "matheus@gmail.com",
      password: "123",
      gender: "M"
    })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    username: "Matheus",
    email: "matheus@gmail.com",
    gender: "M"
  });

  Mail.restore();
});

test("do not create a user", async ({ client }) => {
  const response = await client
    .post("/users")
    .send({})
    .end();

  response.assertStatus(400);
});

test("activateUser", async ({ client, assert }) => {
  let user = await User.findBy("email", "matheus@gmail.com");

  const response = await client.get(`/accounts?token=${user.token}`).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    msg: "conta ativada"
  });

  user = await User.findBy("email", "matheus@gmail.com");

  assert.equal(user.activated, 1);
});

test("update user account", async ({ client, assert }) => {
  let user = await User.findBy("email", "matheus@gmail.com");

  const response = await client
    .put(`/users/${user.id}`)
    .send({
      username: "Matheus Nunes"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    username: "Matheus Nunes"
  });
});
test("error in update user account", async ({ client, assert }) => {
  let user = await User.findBy("email", "matheus@gmail.com");

  const response = await client
    .put(`/users/1`)
    .send({
      username: "Matheus Nunes"
    })
    .loginVia(user)
    .end();

  response.assertStatus(403);
  response.assertJSONSubset({
    err: {
      message: "Não é possivel alterar um usuario que não seja o seu"
    }
  });
});
