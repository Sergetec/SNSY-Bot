const { Client, CommandInteraction } = require('discord.js')
const guildCommandsSchema = require('../Models/guildCommands-schema')

module.exports = {
    name: 'perms',
    description: 'Setup roles permissions.',
    options: [
        {
            name: 'soft-ban',
            type: 'SUB_COMMAND',
            description: 'Soft-bans members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to soft-ban other members.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'soft-unban',
            type: 'SUB_COMMAND',
            description: 'Soft-unbans members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to soft-unban other members.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'mute',
            type: 'SUB_COMMAND',
            description: 'Mutes members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to mute other members.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'unmute',
            type: 'SUB_COMMAND',
            description: 'Unmutes members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to unmute other members.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'kick',
            type: 'SUB_COMMAND',
            description: 'kick members',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to kick other members.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'hist',
            type: 'SUB_COMMAND',
            description: 'punishment history',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to other members history.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'purge',
            type: 'SUB_COMMAND',
            description: 'mass deletes messages',
            options: [
                {
                    name: 'roles',
                    description: 'Roles to have acces to mass delete messages.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction){
        try{
            if (interaction.member.permissions.has('ADMINISTRATOR')){
                const guildID = interaction.guild.id;
                let schema
                const subCommand = interaction.options.getSubcommand()
                var roles = interaction.options.getString('roles')
                var rolesName = roles;
                roles = roles.replaceAll('<', '');
                roles = roles.replaceAll('@', '');
                roles = roles.replaceAll('&', '');
                roles = roles.replaceAll('>', '');
                switch (subCommand){
                    case 'soft-ban':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema){
                            schema.rolesBan = roles
                            await schema.save();
                        }
                        else{
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesBan: roles,
                            })
                            await schema.save();
                        }

                        break;
                    case 'soft-unban':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema){
                            schema.rolesUnban = roles
                            await schema.save();
                        }
                        else{
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesUnban: roles,
                            })
                            await schema.save();
                        }

                        break;
                    case 'mute':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)

                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema){
                            schema.rolesMute = roles
                            await schema.save();
                        }
                        else{
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesMute: roles,
                            })
                            await schema.save();
                        }

                        break;
                    case 'unmute':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)
                        
                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema){
                            schema.rolesUnmute = roles
                            await schema.save();
                        }
                        else{
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesUnmute: roles,
                            })
                            await schema.save();
                        }

                        break;
                    case 'kick':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)
                        
                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema){
                            schema.rolesKick = roles
                            await schema.save();
                        }
                        else{
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesKick: roles,
                            })
                            await schema.save();
                        }

                        break;
                    case 'hist':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)
                        
                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema){
                            schema.rolesHist = roles
                            await schema.save();
                        }
                        else{
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesHist: roles,
                            })
                            await schema.save();
                        }
                        
                        break;
                    case 'purge':
                        await interaction.reply(`✅ Roles: ${rolesName} have been authorized for ${subCommand}.`)
                        
                        //Check for the same guild -> update
                        schema = await guildCommandsSchema.findOne({
                            guildID: guildID,
                        })
                        if (schema){
                            schema.rolesPurge = roles
                            await schema.save();
                        }
                        else{
                            //DATABASE
                            schema = await guildCommandsSchema.create({
                                guildID: guildID,
                                rolesPurge: roles,
                            })
                            await schema.save();
                        }
                        
                        break;
                }
                return;
            }
            await interaction.reply({ content: '**❌ You are not authorized to use this**' });
        } catch(err){
            await interaction.reply({ content: '**❌ Oops something went wrong... please contact me: Sergetec#6803 🤔**' })
            console.log(err)
        }
    }
}