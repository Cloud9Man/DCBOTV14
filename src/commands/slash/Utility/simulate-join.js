const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, Embed, EmbedAssertions } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const WelcomeChannelSchema = require('../../../schemas/WelcomeChannelSchema');
const { log } = require("../../../functions");

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('simulate-join')
        .setDescription('simulate a member join')
        .addUserOption((option) =>
            option
                .setName('target-user')
                .setDescription('The user you want to emulate joining.')
                .setRequired(false)
        ),
    options: {
        developers: true,
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {import('commandkit').SlashCommandProps} param0
     */
    run: async (client, interaction) => {
        try {
            const targetUser = interaction.options.getUser('target-user');

            let member;

            if (targetUser) {
                member =
                    interaction.guild.members.cache.get(targetUser.id) ||
                    (await interaction.guild.members.fetch(targetUser.id));
            } else {
                member = interaction.member;
            }

            client.emit('guildMemberAdd', member);

            interaction.reply('Simulated join!');
        } catch (error) {
            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
