# Changelog 

# [Unreleased]

## Fixed
- Broken layout on Chrome (again... almost)

## Changed
- More elegant way to export a poem
- Constant width when exporting the poem, that corresponds to A4 page at 96 PPI
- Improved wording for saving the poem

# [0.6.0] - 2023-03-27

## Added
- New fonts: Arial, Crimson Roman, Comic Sans MS, Times Old Attic Bold
- Day theme switching
- Night theme switching (default theme -- Chocolate)
- Themes: Strawberry Sundae
- Export poem to image
- Ability to forget the latest draft
- Remember position of poem and note panels

## Fixed
- Poem alignment not being stored in local storage
- Color for label in settings for dark mode
- Greyed out text in mobile browsers when editing is disabled
- Prevent saving poem with empty name

## Changed
- Dark mode doesn't rely on Tailwind's `dark:` selector anymore to enable different night themes 

# [0.5.0] - 2023-03-19
## Added
- Dark mode
- Ability to change fonts
- Ability to set poem alignment

## Fixed
- Broken panes on poem editing

# [0.4.0] - 2023-03-14
## Added
- Confirmation when deleting the poem
- Ability to swap notebooks
- Resizing notebooks past their max height (works in a dorky way but it is what it is)
## Changed
- By default, the poem notebook is on the left hand side
## Fixed
- Hidden annoying scroll for poem name
- Dark background for rows in poem stash

# [0.3.0] - 2023-03-08
## Added
- Additional headers for improved security
- Support for building desktop apps with Tauri
## Changed
- Individual poem page is now always available with the same route instead of dynamic routes with poem ID in URL. This was necessary for enabling static adapter w/ prerenderer

# [0.2.0] - 2023-03-07
## Added 
- Ability to set poem names
## Fixed
- Duplicating lines and missing line breaks when editing a poem
## Changed
- More convenient layout on small screens
- Poem page includes both notes and poem on one screen

## [0.1.0] 
## Added
- Welcome to Poke!Book~
