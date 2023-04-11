<img src="/static/logo.png" width="300px" alt="PokeBook logo"/>

# Poke!Book (Pokeghost’s poetry noteBook)

[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fbook.pokeghost.org)
[![GitHub license](https://img.shields.io/github/license/pokegh0st/pokebook.svg)](https://github.com/pokegh0st/pokebook/blob/main/LICENSE)
![Version](https://img.shields.io/github/v/release/pokegh0st/pokebook)
![GitHub last commit](https://img.shields.io/github/last-commit/pokegh0st/pokebook)
![It's free!](https://img.shields.io/badge/price-%240-brightgreen)
[![MadeWithSvelte.com shield](https://madewithsvelte.com/storage/repo-shields/4280-shield.svg)](https://madewithsvelte.com/p/pokebook/shield-link)

> PokeBook is your own digital notebook for writing poetry. Get into your creative flow with distraction-free environment and never worry about saving what you write!

## What makes PokeBook so cool?

- Workspace split into two independent notepads – jot down notes in one and write the poem in another!
- Endless notebook that grows as you write!
- Everything is stored locally – no need to trust anyone to keep your poems nice and safe! Reload the page, close the tab, even reboot your computer, everything will stay there!
- Optional Google Drive integration for backing up and synchronizing your poems!
- The draft is autosaved with every single character written – don't worry about crashes or blackouts so you can focus on the writing!
- Click "New poem" and you immediately have a clean workspace – previous poem is saved in the Poem Stash™!
- View, edit and delete your previously written poems and store as many as your computer (or Google Drive) can handle!
- Express yourself with a selection of themes and fonts!
- Write your best with PokeHelp mode! PokeHelp provides highlighting rhymes, syllable counter, and text counters (words, characters, lines)
- Want something more... unconventional? PokeMarkov will help you generate prose, poems, and any other kind of text using Markov chains

## PokeBook desktop app

PokeBook has builds for Windows, Linux (deb package and AppImage) and MacOS generated with [Tauri](https://github.com/tauri-apps/tauri). Just grab the latest package from Releases page and enjoy!

> Latest supported Tauri build is v0.6.1 - "French Toast With Extra Jam". At the moment there are no builds for later versions. I'm working on it, though!

## Installing / Getting started

You can use PokeBook at no cost by visiting https://book.pokeghost.org.

Production-ready build can be deployed anywhere by doing the following:

```
git clone https://github.com/pokegh0st/pokebook.git
cd pokebook
yarn
yarn run build
```

PokeBook can be easily deployed on many app platforms (such as Netlify, Vercel, or DigitalOcean) with zero configuration required. For example:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpokegh0st%2Fpokebook&env=GOOGLE_DRIVE_CLIENT_ID,GOOGLE_DRIVE_CLIENT_SECRET,GOOGLE_DRIVE_REDIRECT_URI)

Bare-metal deployment with custom domain will need more configuration depending on how you do it (e.g., setting up Nginx with certbot SSL, etc.).

*Docker image coming soon* (I promise!!)

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
