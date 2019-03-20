#!/usr/bin/env node
////////////////////////////////////////////////////////////////////////////////////////
//includes
/////////////////////////////////////////////////////////////////////////////////////////
var ArrayList = require('arraylist');
var auth = require('./config/auth.json');
var Discord = require('discord.js');
var fs = require('fs');
const { exec } = require('child_process');

////////////////////////////////////////////////////////////////////////////////////////
//variables
/////////////////////////////////////////////////////////////////////////////////////////
var subscribersBlacklist ;
var dailyMessagedelivered;

var newMemberfirstMasternodes=[];
const DiscordBot = new Discord.Client();
var messageTriggered = new Date();

var helpers=require('./user_modules/Helpers');


DiscordBot.on('ready', () => {
 	console.log(`Logged in as ${DiscordBot.user.tag}!`);

});




// setInterval(function() {
// 	DiscordBot.channels.find("name", "general").send(JSON.parse(fs.readFileSync('reward.json', 'utf8')));
// }, 36000000*3);


//Monitor channel
setInterval(function() {
	exec(auth.cli+' getblockcount', function callback(error, stdout, stderr){
										
				    		var CB="";
				    		var CE="";
				    		var GX="";
						process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



							helpers.get_json(auth.exchanges, function (resp) {

					var varlist= [];
	
									CB=resp.exchangesBTC[0];								
									CE=resp.exchangesBTC[1];								
									GX=resp.exchangesBTC[2];								
								
								// console.log(CE.result);
								// console.log(GX);
								// console.log(cbvolume);


							//toDo: this part is only supports 

								 cbvolume=CB.volume.toPrecision(3);
								 varlist.push({name: 'cbvolume',value: cbvolume});
								cevolume=CE.volume.toPrecision(3);
								 varlist.push({name: 'cevolume',value: cevolume});
								gxvolume=GX.volume.toPrecision(3);
								 varlist.push({name: 'gxvolume',value: gxvolume});


								cbbuy=CB.buy;
								cebuy=CE.buy;
								gxbuy=GX.buy;

								cbsell=CB.sell;
								cesell=CE.sell;
								gxsell=GX.sell;


								 varlist.push({name: 'cesell',value: cesell});
								 varlist.push({name: 'cbsell',value: cbsell});
								 varlist.push({name: 'gxsell',value: gxsell});

								 varlist.push({name: 'cbbuy',value: cbbuy});
								 varlist.push({name: 'cebuy',value: cebuy});
								 varlist.push({name: 'gxbuy',value: gxbuy});

								volume=eval(cbvolume+"+"+cevolume+"+"+gxvolume).toPrecision(3);//
								 varlist.push({name: 'volume',value: volume});
								// volume=parseFloat(cbvolume)+parseFloat(cevolume)+parseFloat(gxvolume)
							// 
								monitormsg=fs.readFileSync('./templates/monitor.json', 'utf8');
				    		// var temp_stak=fs.readFileSync('blockheight.json', 'utf8');
								// console.log(monitormsg);




								varlist.forEach(function(value){
									var replace = "<"+value.name+">";
									// console.log(replace);
									regex=new RegExp(replace,"g");
									// console.log(regex);
									// test="<gxbuy>";
									monitormsg=monitormsg.replace(regex, value.value);
								});
						exec(auth.exchanges+' getblockcount', function callback(error, stdout, stderr){
										

				    	setTimeout(function() {
				    		
								DiscordBot.channels.find(x => x.name === "monitor").send(JSON.parse(monitormsg.replace(/<block>/g, stdout.match(/\d+/))));
						}, 1000 );

						});

   
							});


				    
				});

		}, 60000);				




////////////////////////////////////////////////////////////////////////////////////////
//bots reaction to new messages
/////////////////////////////////////////////////////////////////////////////////////////
DiscordBot.on('message', msg => {

////////////////////////////////////////////////////////////////////////////////////////
//filters on channels
/////////////////////////////////////////////////////////////////////////////////////////

		switch(msg.channel.name) {

			case 'trading':


			break; 

			case 'monitor':
					setTimeout(function() {
						msg.delete();

					}, 60000 );

			break;

			 case 'bot':
			 case 'general':
			 case 'masternode-talk':

				// ="" masternodes.online says every x hours 
			 	if((msg.content.includes("rewards") || msg.content.includes("reward")) 
			 		&& (msg.content.includes("no ") 	|| msg.content.includes("not ")	|| msg.content.includes("didn't")|| msg.content.includes("didnt")|| msg.content.includes("haven't") || msg.content.includes("havent")) 
			 		&& (msg.content.includes("hours")|| msg.content.includes("hrs") || msg.content.includes("days") || msg.content.includes("day") || msg.content.includes("hours") || msg.content.includes("hour") ||msg.content.includes("time"))){
			 	

					var now = new Date();
					var delay = 5 * 60000; // 60000 being the number of milliseconds in 15 minute
					var Timeout=new Date(now-delay);

					if (messageTriggered < Timeout) {
					  messageTriggered = new Date();

					}

			 	}
					
			break; 
		}

////////////////////////////////////////////////////////////////////////////////////////
//filters on message
// hint: messages can be easily created by using embed-visdualizer tool
//https://leovoel.github.io/embed-visualizer/
/////////////////////////////////////////////////////////////////////////////////////////
 		switch(msg.content) {
   

            case '!ping':
           	 	msg.channel.send('pong');
				break;

			case "!help":
				// msg.channel.send(JSON.parse(fs.readFileSync('.templates/help.json', 'utf8')));
			break;

			case "!upgrade":
				// msg.channel.send(JSON.parse(fs.readFileSync('.templates/upgrade_old.json', 'utf8')));
			break;
			case "!swap":
				// msg.channel.send(JSON.parse(fs.readFileSync('.templates/swap.json', 'utf8')));
			break;

			case "!boot":
				// msg.channel.send(JSON.parse(fs.readFileSync('.templates/faq.json', 'utf8')));
			break;


			//don't use break if you want the same message for different commands
			case "!help blockheight":
			case "!help blockheigth":
			case "!help block":
				//calls 
				exec(auth.cli+' getblockcount', function callback(error, stdout, stderr){
										

				    	setTimeout(function() {
				    	
				    		var temp_stak=fs.readFileSync('.templates/blockheight.json', 'utf8');

				    		//sends blockheight.json messages but replaces <block_entry>
							msg.channel.send(JSON.parse(temp_stak.replace(/<block_height>/g, stdout.match(/\d+/))));


						}, 1000 );
			
						
			});


			break;

			////////////////////////////////////////////////////////////////////////////////////////
			//In case no static command could be found 
			/////////////////////////////////////////////////////////////////////////////////////////
			default:
				var commandarray=msg.content.split(" ");
				if(commandarray.length>2){
					////////////////////////////////////////////////////////////////////////////////////////
					//checks for !mn check <ip>:<port>
					/////////////////////////////////////////////////////////////////////////////////////////
					if((commandarray[0].includes("!mn")  && commandarray[1].includes("check"))){

						if(typeof msg.channel.name !== "undefined"){

							//checks if argument is an IP	
							if(msg.channel.name.includes("bot")){
  								result=commandarray[2].match(/^([A]+[a-zA-Z0-9]{33})/g);
								
								try {
									if(result[0]){

										    	datablock=0;
										    	helpers.getDatablockofMNbyPubkey(result[0],function(datablock){

										    		console.log("got datablock");
											    	if(datablock!=0){
											    		msg.channel.send("```IP:"+datablock.ip+"\nStatus:"   +datablock.status + "\nPublic-Key:"+ datablock.addr +  "\nVersion:"+datablock.version+"```\n Explorer:" +" https://xap2.ccore.online/address/"+datablock.addr);
											    	}
											    	else{
											    		 msg.channel.send("```Couldn't find Masternode in Apollon Network.```");
											    	}
										    		
										    	});

										    	
											
									}else{
										msg.channel.send("```Can't recognize " + result[0]+" as a Masternode Address```");
										return;

									}

								} catch (err) {
								console.log("Error: on getting a correct IP  " );
								}


							}else{
									//prints a message if you don't use the command in the bot channel (channel ID needed to produce link)
										msg.channel.send("Please use the <#420317781054193676> channel");

								}
						}
			
						}
					
				}
			
				break;
		}



});


//discord bot authentification
DiscordBot.login(auth.discordtoken);


