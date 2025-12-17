let get: PreferencesPlugin.getOptions => Promise.t<PreferencesPlugin.getResult>
let set: PreferencesPlugin.setOptions => Promise.t<unit>
let remove: PreferencesPlugin.removeOptions => Promise.t<unit>
let clear: unit => Promise.t<unit>
