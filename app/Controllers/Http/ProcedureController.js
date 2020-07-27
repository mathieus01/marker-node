'use strict';

const Procedure = use('App/Models/Procedure');

class ProcedureController {
  async show({ params }) {
    const procedure = await Procedure.findBy('id', params.id);

    return procedure;
  }

  async index({ request }) {
    const { name } = request.get();

    const code = parseInt(name);

    let query = Procedure.query();

    if (!!name) {
      query = query.where('name', 'like', `%${name}%`);
    }

    if (!!name && !isNaN(code)) {
      query = query.orWhere('code', code);
    }

    const procedures = await query.fetch();

    return procedures;
  }

  async store({ request }) {
    const data = request.only(['code', 'name', 'ch', 'value']);

    const procedure = await Procedure.create(data);

    return procedure;
  }

  async update({ request, params }) {
    const data = request.only(['code', 'name', 'ch', 'value']);

    const procedure = await Procedure.findOrFail(params.id);

    procedure.merge(data);

    await procedure.save();

    return procedure;
  }

  async destroy({ params, response }) {
    const procedure = await Procedure.find(params.id);

    if (!procedure) {
      return response.status(404).send({
        error: {
          message: 'Não foi possivel excluir o procedimento, procedimento não encontrado',
        },
      });
    }

    await procedure.delete();
  }
}

module.exports = ProcedureController;
