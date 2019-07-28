const Discord = require("discord.js");
const client = new Discord.Client({disableEveryone: true});
const prefix = 'reny!';
const request = require("request");
const botconfig = require("./botconfig.json");
const ytdl = require("ytdl-core");
const db = require('quick.db');
const mongoose = require('mongoose');
var jimp = require('jimp');
const queue = new Map();
const cheerio = require("cheerio");
const {FriendlyError, SQLiteProvider} = require('discord.js-commando');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const path = require('path');
const sqlite = require('sqlite');
const coins = require('./coins.json')
const fs = require("fs");
let xp = require("./xp.json");
const superagent = require('snekfetch');
const command = require ("discord.js-commando");
const { Util, RichEmbed } = require("discord.js");
require("./server.js");
client.on('ready', () => {
  console.log('RenyBOT is online now');
const activities_list = [
    "Hello world! | reny!help", 
    "AWESOME BOT! | reny!help",
    "Being updated | reny!help", 
    "New AutoStatus | reny!help",
    "Adding New Commands | reny!help",
    "Vete a la Versh | reny!help",
  "привет | reny!help",
  `Serving ${client.guilds.size} servers | reny!help`,
  `In ${client.channels.size} channels | reny!help`,
  "Fixing bugs | reny!help",
  "RenyTH#4474 | reny!help",
  "RenyBOT v1.5 | reny!help",
  "THE NIGHTMARE REPEATS ITSELF EVERY TIME",
  "QUE SE ARMEN LOS PUTAZOS!!!!!!"
    ]; // creates an arraylist containing phrases you want your bot to switch through.

    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index], { type: "STREAMING" }); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000); // Runs this every 10 seconds.

});
client.on("messageUpdate", async(oldMessage, newMessage) => {
  if(oldMessage.content === newMessage.content){
   return;
}
    var logchannel = client.channels.get("595295889787060230")
    let logembed = new Discord.RichEmbed ()
    .setAuthor(oldMessage.author.tag, oldMessage.author.avatarURL)
    .setThumbnail(oldMessage.author.avatarURL)
    .setColor("RED")
    .setDescription("Message Edited")
    .addField("Before", oldMessage.content, true)
    .addField("After", newMessage.content, true)
    .setTimestamp()
    
    logchannel.send(logembed)
})

client.on('guildMemberAdd', async member => {
	
	let wChan = db.fetch(`${member.guild.id}`)
	
	if(wChan == null) return;
	
	if(!wChan) return;
	
let font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK) //We declare a 32px font
  let font64 = await jimp.loadFont(jimp.FONT_SANS_64_WHITE) //We declare a 64px font
  let bfont64 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK)
  let mask = await jimp.read('https://i.imgur.com/552kzaW.png') //We load a mask for the avatar, so we can make it a circle instead of a shape
  let welcome = await jimp.read('http://rovettidesign.com/wp-content/uploads/2011/07/clouds2.jpg') //We load the base image

  jimp.read(member.user.displayAvatarURL).then(avatar => { //We take the user's avatar
    avatar.resize(200, 200) //Resize it
    mask.resize(200, 200) //Resize the mask
    avatar.mask(mask) //Make the avatar circle
    welcome.resize(1000, 300)
	
  welcome.print(font64, 265, 55, `Welcome ${member.user.username}`) //We print the new user's name with the 64px font
  welcome.print(bfont64, 265, 125, `To ${member.guild.name}`)
  welcome.print(font64, 265, 195, `There are now ${member.guild.memberCount} users`)
  welcome.composite(avatar, 40, 55).write('Welcome2.png') //Put the avatar on the image and create the Welcome2.png bot
  try{
  member.guild.channels.get(wChan).send(``, { files: ["Welcome2.png"] }) //Send the image to the channel
  }catch(e){
	  // dont do anything if error occurs
	  // if this occurs bot probably can't send images or messages
  }
  })
})
						
client.on('message', async msg => {  //here
  if(msg.author.bot) return;
  if(msg.channel.type === "dm") return;
  if(!msg.content.startsWith(prefix)) return;
  var args = msg.content.slice(prefix.length).trim().split(' ');
  var messageArray = msg.content.split(" ");
  var searchString = messageArray.slice(1).join(' ');
  var url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  console.log(searchString);
  var serverQueue = queue.get(msg.guild.id);
  var sender = msg.author;
  var cmd = args.shift().toLowerCase();
  
  try {
    let commandFile = require(`./cmds/${cmd}.js`);
    commandFile.run(client, msg, args);
    
  } catch (e) {
    console.log(e.stack);
  } finally {
    console.log(`${msg.author.tag} has using ${cmd}'s command`);
  }
  
});

client.login(process.env.BOT_TOKEN); 
