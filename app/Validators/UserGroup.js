"use strict";

class UserGroup {
  get rules() {
    return {
      users: "required"
    };
  }
}

module.exports = UserGroup;
