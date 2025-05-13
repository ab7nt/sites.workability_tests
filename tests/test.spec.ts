import { test } from '@playwright/test';

test('Тестовый тест', async ({ page }) => {
    await page.goto('https://vea.ru');
    await page.pause();
});
