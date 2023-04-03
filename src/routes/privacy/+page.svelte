<div class="w-7/12 mt-10 mx-auto">
	<h1 class="text-4xl text-center">Privacy Policy</h1>
	<br />
	<p class="font-bold">Last updated April 03, 2023</p>
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
		settings (font, alignment, theme, etc.) are stored locally. By default, your poems are stored
		locally. Regardless of your selected storage option, PokeBook never has access to the contents
		of your poems or your perosnal information.
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
		PokeBook provides two possible storage options for poems: browser's storage and Google Drive.
		When using the former, poems and notes are stored in your local IndexedDB instance. Thus, only
		those who have acces to your device can access your poems.
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
		device. No information about you or your device is collected.
	</p>
	<br />
	<p>
		When you use 'Google Drive' storage option, your authentication data is processed by Google.
		PokeBook stores your 'refresh token' so you can save and load poems without having to
		re-authenticate each time.
	</p>
	<br />
	<p>
		When you use 'Google Drive' storage option, PokeBook has access only to files it created in your
		drive. PokeBook cannot access other files you have in your drive.
	</p>
	<br />
	<p>
		In addition, when you use 'Google Drive' storage option, your browser's Request User Agent is
		logged. Log retention is 4K lines and 1 hour of logs. This is necessary because PokeBook relies
		on Vercel's serverless functoins to send requests to Google Drive API.
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
			<td>refreshCode</td>
			<td
				>Refresh code used to generate authentication tokens for making requests to Google Drive</td
			>
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
			<td>dayTheme</td>
			<td>The name of the currently active light theme</td>
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
