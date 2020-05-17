"use strict";

const { test, trait, before } = use("Test/Suite")("Group Controller");
const User = use("App/Models/User");
const Group = use("App/Models/Group");
const Mail = use("Mail");

trait("Test/ApiClient");
trait("Auth/Client");

before(async () => {
  Mail.fake();
  await User.create({
    username: "Nunes",
    email: "nunes@gmail.com",
    password: "123",
    gender: "M",
    activated: true
  });

  Mail.restore();
});

test("store groups", async ({ client }) => {
  const user = await User.findBy("email", "nunes@gmail.com");

  const response = await client
    .post(`/groups`)
    .send({
      name: "Group Name",
      description: "some description"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: "Group Name",
    description: "some description"
  });
});

test("update groups", async ({ client }) => {
  const user = await User.findBy("email", "nunes@gmail.com");
  const group = await Group.findBy("owner_id", user.id);

  const response = await client
    .put(`groups/${group.id}/`)
    .send({
      name: "new Group Name"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: "new Group Name"
  });
});

test("find all groups", async ({ client }) => {
  const user = await User.findBy("email", "nunes@gmail.com");
  const response = await client
    .get("groups")
    .loginVia(user)
    .end();

  response.assertStatus(200);
});
test("find one group", async ({ client }) => {
  const user = await User.findBy("email", "nunes@gmail.com");
  const group = await Group.findBy("owner_id", user.id);

  const response = await client
    .get(`groups/${group.id}/`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: "new Group Name"
  });
});

test("list all groups where authenticate user is on", async ({
  client,
  assert
}) => {
  const user = await User.findBy("email", "nunes@gmail.com");

  const response = await client
    .get("groups/userGroups")
    .loginVia(user)
    .end();

  response.assertStatus(200);

  assert.equal(response.body.length, 1);
});

test("remove users of a specific group", async ({ client, assert }) => {
  const user = await User.findBy("email", "nunes@gmail.com");
  let group = await Group.findBy("owner_id", user.id);

  const response = await client
    .delete(`groups/${group.id}/removeUser`)
    .send({
      users: [user.id]
    })
    .loginVia(user)
    .end();

  group = await Group.find(group.id);

  await group.load("users");
  response.assertStatus(200);

  assert.equal(group.users.length, 0);
});

test("add user to a specific group", async ({ client, assert }) => {
  const user = await User.findBy("email", "nunes@gmail.com");
  let group = await Group.create({
    name: "addUserExampleGroup",
    description: "test",
    owner_id: user.id
  });

  const response = await client
    .post(`groups/${group.id}/addUserToGroup`)
    .send({
      users: [user.id]
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.users.length, 1);
});

test("error in add user to a non existent group", async ({
  client,
  assert
}) => {
  const user = await User.findBy("email", "nunes@gmail.com");

  const response = await client
    .post(`groups/10000000000/addUserToGroup`)
    .send({
      users: [user.id]
    })
    .loginVia(user)
    .end();

  response.assertStatus(404);
  response.assertJSONSubset({
    err: {
      message: "Não foi possivel adicionar o usuario, grupo não encontrado"
    }
  });
});
test("error in user without authorization to delete a group", async ({
  client,
  assert
}) => {
  const user = await User.findBy("email", "nunes@gmail.com");

  const response = await client
    .delete(`groups/100000000`)
    .loginVia(user)
    .end();

  response.assertStatus(403);
  response.assertJSONSubset({
    err: {
      message: "Você não tem autorização para excluir esse grupo"
    }
  });
});
test("delete a group", async ({ client, assert }) => {
  const user = await User.findBy("email", "nunes@gmail.com");
  let group = await Group.create({
    name: "deleteGroup",
    description: "test",
    owner_id: user.id
  });

  const response = await client
    .delete(`groups/${group.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(204);
});
