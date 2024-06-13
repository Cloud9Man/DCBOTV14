const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const LogChannelSchema = require('../../../schemas/LogChannelSchema');
const { log } = require("../../../functions");

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('log')
        .setDescription('Set up the log channels and stuff...')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('set')
                .setDescription('Set up the log channel!')
                .addChannelOption((opt) =>
                    opt.setName('channel')
                        .setDescription('The channel where to send the log messages')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Remove the welcome channel')
                .addChannelOption((opt) =>
                    opt.setName('channel')
                        .setDescription('The channel to remove from the log channel list')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                ),),
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand == "set") {
            try {
                const logChannel = interaction.options.getChannel('channel');

                await interaction.deferReply({ ephemeral: true });

                const schemaObject = {
                    guildId: interaction.guild.id,
                    channelId: logChannel.id
                }

                let dataExists = await LogChannelSchema.exists(schemaObject);

                if (dataExists) {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Already exists`)
                                .setDescription(`This guild already has a log channel set - ${logChannel.id} (${logChannel.name})`)
                                .setFields(
                                    { name: `TIP:`, value: `remove the current log settings using \`/log remove\` and use this command again.` }
                                )
                                .setColor(Config.colors.error)
                        ]
                    })
                    log(`${interaction.user.displayName} (${interaction.user.username} | ${interaction.user.id}) tried setting the log channel, but one was already set.`, 'server')
                } else {
                    const newLogChannel = new LogChannelSchema({
                        ...schemaObject,
                    })
                    newLogChannel
                        .save()
                        .then(() => {
                            interaction.followUp({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`Log channel set!`)
                                        .setDescription(`The log channel has been set for this guild!`)
                                        .setFields(
                                            { name: `Channel:`, value: `${logChannel.id} (${logChannel.name})` }
                                        )
                                        .setColor(Config.colors.default)
                                ]
                            })

                            log(`${interaction.user.displayName} (${interaction.user.username} | ${interaction.user.id}) set a welcome channel.`, 'server');

                            return;
                        })
                        .catch(error => {
                            interaction.followUp(`Error occured, try again later.`);
                            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                            return;
                        })
                }
            } catch (error) {
                log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                return;
            }
        } else if (subcommand == 'remove') {
            try {
                const logChannel = interaction.options.getChannel('channel');

                await interaction.deferReply({ ephemeral: true });

                const schemaObject = {
                    guildId: interaction.guild.id,
                    channelId: logChannel.id
                }

                let dataExists = await LogChannelSchema.exists(schemaObject);

                if (!dataExists) {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Already exists`)
                                .setDescription(`This channel hasn't been set up for welcome messages \nChannel - ${logChannel.id} (${logChannel.name})`)
                                .setColor(Config.colors.error)
                        ]
                    })
                    log(`${interaction.user.displayName} (${interaction.user.username} | ${interaction.user.id}) tried removing the welcome channel, but it wasn't set.`, 'server');

                    return;
                } else {
                    const newLogChannel = LogChannelSchema.findOneAndDelete(schemaObject)
                    newLogChannel
                        .then(() => {
                            interaction.followUp({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`Welcome removed!`)
                                        .setDescription(`This welcome channel has been removed from the list.`)
                                        .setFields(
                                            { name: `Channel:`, value: `${logChannel.id} (${logChannel.name})` }
                                        )
                                        .setColor(Config.colors.default)
                                ]
                            })
                            log(`${interaction.user.displayName} (${interaction.user.username} | ${interaction.user.id}) removed a welcome channel.`, 'server');

                            return;
                        })
                        .catch(error => {
                            interaction.followUp(`Error occured, try again later.`);
                            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                            return;
                        })
                }
            } catch (error) {
                log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                return;
            }
        }
    }
};
