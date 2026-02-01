/*
Parts of the implementation are taken and adapted from ionic-team/capacitor-filesystem
https://github.com/ionic-team/capacitor-filesystem/
Copyright (c) 2025 Ionic
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Additions and modifications are licensed under the terms of GNU Affero
General Public License as published by the Free Software Foundation,
either version 3 of the License, or (at your option) any later version.
*/

import type { CanShareResult, ShareOptions, SharePlugin, ShareResult } from './SharePlugin';

export class ShareWeb implements SharePlugin {
	async canShare(): Promise<CanShareResult> {
		if (typeof navigator === 'undefined' || !navigator.share) {
			return { value: false };
		} else {
			return { value: true };
		}
	}
	async share(options: ShareOptions): Promise<ShareResult> {
		if (typeof navigator === 'undefined' || !navigator.share) {
			throw new Error('Share API not available in this browser');
		}

		await navigator.share({
			title: options.title,
			text: options.text,
			url: options.url
		});
		return {};
	}
}
