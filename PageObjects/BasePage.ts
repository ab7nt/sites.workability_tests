import { expect, test, Page, Request, Locator } from '@playwright/test';
import { finalScreenshots } from '../data/finalScreenshots';
import { helpers } from '../utils/helpers';

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

    // Локаторы
    protected headerTitle: Locator;
    protected searchButton: { [key: string]: Locator };
    protected searchResultItems: { [key: string]: Locator };
    protected searchResultDropdown: { [key: string]: Locator };
    protected searchInput: { [key: string]: Locator };
    protected header: { [key: string]: Locator };
    protected catalogButton: { [key: string]: Locator };
    protected quickOrderButton: { [key: string]: Locator };
    protected searchForm: { [key: string]: Locator };
    protected quickOrderPopup: { [key: string]: Locator };
    protected quickOrderPopupCloseButton: { [key: string]: Locator };
    protected catalogLeftSide: { [key: string]: Locator };
    protected categoriesItems: { [key: string]: Locator };
    protected catalogRightSide: { [key: string]: Locator };
    protected linksInActiveArea: { [key: string]: Locator };
    protected randomSubcategoryLinkInActiveArea: { [key: string]: Locator };
    protected catalog: { [key: string]: Locator };

    constructor(page: Page) {
        this.page = page;

        // Инициализация локаторов
        // Заголовок страницы
        this.headerTitle = page.locator('h1');
        // Хедер
        this.header = {
            mdmprint: page.locator('div.header-content_desktop'),
            copy: page.locator('header.header--pc'),
            litera: page.locator('header'),
            onetm: page.locator('header'),
            vea: page.locator('header'),
            sequoia: page.locator('header#header'),
        };
        // Кнопка "Каталог" или бургер-меню
        this.catalogButton = {
            mdmprint: this.header.mdmprint.locator('div.header-catalog__btn'),
            copy: this.header.copy.locator('div.header-catalog__btn'),
            litera: this.header.litera.locator('div.link-btn.header-menu__toggler'),
            onetm: this.header.onetm.locator('button[data-toggle="menu"]'),
            vea: this.header.vea.locator('div.header-dropdown'),
        };
        // Кнопка "Быстрый заказ", "Оставить заявку" и т.д.
        this.quickOrderButton = {
            mdmprint: this.header.mdmprint.locator('button[data-popup="quick-order"]'),
            copy: this.header.copy.locator('button[data-popup="fast-order"]'),
            litera: this.page.locator('footer button[data-popup="order"]'),
            onetm: this.header.onetm.locator('button[data-popup="consult"]'),
            vea: this.header.vea.locator('div.header__request button.popup-open'),
        };

        // Поиск
        // Форма поиска
        this.searchForm = {
            mdmprint: this.header.mdmprint.locator('form[role="search"]'),
            copy: this.header.copy.locator('form.mobile-hide'),
        };
        // Поле ввода поиска
        this.searchInput = {
            mdmprint: this.searchForm.mdmprint.locator('input[name="s"]'),
            copy: this.searchForm.copy.locator('input[name="s"]'),
        };
        // Кнопка поиска
        this.searchButton = {
            mdmprint: this.searchForm.mdmprint.locator('button[type="submit"]'),
            copy: this.searchForm.copy.locator('button[type="submit"]'),
        };
        // Выпадающий список результатов поиска
        this.searchResultDropdown = {
            mdmprint: this.header.mdmprint.locator('span.search-results__list'),
            copy: this.header.copy.locator('span.search-results__list'),
        };
        // Элементы результатов поиска
        this.searchResultItems = {
            mdmprint: this.searchResultDropdown.mdmprint.locator('a'),
            copy: this.searchResultDropdown.copy.locator('a'),
        };

        // Поп-апы
        // Быстрый заказ или "Оставить заявку" и т.д.
        this.quickOrderPopup = {
            mdmprint: page.locator('div.popup--quick-order.popup--active'),
            copy: page.locator('div.popup--fast-order.popup--active'),
            litera: page.locator('div.popup--order.popup--active'),
            onetm: page.locator('div.popup--consult.popup--active'),
            vea: page.locator('div.popup--order.popup--active'),
        };
        // Закрывающая кнопка поп-апа "Быстрый заказ"
        this.quickOrderPopupCloseButton = {
            mdmprint: this.quickOrderPopup.mdmprint.locator('button.popup-close'),
            copy: this.quickOrderPopup.copy.locator('div.popup__close'),
            litera: this.quickOrderPopup.litera.locator('button.popup-close'),
            onetm: this.quickOrderPopup.onetm.locator('div.popup-close'),
            vea: this.quickOrderPopup.vea.locator('button.popup-close'),
        };

        // Каталог или бургер-меню
        // Сам каталог или бургер-меню
        this.catalog = {
            mdmprint: this.header.mdmprint.locator('div.header-catalog__content'),
            copy: this.header.copy.locator('div.header-catalog.__active'),
            litera: this.header.litera.locator('div.header-menu.__active'),
            onetm: this.header.onetm.locator('div.__active[data-toggle-id="menu"]'),
        };
        // Левая часть (категории)
        this.catalogLeftSide = {
            mdmprint: this.catalog.mdmprint.locator('div.header-catalog__aside'),
            copy: this.catalog.copy.locator('ul#menu-katalog1'),
            litera: this.catalog.litera.locator('div.header-menu__level0'),
            onetm: this.catalog.onetm.locator('div.header-menu__col.header-menu__col-categories'),
            vea: this.header.vea.locator('div.header-dropdown__list'),
        };
        // Сами категории
        this.categoriesItems = {
            mdmprint: this.catalogLeftSide.mdmprint.locator('button.header-catalog__category'),
            copy: this.catalogLeftSide.copy.locator('a.header-catalog__category'),
            litera: this.catalogLeftSide.litera.locator('a'),
            onetm: this.catalogLeftSide.onetm.locator('a.header-menu__category'),
            vea: this.catalogLeftSide.vea.locator('a.dropdown__list-item'),
        };
        // Правая часть (подкатегории и услуги)
        this.catalogRightSide = {
            mdmprint: this.catalog.mdmprint.locator('div.header-catalog__page.tab-item--active'),
            copy: this.catalog.copy.locator('div.header-catalog__page.tab-item--active'),
        };
        // Сами подкатегории и услуги
        this.linksInActiveArea = {
            mdmprint: this.catalogRightSide.mdmprint.locator('a'),
            copy: this.catalogRightSide.copy.locator('a'),
        };
        // this.randomSubcategoryLinkInActiveArea = {
        //     mdmprint: this.catalogRightSide.mdmprint.locator('a.header-catalog__group-header'),
        //     copy: this.catalogRightSide.copy.locator('a.header-catalog__group-header'),
        // };
    }

    // Метод для получения имени сайта из URL
    // Например, для URL "https://mdmprint.ru" вернёт "mdmprint"
    getSiteNameFromURL(): string {
        const url = new URL(this.pageUrl);
        const hostParts = url.hostname.split('.');
        const siteName = hostParts.length > 2 ? hostParts[1] : hostParts[0];

        // Приведение '1-tm' к 'onetm'
        return siteName.startsWith('1-') ? siteName.replace('1-', 'one') : siteName;
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
        const site = this.getSiteNameFromURL();

        await test.step('Проверка страницы результатов поиска', async () => {
            await Promise.all([this.page.waitForLoadState('load'), this.searchButton[site].click()]);

            await this.scrollToEndOfThePage();
            await this.takeAScreenshotForReport('Страница результатов поиска', { fullPage: true });
        });
    }

    // Метод для проверки поиска
    async checkingSearch(): Promise<void> {
        const site = this.getSiteNameFromURL();
        const word = helpers.getRandomSearchWord(); // Случайное слово для поиска

        await test.step('Ввод текста в поле поиска', async () => {
            await this.searchInput[site].fill(word);
            await expect(this.searchInput[site]).toHaveValue(word);
        });

        await test.step('Проверка выпадающего списка результатов поиска', async () => {
            await this.searchResultDropdown[site].waitFor({ state: 'visible' });
            expect(await this.searchResultItems[site].count()).toBeGreaterThan(0);

            const resultItems = await this.searchResultItems[site].all();
            let randomIndex = Math.floor(Math.random() * resultItems.length);
            const randomResultItem = resultItems[randomIndex];
            await randomResultItem.hover();

            await this.takeAScreenshotForReport('Дропдаун результатов поиска');
        });

        await test.step('Проверка страницы результатов поиска', async () => {
            await this.searchButton[site].click();

            await this.page.waitForLoadState('domcontentloaded');

            // Дождаться нужного URL (или падение через timeout)
            await expect.poll(() => this.page.url(), { timeout: 10000 }).toContain('?s=');

            await this.scrollToEndOfThePage();
            await this.takeAScreenshotForReport('Страница результатов поиска', { fullPage: true });
        });
    }

    // Метод для проверки меню каталога
    async catalogChecking(): Promise<void> {
        const site = this.getSiteNameFromURL();

        await test.step('Открытие меню каталога', async () => {
            if (site === 'litera') {
                await this.catalogButton[site].hover();
            } else {
                await this.catalogButton[site].click();
            }

            await this.catalogLeftSide[site].waitFor({ state: 'visible' });
        });

        await test.step('Раскрытие случайной категории в меню каталога', async () => {
            const categories = await this.categoriesItems[site].all();
            let randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];

            if (site === 'mdmprint') {
                await randomCategory.click();
            } else {
                await randomCategory.hover();
            }
        });

        await this.takeAScreenshotForReport('Каталог');
    }

    // Метод для проверки поп-апа "Быстрый заказ", ""Оставить заявку" и т.д.
    async checkingQuickOrderPopup(): Promise<void> {
        const site = this.getSiteNameFromURL();

        await test.step('Открытие поп-апа', async () => {
            await this.quickOrderButton[site].click();
            await this.quickOrderPopup[site].waitFor({ state: 'visible' });
            await this.page.waitForTimeout(1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Поп-ап заявки');

        await test.step('Скрытие поп-апа "Быстрый заказ"', async () => {
            await this.quickOrderPopupCloseButton[site].click();
            await this.page.locator('div.popup.popup--quick-order.popup_swipable').waitFor({ state: 'hidden' });
        });
    }
}
