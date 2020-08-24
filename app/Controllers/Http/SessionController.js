'use strict';

const User = use('App/Models/User');

class SessionController {
  async store({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password']);

    const user = await User.findBy('email', email);

    if (!user) {
      return response.status(404).send({ err: 'Usuario não encontrado, verifique seu email' });
    }

    if (!user.activated) {
      return response.status(403).send({
        error: {
          message: 'Conta Inativa, por favor ative sua conta',
        },
      });
    }

    try {
      const isValid = await auth.attempt(email, password);

      return await auth.generate(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          gender: user.gender,
          birthday: user.birthday,
          avatar: user.avatar,
        },
        true
      );
    } catch (err) {
      return response.status(401).send({
        error: {
          message: 'Usuario ou Senha Incorreta',
        },
      });
    }
  }
}

module.exports = SessionController;
