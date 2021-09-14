---
layout: post
title:  'Note to self: Archiving Discord Chats'
author-id: isotopp
feature-img: assets/img/background/rijksmuseum.jpg
date: 2020-05-18 12:59:37 +0200
tags:
- lang_en
- discord 
---
When the Coronacrisis began, a good friend of mine started a Discord server and brought the band back together. As with any of the Coronavirus Quarantine Chats, the initial discussion revolved around baking proper bread. I wanted to archive this, so I needed a way to download Discord chat histories for archive.

The [DiscordChatExporter](https://github.com/Tyrrrz/DiscordChatExporter) can do that, and doing this was actually easy.

I needed

- Docker
- my Discord User Token
- **No** Discord Bot Token
- The Discord Channel ID

and then did a small starter script:

```bash
~/discord $ cat starter.sh
#! /bin/bash --

rm -rf /tmp/export
mkdir /tmp/export

docker run --rm \
  --network host  \
  -v /tmp/export:/app/out \
  tyrrrz/discordchatexporter:stable export \
      --channel $(cat discord-channel-token.txt) 
      --token $(cat discord-user-token.txt)
```

The [Wiki](https://github.com/Tyrrrz/DiscordChatExporter/wiki) has detailed instructions for [obtaining the tokens](https://github.com/Tyrrrz/DiscordChatExporter/wiki/Obtaining-Token-and-Channel-IDs) and [running the Docker version](https://github.com/Tyrrrz/DiscordChatExporter/wiki/Docker-usage-instructions).

It is important to note that I did not need a bot account or bot token, it is possible to do this under the user identity.

It is also important to note that I needed the `--network host` option (of course) in order to get the container to be able to access the network and have DNS.

And it is finally important to note that this downloads the base HTML only. Images and other content is still stored at Discord. So once you have the log, you still need to put this into a browser and save it with images or use some other method to get a full archive with all media content. Firefox can do this nicely: View, hit Cmd-S and store.