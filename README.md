NOTE: This is a preliminary release. The code has not be modfied to support a wide range of different coins and api calls. Expect to do modifications and structure changes until the official release.


# Install

npm install

node bot.js

# Configuration
cfg file can be found inf confg/auth

You need 
1. A Discord bot token: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
2. Let the discord bot join your server
3. Create a #bot and a #monitor channel and give the bot the rights to post and delete messages.
4. Binary name of your wallet-cli (e.g. Apollon-cli)
5. An URL to get a json list of available exchanges (e.g. https://xap.overemo.com/ext/getexchanges)
6. Edit the messages send in templates/

Note: in case the API call provides invalid data, the bot might crash as of now. Creating a service (e.g. systemctl) fixes that for the moment.

# Create Embed Messages
To create nice responses or modify existing ones (in templates/), the following editor is helpful:
https://leovoel.github.io/embed-visualizer/



