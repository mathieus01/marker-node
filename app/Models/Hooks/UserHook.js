"use strict";

const Mail = use("Mail");
const UserHook = (exports = module.exports = {});

UserHook.activateAccount = async user => {
  const { username, email } = user;

  await Mail.send(
    "emails.activate_account",
    {
      username,
      token: user.token,
      url: `${user.redirect_url}/validate/${user.token}`
    },
    message => {
      message
        .to(email)
        .from("suporte@enfermagem.com")
        .subject("Ativação de Conta");
    }
  );
};
