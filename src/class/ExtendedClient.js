const { Client, Partials, Collection, GatewayIntentBits } = require("discord.js");
const config = require('../config');
const commands = require("../handlers/commands");
const events = require("../handlers/events");
const deploy = require("../handlers/deploy");
const contextMenu = require("../handlers/contextMenu");
const mongoose = require("../handlers/mongoose");
const components = require("../handlers/components");

const { OpenAI } = require("openai");

module.exports = class extends Client {

    collection = {
        interactioncommands: new Collection(),
        contextMenuCommands: new Collection(),
        prefixcommands: new Collection(),
        aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection()
        }
    };
    applicationcommandsArray = [];
    applicationContextMenucommandsarray = [];

    constructor() {
        super({
            intents: 3276799,
            partials: [Object.keys(Partials)],
            presence: {
                activities: [{
                    name: 'Cloud :3',
                    type: 2,
                    state: 'Playing with Cloudy! <3'
                }]
            }
        });
    };

    start = async () => {
        commands(this);
        events(this);
        components(this);

        if (config.handler.mongodb.toggle) mongoose();

        if (config.handler.deploy) deploy(this, config);

        if (config.handler.contextMenu) contextMenu(this, config);

        await this.login(process.env.CLIENT_TOKEN || config.client.token);
    };
};