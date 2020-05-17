"use strict";

const User = use("App/Models/User");
const Group = use("App/Models/Group");
const Patient = use("App/Models/Patient");
const Surgery = use("App/Models/Surgery");
const Procedure = use("App/Models/Procedure");
const Mail = use("Mail");
const { test, trait, before } = use("Test/Suite")("Surgery Controller");

trait("Test/ApiClient");
trait("Auth/Client");

before(async () => {
  Mail.fake();

  const user = await User.create({
    username: "user-test-surgeryController",
    email: "patient-controller-test-surgeryController@gmail.com",
    password: "123",
    gender: "M"
  });

  const group = await Group.create({
    name: "group-test-surgeryController",
    description: "group-test-surgeryController",
    owner_id: user.id
  });

  await group.users().attach([user.id]);

  const patient = await Patient.create({
    name: "patient-Test-surgeryController",
    birthday: new Date(),
    phone: "123",
    gender: "M",
    group_id: group.id
  });

  const procedure = await Procedure.create({
    code: 1,
    name: "test",
    ch: "1.4",
    value: "10"
  });

  Mail.restore();
});

test("store a surgery", async ({ client, assert }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );

  const response = await client
    .post(`/patients/${patient.id}/surgeries`)
    .send({
      date: new Date(),
      cause: "test-cause",
      text_report: "text-report"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    cause: "test-cause",
    text_report: "text-report"
  });
});

test("update a surgery", async ({ client }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );

  const surgery = await Surgery.findBy({
    cause: "test-cause"
  });

  const response = await client
    .put(`/patients/${patient.id}/surgeries/${surgery.id}`)
    .send({
      cause: "test-cause-update"
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    cause: "test-cause-update",
    text_report: "text-report"
  });
});

test("error in update a surgery", async ({ client }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );

  const response = await client
    .put(`/patients/${patient.id}/surgeries/100`)
    .send({
      cause: "test-cause-update"
    })
    .loginVia(user)
    .end();

  response.assertStatus(404);
  response.assertJSONSubset({
    err: {
      message: "Não é possivel alterar o usuario, Usuario não encontrado"
    }
  });
});

test("list all surgeries by specific patient", async ({ client, assert }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );

  const response = await client
    .get(`/patients/${patient.id}/surgeries`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.data.length, 1);
});

test("find a specific surgery by id and patient", async ({
  client,
  assert
}) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );

  const surgery = await Surgery.findBy({
    cause: "test-cause-update"
  });

  const response = await client
    .get(`/patients/${patient.id}/surgeries/${surgery.id}`)
    .loginVia(user)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    cause: "test-cause-update"
  });
});

test("find a non existent surgery and throw error", async ({ client }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );

  const response = await client
    .get(`/patients/${patient.id}/surgeries/100`)
    .loginVia(user)
    .end();

  response.assertStatus(404);
  response.assertJSONSubset({
    err: {
      message: "Cirurgia não encontrada"
    }
  });
});

test("add procedure to a surgery", async ({ client, assert }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );

  const surgery = await Surgery.findBy({
    cause: "test-cause-update"
  });

  const procedure = await Procedure.findBy("name", "test");

  const response = await client
    .post(`/surgeries/${surgery.id}/procedures`)
    .send({
      procedures: [procedure.id]
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.procedures.length, 1);
});

test("remove a procedure to a surgery", async ({ client, assert }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );

  const surgery = await Surgery.findBy({
    cause: "test-cause-update"
  });

  const procedure = await Procedure.findBy("name", "test");

  const response = await client
    .delete(`/surgeries/${surgery.id}/procedures`)
    .send({
      procedures: [procedure.id]
    })
    .loginVia(user)
    .end();

  response.assertStatus(200);
  assert.equal(response.body.procedures.length, 0);
});

test("remove a surgery", async ({ client, assert }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );
  let surgery = await Surgery.findBy({
    cause: "test-cause-update"
  });

  const response = await client
    .delete(`/patients/${patient.id}/surgeries/${surgery.id}`)
    .loginVia(user)
    .end();

  surgery = await Surgery.findBy({
    cause: "test-cause-update"
  });

  response.assertStatus(204);
  assert.equal(surgery, null);
});

test("error in remove a non existent surgery", async ({ client, assert }) => {
  const user = await User.findBy(
    "email",
    "patient-controller-test-surgeryController@gmail.com"
  );
  const patient = await Patient.findBy(
    "name",
    "patient-Test-surgeryController"
  );

  const response = await client
    .delete(`/patients/${patient.id}/surgeries/10`)
    .loginVia(user)
    .end();

  response.assertStatus(404);
  response.assertJSONSubset({
    err: {
      message: "Não foi possivel excluir cirurgia, Cirurgia não encontrada"
    }
  });
});
