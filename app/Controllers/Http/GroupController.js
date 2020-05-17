'use strict';

const Group = use('App/Models/Group');
const User = use('App/Models/User');

class GroupController {
  async store({ request, response, auth }) {
    const data = request.only(['name', 'description']);
    data.owner_id = auth.user.id;

    const group = await Group.create(data);

    await group.users().attach([auth.user.id]);

    return group;
  }

  async update({ request, response, params }) {
    const data = request.only(['name', 'description', 'owner_id', 'users']);
    const group = await Group.findOrFail(params.id);

    group.merge(data);

    if (data.users && data.users.length > 0) {
      group.users().sync(users);
    }

    await group.save();

    await group.load('users');

    return group;
  }

  async index({ request, response, auth }) {
    const { page } = request.get();

    const groups = await Group.query().with('users').paginate(page);

    return groups;
  }

  async show({ request, response, auth, params }) {
    const group = await Group.findOrFail(params.id);

    await group.load('users');

    return group;
  }

  async removeUsers({ request, response, params }) {
    const { users } = request.only(['users']);

    if (users && users.length === 0) {
      return response.status(404).send({
        error: {
          message: 'Nenhum usuario informado',
        },
      });
    }

    const group = await Group.findOrFail(params.group_id);

    await group.users().detach(users);

    await group.load('users');

    return group;
  }

  async userGroups({ request, response, auth }) {
    const { page } = request.get();
    const user = await User.findOrFail(auth.user.id);
    const groups = await user.groups().with('users').with('owner').paginate(page, 12);

    return groups;
  }

  async addUserToGroup({ request, params, response }) {
    const { users } = request.only(['users']);

    const group = await Group.find(params.group_id);

    if (!group) {
      return response.status(404).send({
        error: {
          message: 'Não foi possivel adicionar o usuario, grupo não encontrado',
        },
      });
    }

    await group.users().attach(users);

    await group.load('users');

    return group;
  }

  async destroy({ params, response, auth }) {
    const group = await Group.find(params.id);

    if (!group || group.owner_id !== auth.user.id) {
      return response.status(403).send({
        error: { message: 'Você não tem autorização para excluir esse grupo' },
      });
    }

    await group.users().pivotQuery().delete();
    await group.delete();
  }
}

module.exports = GroupController;
