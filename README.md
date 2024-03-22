# Poke!Book (Pokeghost’s poetry noteBook)

[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)
[![GitHub license](https://img.shields.io/github/license/pokeghosst/pokebook.svg)](https://github.com/pokeghosst/pokebook/blob/main/COPYING)
![Version](https://img.shields.io/github/v/release/pokeghosst/pokebook)
![GitHub last commit](https://img.shields.io/github/last-commit/pokeghosst/pokebook)
![It's free!](https://img.shields.io/badge/price-%240-brightgreen)

<a href="https://www.buymeacoffee.com/pokegh0st" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;" ></a>

> PokeBook is your own digital notebook for writing poetry. Get into a creative flow with distraction-free environment and never worry about saving what you write!

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
- Optional cloud integrations for storing poems in the cloud!
- The draft is auto-saved with every single character written – don't worry about crashes or blackouts, so you can focus on the writing!
- Click "New poem" and you immediately have a clean workspace – previous one is saved in the Poem Stash!
- View, edit and delete previously written poems and store as many as your computer (or cloud provider) can handle!
- Express yourself with a selection of themes and fonts!
- Write your best with PokeHelp mode! PokeHelp provides highlighting rhymes, syllable counter, and text counters (words, characters, lines)
- Want something more... unconventional? [PokeMarkov](https://github.com/pokeghosst/pokebook-markov) will help you generate prose, poems, and any other kind of text using Markov chains

# Installing / Getting started

You can use PokeBook at no cost by visiting https://book3.pokeghost.org.

## Cloud provider integration

Storing poems in various cloud providers is handled by the [PokeBook InterCloud](https://github.com/pokeghosst/pokebook-intercloud) service. See the repository for more detailed information on starting and configuring the service.

## Environment variables

For PokeBook cloud integration to work properly, the following environment variables are required.

| Variable                    | Description                                                                                                                      | Example value         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| PUBLIC_POKEBOOK_CLIENT_URL  | Base URL of the deployed web client where the user will be redirected after signing in with a cloud provider. No trailing slash! | http://localhost:5173 |
| PUBLIC_POKEBOOK_SERVER_URL  | Base URL of the PokeBook InterCloud server. No trailing slash!                                                                   | http://localhost:5173 |
| PUBLIC_POKEBOOK_FOLDER_NAME | Name of the folder that will be created on user's Google Drive.                                                                  | PokeBook 3            |
| GOOGLE_CLIENT_ID            | Client ID from registered Google Cloud application.                                                                              |                       |
| GOOGLE_CLIENT_SECRET        | Client Secret from registered Google Cloud application.                                                                          |                       |
| REDIS_HOST                  | Redis database connection host.                                                                                                  |                       |
| REDIS_PORT                  | Redis database connection port.                                                                                                  |                       |
| REDIS_PASSWORD              | Redis database connection password.                                                                                              |                       |
| DROPBOX_APP_KEY             | Key from Dropbox application.                                                                                                    |                       |
| DROPBOX_APP_SECRET          | App secret from Dropbox application.                                                                                             |                       |

## Building app for deployment

PokeBook can be built with static adapter and deployed on a generic hosting provider (like Netlify Drop) by doing the following:

```
npm run static
```

You can deploy PokeBook to Vercel in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fpokeghosst%2Fpokebook&env=PUBLIC_POKEBOOK_CLIENT_URL,PUBLIC_POKEBOOK_SERVER_URL,PUBLIC_POKEBOOK_FOLDER_NAME,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,REDIS_HOST,REDIS_PORT,REDIS_PASSWORD,DROPBOX_APP_KEY,DROPBOX_APP_SECRET&demo-title=PokeBook%203&demo-description=An%20endearing%20digital%20notebook%20for%20writing%20poetry.&demo-url=https%3A%2F%2Fbook3.pokeghost.org%2F)

PokeBook is configured with `@sveltejs/adapter-auto` so it should be easily deployable to any popular hosting provider as long as there is an adapter for it.

# Developing

Environment for local development can be quickly spun up by doing the following:

```
npm i
npm run dev
```

# Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

For bugs and feature requests, don't hesitate to open issues!

# License

GNU Affero General Public License v3.0 (see `LICENSE` for details).
