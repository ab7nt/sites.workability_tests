import { test, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class VeaMainPage extends BasePage {
    pageUrl = 'https://vea.ru';

    constructor(page) {
        super(page);

        // Хедер
        this.header = page.locator('header');
        // Кнопка "Оставить заявку"
        this.requestButtonInHeader = this.header.locator('div.header__request button.popup-open');
        // Меню "Услуги"
        this.servicesDropdownButton = this.header.locator('div.header-dropdown');
        // Сам дропдаун
        this.servicesDropdown = this.header.locator('div.header-dropdown__list');
        // Услуги
        this.servicesNavItemLink = this.servicesDropdown.locator('a.dropdown__list-item');

        // Поп-апы
        // Оставьте заявку
        // Сам поп-ап
        this.submitRequestPopup = page.locator('div.popup--order.popup--active');
    }

    async navMenuChecking() {
        await test.step('Открытие меню услуг', async () => {
            await this.servicesDropdownButton.hover();
            // await this.servicesDropdown.waitFor('visible');
        });

        await test.step('Наведение на случайный пункт в меню услуг', async () => {
            // Получаем все элементы категорий
            const navItemLink = await this.servicesNavItemLink.all();

            // Выбираем случайный индекс
            let randomIndex = Math.floor(Math.random() * navItemLink.length);
            const randomNavItemLink = navItemLink[randomIndex];

            // Наведение курсора на случайную категорию
            await randomNavItemLink.hover();
            // await this.page.waitForTimeout(1 * 1000); // Пропуск анимации

            // await this.page.pause();
        });

        await this.takeAScreenshotForReport();
    }

    async checkingQuickOrderPopup() {
        await test.step('Открытие поп-апа "Оставить заявку"', async () => {
            await this.requestButtonInHeader.click();
            await this.submitRequestPopup.waitFor('visible');
            // await this.page.waitForTimeout(1 * 1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport();
    }
}
