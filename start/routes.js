"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use("Route");

//Criar Conta
Route.post("users", "UserController.store").validator("User");

//Login
Route.post("sessions", "SessionController.store");

//Ativar Conta
Route.get("accounts", "UserController.activateAccount");

//Esqueceu a senha - gerar token
Route.post("passwords", "ForgotPasswordController.store");

//Esqueceu a senha - alterar senha
Route.put("passwords", "ForgotPasswordController.update");

//Consultar Imagem
Route.get("files/:id", "FileController.show");

//Rotas autenticadas
Route.group(() => {
  //Alterar Usuario
  Route.put("users/:id", "UserController.update");

  Route.get("users/users-by-name", "UserController.usersByName");

  //Upload de imagens
  Route.post("surgeries/:surgery_id/files", "FileController.store");

  //Deletar Imagem
  Route.delete("surgeries/:surgery_id/files/:id", "FileController.destroy");

  //Lista de imagens por cirurgia
  Route.get("surgeries/:surgery_id/files", "FileController.index");

  //Lista de grupos do usuario logado
  Route.get("groups/userGroups", "GroupController.userGroups");

  //Remove usuario do grupo
  Route.post("groups/:group_id/removeUser", "GroupController.removeUsers");

  //Adicionar Usuario ao grupo
  Route.post(
    "groups/:group_id/addUserToGroup",
    "GroupController.addUserToGroup"
  );

  //CRUD Grupo
  Route.resource("groups", "GroupController").apiOnly();

  Route.get("patients/userPatients", "PatientController.getPatients");
  //CRUD Paciente
  Route.resource("patients", "PatientController").apiOnly();

  //CRUD Cirurgia
  Route.resource("surgeries", "SurgeryController").apiOnly();

  //Remover procedimentos da cirurgia
  Route.delete(
    "surgeries/:surgery_id/procedures",
    "SurgeryController.removeProcedures"
  );

  //Adicionar procedimentos a cirurgia
  Route.post(
    "surgeries/:surgery_id/procedures",
    "SurgeryController.addProcedures"
  );

  //CRUD Procedimentos
  Route.get("procedures", "ProcedureController.index");

  Route.get("schedule", "SurgeryController.getSchedule");
}).middleware(["auth"]);
