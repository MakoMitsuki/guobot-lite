require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;

const rest = new REST({ version: '10' }).setToken(TOKEN);
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });


require('./guobaguide.js');

const commands = [
    {
      name: 'urmom',
      description: 'Replies with gay.',
    },
    {
        name: 'guoba',
        description: 'Gives the Guoba Guide for each character',
        options: [
            {
                name: "character",
                description: "The character you'd like to pull the Guoba Graphic for.",
                type: 3
            },
        ]
      },
  ];

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
   client.user.setPresence({activities: [{name: 'Oink Oink'}], status: 'available'});
});

client.on('message', async msg => {
	try {
		if (msg.author.bot) return;

		if (msg.content === "+hey") {
			console.log(msg.content);
		}
	} catch (error) {
		console.log(`SOMETHING WENT WRONG WITH A MESSAGE COMMAND: ${error}`);
		return;
	}
});

client.on('interactionCreate', async interaction => {
	try {
		if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

        if (interaction.commandName === 'urmom') {
            await interaction.reply('gay');
        }

        if (interaction.commandName === 'guoba') {
           

                try {
                    const chara = interaction.options.getString('character');

                    //const fileArray = guobaguide.find((g) => {g.name === })
                    await interaction.reply(`Oink ${chara}`)
                } catch (error) {
                    await interaction.reply('Error using the guoba command! Try again later!');
                    console.log(error);
                }
        }

    } catch (error) {
		console.log(`SOMETHING WENT WRONG ON AN INTERACTION: ${error}`);
		return;
	}
});

client.login(TOKEN);