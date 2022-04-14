module.exports = {
    name: 'messageCreate',
    async execute(message) {

        if (message.channel.id === '963890145608728626') {

            // If you're not a CM then get out :D
            if (!message.member.roles.cache.has('695153281105920070') || message.author.bot && message.author.user.id !== message.client.user.id) message.delete()

        }

    }
}