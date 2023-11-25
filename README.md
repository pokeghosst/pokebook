# Poke!Book (Pokeghost’s poetry noteBook)

[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fbook.pokeghost.org)
[![GitHub license](https://img.shields.io/github/license/pokegh0st/pokebook.svg)](https://github.com/pokegh0st/pokebook/blob/main/LICENSE)
![Version](https://img.shields.io/github/v/release/pokegh0st/pokebook)
![GitHub last commit](https://img.shields.io/github/last-commit/pokegh0st/pokebook)
![It's free!](https://img.shields.io/badge/price-%240-brightgreen)
[![MadeWithSvelte.com shield](https://madewithsvelte.com/storage/repo-shields/4280-shield.svg)](https://madewithsvelte.com/p/pokebook/shield-link)

<a href="https://www.buymeacoffee.com/pokegh0st" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;" ></a>

> PokeBook is your own digital notebook for writing poetry. Get into your creative flow with distraction-free environment and never worry about saving what you write!

# Patrons

PokeBook is supported by these awesome people!
| | | |
|-------------------------------------------------------|---------------------------------------------|-------------------------------------------------------------|
| | [GlueBall](https://twitter.com/MrThernlund) | _"Better to execute what is, than to never compile at all"_ |
|<img src="./patrons/j33.png" width="50px" alt="J33"/> | J33 | |

# What makes PokeBook so cool?

- Workspace split into two independent notepads – jot down notes in one and write the poem in another!
- Endless notebook that grows as you write!
- Everything is stored locally – no need to trust anyone to keep your poems nice and safe! Reload the page, close the tab, even reboot your computer, everything will stay there!
- Optional Google Drive integration for backing up and synchronizing your poems!
- The draft is autosaved with every single character written – don't worry about crashes or blackouts so you can focus on the writing!
- Click "New poem" and you immediately have a clean workspace – previous poem is saved in the Poem Stash!
- View, edit and delete your previously written poems and store as many as your computer (or Google Drive) can handle!
- Express yourself with a selection of themes and fonts!
- Write your best with PokeHelp mode! PokeHelp provides highlighting rhymes, syllable counter, and text counters (words, characters, lines)
- Want something more... unconventional? PokeMarkov will help you generate prose, poems, and any other kind of text using Markov chains

# PokeBook desktop app

PokeBook has builds for Windows, Linux (deb package and AppImage) and MacOS generated with [Tauri](https://github.com/tauri-apps/tauri). Just grab the latest package from Releases page and enjoy!

> Latest supported Tauri build is v0.6.1 - "French Toast With Extra Jam". At the moment there are no builds for later versions. I'm working on it, though!

# Installing / Getting started

You can use PokeBook at no cost by visiting https://book.pokeghost.org.

## Google Drive integration prerequisites

Functionality for storing poems in Google Drive is handled by [PokeDrive Book](https://github.com/pokegh0st/pokedrive-book). Make sure you deploy and configure it properly to use the Google Drive integration.

## Environment variables

- `PUBLIC_POKEBOOK_BASE_URL` - The base URL of the PokeBook app deployment with no trailing slash
- `PUBLIC_POKEDRIVE_BASE_URL`- The base URL of PokeDrive Book deployment with no trailing slash

## Building app for deployment

PokeBook can be built with static adapter and deployed on a generic hosting provider by doing the following:

```
git clone https://github.com/pokegh0st/pokebook.git
cd pokebook
yarn
yarn run static
```

You can deploy PokeBook to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpokegh0st%2Fpokebook&env=PUBLIC_POKEDRIVE_BASE_URL,PUBLIC_POKEBOOK_BASE_URL)

To deploy to other platform (e.g., Netlify), make sure to change the adapter.

Bare-metal deployment with custom domain will need more configuration depending on how you do it (e.g., setting up Nginx/Apache with certbot SSL, etc.).

## Docker image

The Docker image is _probably_ working but I haven't properly tested it yet.

# Developing

Environment for local development can be quickly spun up by doing the following:

```
git clone https://github.com/pokegh0st/pokebook.git
cd pokebook
yarn
yarn run dev
```

# Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

For bugs and feature requests, don't hesitate to open issues!

# License

GNU Affero General Public License v3.0 (see `LICENSE` for details).
