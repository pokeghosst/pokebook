import { afterAll, beforeAll, test } from 'vitest';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { expect } from '@playwright/test';

const PORT = 5173;

let server: PreviewServer;
let browser: Browser;
let page: Page;

beforeAll(async () => {
	server = await preview({ preview: { port: PORT } });
	browser = await chromium.launch({ headless: true });
	page = await browser.newPage();
});

afterAll(async () => {
	await browser.close();
	await new Promise<void>((resolve, reject) => {
		server.httpServer.close((error) => (error ? reject(error) : resolve()));
	});
});

test("first test", async () => {
	await page.goto(`http://localhost:${PORT}`);
	await expect(page).toHaveURL(`http://localhost:${PORT}/`);
});
