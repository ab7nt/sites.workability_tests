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
    }

    // Провека видимости элементов
    async checkingTheVisibilityOfElements() {
        expect(this.headerTitle).toBeVisible();
    }

    // Снятие скриншота
    async takeAScreenshot() {
        const screenShotPath = this.pageUrl.split('//')[1];
        await this.page.screenshot({ path: `test-results/screenshots/${screenShotPath}.png`, fullPage: true });
    }

    async generalWorkabilityChecking() {
        await this.open();
        await this.checkingTheVisibilityOfElements();
        await this.takeAScreenshot();
    }
}
