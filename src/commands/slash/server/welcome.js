const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const WelcomeChannelSchema = require('../../../schemas/WelcomeChannelSchema');
const { log } = require("../../../functions");

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('welcome')
        .setDescription('Set up the welcome channels and stuff...')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('set')
                .setDescription('Set up the welcome channel!')
                .addChannelOption((opt) =>
                    opt.setName('channel')
                        .setDescription('The channel where to send the welcome message')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText)
                )
                .addStringOption((opt) =>
                    opt.setName('message')
                        .setDescription('The message to display when someone joins')
                        .setRequired(false)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('remove')
                .setDescription('Remove the welcome channel')
                .addChannelOption((opt) =>
                    opt.setName('target-channel')
                        .setDescription('The channel to remove from the welcome channel list')
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
                const welcomeMessage = interaction.options.getString('message') || null;
                const welcomeChannel = interaction.options.getChannel('channel');

                await interaction.deferReply({ ephemeral: true });

                const schemaObject = {
                    guildId: interaction.guild.id,
                    channelId: welcomeChannel.id
                }

                let dataExists = await WelcomeChannelSchema.exists(schemaObject);

                if (dataExists) {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Already exists`)
                                .setDescription(`This guild already has a welcome channel set - ${welcomeChannel.id} (${welcomeChannel.name})`)
                                .setFields(
                                    { name: `TIP:`, value: `remove the current welcomer settings using \`/welcome remove\` and use this command again.` }
                                )
                                .setColor(Config.colors.error)
                        ]
                    })
                    log(`${interaction.user.displayName} (${interaction.user.username} | ${interaction.user.id}) tried setting the welcome channel, but one was already set.`, 'server')
                } else {
                    const newWelcomeChannel = new WelcomeChannelSchema({
                        ...schemaObject,
                        customMessage: welcomeMessage || null
                    })
                    newWelcomeChannel
                        .save()
                        .then(() => {
                            interaction.followUp({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`Welcome set!`)
                                        .setDescription(`The welcome channel has been set for this guild!`)
                                        .setFields(
                                            { name: `Message:`, value: welcomeMessage || `\`None\`` },
                                            { name: `Channel:`, value: `${welcomeChannel.id} (${welcomeChannel.name})` }
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
                const welcomeChannel = interaction.options.getChannel('target-channel');

                await interaction.deferReply({ ephemeral: true });

                const schemaObject = {
                    guildId: interaction.guild.id,
                    channelId: welcomeChannel.id
                }

                let dataExists = await WelcomeChannelSchema.exists(schemaObject);

                if (!dataExists) {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Already exists`)
                                .setDescription(`This channel hasn't been set up for welcome messages \nChannel - ${welcomeChannel.id} (${welcomeChannel.name})`)
                                .setColor(Config.colors.error)
                        ]
                    })
                    log(`${interaction.user.displayName} (${interaction.user.username} | ${interaction.user.id}) tried removing the welcome channel, but it wasn't set.`, 'server');

                    return;
                } else {
                    const newWelcomeChannel = WelcomeChannelSchema.findOneAndDelete(schemaObject)
                    newWelcomeChannel
                        .then(() => {
                            interaction.followUp({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`Welcome removed!`)
                                        .setDescription(`This welcome channel has been removed from the list.`)
                                        .setFields(
                                            { name: `Channel:`, value: `${welcomeChannel.id} (${welcomeChannel.name})` }
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
