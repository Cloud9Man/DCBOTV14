const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");
const { ActivityType, EmbedBuilder } = require("discord.js");
const config = require("../../config")

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
      "info"
    );

    log(`Status has been set for ${client.user.displayName}!`, "info");
    try {
      const embed = new EmbedBuilder()
        .setTitle("Online!")
        .setDescription("Yippeee! Cloud has finally turned me on! oh wait... i mean.. started me..")
        .setColor(config.colors.default)

      const channelID = '1191059794275094598';
      const logss = client.channels.cache.get(channelID);

      logss.send({ embeds: [ embed ] })
    } catch (error) {
      log(`Oops! Something went wrong! Error: ${error}`, "err");
    }
  },
};
