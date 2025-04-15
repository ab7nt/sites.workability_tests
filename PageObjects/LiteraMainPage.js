import { test, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LiteraMainPage extends BasePage {
    pageUrl = 'https://litera.studio';

    constructor(page) {
        super(page);

        // Хедер
        this.header = page.locator('header');
        // Кнопка "Оставить заявку"
        this.requestButton = page.locator('button[data-popup="order"].order-design__btn');
        // Кнопка бургер-меню
        this.burgerMenuButton = this.header.locator('div.header-menu__toggler');
        // Само бургер-меню
        this.burgerMenu = page.locator('div.header-menu.__active.__open');
        // Категории
        this.categoriesItems = this.burgerMenu.locator('a[data-options="desktopOnly|delayed|headerMenuMain"]');

        // Поп-апы
        // Оставьте заявку
        // Сам поп-ап
        this.submitRequestPopup = page.locator('div.popup--order.popup--active');
    }

    async burgerMenuChecking() {
        await test.step('Открытие бургер-меню', async () => {
            await this.burgerMenuButton.click();
            await this.burgerMenu.waitFor('visible');
        });

        await test.step('Наведение на случайный пункт в меню услуг', async () => {
            // Получаем все элементы категорий
            const categories = await this.categoriesItems.all();

            // Выбираем случайный индекс
            let randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategories = categories[randomIndex];

            // Наведение курсора на случайную категорию
            await randomCategories.hover();
            await this.page.waitForTimeout(1 * 1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Бургер-меню');

        await test.step('Скрытие бургер-меню', async () => {
            await this.burgerMenuButton.click();
        });
    }

    async checkingSubmitRequestPopup() {
        await test.step('Открытие поп-апа "Оставить заявку"', async () => {
            await this.requestButton.click();
            await this.submitRequestPopup.waitFor('visible');
        });

        await this.takeAScreenshotForReport('Поп-ап ""Оставить заявку""');
    }
}
