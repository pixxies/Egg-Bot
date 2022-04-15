module.exports = {
    name: 'ready',
    async execute(client) {

        client.user.setPresence({
            activities: [{
                name: "in the Egg Hunt | /basket",
                type: 'COMPETING'
            }],
            status: 'online'
        });

        console.log(`${client.user.tag} is online!`)

    }
}