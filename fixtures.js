import { test } from '@playwright/test';
import { BasePage } from './PageObjects/BasePage';

test.afterEach(async ({ page, context }) => {
    const basePage = new BasePage(page);

    await basePage.attachFinalScreenshots();
});
