<div class="w-7/12 mt-10 mx-auto">
	<h1 class="text-4xl text-center">Privacy Policy</h1>
	<br />
	<p class="font-bold">Last updated August 09, 2023</p>
	<br />
	<p>
		This Privacy Policy applies to the PokeBook (the "App") and governs how it collects, uses, and
		discloses information collected from users ("you" or "your") of the App. This policy aims to be
		as simple and straightforward as possible so you clearly understand everything that is important
		without unnecessary legal talk.
	</p>
	<br />
	<p>
		In short, PokeBook never requests any personal or identifiable information.. If you connect to
		Google Drive, your poems and personal data are stored and processed by Google. Interface
		settings (font, alignment, theme, etc.) are stored locally. If you're using browser, they are
		stored in the localStorage. On mobile devices, settings are stored in UserDefaults (on iOS) or
		SharedPreferences (on Android). By default, your poems are stored locally. Regardless of your
		selected storage option, PokeBook never has access to the contents of your poems or your
		perosnal information.
	</p>
	<br />
	<p>
		PokeBook doesn't use any kind of analytics or session recording services (such as Goole
		Analytics, Facebook Pixel, Hotjar, etc.).
	</p>
	<br />
	<h2 class="text-xl">Where are poems stored?</h2>
	<br />
	<p>
		PokeBook provides three possible storage options for poems: browser's storage (if you're using
		it in browser), device file system (if you're using a mobile app from the store) and Google
		Drive. When using the former, poems and notes are stored in your local IndexedDB instance. When
		you're using a mobile app, poems are saved as regular text files on your device. PokeBook
		doesn't read into your filesystem and only saves files in the application persistent folder.
		Please note! If you uninstall the app, the poems will be gone. With these two options only those
		who have acces to your device can access your poems.
	</p>
	<br />
	<p>
		On the other hand, when choosing Google Drive, poems and notes are stored in your Google Drive.
		This data is subject to Google's terms of service and privacy policy.
	</p>
	<br />
	<h2 class="text-xl">What information is processed and how?</h2>
	<br />
	<p>
		When you use 'local' storage option, all information is stored and processed directly on your
		device (either in browser or in file system). No information about you or your device is
		collected.
	</p>
	<br />
	<p>
		When you use 'Google Drive' storage option, your authentication data is processed by Google.
		PokeBook stores your UUID (Universally unique identifier) that is passed to PokeBook's backend
		service so that it knows it's you who's making the request. All this is needed to save and load
		poems without having to re-authenticate each time.
	</p>
	<br />
	<p>
		When you use 'Google Drive' storage option, PokeBook has access only to files it created in your
		drive. PokeBook cannot access other files you have in your drive.
	</p>
	<br />
	<p>
		In addition, when you use 'Google Drive' storage option, short-living request logs are recorded
		strictly for internal use to understand errors if they happen.
	</p>
	<br />
	<h2 class="text-xl">What information is stored on your device?</h2>
	<br />
	<h3 class="text-lg">Local Storage</h3>
	<br />
	<p>
		Parameters in local storage have no expiration; they are cleared when local storage is cleared.
	</p>
	<br />
	<table>
		<tr>
			<th>Name</th>
			<th>Purpose</th>
		</tr>
		<tr>
			<td>dayTheme</td>
			<td>The name of the currently active light theme</td>
		</tr>
		<tr>
			<td>nightTheme</td>
			<td>The name of the currently active dark theme</td>
		</tr>
		<tr>
			<td>currentPoem</td>
			<td>Identifier of the last selected poem from the list of poems</td>
		</tr>
		<tr>
			<td>poem</td>
			<td>Current poem draft that you are typing on the homepage</td>
		</tr>
		<tr>
			<td>darkMode</td>
			<td>Denotes whether the dark mode is active or not</td>
		</tr>
		<tr>
			<td>viewsState</td>
			<td>Used to remember the location of "Poem" and "Notes" panes</td>
		</tr>
		<tr>
			<td>note</td>
			<td>Current note draft that you are typing on the homepage</td>
		</tr>
		<tr>
			<td>poemName</td>
			<td>Name of the current note draft that you are typing on the homepage</td>
		</tr>
		<tr>
			<td>storageMode</td>
			<td>Denotes which storage you are using at the moment</td>
		</tr>
		<tr>
			<td>font</td>
			<td>Name of the active selected font family</td>
		</tr>
		<tr>
			<td>poemAlignment</td>
			<td>Active selected alignment option</td>
		</tr>
		<tr>
			<td>backupPoemText</td>
			<td>The text of unsaved poem you edited</td>
		</tr>
		<tr>
			<td>backupPoemName</td>
			<td>The name of unsaved poem you edited</td>
		</tr>
		<tr>
			<td>backupPoemNote</td>
			<td>The note of unsaved poem you edited</td>
		</tr>
		<tr>
			<td>pokehelp</td>
			<td>PokeHelp writing mode</td>
		</tr>
	</table>
	<br />
	<h3 class="text-lg">Session Storage</h3>
	<br />
	<table>
		<tr>
			<th>Name</th>
			<th>Purpose</th>
			<th>Expiration</th>
		</tr>
		<tr>
			<td>sveltekit:scroll</td>
			<td>Scroll state</td>
			<td>Session</td>
		</tr>
		<tr>
			<td>sveltekit:snapshot</td>
			<td>Snapshot of DOM for navigation</td>
			<td>Session</td>
		</tr>
	</table>
	<br />
	<h3 class="text-lg">IndexedDB</h3>
	<br />
	<p>
		When 'local' storage option is selected, all poems are stored in the <em>poems</em> IndexedDB database
		with the following columns. Storage for the database is permanent, it's cleared only when you clear
		it yourself.
	</p>
	<br />
	<h3 class="text-lg">Device File System</h3>
	<br />
	<p>
		When 'local' storage option is selected in a mobile app, all poems are stored in the application
		directory according to your operating system as plain text files.
	</p>
	<br />
	<table>
		<tr>
			<th>Name</th>
			<th>Purpose</th>
		</tr>
		<tr>
			<td>id</td>
			<td>Identifier of the poem record in the database</td>
		</tr>
		<tr>
			<td>note</td>
			<td>Note associated with the poem</td>
		</tr>
		<tr>
			<td>poem</td>
			<td>Contents of the poem</td>
		</tr>
		<tr>
			<td>name</td>
			<td>Name of the poem</td>
		</tr>
		<tr>
			<td>timestamp</td>
			<td>Time of the poem creation</td>
		</tr>
	</table>
	<br />
	<h2 class="text-xl">Cookies</h2>
	<br />
	<p>PokeBook doesn't use cookies.</p>
</div>
