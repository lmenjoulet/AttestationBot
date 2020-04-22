//librairies nodejs et npm
let fs = require('fs');
const Discord = require('discord.js');

//librairies propres au projet
let UserManager = require('./UserManager.js');
let Certificator = require('./Certificator.js');


//clé d'acces au bot
const TOKEN  = fs.readFileSync("./ressources/token_discord.txt").toString();
const bot_data = JSON.parse(fs.readFileSync("./ressources/bot_data.json"));

const client = new Discord.Client();
let usermanager = new UserManager();
let certificator = new Certificator();

client.login(TOKEN);

//initialisation du statut du bot
client.on("ready", () => { 
    client.user.setPresence({
        activity:{
            "name" : bot_data.prefix + "aide",
            "type" : "LISTENING"
        }
    })
});

client.on("message", async (message) => {
    const args = message.content.split(' ');
    const command = args[0].substring(1);

    if(args[0].substring(0,1) === bot_data.prefix){
        switch(command){
            case "aide":
                message.channel.send(bot_data.aide.general);
                break;
            
            case "chargerprofil":
                if(["lastname","firstname","birthday","lieunaissance","address","zipcode","town"].includes(args[1])){
                    args[2] = args.slice(2).join(' ');
                    usermanager.addUserInfo(message.author.id, args[1], args[2]);
                    usermanager.saveUsers();
                }
                else{
                    message.reply(bot_data.aide.chargerprofil);
                }
                break;
            
            case "voirprofil":
                message.reply('');
                for(detail in usermanager.loadUser(message.author.id)){
                    message.channel.send(`${detail} : ${usermanager.loadUser(message.author.id)[detail]}`);
                }
                break;
            
            case "attestation":
                if(['travail','courses','sante','famille','sport','judiciaire','missions'].includes(args[1])){
                    if(usermanager.loadUser(message.author.id) != undefined){
                        if(Object.keys(usermanager.loadUser(message.author.id)).length == 7){
                            let pdf = await certificator.generatePdf(usermanager.loadUser(message.author.id), args[1]);
                            message.reply('voila ton attestation !', new Discord.MessageAttachment(Buffer.from(pdf.buffer), 'attestation.pdf'));
                        }
                    }
                    else{
                        message.reply('ton profil est vide ou incomplet.');
                    }

                }
                else{
                    message.reply("fournissez une des raisons suivantes de cette manière :\n"+
                                  "!attestation <raison> \n"+
                                  "La liste des raisons est :\n"+
                                  "travail\ncourses\nsante\nfamille\nsport\njudiciaire\nmissions");
                }
                break;

            default :
                message.reply(`ce n'est pas une commande valide, essaye plutôt ${bot_data.prefix}aide`);
                break;
        }
    }

})