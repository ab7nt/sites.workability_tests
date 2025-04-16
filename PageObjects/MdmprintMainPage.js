import { test, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class MdmprintMainPage extends BasePage {
    pageUrl = 'https://mdmprint.ru';

    constructor(page) {
        super(page);

        // Хедер
        this.header = page.locator('div.header-content_desktop');
        // Кнопка "Каталог"
        this.catalogButton = this.header.locator('div.header-catalog__btn');
        // Кнопка "Быстрый заказ"
        this.quickOrderButton = this.header.locator('button[data-popup="quick-order"]');
        // Поле поиска
        // Само поле
        this.searchField = this.header.locator('form[role="search"]');
        // Поле для ввода текста
        this.searchInput = this.searchField.locator('input[name="s"]');
        // Кнопка поиска
        this.searchButton = this.searchField.locator('button[type="submit"]');
        // Выпадающий список с результатами поиска
        this.searchResultDropdown = this.header.locator('span.search-results__list');
        // Сами результаты поиска
        this.searchResultItems = this.searchResultDropdown.locator('a');

        // Поп-апы
        // Быстрый заказ
        // Сам поп-ап
        this.quickOrderPopup = page.locator('div.popup--quick-order.popup--active');
        // Кнопка скрытия
        this.quickOrderPopupCloseButton = this.quickOrderPopup.locator('button.popup-close');

        // Каталог
        // Сам каталог (список категорий)
        this.catalogLeftSide = this.header.locator('div.header-catalog__content');
        // Категории
        this.categoriesItems = this.header.locator('button.header-catalog__category');
        // Раскрытая правая часть меню каталога
        this.catalogActiveArea = page.locator('div.header-catalog__page.tab-item--active');
        // Ссылки на категории в раскрытой части меню
        this.randomCategoryLinkInActiveArea = this.catalogActiveArea.locator('a.header-catalog__page-header');
        // Ссылки на подкатегории в раскрытой части меню
        this.randomSubcategoryLinkInActiveArea = this.catalogActiveArea.locator('a.header-catalog__group-header');
    }

    async catalogChecking() {
        await test.step('Открытие меню каталога', async () => {
            await this.catalogButton.click();
            await this.catalogLeftSide.waitFor('visible');
        });

        await test.step('Раскрытие случайной категории в меню каталога', async () => {
            // Получаем все элементы категорий
            const categories = await this.categoriesItems.all();

            // Выбираем случайный индекс
            let randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];

            // Кликаем на случайную категорию
            await randomCategory.click();
        });

        await this.takeAScreenshotForReport('Каталог');
    }

    async checkingQuickOrderPopup() {
        await test.step('Открытие поп-апа "Быстрый заказ"', async () => {
            await this.quickOrderButton.click();
            await this.quickOrderPopup.waitFor('visible');
        });

        await this.takeAScreenshotForReport('Поп-ап "Быстрый заказ"');

        await test.step('Скрытие поп-апа "Быстрый заказ"', async () => {
            await this.quickOrderPopupCloseButton.click();
            await this.page.locator('div.popup.popup--quick-order.popup_swipable').waitFor('hidden');
        });
    }

    async checkingSearch() {
        await test.step('Ввод текста в поле поиска', async () => {
            await this.searchInput.fill('Визитки');
            await expect(this.searchInput).toHaveValue('Визитки');
        });

        await test.step('Проверка выпадающего списка результатов поиска', async () => {
            // Проверка дропдауна с результатми поиска
            await this.searchResultDropdown.waitFor('visible');
            expect(await this.searchResultItems.count()).toBeGreaterThan(0);

            // Наведение на случайный аункт в дропдауне
            // Получаем все элементы результатов поиска
            const resultItems = await this.searchResultItems.all();

            // Выбираем случайный индекс
            let randomIndex = Math.floor(Math.random() * resultItems.length);
            const randomResultItem = resultItems[randomIndex];

            // Наведение курсора на случайный пункт
            await randomResultItem.hover();

            await test.step('Проверка страницы результатов поиска', async () => {
                // Клик по кнопке поиска и ожидание перехода на страницу результатов
                const [response] = await Promise.all([
                    this.page.waitForNavigation({ waitUntil: 'load' }),
                    this.searchButton.click(),
                ]);

                // Проверяем URL и статус
                expect(this.page.url()).toContain('mdmprint.ru/?s=');
                expect(response.status()).toBe(200);
            });

            await this.takeAScreenshotForReport('Страница результатов поиска', { fullPage: true });
        });

        await this.takeAScreenshotForReport('Дропдаун результатов поиска');
    }
}
