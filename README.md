# Poke!Book (Pokeghost’s poetry noteBook)

[![greater-good](https://honey.badgers.space/badge/greater-good/affirmation/green)](https://good-labs.github.io/greater-good-affirmation)
[![GitHub license](https://honey.badgers.space/badge/license/AGPL-3.0/orange)](./COPYING)
![Version](https://badgers.space/codeberg/release/pokesuite/pokebook)
![It's free!](https://honey.badgers.space/badge/price/$0/green)

> PokeBook is your own digital notebook for writing poetry. Get into a creative flow with distraction-free environment and never worry about saving what you write!

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

You can use PokeBook at no cost by visiting https://book.pokeghost.org.

## Building app for deployment

PokeBook can be built with static adapter and deployed on a generic hosting provider (like Netlify Drop) by doing the following:

```
bun run static
```

PokeBook is configured with `@sveltejs/adapter-auto` so it should be easily deployable to any popular hosting provider as long as there is an adapter for it.

# Developing

Environment for local development can be quickly spun up by doing the following:

```
bun i
bun dev
```

# Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

For bugs and feature requests, don't hesitate to open issues!

## Branch structure

- `main` - current production branch, deployed to https://book.pokeghost.org/
- `stage` - current nightly branch, deployed to https://staging.book.pokeghost.org/

# License

GNU Affero General Public License v3.0 (see `LICENSE` for details).

# Patrons

Poke!Book is funded with the help of its patrons! See `PATRONS.md` to see their full list.
