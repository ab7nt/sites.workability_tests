import { test, expect } from 'playwright/test';

export class BasePage {
    pageUrl = null;

    constructor(page) {
        this.page = page;

        // Общие локаторы
        this.headerTitle = page.locator('h1');
    }

    // Метод для отслеживания медленных запросов
    async logSlowRequests(threshold = 5 * 1000) {
        const slowRequests = [];

        // Возвращаем промис, который будет собирать данные до тех пор, пока не завершится тест
        return new Promise((resolve) => {
            this.page.on('requestfinished', (request) => {
                const timing = request.timing();
                if (!timing) return;

                const duration = timing.responseEnd - timing.startTime;
                if (duration > threshold) {
                    // Добавляем медленные запросы
                    slowRequests.push({
                        url: request.url(),
                        duration: (duration / 1000).toFixed(2) + 's',
                        method: request.method(),
                        resourceType: request.resourceType(),
                    });
                }
            });

            // Используем page.on('load') или page.waitForTimeout, чтобы дождаться окончания всех запросов
            this.page.once('load', () => {
                resolve(slowRequests);
            });
        });
    }

    // Открытие страницы с отслеживанием медленных запросов
    async open() {
        // Стартуем отслеживание медленных запросов
        const slowRequests = await this.logSlowRequests();

        // Открываем страницу
        const response = await this.page.goto(this.pageUrl, { referer: 'workability-checking' });
        expect(response.status()).toBe(200);

        // Ожидаем полной загрузки страницы (networkidle)
        // await this.page.waitForLoadState('networkidle');

        // Логируем и прикрепляем медленные запросы, если они есть
        if (slowRequests.length > 0) {
            console.log('⏱ Медленные запросы (более 5 сек):');
            slowRequests.forEach((r) => {
                console.log(`- ${r.method} ${r.url} [${r.duration}] (${r.resourceType})`);
            });

            // Прикрепляем медленные запросы к отчёту
            await test.info().attach('Медленные запросы', {
                body: Buffer.from(JSON.stringify(slowRequests, null, 2), 'utf-8'),
                contentType: 'application/json',
            });
        }
    }

    // // Открытие страницы
    // async open() {
    //     const response = await this.page.goto(this.pageUrl, { referer: 'workability-checking' });
    //     expect(response.status()).toBe(200);
    //     await this.page.waitForLoadState('networkidle');
    // }

    // Провека видимости элементов
    async checkingTheVisibilityOfElements() {
        expect(this.headerTitle).toBeVisible();
    }

    // Снятие скриншота
    async takeAScreenshot() {
        const screenshotName = this.pageUrl.split('//')[1];
        await this.page.screenshot({ path: `test-results/screenshots/${screenshotName}.png`, fullPage: true });
    }

    // Снятие скриншота и прикрепление его к отчёту
    async takeAScreenshotForReport(page) {
        const screenshot = await page.screenshot({ fullPage: true });

        await test.info().attach('Скриншот страницы', {
            body: screenshot,
            contentType: 'image/png',
        });
    }

    // Прокрутка до низа страницы
    async scrollToEndOfThePAge() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await this.page.waitForTimeout(3 * 1000); // Дать время на загрузку
    }

    // Объединение методов проверки в одну функцию
    async generalWorkabilityChecking() {
        await this.open();
        await this.checkingTheVisibilityOfElements();
        await this.scrollToEndOfThePAge();
        await this.takeAScreenshotForReport(this.page);
    }
}
