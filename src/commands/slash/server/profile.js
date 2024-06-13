const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, Embed, EmbedAssertions, RoleFlagsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const { log } = require("../../../functions");

//Schemas

const UserSchema = require('../../../schemas/UserSchema');
const LevelSchema = require('../../../schemas/LevelSchema');
const ThanksSchema = require('../../../schemas/ThanksSchema');
const level = require('./level');
const calculateLevelXP = require('../../../calculateLevelXP');

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName('profile')
        .setDescription(`See the profile options`)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('show')
                .setDescription('Show someones profile')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The users profile you want to see')
                        .setRequired(false)
                ))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('create')
                .setDescription('Create your profile!')
        )
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName('quote')
                .setDescription('Profile quote options')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('add')
                        .setDescription("Add a quote to your profile")
                        .addStringOption((opt) =>
                            opt
                                .setName('text')
                                .setDescription('What your quote should display')
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('remove')
                        .setDescription("Remove the quote from your profile")
                )
        ),

    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

        if (subcommandGroup == "quote") {
            if (subcommand == "add") {
                const textQuote = interaction.options.getString('text')

                const schemaObject = {
                    userId: interaction.member.id,
                }

                await interaction.deferReply();

                const data = await UserSchema.findOne(schemaObject)

                if (data) {
                    data.quote = textQuote;
                    data.save();

                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Added quote`)
                                .setDescription(`Quote has been added to profile!`)
                                .addFields(
                                    { name: `Quote:`, value: textQuote }
                                )
                                .setColor(Config.colors.default)
                        ]
                    })
                } else {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`No profile`)
                                .setDescription(`You can't add a quote.`)
                                .addFields(
                                    { name: `Reason:`, value: "You don't have a profile." }
                                )
                                .setColor(Config.colors.error)
                        ]
                    })
                }
            } else if (subcommand == "remove") {
                const textQuote = interaction.options.getString('text')

                const schemaObject = {
                    userId: interaction.member.id,
                }

                await interaction.deferReply();

                const data = await UserSchema.findOne(schemaObject)

                if (data) {
                    data.quote = null;
                    data.save();

                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Added removed`)
                                .setDescription(`Quote has been removed from your profile!`)
                                .setColor(Config.colors.default)
                        ]
                    })
                } else {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`No profile`)
                                .setDescription(`You can't add a quote.`)
                                .addFields(
                                    { name: `Reason:`, value: "You don't have a profile." }
                                )
                                .setColor(Config.colors.error)
                        ]
                    })
                }
            }
        } 
        if (subcommand == "show") {
            try {
                const user = interaction.options.getUser('user') || interaction.user;

                let allLevels = await LevelSchema.find({ guildId: interaction.guild.id }).select('-_id userId level xp')

                let arr = allLevels.sort((a, b) => {
                    if (a.level == b.level) {
                        return b.xp - a.xp
                    } else if (a.level != b.level) {
                        return b.level - a.level
                    }
                })

                let currentRank = allLevels.findIndex((lvl) => lvl.userId === user.id) + 1

                await interaction.deferReply();

                const schemaObject = {
                    userId: user.id,
                }

                let data = await UserSchema.findOne(schemaObject);
                let thanksData = await ThanksSchema.findOne(schemaObject);
                let levelData = await LevelSchema.findOne(schemaObject);

                let newThanksData;

                if (!thanksData) newThanksData = new ThanksSchema({ ...schemaObject, thanksGiven: 0, thanksReceived: 0 })

                if (data) {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`${user.displayName}'s profile`)
                                .setThumbnail(user.displayAvatarURL())
                                .setFields(
                                    { name: `Dispay name:`, value: user.displayName },
                                    { name: `Username:`, value: user.username },
                                    { name: `User id:`, value: user.id },
                                    { name: `Level`, value: levelData.level.toString() || 'None', inline: true },
                                    { name: `XP`, value: `${levelData.xp.toString()}/${calculateLevelXP(levelData.level)}` || 'None', inline: true },
                                    { name: `Rank`, value: `#${currentRank}` || 'None', inline: true }
                                )
                                .setColor(Config.colors.default),
                            new EmbedBuilder()
                                .setFields(
                                    { name: `Quote`, value: data.quote || 'Undefined' },
                                )
                                .setColor(Config.colors.default),
                            new EmbedBuilder()
                                .setFields(
                                    { name: `Thanks given`, value: thanksData ? thanksData.thanksGiven.toString() : newThanksData.thanksGiven.toString() || "0", inline: true },
                                    { name: `Thanks gotten`, value: thanksData ? thanksData.thanksReceived.toString() : newThanksData.thanksReceived.toString() || "0", inline: true },
                                )
                                .setColor(Config.colors.default)
                        ]
                    })

                    return;
                } else {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`No data..`)
                                .setDescription(user.id ? `No data availabe for this profile` : `No data available for your profile..`)
                                .setFields(
                                    { name: "TIP:", value: "If you don't have a profile yet, use `/profile create`" },
                                )
                                .setColor(Config.colors.error)
                        ]
                    });

                    return;
                }
            } catch (error) {
                log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                return;
            }
        } else if (subcommand == "create") {
            const schemaObject = {
                userId: interaction.member.id,
            }

            await interaction.deferReply();

            const data = await UserSchema.exists(schemaObject)

            if (data) {
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Profile already exists!`)
                            .setDescription(`You already have a profile.`)
                            .setColor(Config.colors.error)
                    ]
                })
            } else {
                const newUserProfile = new UserSchema({
                    ...schemaObject
                })

                newUserProfile
                    .save()
                    .then(() => {
                        interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Profile crated!`)
                                    .setDescription(`You have created a profile`)
                                    .addFields(
                                        { name: `TIP:`, value: "To remove your profile, use `/profile remove`" }
                                    )
                                    .setColor(Config.colors.error)
                            ]
                        })
                    })
            }
        }
    }
};
