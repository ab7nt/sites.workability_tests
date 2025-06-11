import { expect, test, Page, Locator } from '@playwright/test';
import { finalScreenshots } from '../data/finalScreenshots';
import { helpers } from '../utils/helpers';

// Общий тип для всех словарей локаторов
export type LocatorMap = { [key: string]: Locator };

// Базовый класс для страниц
export class BasePage {
    protected page: Page;
    protected pageUrl: string | null = null;

    protected get site(): string {
        if (!this.pageUrl) throw new Error('pageUrl not set');
        return this.getSiteNameFromURL();
    }

    // Локаторы
    protected isMobile: boolean = false;

    protected headerTitle: Locator;
    protected searchInputButton: LocatorMap;
    protected searchResultItems: LocatorMap;
    protected searchResultDropdown: LocatorMap;
    protected searchInput: LocatorMap;
    protected header: LocatorMap;
    protected catalogButton: LocatorMap;
    protected quickOrderButton: LocatorMap;
    protected searchForm: LocatorMap;
    protected quickOrderPopup: LocatorMap;
    protected quickOrderPopupCloseButton: LocatorMap;
    protected catalogLeftSide: LocatorMap;
    protected categoriesItems: LocatorMap;
    protected catalogRightSide: LocatorMap;
    protected linksInCatalogRightSide: LocatorMap;
    protected randomSubcategoryLinkInActiveArea: LocatorMap;
    protected catalog: LocatorMap;
    protected headerSearchButton: LocatorMap;
    protected burgerMenuButton: LocatorMap;
    protected headerMobile: LocatorMap;
    protected quickOrderButtonMobile: LocatorMap;
    protected catalogButtonMobile: LocatorMap;
    protected catalogMobile: LocatorMap;
    protected categoriesItemsMobile: LocatorMap;
    protected searchInputMobile: LocatorMap;
    protected searchResultDropdownMobile: LocatorMap;
    protected searchResultItemsMobile: LocatorMap;
    protected searchButtonMobile: LocatorMap;
    protected searchInputButtonMobile: LocatorMap;
    protected bottomTabMenu: Locator;
    protected bottomTabMenuMainTab: LocatorMap;
    protected bottomTabMenuCatalogTab: LocatorMap;

    constructor(page: Page) {
        this.page = page;

        // Инициализация локаторов
        // Десктопная версия
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
        // Кнопка поиска в хедере
        this.headerSearchButton = {
            onetm: this.header.onetm.locator('button[data-toggle="search"]'),
            litera: this.header.litera.locator('div.header-top__nav div.header-search__toggler'),
        };

        // Поиск
        // Форма поиска
        this.searchForm = {
            mdmprint: this.header.mdmprint.locator('form[role="search"]'),
            copy: this.header.copy.locator('form.mobile-hide'),
            onetm: this.header.onetm.locator('div[data-toggle-id="search"] form'),
            litera: this.header.litera.locator('form[role="search"]'),
        };
        // Поле ввода поиска в хедере
        this.searchInput = {
            mdmprint: this.searchForm.mdmprint.locator('input[name="s"]'),
            copy: this.searchForm.copy.locator('input[name="s"]'),
            onetm: this.searchForm.onetm.locator('input[name="s"]'),
            litera: this.searchForm.litera.locator('input[name="s"]'),
        };
        // Кнопка поиска в поле ввода
        this.searchInputButton = {
            mdmprint: this.searchForm.mdmprint.locator('button[type="submit"]'),
            copy: this.searchForm.copy.locator('button[type="submit"]'),
            onetm: this.searchForm.onetm.locator('button:has(use[*|href="#search"])'),
            litera: this.searchForm.litera.locator('button[type="submit"]'),
        };
        // Выпадающий список результатов поиска
        this.searchResultDropdown = {
            mdmprint: this.header.mdmprint.locator('span.search-results__list'),
            copy: this.header.copy.locator('span.search-results__list'),
            onetm: this.searchForm.onetm.locator('div.search-results__list'),
            litera: this.header.litera.locator('div.search-results__list'),
        };
        // Элементы результатов поиска
        this.searchResultItems = {
            mdmprint: this.searchResultDropdown.mdmprint.locator('a'),
            copy: this.searchResultDropdown.copy.locator('a'),
            onetm: this.searchResultDropdown.onetm.locator('a'),
            litera: this.searchResultDropdown.litera.locator('a'),
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
            mdmprint: this.header.mdmprint.locator('div.header-catalog__content, div.--js-mobile-menu'),
            copy: this.header.copy.locator('div.header-catalog.__active'),
            litera: this.header.litera.locator('div.header-menu.__active'),
            onetm: this.header.onetm.locator('div.__active[data-toggle-id="menu"]'),
        };
        // Левая часть (категории)
        this.catalogLeftSide = {
            mdmprint: this.catalog.mdmprint.locator('div.header-catalog__aside, div.--js-mobile-menu-catalog'),
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
        this.linksInCatalogRightSide = {
            mdmprint: this.catalogRightSide.mdmprint.locator('a'),
            copy: this.catalogRightSide.copy.locator('a'),
        };

        // Мобильная версия
        // Хедер (адаптив)
        this.headerMobile = {
            mdmprint: this.page.locator('div.header-menu__mobile'),
            copy: this.page.locator('header.header_mobile'),
        };

        // Кнопка "Быстрый заказ", "Оставить заявку и т.д." (адаптив)
        this.quickOrderButtonMobile = {
            mdmprint: this.headerMobile.mdmprint.locator('button[data-popup="quick-order"]'),
            copy: page.locator('button.fastorder-trigger_mobile'),
            litera: this.page.locator('footer button[data-popup="order"]'),
            onetm: page.locator('button[data-popup="consult"].footer-consult'),
            vea: this.page.locator('div.footer-order button[data-popup="order"]'),
        };

        // Кнопка бургер-меню (адаптив)
        this.burgerMenuButton = {
            mdmprint: this.headerMobile.mdmprint.locator('div.header-toggler_mobile'),
            copy: this.headerMobile.copy.locator('button[data-mobile-menu="menu"]'),
            litera: this.header.litera.locator('div.header-mobile-controls__icon.header-menu__toggler'),
            onetm: this.header.onetm.locator('button[data-toggle="menu"]'),
            vea: this.header.vea.locator('div.header-menu__toggler'),
        };

        // Поиск (адаптив)
        // Кнопка поиска в хедере (адаптив)
        this.searchButtonMobile = {
            mdmprint: this.headerMobile.mdmprint.locator('input[name="s"]').first(), // Клик по инпуту поиска
            copy: this.headerMobile.copy.locator('button[data-mobile-menu="search"]'),
            litera: this.header.litera.locator('div.header-mobile-controls__icon.header-search__toggler'),
        };
        // Поле ввода поиска в хедере (адаптив)
        this.searchInputMobile = {
            mdmprint: this.headerMobile.mdmprint.locator('input[name="s"]').first(),
            copy: this.headerMobile.copy.locator('input[name="s"]'),
            litera: this.header.litera.locator('input[name="s"]'),
            onetm: this.header.onetm.locator('div[data-toggle-id="menu"] input[name="s"]'),
        };
        // Кнопка поиска в поле ввода (адаптив)
        this.searchInputButtonMobile = {
            litera: this.header.litera.locator('button.search-nwp__submit-button'),
            onetm: this.header.onetm.locator('div[data-toggle-id="menu"] button.input-button'),
        };

        // Выпадающий список результатов поиска (адаптив)
        this.searchResultDropdownMobile = {
            mdmprint: this.headerMobile.mdmprint.locator('span.search-results__list').first(),
            copy: this.headerMobile.copy.locator('span.search-results__list'),
            onetm: page.locator('div.show-mobile div.search-results__list'),
            litera: this.header.litera.locator('div.search-results__list'),
        };
        // Элементы результатов поиска (адаптив)
        this.searchResultItemsMobile = {
            mdmprint: this.searchResultDropdownMobile.mdmprint.locator('a'),
            copy: this.searchResultDropdownMobile.copy.locator('a'),
            onetm: this.searchResultDropdownMobile.onetm.locator('a'),
            litera: this.searchResultDropdownMobile.litera.locator('a'),
        };

        // Нижнее тап-меню для ccopy.ru (адаптив)
        // Само меню (адаптив)
        this.bottomTabMenu = page.locator('div.header-control.stick-nav');
        // Кнопка "Главная" (адаптив)
        this.bottomTabMenuMainTab = {
            active: this.bottomTabMenu.locator('span.header-control__button--active'),
            inactive: this.bottomTabMenu.locator('span.header-control__button'),
        };
        // Кнопка "Каталог" (адаптив)
        this.bottomTabMenuCatalogTab = {
            active: this.bottomTabMenu.locator('button.header-control__button--catalog.header-control__button--active'),
            inactive: this.bottomTabMenu.locator('button.header-control__button--catalog'),
        };

        // Каталог (адаптив)
        // Сама кнопка каталога (адаптив)
        this.catalogButtonMobile = {
            mdmprint: this.headerMobile.mdmprint.locator('button[data-mobile-menu="menu-catalog"]'),
        };
        // Сам каталог (адаптив)
        this.catalogMobile = {
            mdmprint: this.headerMobile.mdmprint.locator('div.--js-mobile-menu-catalog'),
            copy: page.locator('div.tab-bar.popup--catalog'),
            litera: this.header.litera.locator('div.header-menu__catalog'),
            onetm: this.header.onetm.locator('div.header-menu__col-categories'),
            vea: this.header.vea.locator('div.header-menu__services'),
        };
        // Категории (адаптив)
        this.categoriesItemsMobile = {
            mdmprint: this.catalogMobile.mdmprint.locator('span[data-mobile-menu*="menu-catalog"]'),
            copy: this.catalogMobile.copy.locator('button.state-category__list-item'),
            litera: this.catalogMobile.litera.locator('a[data-hover-tab*="HeaderMenuMain1"]'),
            onetm: this.catalogMobile.onetm.locator('a.header-menu__category'),
        };
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

    // Открытие страницы
    async open(): Promise<void> {
        const currentUrl = this.page.url();

        if (currentUrl.startsWith(this.pageUrl)) {
            return; // Страница уже открыта — повторно не переходим
        }

        await test.step(`Открытие страницы: ${this.pageUrl}`, async () => {
            // Перехват и игнор загрузки v2.js (Марквиз)
            const abortJs = '**/v2.js';
            await this.page.route(abortJs, (route) => route.abort());

            const response = await this.page.goto(this.pageUrl, {
                referer: 'workability-checking',
                waitUntil: 'load',
            });

            // Отмена перехвата после загрузки страницы
            await this.page.unroute(abortJs);

            expect(response, 'Не удалось перейти по URL').not.toBeNull();
            expect(response?.status(), `Неверный статус: ${response?.status()}`).toBe(200);

            // Ожидание отображения баннера над хедером (для copy.ru)
            if (this.site === 'copy') {
                await this.page.locator('div.promo').waitFor({ state: 'visible' });
            } else {
                await this.page.waitForLoadState('load');
            }
        });
    }

    // Проверка версии сайта (мобильная или десктопная)
    async init(): Promise<void> {
        const viewport = this.page.viewportSize();
        this.isMobile = viewport ? viewport.width <= 768 : false;
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
            await this.page.waitForTimeout(1000);

            await this.page.evaluate(() => {
                if (!document.body) throw new Error('document.body is not available on this page.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            await this.page.waitForTimeout(1000);
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
            await Promise.all([this.page.waitForLoadState('load'), this.searchInputButton[this.site].click()]);

            await this.scrollToEndOfThePage();
            await this.takeAScreenshotForReport('Страница результатов поиска', { fullPage: true });
        });
    }

    // Метод для проверки поиска
    async checkingSearch(): Promise<void> {
        // Случайное слово для поиска
        const word = helpers.getRandomSearchWord(this.site);

        await test.step('Ввод текста в поле поиска', async () => {
            // Ожидание загрузки основного скрипта
            if (this.site === 'mdmprint') {
                await this.page.waitForResponse((resp) => resp.url().includes('main.js') && resp.status() === 200);
                await this.page.waitForTimeout(1000);
            }

            // Открытие поля поиска (если требуется)
            if (this.isMobile) {
                if (this.site !== 'onetm') {
                    await this.searchButtonMobile[this.site].click();
                }
                if (this.site === 'onetm') {
                    await this.burgerMenuButton[this.site].click();
                }
            } else {
                const sitesRequiringClick = new Set(['litera', 'onetm']);
                if (sitesRequiringClick.has(this.site)) {
                    await this.headerSearchButton[this.site].click();
                }
            }

            // Ввод текста в поле поиска
            if (this.isMobile) {
                await this.searchInputMobile[this.site].fill(word);
                await expect(this.searchInputMobile[this.site]).toHaveValue(word);
            } else {
                await this.searchInput[this.site].pressSequentially(word, { delay: 100 });
                await expect(this.searchInput[this.site]).toHaveValue(word);
            }
        });

        await test.step('Проверка выпадающего списка результатов поиска', async () => {
            // Проверка наличия выпадающего списка результатов поиска
            if (this.isMobile) {
                await this.searchResultDropdownMobile[this.site].waitFor({ state: 'visible' });
                await this.page.waitForTimeout(1000); // Пропуск анимации
                expect(await this.searchResultItemsMobile[this.site].count()).toBeGreaterThan(0);
            } else {
                await this.searchResultDropdown[this.site].waitFor({ state: 'visible' });
                expect(await this.searchResultItems[this.site].count()).toBeGreaterThan(0);
            }

            // Наведенеие на случайный элемент из выпадающего списка (только для десктопа)
            if (!this.isMobile) {
                const resultItems = await this.searchResultItems[this.site].all();
                let randomIndex = Math.floor(Math.random() * resultItems.length);
                const randomResultItem = resultItems[randomIndex];
                await randomResultItem.hover();
            } else {
                return;
            }

            await this.scrollToEndOfThePage();
            await this.takeAScreenshotForReport('Дропдаун результатов поиска');
        });

        await test.step('Проверка страницы результатов поиска', async () => {
            // Нажатие на кнопку "Поиск" или "Enter"
            if (this.isMobile) {
                // Enter в поле поиска
                if (this.site === 'mdmprint' || this.site === 'copy') {
                    await this.searchInputMobile[this.site].press('Enter');
                } else {
                    // Клик по кнопке "Поиск"
                    await this.searchInputButtonMobile[this.site].click();
                }
            } else {
                await this.searchInputButton[this.site].click();
            }

            await this.page.waitForLoadState('domcontentloaded');

            // Дождаться нужного URL (или падение через timeout)
            await expect.poll(() => this.page.url(), { timeout: 10000 }).toContain('?s=');

            // await this.scrollToEndOfThePage();
            await this.takeAScreenshotForReport('Страница результатов поиска', { fullPage: true });
        });
    }

    // Метод для проверки меню каталога
    async catalogChecking(): Promise<void> {
        await test.step('Открытие меню каталога', async () => {
            if (this.isMobile) {
                if (this.site === 'copy') {
                    // Клик по кнопке "Каталог" в нижнем тап-меню (адаптив)
                    await this.bottomTabMenuCatalogTab['inactive'].click();
                } else if (this.site === 'onetm' || this.site === 'litera' || this.site === 'vea') {
                    // Клик по бургер-меню (адаптив)
                    await this.burgerMenuButton[this.site].click();
                } else {
                    // Открытие бургер-меню и затем каталога (адаптив)
                    await this.burgerMenuButton[this.site].click();
                    await this.catalogButtonMobile[this.site].click();
                }
            } else {
                // Наведение или клик, в зависимости от сайта (десктоп)
                if (this.site === 'litera') {
                    await this.catalogButton[this.site].hover();
                } else {
                    await this.catalogButton[this.site].click();
                }
            }

            // Ожидание отображения каталога
            const catalogSelector: Locator = this.isMobile
                ? this.catalogMobile[this.site]
                : this.catalogLeftSide[this.site];
            await catalogSelector.waitFor({ state: 'visible' });
        });

        await test.step('Раскрытие случайной категории в меню каталога', async () => {
            if (this.site === 'vea' || this.site === 'litera') {
                await this.page.waitForTimeout(1000); // Пропуск анимации
                await this.takeAScreenshotForReport('Каталог');
                return;
            }

            const categories = await (this.isMobile
                ? this.categoriesItemsMobile[this.site]
                : this.categoriesItems[this.site]
            ).all();

            const randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];

            // На мобильном — всегда клик
            if (this.isMobile) {
                await randomCategory.click();
            } else {
                if (this.site === 'mdmprint') {
                    await randomCategory.click();
                }
                await randomCategory.hover();
            }

            await this.page.waitForTimeout(2000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport(this.isMobile ? 'Каталог (моб)' : 'Каталог');
    }

    // Метод для проверки поп-апа "Быстрый заказ", ""Оставить заявку" и т.д.
    async checkingQuickOrderPopup(): Promise<void> {
        await test.step('Открытие поп-апа', async () => {
            if (this.isMobile) {
                await this.quickOrderButtonMobile[this.site].click();
            } else {
                await this.quickOrderButton[this.site].click();
            }
            await this.quickOrderPopup[this.site].waitFor({ state: 'visible' });
            await this.page.waitForTimeout(1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Поп-ап заявки');

        // await test.step('Скрытие поп-апа "Быстрый заказ"', async () => {
        //     await this.quickOrderPopupCloseButton[this.site].click();
        //     await this.page.locator('div.popup.popup--quick-order.popup_swipable').waitFor({ state: 'hidden' });
        // });
    }
}
