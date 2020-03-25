import { Command as C } from "@types";

export = {
  config: {
    name: "giveaway",
    role: "moderator",
    help: {
      description: `Giveaway commands
      can
      this
      have
      newlines?`.replace(/\t+/g, ""),
      category: "fun"
    }
  },
  async run (client, message, args) {

  }
} as C.Command;
