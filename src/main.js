//modules nodejs
let fs = require('fs');
const Discord = require('discord.js');

//librairies propres au projet

//clé d'acces au bot
const TOKEN  = fs.readFileSync("./ressources/discord_token.txt").toString();

const bot_data = JSON.parse(fs.readFileSync("./ressources/bot_data.json"));