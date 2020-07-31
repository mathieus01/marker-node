'use strict';

const Surgery = use('App/Models/Surgery');
const Patient = use('App/Models/Patient');
const moment = require('moment');

class SurgeryController {
  async store({ request, response, params }) {
    const data = request.only(['type', 'cause', 'date', 'location', 'id', 'patient_id']);
    const { procedures } = request.only(['procedures']);

    try {
      const surgery = await Surgery.create(data);

      if (procedures && procedures.length > 0) {
        await surgery.procedures().attach(procedures);
      }

      await surgery.load('procedures');

      return surgery;
    } catch (e) {
      return { err: e };
    }
  }

  async update({ params, request, response }) {
    const data = request.only(['type', 'cause', 'date', 'location', 'id', 'patient_id']);
    const { procedures } = request.only(['procedures']);

    const surgery = await Surgery.findBy({
      id: params.id,
    });

    if (!surgery) {
      return response.status(404).send({
        error: {
          message: 'Não é possivel alterar o usuario, Usuario não encontrado',
        },
      });
    }

    surgery.merge(data);

    if (procedures && procedures.length > 0) {
      surgery.procedures().sync(procedures);
    }

    await surgery.save();

    return surgery;
  }

  async index({ request, response, params }) {
    const { page, patient, dtSurgery } = request.get();

    let filter = {};

    if (patient) {
      filter = { ...filter, patient_id: patient };
    }

    if (dtSurgery) {
      filter = { ...filter, date: new Date(new Date(dtSurgery).toDateString()) };
    }
    const surgeries = await Surgery.query().with('procedures').where(filter).orderBy('id', 'desc').paginate(page);

    return surgeries;
  }

  async show({ params, request, response, view }) {
    const surgery = await Surgery.findBy({
      id: params.id,
    });

    if (!surgery) {
      return response.status(404).send({ error: { message: 'Cirurgia não encontrada' } });
    }

    await surgery.load('files');

    return surgery;
  }

  async destroy({ params, request, response }) {
    const surgery = await Surgery.findBy({
      id: params.id,
    });

    if (!surgery) {
      return response.status(404).send({
        error: {
          message: 'Não foi possivel excluir cirurgia, Cirurgia não encontrada',
        },
      });
    }

    await surgery.delete();
  }

  async removeProcedures({ request, params }) {
    const { procedures } = request.only(['procedures']);

    const surgery = await Surgery.findByOrFail({
      id: params.surgery_id,
    });

    await surgery.procedures().detach(procedures);

    await surgery.load('procedures');

    return surgery;
  }

  async addProcedures({ request, params, response }) {
    const { procedures } = request.only(['procedures']);

    if (!procedures || procedures.length === 0)
      return response.status(403).send({ error: { message: 'Nenhum procedimento foi enviado' } });

    const surgery = await Surgery.findOrFail(params.surgery_id);

    await surgery.procedures().attach(procedures);

    await surgery.load('procedures');

    return surgery;
  }

  async getSchedule({ request, response, auth }) {
    const { id } = auth.user;
    const today = moment(new Date()).subtract(1, 'days');
    const dayWeek = new Date().getDay();

    const patients = await Surgery.query()
      .select('surgeries.*')
      .innerJoin('patients', 'patients.id', 'surgeries.patient_id')
      .innerJoin('groups', 'patients.group_id', 'groups.id')
      .innerJoin('user_group', 'groups.id', 'user_group.group_id')
      .where('user_group.user_id', id)
      .whereBetween('surgeries.date', [today, moment().add(6 - dayWeek, 'days')])
      .orderBy('surgeries.date', 'asc')
      .with('patient')
      .with('patient.group')
      .fetch();

    return patients;
  }
}

module.exports = SurgeryController;
