import { test, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CopyRuMainPage extends BasePage {
    pageUrl = 'https://copy.ru';

    constructor(page) {
        super(page);

        // Хедер
        this.header = page.locator('header.header--pc');
        // Кнопка "Каталог"
        this.catalogButton = this.header.locator('div.header-catalog__btn');
        // Кнопка "Быстрый заказ"
        this.quickOrderButton = this.header.locator('button[data-popup="fast-order"]');

        // Поп-апы
        // Быстрый заказ
        // Сам поп-ап
        this.quickOrderPopup = page.locator('div.popup--fast-order.popup--active');

        // Каталог
        // Сам каталог
        this.catalog = page.locator('div.header-catalog.__active');
        // Левая часть каталога (категории)
        this.catalogLeftSide = this.catalog.locator('ul#menu-katalog1');
        // Категории
        this.categoriesItems = this.catalogLeftSide.locator('a.header-catalog__category');
        // Правая часть (подкатегории и услуги)
        this.catalogRightSide = this.catalog.locator('ul#menu-katalog1-1');
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
            await randomCategory.hover();
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
}
