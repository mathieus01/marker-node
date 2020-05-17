"use strict";

const { test, trait, before } = use("Test/Suite")("Patient Controller");
const User = use("App/Models/User");
const Group = use("App/Models/Group");
const Patient = use("App/Models/Patient");
const Mail = use("Mail");

trait("Test/ApiClient");
trait("Auth/Client");

before(async () => {
  Mail.fake();

  const user = await User.create({
    username: "patient-controller-test",
    email: "patient-controller-test@gmail.com",
    password: "123",
    gender: "M"
  });

  const group = await Group.create({
    name: "group-test",
    description: "group-test",
    owner_id: user.id
  });

  await group.users().attach([user.id]);

  Mail.restore();
});

test("store a patient", async ({ client }) => {
  const user = await User.findBy("email", "patient-controller-test@gmail.com");
  const group = await Group.findBy("owner_id", user.id);

  const response = await client
    .post(`/groups/${group.id}/patients`)
    .send({
      name: "Patient-Test",
      birthday: new Date(),
      phone: "123",
      gender: "M"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: "Patient-Test",
    phone: "123",
    gender: "M"
  });
});

test("update a patient", async ({ client }) => {
  const user = await User.findBy("email", "patient-controller-test@gmail.com");
  const group = await Group.findBy("owner_id", user.id);
  const patient = await Patient.findBy("name", "Patient-Test");

  const response = await client
    .put(`/groups/${group.id}/patients/${patient.id}`)
    .send({
      phone: "456"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: "Patient-Test",
    phone: "456",
    gender: "M"
  });
});

test("error on update a non existent patient", async ({ client }) => {
  const user = await User.findBy("email", "patient-controller-test@gmail.com");
  const group = await Group.findBy("owner_id", user.id);

  const response = await client
    .put(`/groups/${group.id}/patients/20`)
    .send({
      phone: "456"
    })
    .loginVia(user)
    .end();

  response.assertStatus(404);
  response.assertJSONSubset({
    err: {
      message: "Não é possivel alterar o usuario, usuario não encontrado"
    }
  });
});

test("find a list of a patient's by group", async ({ client, assert }) => {
  const user = await User.findBy("email", "patient-controller-test@gmail.com");
  const group = await Group.findBy("owner_id", user.id);

  const response = await client
    .get(`/groups/${group.id}/patients`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.length, 1);
});

test("find a specific a patient by group", async ({ client, assert }) => {
  const user = await User.findBy("email", "patient-controller-test@gmail.com");
  const group = await Group.findBy("owner_id", user.id);
  const patient = await Patient.findBy("name", "Patient-Test");

  const response = await client
    .get(`/groups/${group.id}/patients/${patient.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    name: "Patient-Test",
    phone: "456"
  });
});

test("delete a patient", async ({ client, assert }) => {
  const user = await User.findBy("email", "patient-controller-test@gmail.com");
  const group = await Group.findBy("owner_id", user.id);
  let patient = await Patient.findBy("name", "Patient-Test");

  const response = await client
    .delete(`/groups/${group.id}/patients/${patient.id}`)
    .loginVia(user)
    .end();

  patient = await Patient.findBy("name", "Patient-Test");

  response.assertStatus(204);
  assert.equal(patient, null);
});
