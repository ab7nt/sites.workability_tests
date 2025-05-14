import { expect, test, Page, Request, Locator } from '@playwright/test';
import { finalScreenshots } from '../data/finalScreenshots';

// Интерфейс для медленных запросов
interface SlowRequest {
    url: string;
    duration: string;
    method: string;
    resourceType: string;
}

// Базовый класс для страниц
export class BasePage {
    protected page: Page;
    protected pageUrl: string | null = null;
    protected headerTitle: Locator;
    protected searchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Инициализация локаторов
        this.headerTitle = page.locator('h1');
        this.searchButton = page.locator('[data-testid="search-button"], button[type="submit"]');
    }

    // Сбор и прикрепление медленных запросов к отчёту
    async logSlowRequests(threshold: number = 5000, timeout: number = 10000): Promise<SlowRequest[]> {
        const slowRequests: SlowRequest[] = [];
        let timeoutReached = false;

        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => {
                timeoutReached = true;
                reject(new Error('Timeout reached'));
            }, timeout)
        );

        const trackRequestsPromise = new Promise<void>((resolve) => {
            this.page.on('requestfinished', async (request: Request) => {
                const timing = request.timing();
                if (!timing || timeoutReached) return;

                const duration = timing.responseEnd - timing.startTime;
                if (duration > threshold) {
                    slowRequests.push({
                        url: request.url(),
                        duration: `${(duration / 1000).toFixed(2)}s`,
                        method: request.method(),
                        resourceType: request.resourceType(),
                    });
                }
            });

            resolve();
        });

        try {
            await Promise.race([timeoutPromise, trackRequestsPromise]);
        } catch (error: any) {
            if (error.message !== 'Timeout reached') throw error;
        }

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
    async open(): Promise<void> {
        await test.step('Открытие главной страницы сайта', async () => {
            await this.logSlowRequests();
            const response = await this.page.goto(this.pageUrl ?? '', { referer: 'workability-checking' });
            expect(response?.status()).toBe(200);
        });
    }

    // Проверка отображения элементов
    async checkingTheVisibilityOfElements(): Promise<void> {
        await test.step('Проверка отображения заголовка H1', async () => {
            await expect(this.headerTitle).toBeVisible();
        });
    }

    // Скриншот страницы
    async takeAScreenshot(): Promise<void> {
        await test.step('Снятие скриншота страницы и сохранение в файл', async () => {
            const name = this.pageUrl?.split('//')[1] ?? 'screenshot';
            await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
        });
    }

    // Скриншот страницы с прикреплением к отчёту
    async takeAScreenshotForReport(screenshotName = 'Скриншот', options: { fullPage?: boolean } = {}): Promise<void> {
        await test.step('Снятие скриншота страницы и прикрепление к отчёту', async () => {
            const screenshot = await this.page.screenshot({
                fullPage: options.fullPage ?? false,
            });

            await test.info().attach(screenshotName, {
                body: screenshot,
                contentType: 'image/png',
            });

            finalScreenshots.push({
                name: screenshotName,
                content: screenshot,
                timestamp: new Date(Date.now() + 3 * 3600 * 1000).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                }),
            });
        });
    }

    // Скролл страницы для нормализации загрузки
    async scrollToEndOfThePage(): Promise<void> {
        await test.step('Скролл страницы для нормализации загрузки', async () => {
            await this.page.evaluate(() => {
                if (!document.body) throw new Error('document.body is not available on this page.');
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            });
            await this.page.waitForTimeout(2000);

            await this.page.evaluate(() => {
                if (!document.body) throw new Error('document.body is not available on this page.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            await this.page.waitForTimeout(2000);
        });
    }

    // Основная функция для проверки работоспособности страницы
    async generalWorkabilityChecking(): Promise<void> {
        await test.step('Общие проверки', async () => {
            try {
                await this.open();
                await this.checkingTheVisibilityOfElements();
                await this.scrollToEndOfThePage();
                await this.takeAScreenshotForReport('Главная страница', { fullPage: true });
            } catch (error) {
                console.error('Ошибка при выполнении общих проверок:', error);
            }
        });
    }

    // Проверка страницы результатов поиска
    async checkSearchResultsPage(): Promise<void> {
        await test.step('Проверка страницы результатов поиска', async () => {
            await Promise.all([this.page.waitForLoadState('load'), this.searchButton.click()]);

            await this.scrollToEndOfThePage();
            await this.takeAScreenshotForReport('Страница результатов поиска', { fullPage: true });
        });
    }
}
