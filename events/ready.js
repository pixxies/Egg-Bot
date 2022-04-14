module.exports = {
    name: 'ready',
    async execute(client) {

        console.log(`${client.user.tag} is online!`)

    }
}