import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Класс для главной страницы vea.ru
export class VeaMainPage extends BasePage {
    pageUrl: string = 'https://vea.ru';
    header: Locator;
    requestButtonInHeader: Locator;
    servicesDropdownButton: Locator;
    servicesDropdown: Locator;
    servicesNavItemLink: Locator;
    submitRequestPopup: Locator;

    constructor(page: Page) {
        super(page);

        // Инициализация локаторов
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

    // Метод для проверки меню услуг
    async navMenuChecking(): Promise<void> {
        await test.step('Открытие меню услуг', async () => {
            await this.servicesDropdownButton.hover();
            // await this.servicesDropdown.waitFor('visible');
        });

        await test.step('Наведение на случайный пункт в меню услуг', async () => {
            // Получаем все элементы услуг
            const navItemLink = await this.servicesNavItemLink.all();

            // Выбираем случайный индекс
            let randomIndex = Math.floor(Math.random() * navItemLink.length);
            const randomNavItemLink = navItemLink[randomIndex];

            // Наведение курсора на случайную услугу
            await randomNavItemLink.hover();
            await this.page.waitForTimeout(1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Меню услуг');
    }

    // Метод для проверки поп-апа "Оставить заявку"
    async checkingSubmitRequestPopup(): Promise<void> {
        await test.step('Открытие поп-апа "Оставить заявку"', async () => {
            await this.requestButtonInHeader.click();
            await this.submitRequestPopup.waitFor({ state: 'visible' });
            await this.page.waitForTimeout(1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Поп-ап "Оставить заявку"');
    }
}
