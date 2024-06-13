const { ContextMenuCommandInteraction, ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const Config = require('../../../config');
const { time } = require('../../../functions');
const { log } = require("../../../functions");

module.exports = {
    structure: new ContextMenuCommandBuilder()
        .setName('User info')
        .setType(ApplicationCommandType.User),
    /**
     * @param {ExtendedClient} client 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            const user = interaction.targetUser;
            const member = interaction.targetMember;

            const interactionUser = interaction.user;

            let interactionDirectUser = interaction.guild.members.cache.get(interactionUser.id) || (await interaction.guild.members.fetch(interactionUser.id))

            const arr = [
                `**Username**: ${user.username}`,
                `**Display name**: ${member.nickname || user.displayName}`,
                `**ID**: ${user.id}`,
                `**Joined Discord**: ${time(user.createdTimestamp, 'd')} (${time(user.createdTimestamp, 'R')})`,
                `**Joined server**: ${time(member.joinedTimestamp, 'd')} (${time(member.joinedTimestamp, 'R')})`,
                `**In a voice channel?**: ${member.voice.channel ? 'True (yes)' : 'False (no)'}`,
                `**Guild owner?**: ${interaction.guild.ownerId === user.id ? 'True (yes)' : 'False (no)'}`,
                `**Timed out?**: ${member.communicationDisabledUntilTimestamp ? 'True (yes)' : 'False (no)'}`
            ]

            interactionDirectUser.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${user.displayName} info`)
                        .setDescription(`${arr.join('\n')}`)
                        .setColor(Config.colors.default)
                ]
            })

            interaction.reply({ ephemeral: true, content: `Sent you the user info.` })
        } catch (error) {
            await interaction.reply({
                content: `Uh oh! Something went wrong, err: ${error}`,
                ephemeral: true
            })

            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
