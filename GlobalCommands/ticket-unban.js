const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'ticket',
    description: 'generates the unban ticket',
    options: [
        {
            name: 'unban',
            type: 'SUB_COMMAND',
            description: 'generates the unban ticket',
        },
    ],
    async execute(client, interaction){
        if (interaction.member.permissions.has('ADMINISTRATOR')){
            var row = new MessageActionRow()
                .addComponents(new MessageButton()
                .setCustomId("open-ticket")
                .setLabel("Open ticket")
                .setEmoji("📩")
                .setStyle("PRIMARY")
            );
            const mesaj = new MessageEmbed()
                    .setTitle('Cerere unban')
                    .setDescription('Daca vezi asta inseamna ca esti banat.\nPentru a face o cerere de unban, te rugam sa apesi pe butonul de mai jos.')
                    .setColor('RED')
                    .setFooter(`${process.env.VERSION}`)
                    
                    const guildId = interaction.guild.id
                    let schema = await guildCommandsSchema.findOne({
                        guildID: guildId,
                    })
                    if (!schema.bannedChannel){
                        return interaction.followUp('**❌ You have not set up the banned channel. Please use `/set banned-channel`**')
                    }
                    const channel = schema.bannedChannel

                    if (!schema.bannedCategory){
                        return interaction.followUp('**❌ You have not set up the banned category. Please use `/set banned-category`**')
                    }
                    
                    if (!schema.staffRole){
                        return interaction.followUp('**❌ You have not set up the staff role. Please use `/set staff-role`**')
                    }

            client.channels.cache.get(channel).send({ embeds: [mesaj], components: [row] });
            return interaction.followUp({ content: '✅ Generated'} );
        }
        return interaction.followUp({ content: '**❌ You are not authorized to use this**' });
    }
}