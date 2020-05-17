"use strict";

class ForgotPassword {
  get rules() {
    return {
      email: "required|email"
    };
  }
}

module.exports = ForgotPassword;
