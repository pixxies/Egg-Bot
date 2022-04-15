const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config');
const fs = require('fs');
const path = require('path');
const client = new Discord.Client({
    allowedMentions: false,
    failIfNotExists: false,
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES'
    ],
    makeCache: Discord.Options.cacheWithLimits({
        GuildMemberManager: Infinity, // guild.members
        GuildMemberRoleManager: Infinity, // guild.members.roles
    }),
});

client.event = {
    start: 1650056400,
    end: 1650315600
}

client.colors = {
    yellow: "#ffdd36",
    red: "#ff3366"
}

client.db = require('./db');
client.login(token).catch(console.error);

client.commands = new Discord.Collection();

function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            //console.log(fullPath);
            traverseDir(fullPath);
        } else {
            //console.log(fullPath);
            let props = require('./' + fullPath);
            console.log(`${file} loaded!`);
            client.commands.set(props.name, props);
        }
    });
}
traverseDir("./commands");

const commands = client.commands.map(({ execute, ...data }) => data);

// Register slash commands on Discord
const rest = new REST({ version: '9' }).setToken(token);
(async() => {

    try {

        console.log('Started refreshing slash commands...');

        await rest.put(
            Routes.applicationGuildCommands('964056498609213532', '963063606814048306'), { body: commands }
        );
        await rest.put(
            Routes.applicationGuildCommands('964056498609213532', '264445053596991498'), { body: commands }
        );

        console.log(`Successfully reloaded ${commands.length} slash commands!`);

    } catch (error) {
        console.error(error);
    }

})();


// client.on("debug", console.log)


// Event handler
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    switch (event.name) {

        case "ready":
            client.once(event.name, async(...args) => event.execute(...args));
            break;

        case "interactionCreate":
            client.on(event.name, async(...args) => event.execute(...args));
            break;

        case "messageCreate":
            client.on(event.name, async(...args) => event.execute(...args));
            break;

        default:
            client.on(event.name, async(...args) => event.execute(...args));
            break;
    }
}


// Handle errors

process.on('unhandledRejection', (reason, p) => {
    // See full list of error codes at: https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes
    const excluded_reasons = [
        50013, // Missing Permissions
        10008, // Unknown Message
        50001, // Missing Access
    ]
    if (reason.code && excluded_reasons.includes(reason.code)) return
    console.error('Unhandled Promise Rejection: ' + reason.stack);
});