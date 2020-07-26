'use strict';
const Database = use('Database');
const Patient = use('App/Models/Patient');

class PatientController {
  async store({ request, response, params }) {
    const data = request.all();

    const patient = await Patient.create(data);

    return patient;
  }

  async update({ params, request, response }) {
    const data = request.all();

    const patient = await Patient.findBy({
      id: params.id,
    });

    if (!patient) {
      return response.status(404).send({
        err: {
          message: 'Não é possivel alterar o usuario, usuario não encontrado',
        },
      });
    }

    patient.merge(data);
    await patient.save();

    return patient;
  }

  async index({ request, response, params }) {
    const { page } = request.get();
    const patients = await Patient.query().paginate(page);

    return patients;
  }

  async getPatients({ request, response, auth }) {
    const { id } = auth.user;
    const { page } = request.get() || 1;
    const patients = await Patient.query()
      .select('patients.*')
      .innerJoin('groups', 'patients.group_id', 'groups.id')
      .innerJoin('user_group', 'groups.id', 'user_group.group_id')
      .where('user_group.user_id', id)
      .with('group')
      .paginate(page, 20);

    return patients;
  }

  async show({ params, request, response, view }) {
    const patient = await Patient.findByOrFail({
      id: params.id,
    });

    await patient.load('group');
    return patient;
  }

  async destroy({ params, request, response }) {
    const patient = await Patient.findByOrFail({
      id: params.id,
    });

    await patient.delete();
  }
}

module.exports = PatientController;
