# Civilization Discord Drafter Bot

This bot are based on work of [**Civilization Drafter**](https://civilizationdrafter.com/) and is freely available under the [GPLv3 license](https://raw.githubusercontent.com/jeremiemeunier/civ-drafter-discord-bot/main/LICENSE).

You can simply add bot without deployment with [this link](https://discord.com/oauth2/authorize?client_id=1245399954743361587&permissions=2147485696&scope=bot).

### Features

* Make draft without duplicate leaders

**Incoming features**

* Ban specific leaders
* Restrict DLC leaders to certain players
* Options to allow duplicate civilizations and leaders
* ~Build and send image with name and picture of leaders~

## Deployment

The following assumes you have Git and Docker installed.

```bash
docker compose up -d --build
```

## Usage

Just send a `/draft` in you discord channel and follow required fields. Now you can pass a third params to render images of all leaders drafted.
