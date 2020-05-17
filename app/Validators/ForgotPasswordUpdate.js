"use strict";

class ForgotPasswordUpdate {
  get rules() {
    return {
      token: "required",
      password: "required|confirmed"
    };
  }
}

module.exports = ForgotPasswordUpdate;
