const Discord = require("discord.js");

module.exports = {
    name: 'basket',
    description: 'See your egg basket',
    async execute(interaction) {

        let sql = 'SELECT * FROM answers WHERE userid = $1'
        let res = await interaction.client.db.query(sql, [interaction.user.id])

        if (res.rows.length) {

            let basket_data = JSON.parse(res.rows[0].basket)

            let basket = basket_data.map(e => e.egg)

            let showbasket = new Discord.MessageEmbed()
                .setColor("#ffdd36")
                .setTitle(`${interaction.user.username}'s Basket`)
                .setDescription(basket.join(''))
                .setFooter({ text: `${basket.length}/50 eggs found!` })
                .setTimestamp()
            interaction.reply({ embeds: [showbasket], ephemeral: true })

        } else {

            let nobasket = new Discord.MessageEmbed()
                .setColor("#ffdd36")
                .setTitle(`:frowning: You haven't found any eggs yet!`)
                .setDescription(`Go to the <#963890145608728626> channel to find out how to play!`)
                .setTimestamp()
            interaction.reply({ embeds: [nobasket], ephemeral: true })

        }

    }
}