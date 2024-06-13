const { ChannelType, Message } = require("discord.js");
const config = require("../../config");
const { log } = require("../../functions");
const ExtendedClient = require("../../class/ExtendedClient");

//XP utils
const calculateLevelXP = require('../../calculateLevelXP');

//Schemas
const GuildSchema = require("../../schemas/GuildSchema");
const LevelSchema = require("../../schemas/LevelSchema");

const cooldown = new Map();

const cooldowns = new Set();

function getRandomXP(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  event: "messageCreate",
  /**
   *
   * @param {ExtendedClient} client
   * @param {Message<true>} message
   * @returns
   */
  run: async (client, message) => {
    if (message.author.bot || message.channel.type === ChannelType.DM) return;

    log(`${message.author.displayName} [ID: ${message.author.id} | Username: ${message.author.username}] sent a message: "${message.content}"`, "server");

    //XP AND LEVEL

    const xpToGive = getRandomXP(1, 15);

    try {
      if (cooldowns.has(message.author.id)) return;

      const schemaObject = {
        userId: message.author.id,
        guildId: message.guild.id
      }

      const levelProfile = await LevelSchema.findOne(schemaObject)

      if (levelProfile) {
        levelProfile.xp += xpToGive;

        if (levelProfile.xp > calculateLevelXP(levelProfile.level)) {
          levelProfile.xp = 0;
          levelProfile.level += 1;

          message.channel.send(`Congrats <@${message.author.id}>! You have leveled up to level __**${levelProfile.level}**__!`)

          /*cooldowns.add(message.author.id);
          setTimeout(() => {
            cooldowns.delete(message.author.id);
          }, 60000)*/
        }

        await levelProfile.save().catch((e) => {
          log(`An error occured when saving the level. Error: ${e}`, 'err')
          return;
        });
      } else {
        const newLevelProfile = new LevelSchema({
          userId: message.author.id,
          guildId: message.guild.id,
          xp: xpToGive,
        })

        cooldowns.add(message.author.id);
        setTimeout(() => {
          cooldowns.delete(message.author.id);
        }, 60000)

        await newLevelProfile.save()
      }
    } catch (error) {
      log(`An error occured when giving XP. Error: ${error}`, 'err');
      return;
    }

    //PREFIX AND COMMANDS

    if (!config.handler.commands.prefix) return;

    let prefix = config.handler.prefix;

    if (config.handler?.mongodb?.toggle) {
      try {
        const guildData = await GuildSchema.findOne({ guild: message.guildId });

        if (guildData && guildData?.prefix) prefix = guildData.prefix;
      } catch {
        prefix = config.handler.prefix;
      }
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandInput = args.shift().toLowerCase();

    if (!commandInput.length) return;

    let command =
      client.collection.prefixcommands.get(commandInput) ||
      client.collection.prefixcommands.get(
        client.collection.aliases.get(commandInput)
      );

    if (command) {
      try {
        if (
          command.structure?.permissions &&
          !message.member.permissions.has(command.structure?.permissions)
        ) {
          await message.reply({
            content:
              config.messageSettings.notHasPermissionMessage !== undefined &&
                config.messageSettings.notHasPermissionMessage !== null &&
                config.messageSettings.notHasPermissionMessage !== ""
                ? config.messageSettings.notHasPermissionMessage
                : "You do not have the permission to use this command.",
          });

          return;
        }

        if (command.structure?.developers) {
          if (!config.users.developers.includes(message.author.id)) {
            setTimeout(async () => {
              await message.reply({
                content:
                  config.messageSettings.developerMessage !== undefined &&
                    config.messageSettings.developerMessage !== null &&
                    config.messageSettings.developerMessage !== ""
                    ? config.messageSettings.developerMessage
                    : "You are not authorized to use this command",
              });
            }, 5 * 1000);
          }

          return;
        }

        if (command.structure?.nsfw && !message.channel.nsfw) {
          await message.reply({
            content:
              config.messageSettings.nsfwMessage !== undefined &&
                config.messageSettings.nsfwMessage !== null &&
                config.messageSettings.nsfwMessage !== ""
                ? config.messageSettings.nsfwMessage
                : "The current channel is not a NSFW channel.",
          });

          return;
        }

        if (command.structure?.cooldown) {
          const cooldownFunction = () => {
            let data = cooldown.get(message.author.id);

            data.push(commandInput);

            cooldown.set(message.author.id, data);

            setTimeout(() => {
              let data = cooldown.get(message.author.id);

              data = data.filter((v) => v !== commandInput);

              if (data.length <= 0) {
                cooldown.delete(message.author.id);
              } else {
                cooldown.set(message.author.id, data);
              }
            }, command.structure?.cooldown);
          };

          if (cooldown.has(message.author.id)) {
            let data = cooldown.get(message.author.id);

            if (data.some((v) => v === commandInput)) {
              await message.reply({
                content:
                  config.messageSettings.cooldownMessage !== undefined &&
                    config.messageSettings.cooldownMessage !== null &&
                    config.messageSettings.cooldownMessage !== ""
                    ? config.messageSettings.cooldownMessage
                    : `Slow down broski. There is a ${command.structure?.cooldown} second cooldown left.`,
              });

              return;
            } else {
              cooldownFunction();
            }
          } else {
            cooldown.set(message.author.id, [commandInput]);

            cooldownFunction();
          }
        }

        command.run(client, message, args);
      } catch (error) {
        log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
        return;
      }
    }
  },
};
