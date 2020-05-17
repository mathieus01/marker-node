"use strict";

const Youch = use("Youch");
const Env = use("Env");

const BaseExceptionHandler = use("BaseExceptionHandler");

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  async handle(error, { request, response }) {
    if (error.name === "ValidationException") {
      return response.status(error.status).send(error.messages);
    }
    if (Env.get("NODE_ENV") === "development") {
      const youch = new Youch(error, request.request);
      const errorJson = await youch.toJSON();

      return response.status(error.status).send(errorJson);
    }

    return response.send(error.status);
  }

  async report(error, { request }) {}
}

module.exports = ExceptionHandler;
