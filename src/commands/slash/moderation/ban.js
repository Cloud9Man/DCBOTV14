const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');

const { log } = require("../../../functions");
const ms = require('ms')

const LogChannelSchema = require('../../../schemas/LogChannelSchema');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban someone from the guild.')
        .addUserOption((opt) =>
            opt.setName('user')
                .setDescription('The user.')
                .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('reason')
                .setDescription('Why are you banning them?')
                .setRequired(false)
        ),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'None';

        const member = interaction.guild.members.fetch(user.id)

        if (!member) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Error`)
                        .setDescription(`The user isn't in the guild.`)
                        .setColor(Config.colors.error)
                ]
            });

            return;
        };

        if (user.bot) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Error`)
                        .setDescription(`You cannot timeout a bot!`)
                        .setColor(Config.colors.error)
                ]
            });

            return;
        }

        const targetUserRolePosition = (await member).roles.highest.position;
        const requestUserRolePostion = interaction.member.roles.highest.position;
        const botRolesPosition = interaction.guild.members.me.roles.highest.position;

        if (targetUserRolePosition >= requestUserRolePostion) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Error`)
                        .setDescription(`${user} has the same or higher roles position than you.`)
                        .setColor(Config.colors.error)
                ]
            });
        }
        if (targetUserRolePosition >= botRolesPosition) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Error`)
                        .setDescription(`${user} has the same or higher roles position than me.`)
                        .setColor(Config.colors.error)
                ]
            });
        }

        try {
            (await member).ban({ reason: reason });
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Ban hammer!`)
                        .setDescription(`${user} was banned by ${interaction.user}`)
                        .setFields(
                            { name: 'Reason', value: reason },
                        )
                        .setColor(Config.colors.default)
                ]
            });

            (await member).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Whoops!`)
                        .setDescription(`You have been banned by ${interaction.user} in ${interaction.guild.name}`)
                        .setFields(
                            { name: 'Reason', value: reason },
                        )
                        .setColor(Config.colors.error)
                ]
            })

            const data = await LogChannelSchema.findOne({
                guildId: interaction.guild.id
            });

            if (!data) return;

            const logChannel = await interaction.guild.channels.cache.get(data.channelId) || (await interaction.guild.channels.fetch(data.channelId));

            logChannel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`User has been banned!`)
                        .setDescription(`${user} has been banned by ${interaction.user}`)
                        .setFields(
                            { name: 'Reason', value: reason },
                        )
                        .setColor(Config.colors.default)
                ]
            })
            return;
        } catch (error) {
            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
