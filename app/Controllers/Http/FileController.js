"use strict";

const File = use("App/Models/File");
const Helpers = use("Helpers");

class FileController {
  async show({ params, response }) {
    const file = await File.findOrFail(params.id);

    response.download(Helpers.tmpPath(`uploads/${file.file}`));
  }

  async store({ request, params }) {
    try {
      if (!request.file("file")) return;

      const upload = request.file("file", { size: "2mb" });

      const fileName = `${Date.now()}.${upload.subtype}`;

      await upload.moveAll(Helpers.tmpPath("uploads"), file => {
        const fileName = `${Date.now()}.${file.subtype}`;

        File.create({
          file: fileName,
          name: file.clientName,
          type: file.type,
          subtype: file.subtype,
          surgery_id: params.surgery_id
        });

        return { name: fileName };
      });

      if (!upload.movedAll()) {
        throw upload.error();
      }
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Erro no upload de arquivos" } });
    }
  }

  async index({ params }) {
    const files = await File.query()
      .where({
        surgery_id: params.surgery_id
      })
      .fetch();

    return files;
  }

  async destroy({ params }) {
    const file = await File.findByOrFail({
      id: params.id,
      surgery_id: params.surgery_id
    });

    file.delete();
  }
}

module.exports = FileController;
