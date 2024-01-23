require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const CLIENT_ID = process.env.CLIENT_ID;
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST({ version: '10' }).setToken(TOKEN);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set commands on client and array to register
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
      
      const awaitData = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

      /* use this when testing in future
        const awaitData = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });

        then this to delete guild commands when done testing
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
	        .then(() => console.log('Successfully deleted all guild commands.'))
	        .catch(console.error);
      */

      console.log(`Successfully reloaded application with ${awaitData.length} commands.`);
    } catch (error) {
      console.error(error);
    }
  })();

client.on(Events.ClientReady, () => {
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

client.on(Events.InteractionCreate, async interaction => {
	try {
		if (!interaction.isChatInputCommand() && !interaction.isAutocomplete()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        
        if(interaction.isChatInputCommand()){
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
            }
        }else if(interaction.isAutocomplete()){
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }

    } catch (error) {
		console.log(`SOMETHING WENT WRONG ON AN INTERACTION: ${error}`);
		return;
	}
});

client.login(TOKEN);