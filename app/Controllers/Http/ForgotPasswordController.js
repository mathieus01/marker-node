"use strict";

const User = use("App/Models/User");
const Mail = use("Mail");
const crypto = use("crypto");
const moment = require("moment");

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      const email = request.input("email");

      const user = await User.findByOrFail("email", email);

      if (!user) {
        return response.status(404).send({
          error: { message: "Usuario não encontrado para o email informado" }
        });
      }

      user.token = crypto.randomBytes(10).toString("hex");
      user.token_created_at = new Date();

      await user.save();

      await Mail.send(
        "emails.forgot_password",
        { user, url: `${request.input("redirect_url")}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from("suporte@enfermagem.com")
            .subject("Recuperação de Senha");
        }
      );
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message:
            "Não foi possivel enviar a solicitação para troca de senha, tente novamente",
          err
        }
      });
    }
  }

  async update({ request, response }) {
    const { token, password } = request.only(["token", "password"]);

    const user = await User.findByOrFail("token", token);

    const expiredToken = moment()
      .subtract("2", "days")
      .isAfter(user.token_created_at);

    if (expiredToken) {
      return response.status(401).send({
        error: {
          message:
            "Token expirado, faça uma nova solicitaçao para a troca de senha"
        }
      });
    }

    user.token = null;
    user.token_created_at = null;
    user.password = password;
    await user.save();
  }
}

module.exports = ForgotPasswordController;
