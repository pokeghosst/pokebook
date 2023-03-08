<img src="/static/logo.png" width="300px" alt="PókeBook logo"/>

# Poke!Book (Pokeghost’s poetry noteBook)

[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fbook.pokeghost.org)
[![GitHub license](https://img.shields.io/github/license/pokegh0st/pokebook.svg)](https://github.com/pokegh0st/pokebook/blob/main/LICENSE)
![Version](https://img.shields.io/github/v/release/pokegh0st/pokebook)
![GitHub last commit](https://img.shields.io/github/last-commit/pokegh0st/pokebook)
![It's free!](https://img.shields.io/badge/price-%240-brightgreen)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e7d89e1a-3c25-47e9-82e6-23acd668e75e/deploy-status)](https://app.netlify.com/sites/dancing-axolotl-36cfbd/deploys)

> PokeBook is your own digital notebook for writing poetry. Get into your creative flow with distraction-free environment and never worry about saving what you write!

## What makes PokeBook so cool?

- Workspace split into two independent notepads – jot down notes in the left one and write the poem in the right one.
- Everything is stored locally – no need to trust anyone to keep your poems nice and safe! Reload the page, close the tab, even reboot your computer, everything will stay there!
- The draft is autosaved with every single character written – don't worry about crashes or blackouts so you can focus on the writing!
- Click "New poem" and you immediately have a clean workspace – previous poem is saved in the Poem Stash™!
- View, edit and delete your previously written poems and store as many as your computer can handle!

## PokeBook desktop app

PokeBook has builds for Windows, Linux (deb package and AppImage) and MacOS produced with [Tauri](https://github.com/tauri-apps/tauri). Just grab the latest package from Releases page and enjoy!

## Installing / Getting started

You can use PokeBook at no cost by visiting https://book.pokeghost.org.

Production-ready build can be deployed anywhere by doing the following:

```
git clone https://github.com/pokegh0st/pokebook.git
cd pokebook
yarn
yarn run build
```

PokeBook can be easily deployed on many app platforms (such as Netlify or DigitalOcean) with zero configuration required. For example:

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/pokegh0st/pokebook)

Bare-metal deployment with custom domain will need more configuration depending on how you do it (e.g., setting up Nginx with certbot SSL, etc.).

*Docker image coming soon*

## Developing

Environment for local development can be quickly spun up by doing the following:

```
git clone https://github.com/pokegh0st/pokebook.git
cd pokebook
yarn
yarn run dev
```

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

For bugs and feature requests, don't hesitate to open issues!

## Known limitations

- You cannot save poems in private browser window (guess why, duh!)

## To Do

- [ ] Literature tools: count lines, characters, and words; syllable counter; literature form helper, maybe?
- [x] Better look on small screens
- [ ] Export to text file
- [ ] Electron app
