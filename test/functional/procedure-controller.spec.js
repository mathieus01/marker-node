"use strict";

const User = use("App/Models/User");
const Procedure = use("App/Models/Procedure");
const Mail = use("Mail");
const { test, trait, before } = use("Test/Suite")("Procedure Controller");

trait("Test/ApiClient");
trait("Auth/Client");

before(async () => {
  Mail.fake();

  await User.create({
    username: "procedure-test",
    email: "procedure@gmail.com",
    gender: "M",
    password: "123"
  });

  Mail.restore();
});

test("store procedure", async ({ client }) => {
  const user = await User.findBy("username", "procedure-test");

  const response = await client
    .post("procedures")
    .send({
      code: 1,
      name: "procedure-test",
      ch: "1.5",
      value: "10"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    code: 1,
    name: "procedure-test",
    ch: "1.5",
    value: "10"
  });
});

test("update procedure", async ({ client }) => {
  const user = await User.findBy("username", "procedure-test");
  const procedure = await Procedure.findBy("name", "procedure-test");

  const response = await client
    .put(`procedures/${procedure.id}`)
    .send({
      ch: "1.0"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    code: 1,
    name: "procedure-test",
    ch: "1.0",
    value: 10
  });
});

test("find all procedures", async ({ client, assert }) => {
  const user = await User.findBy("username", "procedure-test");

  const response = await client
    .get("procedures")
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.length, 1);
});

test("find a specific procedure", async ({ client, assert }) => {
  const user = await User.findBy("username", "procedure-test");
  const procedure = await Procedure.findBy("name", "procedure-test");

  const response = await client
    .get(`procedures/${procedure.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    code: 1,
    name: "procedure-test",
    ch: 1,
    value: 10
  });
});

test("delete a specific procedure", async ({ client, assert }) => {
  const user = await User.findBy("username", "procedure-test");
  let procedure = await Procedure.findBy("name", "procedure-test");

  const response = await client
    .delete(`procedures/${procedure.id}`)
    .loginVia(user)
    .end();

  procedure = await Procedure.findBy("name", "procedure-test");
  response.assertStatus(204);
  assert.equal(procedure, null);
});
