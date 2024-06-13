const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits, Embed, EmbedAssertions, RoleFlagsBitField } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const { time } = require('../../../functions');
const Config = require('../../../config');
const { log } = require("../../../functions");

//Schemas

const ThanksSchema = require('../../../schemas/ThanksSchema');
const { config } = require('dotenv');

module.exports = {
    structure: new SlashCommandBuilder()
        .setDMPermission(false)
        .setName('thanks')
        .setDescription(`Send thanks to someone!`)
        .addSubcommand((subcommand) =>
            subcommand
                .setName('send')
                .setDescription('Send thanks to someone!')
                .addUserOption((opt) =>
                    opt.setName('user')
                        .setDescription('The person you want to thank.')
                        .setRequired(true)
                ))
        .addSubcommand((subcommand) =>
            subcommand
                .setName('leaderboard')
                .setDescription('Check the "thanks" leaderboard')
        ),

    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const subcommandGroup = interaction.options.getSubcommandGroup();

        await interaction.deferReply();

        if (subcommand == "send") {
            try {
                const user = interaction.options.getUser('user');

                if (user.id == interaction.user.id) {
                    interaction.followUp({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle(`Sorry, can't do`)
                                .setDescription(`A little unfair don't you think..? Sending thanks to yourself... seriously..?`)
                                .setColor(Config.colors.error)
                        ]
                    })

                    return;
                }

                let interactionUserData = await ThanksSchema.findOne({ userId: interaction.user.id })
                if (!interactionUserData) interactionUserData = new ThanksSchema({ userId: interaction.user.id, guildId: interaction.guild.id, thanksGiven: 0, thanksReceived: 0 })

                let receiverUserData = await ThanksSchema.findOne({ userId: user.id })
                if (!receiverUserData) receiverUserData = new ThanksSchema({ userId: user.id, guildId: interaction.guild.id, thanksGiven: 0, thanksReceived: 0 })

                const now = new Date()

                if (interactionUserData && interactionUserData.lastGave && interaction.user.id != Config.users.developers) {
                    const then = new Date(interactionUserData.lastGave)

                    const diff = now.getTime() - then.getTime();
                    const diffHours = Math.round(diff / (1000 * 60 * 60))

                    const hours = 24

                    if (diffHours <= hours) {
                        console.log('already thanked in 24')
                    }

                    return;
                }

                interactionUserData.lastGave = now;
                interactionUserData.thanksGiven += 1;

                receiverUserData.thanksReceived += 1;

                interactionUserData.save();
                receiverUserData.save();

                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`Thanks given!`)

                            .setDescription(`${interaction.user} gave a thanks to ${user}`)
                            .setFields(
                                { name: `${interaction.user.displayName}'s thanks given`, value: interactionUserData.thanksGiven.toString() },
                                { name: `${user.displayName}'s thanks received`, value: receiverUserData.thanksReceived.toString() },
                                { name: `TIP`, value: "Use `/profile show` to see the thanks you've given and received" },
                            )
                            .setColor(Config.colors.default),
                    ]
                })

                try {
                    let thanksReceiver = interaction.guild.members.cache.get(user.id) || (await interaction.guild.members.fetch(user.id));
                    thanksReceiver.send({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Alert!')
                                .setDescription(`You have received a thanks by ${interaction.user}!`)
                                .setFields(
                                    { name: "Who thanked you", value: `${interaction.user.displayName} (${interaction.user.username} || ${interaction.user.id})` },
                                    { name: "How many thanks you have now", value: `${receiverUserData.thanksReceived.toString()}` }
                                )
                                .setColor(Config.colors.default)
                        ]
                    });

                    return;
                } catch (error) {
                    log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                    return;
                }

            } catch (error) {
                log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
                return;
            }

        } else if (subcommand == "leaderboard") {
            await interaction.deferReply();

            let allThanks = await ThanksSchema.find({ guildId: interaction.guild.id }).select('-_id userId thanksReceived thanksGiven');

            let arr = allThanks.sort((a, b) => {
                return b.thanksReceived - a.thanksReceived
            });

            let message = `🏆 Leaderboard of the most thanks 🏆 \n\n`;

            arr.forEach((userThanks, x) => {
                message += `${x += 1}. <@${userThanks.userId}> have received **${userThanks.thanksReceived}** thanks! (They've given ${userThanks.thanksGiven} thanks) \n`
            });

            await interaction.followUp({ content: message.toString() });

            return;
        }
    }
};
