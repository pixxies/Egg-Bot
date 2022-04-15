const Discord = require("discord.js");

module.exports = {
    name: 'leaderboard',
    description: 'See the top egg hunters',
    async execute(interaction) {

        let sql = "SELECT * FROM answers ORDER BY eggsfound DESC, lastfind ASC LIMIT 5"
        let lb_data = await interaction.client.db.query(sql)

        if (lb_data.rows.length) {

            let loading = new Discord.MessageEmbed()
                .setTitle(`:egg: Loading the leaderboard`)
                .setDescription(`<a:typing:797843482130644992> *\`Please be patient, this might take a moment\`*`)
                .setColor(interaction.client.colors.red)
            await interaction.reply({ embeds: [loading], fetchReply: true })

            // Add rank to contestant objects
            let lb_data_res = lb_data.rows

            let num = {
                0: {
                    num: '<:p_one:943489953298546719>',
                    embed: new Discord.MessageEmbed()
                        .setColor("#e8b835")
                },
                1: {
                    num: '<:p_two:943489953818632192>',
                    embed: new Discord.MessageEmbed()
                        .setColor("#aeb7b8")
                },
                2: {
                    num: '<:p_three:943489953822822470>',
                    embed: new Discord.MessageEmbed()
                        .setColor("#945122")
                },
                3: {
                    num: '<:p_four:943489953806037012>',
                    embed: new Discord.MessageEmbed()
                        .setColor("#42c2be")
                },
                4: {
                    num: '<:p_five:943489953424355369>',
                    embed: new Discord.MessageEmbed()
                        .setColor("#5b40bd")
                }
            }

            let l_head = new Discord.MessageEmbed()
                .setTitle(`:rabbit: Top ${lb_data_res.length} Egg Hunters`)
                .setColor(interaction.client.colors.red)
                .setDescription(`*Event ends <t:${interaction.client.event.end}:R>*`)

            let embeds = [l_head]

            for (let i = 0; i < lb_data_res.length; i++) {

                const hunter = lb_data_res[i];
                let hunter_u = interaction.guild.members.cache.get(hunter.userid)
                if (!hunter_u) hunter_u = await interaction.guild.members.fetch(hunter.userid)
                    // console.log(hunter_u)
                num[i].embed.addField(`${num[i].num} ${hunter_u.user.username+'#'+hunter_u.user.discriminator}`, `:egg: \`${hunter.eggsfound}/50\`\n:stopwatch: Last egg found <t:${Math.round(hunter.lastfind/1000)}:R>`)
                embeds.push(num[i].embed)

            }
            await interaction.editReply({ embeds: embeds, fetchReply: true })

        } else {

            interaction.reply({ content: "Nothing to show here yet! Be the first player!", ephemeral: true })

        }

    }
}