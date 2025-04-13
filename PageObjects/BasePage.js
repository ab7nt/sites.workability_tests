import { test, expect } from '@playwright/test';

export class BasePage {
    pageUrl = null;

    constructor(page) {
        this.page = page;

        // Общие локаторы
        this.headerTitle = page.locator('h1');
    }

    // Метод для отслеживания медленных запросов
    async logSlowRequests(threshold = 5 * 1000, timeout = 10 * 1000) {
        const slowRequests = [];
        let timeoutReached = false;

        // Таймаут для остановки ожидания через 30 секунд
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {
                timeoutReached = true;
                reject(new Error('Timeout reached'));
            }, timeout)
        );

        // Функция для отслеживания запросов
        const trackRequestsPromise = new Promise((resolve) => {
            this.page.on('requestfinished', async (request) => {
                const timing = request.timing();
                if (!timing || timeoutReached) return;

                const duration = timing.responseEnd - timing.startTime;
                if (duration > threshold) {
                    // если запрос дольше порогового времени
                    slowRequests.push({
                        url: request.url(),
                        duration: (duration / 1000).toFixed(2) + 's',
                        method: request.method(),
                        resourceType: request.resourceType(),
                    });
                }
            });

            resolve();
        });

        // Ждем либо завершения всех запросов, либо таймаута
        try {
            await Promise.race([timeoutPromise, trackRequestsPromise]);
        } catch (error) {
            if (error.message !== 'Timeout reached') {
                throw error;
            }
            console.log('Таймаут для отслеживания медленных запросов достигнут.');
        }

        // Прикрепляем медленные запросы, если они есть
        if (slowRequests.length > 0) {
            console.log('⏱ Медленные запросы (более 5 сек):');
            slowRequests.forEach((r) => {
                console.log(`- ${r.method} ${r.url} [${r.duration}] (${r.resourceType})`);
            });

            await test.info().attach('Медленные запросы', {
                body: Buffer.from(JSON.stringify(slowRequests, null, 2), 'utf-8'),
                contentType: 'application/json',
            });
        }

        return slowRequests;
    }

    // Открытие страницы
    async open() {
        await test.step('Открытие главной страницы сайта', async () => {
            await this.logSlowRequests();
            const response = await this.page.goto(this.pageUrl, { referer: 'workability-checking' });
            expect(response.status()).toBe(200);
        });
    }

    // Проверка видимости ключевых элементов
    async checkingTheVisibilityOfElements() {
        await test.step('Проверка отображения заголовка H1', async () => {
            await expect(this.headerTitle).toBeVisible();
        });
    }

    // Скриншот страницы и сохранение в файл
    async takeAScreenshot() {
        await test.step('Снятие скриншота страницы и сохранение в файл', async () => {
            const screenshotName = this.pageUrl.split('//')[1];
            await this.page.screenshot({ path: `test-results/screenshots/${screenshotName}.png`, fullPage: true });
        });
    }

    // Скриншот страницы и прикрепление к отчёту
    async takeAScreenshotForReport(options = {}) {
        // Параметры по умолчанию
        const screenshotOptions = {
            fullPage: options.fullPage ?? false,
        };

        await test.step('Снятие скриншота страницы и прикрепление к отчёту', async () => {
            const screenshot = await this.page.screenshot(screenshotOptions);

            await test.info().attach('Скриншот страницы', {
                body: screenshot,
                contentType: 'image/png',
            });
        });
    }

    // Прокрутка страницы вниз и вверх
    async scrollToEndOfThePAge() {
        await test.step('Скролл страницы для нормализации загрузки', async () => {
            await this.page.evaluate(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
            await this.page.waitForTimeout(2000);

            await this.page.evaluate(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            await this.page.waitForTimeout(2000);
        });
    }

    // Объединённая проверка
    async generalWorkabilityChecking() {
        await test.step('Проверка главной страницы', async () => {
            await this.open();
            await this.checkingTheVisibilityOfElements();
            await this.scrollToEndOfThePAge();
            await this.takeAScreenshotForReport({ fullPage: true });
        });
    }
}
