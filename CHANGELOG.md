# Changelog

## [2.0.0-rc1] - 2023-08-21

### Added
- Android application

### Changed
- Moved Google Drive integration out
- Refactored app settings to Capacitor Preferences API
- Refactored poem storage to Capacitor Filesystem API
- Proper static site generation with server-side rendering

## [1.2.2] - 2023-06-14

### Fixed
- Errors with Google Drive integration
- Poem stash placeholder text wrong color in dark mode

### Changed

- Removed non-exception prints to console

## [1.2.1] - 2023-06-11

### Fixed
- Unable to load poems from Google Drive

### Changed
- Bump vite from 4.1.4 to 4.1.5

## [1.2.0] - 2023-05-26

### Added
- Log out of Google Drive
- Minimalistic logo that adapts to the theme
- Burger menu on small screens
- New day theme: Cherry Blossom

### Fixed
- Line syllable counters being displayed in wrong places when lines are very long
- Line syllable counters clashing with the poem
- Possibly inadequate notebook auto height behavior
- Oversized text underline
- Incorrect Poem Stash behavior with Google Drive in some cases
- Invalid date and inaccessible when saving previously unsaved poem to Google Drive
- Notebooks being cut off when poem/notes are too long
- Notebooks going goblin mode with very long lines
- Incorrect styling of disabled fields in Safari on iOS for non-default themes

### Changed
- Tweaks for added visual appeal and delight

## [1.1.0] - 2023-04-12

### Added
- Saving contents of edited poems. Delete or save -- you decide
- Red Velvet night theme

### Fixed
- Rhyme coloring issues
- Poem padding so it doesn't get smushed with syllables

### Changed
- Removed Tauri
- Made rhyme highlights blurry

## [1.0.0] - 2023-04-11

### Added
- Confirmation when trying to close the page with unsaved changes to the poem
- PokeHelp mode: highlighting rhymes, syllable counter, text counters (words, characters, lines)
- PokeMarkov
- Cookie Dough theme

### Fixed
- Broken notebook panes when resizing
- Wrong order in Poem Stash

## [0.7.0] - 2023-04-03

### Added
- Black Lobelia theme
- Lemon tart theme
- Google Drive storage option

### Fixed
- Switcher for night themes

## [0.6.1] - 2023-03-28

### Fixed
- Broken layout on Chrome (again... almost)

### Changed
- More elegant way to export a poem
- Constant width when exporting the poem, that corresponds to A4 page at 96 PPI
- Improved wording for saving the poem

## [0.6.0] - 2023-03-27

### Added
- New fonts: Arial, Crimson Roman, Comic Sans MS, Times Old Attic Bold
- Day theme switching
- Night theme switching (default theme -- Chocolate)
- Themes: Strawberry Sundae
- Export poem to image
- Ability to forget the latest draft
- Remember position of poem and note panels

### Fixed
- Poem alignment not being stored in local storage
- Color for label in settings for dark mode
- Greyed out text in mobile browsers when editing is disabled
- Prevent saving poem with empty name

### Changed
- Dark mode doesn't rely on Tailwind's `dark:` selector anymore to enable different night themes 

## [0.5.0] - 2023-03-19

### Added
- Dark mode
- Ability to change fonts
- Ability to set poem alignment

### Fixed
- Broken panes on poem editing

## [0.4.0] - 2023-03-14

### Added
- Confirmation when deleting the poem
- Ability to swap notebooks
- Resizing notebooks past their max height (works in a dorky way but it is what it is)

### Changed
- By default, the poem notebook is on the left hand side

### Fixed
- Hidden annoying scroll for poem name
- Dark background for rows in poem stash

## [0.3.0] - 2023-03-08

### Added
- Additional headers for improved security
- Support for building desktop apps with Tauri

### Changed
- Individual poem page is now always available with the same route instead of dynamic routes with poem ID in URL. This was necessary for enabling static adapter w/ prerenderer

## [0.2.0] - 2023-03-07

### Added 
- Ability to set poem names

### Fixed
- Duplicating lines and missing line breaks when editing a poem

### Changed
- More convenient layout on small screens
- Poem page includes both notes and poem on one screen

## [0.1.0] 

### Added
- Welcome to Poke!Book~
