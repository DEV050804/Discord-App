require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

// Initialize the client with only the required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // For interacting with guilds
        GatewayIntentBits.GuildMessages, // For listening to messages in guilds
        GatewayIntentBits.MessageContent, // For reading message content
    ],
});

client.commands = new Map();

// Dynamically load commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Bot is ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Handle incoming messages
client.on('messageCreate', (message) => {
    // Ignore messages that don't start with "!" or are from bots
    if (!message.content.startsWith('!') || message.author.bot) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Get the command
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        // Execute the command with arguments
        command.execute(message, args);
    } catch (error) {
        console.error(`Error executing command "${commandName}":`, error);
        message.reply('There was an error executing that command!');
    }
});

// Example for a simple interaction
client.on('messageCreate', (message) => {
    if (message.content.toLowerCase() === 'hello') {
        message.reply('Hello! How can I assist you today?');
    }
});

// Log in the bot
client.login(process.env.BOT_TOKEN);
