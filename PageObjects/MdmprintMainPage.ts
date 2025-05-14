import { test, expect, Page, Locator } from '@playwright/test';
import { helpers } from '../utils/helpers';
import { BasePage } from './BasePage';

// Класс для главной страницы mdmprint.ru
export class MdmprintMainPage extends BasePage {
    pageUrl: string = 'https://mdmprint.ru';
    header: Locator;
    catalogButton: Locator;
    quickOrderButton: Locator;
    searchField: Locator;
    searchInput: Locator;
    searchButton: Locator;
    searchResultDropdown: Locator;
    searchResultItems: Locator;
    quickOrderPopup: Locator;
    quickOrderPopupCloseButton: Locator;
    catalogLeftSide: Locator;
    categoriesItems: Locator;
    catalogActiveArea: Locator;
    randomCategoryLinkInActiveArea: Locator;
    randomSubcategoryLinkInActiveArea: Locator;

    constructor(page: Page) {
        super(page);

        // Инициализация локаторов
        // Хедер
        this.header = page.locator('div.header-content_desktop');
        // Кнопка "Каталог"
        this.catalogButton = this.header.locator('div.header-catalog__btn');
        // Кнопка "Быстрый заказ"
        this.quickOrderButton = this.header.locator('button[data-popup="quick-order"]');
        // Поле поиска
        this.searchField = this.header.locator('form[role="search"]');
        this.searchInput = this.searchField.locator('input[name="s"]');
        this.searchButton = this.searchField.locator('button[type="submit"]');
        this.searchResultDropdown = this.header.locator('span.search-results__list');
        this.searchResultItems = this.searchResultDropdown.locator('a');

        // Поп-апы
        this.quickOrderPopup = page.locator('div.popup--quick-order.popup--active');
        this.quickOrderPopupCloseButton = this.quickOrderPopup.locator('button.popup-close');

        // Каталог
        this.catalogLeftSide = this.header.locator('div.header-catalog__content');
        this.categoriesItems = this.header.locator('button.header-catalog__category');
        this.catalogActiveArea = page.locator('div.header-catalog__page.tab-item--active');
        this.randomCategoryLinkInActiveArea = this.catalogActiveArea.locator('a.header-catalog__page-header');
        this.randomSubcategoryLinkInActiveArea = this.catalogActiveArea.locator('a.header-catalog__group-header');
    }

    // Метод для проверки меню каталога
    async catalogChecking(): Promise<void> {
        await test.step('Открытие меню каталога', async () => {
            await this.catalogButton.click();
            await this.catalogLeftSide.waitFor({ state: 'visible' });
        });

        await test.step('Раскрытие случайной категории в меню каталога', async () => {
            const categories = await this.categoriesItems.all();
            let randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];
            await randomCategory.click();
        });

        await this.takeAScreenshotForReport('Каталог');
    }

    // Метод для проверки поп-апа "Быстрый заказ"
    async checkingQuickOrderPopup(): Promise<void> {
        await test.step('Открытие поп-апа "Быстрый заказ"', async () => {
            await this.quickOrderButton.click();
            await this.quickOrderPopup.waitFor({ state: 'visible' });
            await this.page.waitForTimeout(1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Поп-ап "Быстрый заказ"');

        await test.step('Скрытие поп-апа "Быстрый заказ"', async () => {
            await this.quickOrderPopupCloseButton.click();
            await this.page.locator('div.popup.popup--quick-order.popup_swipable').waitFor({ state: 'hidden' });
        });
    }

    // Метод для проверки поиска
    async checkingSearch(): Promise<void> {
        const word = helpers.getRandomSearchWord(); // Получаем случайное слово для поиска

        await test.step('Ввод текста в поле поиска', async () => {
            await this.searchInput.fill(word);
            await expect(this.searchInput).toHaveValue(word);
        });

        await test.step('Проверка выпадающего списка результатов поиска', async () => {
            await this.searchResultDropdown.waitFor({ state: 'visible' });
            expect(await this.searchResultItems.count()).toBeGreaterThan(0);

            const resultItems = await this.searchResultItems.all();
            let randomIndex = Math.floor(Math.random() * resultItems.length);
            const randomResultItem = resultItems[randomIndex];
            await randomResultItem.hover();

            await this.takeAScreenshotForReport('Дропдаун результатов поиска');
        });

        await test.step('Проверка страницы результатов поиска', async () => {
            await Promise.all([this.page.waitForLoadState('load'), this.searchButton.click()]);

            expect(this.page.url()).toContain(`mdmprint.ru/?s=`);

            await this.scrollToEndOfThePage();
            await this.takeAScreenshotForReport('Страница результатов поиска', { fullPage: true });
        });
    }
}
