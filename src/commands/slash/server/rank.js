const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, AttachmentBuilder, PermissionFlagsBits, Attachment } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const { log } = require("../../../functions");
const LevelSchema = require('../../../schemas/LevelSchema');

const { readFile } = require('fs')

const calculateLevelXP = require('../../../calculateLevelXP');

const canvacord = require('canvacord');

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName('rank')
        .setDescription("Display the servers leaderboard!"),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            let allLevels = await LevelSchema.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

            let arr = allLevels.sort((a, b) => {
                if (a.level == b.level) {
                    return b.xp - a.xp;
                } else if (a.level != b.level) {
                    return b.level - a.level;
                }
            })

            let message = `🏆 Leaderboard of levels/xp in the server 🏆 \n\n`;

            arr.forEach((userLevel, x) => {
                message += `${x += 1}. <@${userLevel.userId}>: LEVEL - **${userLevel.level}** | XP - **${userLevel.xp}/${calculateLevelXP(userLevel.level)}** \n`
            });

            await interaction.reply({ content: message.toString() });

            return;
        } catch (error) {
            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
