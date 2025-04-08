import { test } from 'playwright/test';
import { expect } from 'playwright/test';

export class BasePage {
    pageUrl = null;

    constructor(page) {
        this.page = page;

        // Общие локаторы
        this.headerTitle = page.locator('h1');
    }

    // Открытие страницы
    async open() {
        const response = await this.page.goto(this.pageUrl, { referer: 'workability-checking' });
        expect(response.status()).toBe(200);
        await this.page.waitForLoadState('networkidle');
    }

    // Провека видимости элементов
    async checkingTheVisibilityOfElements() {
        expect(this.headerTitle).toBeVisible();
    }

    // Снятие скриншота
    async takeAScreenshot(page) {
        const screenshot = await page.screenshot({ fullPage: true });

        // Прикрепляем скриншот к отчёту
        await test.info().attach('Скриншот страницы', {
            body: screenshot,
            contentType: 'image/png',
        });

        // const screenShotPath = this.pageUrl.split('//')[1];
        // await this.page.screenshot({ path: `test-results/screenshots/${screenShotPath}.png`, fullPage: true });
    }

    // Объединение методов проверки в одну функцию
    async generalWorkabilityChecking() {
        await this.open();
        await this.checkingTheVisibilityOfElements();
        await this.takeAScreenshot(this.page);
    }
}
