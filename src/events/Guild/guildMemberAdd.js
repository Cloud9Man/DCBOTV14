const { ChannelType, Message, Guild, EmbedBuilder } = require("discord.js");
const config = require("../../config");
const { log } = require("../../functions");
const GuildSchema = require("../../schemas/WelcomeChannelSchema");
const ExtendedClient = require("../../class/ExtendedClient");

const cooldown = new Map();

const WelcomeChannelSchema = require("../../schemas/WelcomeChannelSchema");

module.exports = {
  event: "guildMemberAdd",
  /**
   * @param {ExtendedClient} client
   * @param {import('discord.js').GuildMember} guildMember
   * @returns
   */
  run: async (client, guildMember) => {
    try {
      if (guildMember.user.bot) return;

      const welcomeConfigs = await WelcomeChannelSchema.find({
        guildId: guildMember.guild.id,
      })

      if (!welcomeConfigs.length) return;

      for (const welcomeConfig of welcomeConfigs) {
        const targetChannel = 
          guildMember.guild.channels.cache.get(welcomeConfig.channelId) || 
          (await guildMember.guild.channels.fetch (
            welcomeConfig.channelId
          ))
        
        if (!targetChannel) {
          WelcomeChannelSchema.findOneAndDelete({
            guildId: guildMember.guild.id,
            channelId: welcomeConfig.channelId,
          }). catch (() => {});
        }

        const customeMessage = welcomeConfig.customMessage || `Hiya {username}! Welcome to {server-name}!`;

        const welcomeMessage = customeMessage
          .replace('{mention-member}', `<@${guildMember.id}>`)
          .replace('{server-name}', guildMember.guild.name)
          .replace('{username}', guildMember.user.username)
          .replace('{member-count}', String(guildMember.guild.approximateMemberCount));

        const messages = [
          `Don't harrass others.`,
          `Welcome to CloudLand!`,
          `Check out the announcements.`,
          `Make a suggestion.`,
          `Go outside.`
        ]
        const randomMessage = messages[(Math.floor(Math.random() * messages.length))];

        log(`Someone joined. Message sent to ${targetChannel.name} (${targetChannel.id}), ${guildMember.user.username} (${guildMember.id}) joined. The message is "${welcomeMessage}"`, `server`);

        const welcomeEmbed = new EmbedBuilder()
          .setTitle(`New member!`)
          .setDescription(welcomeMessage)
          .setFields(
            { name: '<:CL_blueheart:1191056474118570156> User <:CL_blueheart:1191056474118570156>', value: `${guildMember.user.username} (${guildMember.id})`, inline: false },
            { name: '<:CL_blueheart:1191056474118570156> Welcome them <:CL_blueheart:1191056474118570156>', value: `Don't forget to be welcoming to them!`, inline: false }
          )
          .setColor(config.colors.default)
          .setThumbnail(guildMember.displayAvatarURL())
          .setFooter({
            text: randomMessage
          })  

        targetChannel.send({ embeds: [welcomeEmbed] }).catch(() => {})
      }
    } catch (err) {
      log(`Error in ${__filename} \nError: ${err}`, 'err');
    }
  },
};
