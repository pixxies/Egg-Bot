const Discord = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        // If it's a slash command
        if (interaction.isCommand()) {

            try {

                let no_start = new Discord.MessageEmbed()
                    .setTitle(`Top.gg Egg Hunt`)
                    .setColor(interaction.client.colors.red)
                    .setDescription(`To celebrate Spring, the Top.gg <@&695153281105920070>s have hidden 50 eggs in their message history over the last 12 months! Search through message history from <@395526710101278721>, <@321714991050784770>, <@311553339261321216> and <@491002268401926145> and find up to 50 eggs hidden amongst their messages!\n\n:calendar: **Event details**\nStarts: <t:${interaction.client.event.start}:F>\nEnds: <t:${interaction.client.event.end}:F>\n\n:information_source: **More info in <#963890145608728626>**`)
                    .setImage('https://i.imgur.com/PP5Nmo0.jpg')

                if (interaction.client.event.start > Math.floor(Date.now() / 1000)) return interaction.reply({ embeds: [no_start], ephemeral: true })

                let cmd
                if (interaction.client.commands.has(interaction.commandName)) cmd = interaction.client.commands.get(interaction.commandName)

                cmd.execute(interaction).catch(err => {
                    console.log(err);
                    console.error(`[G/U ${interaction.guild.id}/${interaction.user.id}]: ${interaction.commandName}: ${err}`)
                });

            } catch (error) {
                console.error(error);
                await interaction.reply({ embeds: [errorMessage(`There was an error trying to execute that command!`, `Please [contact our developers](${globals.serverlink}) with this debugging data so we can investigate:\n\`\`\`\nCMD: ${interaction.commandName}\nMID: ${interaction.id}\nUID: ${interaction.user.id}\nCID: ${interaction.channel.id}\nGID: ${interaction.guild.id}\nUNIX: ${Date.now()}\`\`\``)], ephemeral: true });
            }
        }

    }
}