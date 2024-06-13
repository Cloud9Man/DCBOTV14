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
        .setName('level')
        .setDescription("See your or someone elses level")
        .addUserOption((opt) =>
            opt.setName('user')
                .setDescription('The persons level you want to see')
                .setRequired(false)
        ),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        await interaction.deferReply();

        try {
            const user = interaction.options.getUser('user') || interaction.user;


            const schemaObject = {
                guildId: interaction.guild.id,
                userId: user.id
            }

            let data = await LevelSchema.findOne(schemaObject);

            if (!data) {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`No level`)
                            .setDescription(user.id ? `This person doesn't have a level yet...` : `You don't have a level yet, try chatting some more.`)
                            .setColor(Config.colors.error)
                    ]
                });
                return;
            }

            let allLevels = await LevelSchema.find({ guildId: interaction.guild.id }).select('-_id userId level xp');

            let arr = allLevels.sort((a, b) => {
                if (a.level == b.level) {
                    return b.xp - a.xp;
                } else if (a.level != b.level) {
                    return b.level - a.level;
                }
            })

            let currentRank = allLevels.findIndex((lvl) => lvl.userId === user.id) + 1;
 
            const rank = new canvacord.RankCardBuilder()
                .setAvatar(user.displayAvatarURL({size: 256}))
                .setRank(currentRank)
                .setLevel(data.level)
                .setCurrentXP(data.xp)
                .setRequiredXP(calculateLevelXP(data.level))
                .setUsername(user.username)
                .setDisplayName(user.displayName)
                .setFonts(canvacord.Font.loadDefault())
    
            const rankData = await rank.build();

            const attachement = new AttachmentBuilder(rankData);

            interaction.followUp({ files: [ attachement] });

            return;
        } catch (error) {
            log(`Error in ${__filename}\nErr: ${error}`, 'err');
        }
    }
};
