import { test, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class MdmprintMainPage extends BasePage {
    pageUrl = 'https://mdmprint.ru';

    constructor(page) {
        super(page);

        // Локаторы
        // Хедер
        this.header = page.locator('div.header-content_desktop');
        // Кнопка "Каталог"
        this.catalogButton = this.header.locator('div.header-catalog__btn');
        // Кнопка "Быстрый заказ"
        this.quickOrderButton = this.header.locator('button[data-popup="quick-order"]');

        // Поп-апы
        // Быстрый заказ
        // Сам поп-ап
        this.quickOrderPopup = page.locator('div.popup--quick-order.popup--active');

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

        await this.takeAScreenshotForReport();
    }

    async checkingQuickOrderPopup() {
        await test.step('Открытие поп-апа "Быстрый заказ"', async () => {
            await this.quickOrderButton.click();
            await this.quickOrderPopup.waitFor('visible');
        });

        await this.takeAScreenshotForReport();
    }

    // async selectRandomCategory() {
    //     await test.step('Раскрытие случайной категории в меню каталога', async () => {
    //         // Получаем все элементы категорий
    //         const categories = await this.categoriesItems.all();

    //         // Выбираем случайный индекс
    //         let randomIndex = Math.floor(Math.random() * categories.length);
    //         const randomCategory = categories[randomIndex];

    //         // Кликаем на случайную категорию
    //         await randomCategory.click();

    //         // Снятие скриншота видимой области
    //         await this.takeAScreenshotForReport();
    //     });
    // }
}
