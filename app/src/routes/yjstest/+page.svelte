<script lang="ts">
	import { PoemDoc } from '$lib/models/PoemDoc';
	import { decodeFromBase64 } from '$lib/util/base64';

	const localPoem = new PoemDoc();

	localPoem.getTitle().insert(0, 'test');
	localPoem.getTitle().insert(4, ' more');

	const localPoemState = localPoem.getState();

	console.log(localPoem.getTitle().toString());
	console.log(localPoemState);
	const stateArray = decodeFromBase64(localPoemState);

	const remotePoem = new PoemDoc();

	remotePoem.importState(stateArray);
	remotePoem.getTitle().insert(4, ' even');

	console.log(remotePoem.getTitle().toString());

	const remotePoemState = decodeFromBase64(remotePoem.getState());

	localPoem.importState(remotePoemState);

	console.log(localPoem.getTitle().toString());
</script>

<h1>y.js test</h1>
