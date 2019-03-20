var fs = require('fs');
const { exec } = require('child_process');
const https = require('https');
// require('ssl-root-cas').inject().addFile(__dirname + '/ssl/graviexnet.crt');
module.exports = {
newMembersfirstTrading: [],





////////////////////////////////////////////////////////////////////////////////////////
//get time until specific date
/////////////////////////////////////////////////////////////////////////////////////////
getTimeuntil: function(time) {
	
    webinardate=new Date(time);
    // webinardate=new Date('April 26, 2018 17:00:00');


    today=new Date();

    var seconds = Math.floor((webinardate - (today))/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);

    hours = hours-(days*24);
    minutes = minutes-(days*24*60)-(hours*60);
    seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
    
    return " "+days+" Days " +hours+" Hours "+minutes+" Minutes";
},

// ----receive function----v
get_json: function(url, callback) {

	 https.get(url, function(res) {
      var body = '';
 
      res.on('data', function(chunk) {
         body += chunk;
      });
 
      res.on('end', function() {
		try {
           var result = JSON.parse(body)

		} catch (err) {
			console.log("parsing exception");
    	  callback(JSON.parse('{"currentPriceBTC":0.0000,"currentPriceUSD":0.0,"currentPriceEUR":0.0,"btceur":0.0,"btcusd":0.0,"change24h":0.0,"coinsymbol":"XAP","exchangesBTC":[{"exchangeID":"cryptobridge","exchangeName":"Crypto bridge","exchangeDirectURL":"https://wallet.crypto-bridge.org/market/BRIDGE.XAP_BRIDGE.BTC","exchangeURL":"https://crypto-bridge.org/","updatetime":1526330503,"last":0.0,"buy":0.0,"sell":0.0000,"volume":0.0,"change":-2.43030736240171551107934239},{"exchangeID":"coinexchange","exchangeName":"Coinexchange","exchangeDirectURL":"https://www.coinexchange.io/market/XAP/BTC","exchangeURL":"https://www.coinexchange.io/","updatetime":1526331068,"last":0.0000,"buy":0.0000,"sell":0.000000,"volume":0.0,"change":9.14675767918088737201365188},{"exchangeID":"graviex","exchangeName":"Graviex","exchangeDirectURL":"https://graviex.net/markets/xapbtc","exchangeURL":"https://graviex.net/","updatetime":1526330503,"last":0.0,"buy":0.0,"sell":0.0,"volume":0.0,"change":-17.61313482022009062555169776},{"exchangeID":"palitanx","exchangeName":"Palitanx","exchangeDirectURL":"https://palitanx.com/exchange/BTC-XAP","exchangeURL":"https://palitanx.com/","updatetime":1526331219,"last":0.0,"buy":0.0,"sell":0.0,"volume":0.0,"change":0.0}]}'));

		}

        callback(result);
      });


    }).on('error', function(e) {
      console.log("Error: " + e.message);
    	callback(JSON.parse('{"currentPriceBTC":0.0000,"currentPriceUSD":0.0,"currentPriceEUR":0.0,"btceur":0.0,"btcusd":0.0,"change24h":0.0,"coinsymbol":"XAP","exchangesBTC":[{"exchangeID":"cryptobridge","exchangeName":"Crypto bridge","exchangeDirectURL":"https://wallet.crypto-bridge.org/market/BRIDGE.XAP_BRIDGE.BTC","exchangeURL":"https://crypto-bridge.org/","updatetime":1526330503,"last":0.0,"buy":0.0,"sell":0.0000,"volume":0.0,"change":-2.43030736240171551107934239},{"exchangeID":"coinexchange","exchangeName":"Coinexchange","exchangeDirectURL":"https://www.coinexchange.io/market/XAP/BTC","exchangeURL":"https://www.coinexchange.io/","updatetime":1526331068,"last":0.0000,"buy":0.0000,"sell":0.000000,"volume":0.0,"change":9.14675767918088737201365188},{"exchangeID":"graviex","exchangeName":"Graviex","exchangeDirectURL":"https://graviex.net/markets/xapbtc","exchangeURL":"https://graviex.net/","updatetime":1526330503,"last":0.0,"buy":0.0,"sell":0.0,"volume":0.0,"change":-17.61313482022009062555169776},{"exchangeID":"palitanx","exchangeName":"Palitanx","exchangeDirectURL":"https://palitanx.com/exchange/BTC-XAP","exchangeURL":"https://palitanx.com/","updatetime":1526331219,"last":0.0,"buy":0.0,"sell":0.0,"volume":0.0,"change":0.0}]}'));
	});
},



getExtension: function(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
},

getDatablockofMNbyPubkey: function(pubkey,callback){


    exec('bash user_modules/getMnbyPub.sh',{
    maxBuffer: 9000 * 1024 //quick fix
    }, function waitofos(error, stdout, stderr){

    // mnlist=stdout.toString().split(",");
     var obj=JSON.parse(stdout); // write it back 
// '
       // console.log(obj.length)

      for (var i = obj.length - 1; i >= 0; i--) {

        if(obj[i].ip.includes(ip)){
            // console.log("found MN in Apollon network");
           callback( obj[i]);
        return;
        }
      }

     callback(0)
      
   })

}


getDatablockofMNbyIP: function(ip,callback){

		exec(auth.cli+' masternode list > mnlist.txt' ,{
    maxBuffer: 9000 * 1024 //quick fix
    }, function waitofos(error, stdout, stderr){

		// mnlist=stdout.toString().split(",");
	   var obj=JSON.parse(fs.readFileSync("mnlist.txt", 'utf8')); // write it back 
// '
	     // console.log(obj.length)

	    for (var i = obj.length - 1; i >= 0; i--) {

	    	if(obj[i].ip.includes(ip)){
	    		  // console.log("found MN in Apollon network");
	    		 callback( obj[i]);
	 			return;
	    	}
	    }

	   callback(0)
	    
	 })

}


};