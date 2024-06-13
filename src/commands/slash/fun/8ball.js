const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const config = require('../../../config');

const { log } = require('../../../functions');

module.exports = {
    structure: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the 8ball to do some voodoo magic for you.')
        .addStringOption((opt) =>
            opt.setName('question')
                .setDescription('Your silly question')
                .setRequired(true)
        ),
    options: {
        cooldown: 500
    },
    /**
     * @param {ExtendedClient} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        answers = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
            'No way.',
            'Maybe',
            'The answer is hiding inside you',
            'No.',
            'Depends on the mood of Cloud',
            '||No||',
            '||Yes||',
            'Hang on',
            'It\'s over',
            'It\'s just the beginning',
            'Good Luck',
        ];

        actions = [
            'threw the magic 8ball on the ground, and it annoyed the 8ball.',
            'wrote a poem with the 8ball.',
            'ghosted the 8ball when texting.',
            'friendzoned the 8ball, womp womp.',
            'just shook the 8ball.',
            'gave the 8ball a big smooch.',
            'threw the 8ball across the room and shattered it, no reply for you!',
            'hung out with the 8ball and gained its trust.'
        ]

        try {
            const message = answers[Math.floor(Math.random() * answers.length)];

            const action = actions[Math.floor(Math.random() * actions.length)];

            const question = interaction.options.getString('question');

            if (action == 'threw the 8ball across the room and shattered it, no reply for you!') {
                const eballembed = new EmbedBuilder()
                    .setTitle('8ball')
                    .setDescription(`${interaction.user} ${action}`)
                    .setColor(config.colors.default)

                await interaction.reply({
                    embeds: [eballembed]
                });
            } else {
                const eballembed = new EmbedBuilder()
                    .setTitle('8ball')
                    .setDescription(`${interaction.user} ${action}`)
                    .setFields(
                        { name: 'Question', value: `**${question}**`, inline: true},
                        { name: 'Answer', value: `**${message}**`, inline: true},
                    )
                    .setColor(config.colors.default)

                await interaction.reply({
                    embeds: [eballembed]
                });
            }
        } catch (error) {
            log(`Whoops! An error occured in ${__filename}. Error: ${error}`, 'err');
            return;
        }
    }
};
