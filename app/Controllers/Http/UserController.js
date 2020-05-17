"use strict";

const Database = use("Database");
const User = use("App/Models/User");
const Group = use("App/Models/Group");
const crypto = use("crypto");

class UserController {
  async store({ request, response }) {
    try {
      const data = request.only([
        "username",
        "password",
        "email",
        "gender",
        "redirect_url"
      ]);

      const trx = await Database.beginTransaction();

      data.token = crypto.randomBytes(10).toString("hex");
      data.token_created_at = new Date();

      const user = await User.create(data, trx);

      const group = await Group.create(
        {
          name: "Padrão",
          description: "",
          owner_id: user.id
        },
        trx
      );

      await trx.commit();

      await user.groups().attach([group.id], trx);
      await user.load("groups", trx);

      return user;
    } catch (err) {
      console.log(err.message);
      return response.status(403).send({
        error: {
          message: "Não foi possivel criar o usuario, tente novamente",
          msg: err.message
        }
      });
    }
  }

  async activateAccount({ request, response }) {
    const { token } = request.get();

    const user = await User.findByOrFail("token", token);

    if (user.activated) {
      return response.status(403).send({
        error: {
          message:
            "Sua conta ja se encontra ativada, faça o login normalmente pelo site"
        }
      });
    }

    user.token = null;
    user.token_created_at = null;
    user.redirect_url = null;
    user.activated = true;

    await user.save();

    return response.status(200).send({ msg: "conta ativada" });
  }

  async update({ request, response, params, auth }) {
    const data = request.only(["username", "password", "gender", "birthday"]);

    if (auth.user.id !== parseInt(params.id)) {
      return response.status(403).send({
        error: {
          message: "Não é possivel alterar um usuario que não seja o seu"
        }
      });
    }

    const user = await User.findOrFail(params.id);

    user.merge(data);

    await user.save();

    return user;
  }

  async usersByName({ request, response, params }) {
    const { username } = request.get("username");
    if (!username) {
      return response.status(404).send({
        error: {
          message: "Nenhum nome foi informado, informe o nome do usuario"
        }
      });
    }

    console.log(username);
    const users = await User.query()
      .where("username", "like", `%${username}%`)
      .fetch();

    return users;
  }
}

module.exports = UserController;
