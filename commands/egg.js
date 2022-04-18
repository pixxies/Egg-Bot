const Discord = require("discord.js");
const eggs = require('../answers/eggs.json')

module.exports = {
    name: 'egg',
    args: '<message_ID>',
    description: 'Add an egg to your basket',
    options: [{
        name: 'id',
        type: 3,
        description: 'The message ID where the egg is hidden',
        required: true
    }],
    async execute(interaction) {

        let ended = new Discord.MessageEmbed()
            .setTitle(`Top.gg Egg Hunt`)
            .setColor(interaction.client.colors.red)
            .setDescription(`This event ended on <t:${interaction.client.event.end}:F>.\nTry \`/leaderboard\` to see the event winners!`)
            .setImage('https://i.imgur.com/PP5Nmo0.jpg')

        if (Math.floor(Date.now() / 1000) > interaction.client.event.end) return interaction.reply({ embeds: [ended], ephemeral: true })

        let answer = interaction.options.get('id').value

        let found = eggs.find(({ egg_location }) => egg_location === answer);

        if (found) {

            let basket = []

            let sql = 'SELECT * FROM answers WHERE userid = $1'
            let res = await interaction.client.db.query(sql, [interaction.user.id])

            if (res.rows.length) {

                basket = JSON.parse(res.rows[0].basket)

                const egginbasket = basket.find(({ egg }) => egg === found.egg_string)

                if (egginbasket) {

                    let alreadyfound = new Discord.MessageEmbed()
                        .setColor(interaction.client.colors.red)
                        .setTitle(`${found.egg_string} You already found ${found.egg_name}!`)
                        .setDescription(`You found this egg <t:${Math.floor(egginbasket.timestamp/1000)}:R>`)
                    interaction.reply({ embeds: [alreadyfound], ephemeral: true })

                } else {

                    basket.push({ egg: found.egg_string, timestamp: Date.now() })
                    let updatebasket = 'UPDATE answers SET basket = $1, lastfind = $2, eggsfound = eggsfound + 1 WHERE userid = $3'
                    interaction.client.db.query(updatebasket, [JSON.stringify(basket), Date.now(), interaction.user.id])

                    let newegg = new Discord.MessageEmbed()
                        .setColor(interaction.client.colors.yellow)
                        .setTitle(`${found.egg_string} Congratulations! You found ${found.egg_name}!`)
                        .setTimestamp()
                    interaction.reply({ embeds: [newegg], ephemeral: true })

                    if (basket.length === 25) interaction.member.roles.add('965100574225883157')

                }

            } else {

                basket.push({ egg: found.egg_string, timestamp: Date.now() })
                let newplayer = 'INSERT INTO answers (userid, basket, lastfind, eggsfound) VALUES ($1, $2, $3, 1)'
                interaction.client.db.query(newplayer, [interaction.user.id, JSON.stringify(basket), Date.now()])

                let newegg = new Discord.MessageEmbed()
                    .setColor(interaction.client.colors.yellow)
                    .setTitle(`${found.egg_string} Congratulations! You found ${found.egg_name}!`)
                    .setTimestamp()
                interaction.reply({ embeds: [newegg], ephemeral: true })

                interaction.member.roles.add('965563014310936626') // Add participant role

            }

        } else {

            let notanegg = new Discord.MessageEmbed()
                .setColor(interaction.client.colors.red)
                .setTitle("Sorry! That's not an egg!")
            interaction.reply({ embeds: [notanegg], ephemeral: true })

        }

    }
}
