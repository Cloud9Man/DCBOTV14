const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");
const { ActivityType, EmbedBuilder } = require("discord.js");
const config = require("../../config");

const StartedSchema = require("../../schemas/StartedSchema");

module.exports = {
  event: "ready",
  once: true,
  /**
   *
   * @param {ExtendedClient} _
   * @param {import('discord.js').Client<true>} client
   * @returns
   */
  run: async (_, client) => {
    log(
      `Logged in as: ${client.user.displayName}. The client is now ready for work!`,
      "bot"
    );

    log(`Status has been set for ${client.user.displayName}!`, "bot");

    try {
      let bot = await StartedSchema.findOne({ botID: client.user.id });

      if (!bot) {
        bot = new StartedSchema({
          botID: client.user.id,
          startedTimes: 0,
        })
      }

      bot.startedTimes += 1;

      await bot.save();

      log(`The bot has been started for the ${bot.startedTimes.toString()}. time!`, `bot`);
    } catch (error) {
      log(`Oops! Something went wrong! Error: ${error}`, "err");
    }
  },
};
