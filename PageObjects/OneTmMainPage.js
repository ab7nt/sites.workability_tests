import { test, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OneTmMainPage extends BasePage {
    pageUrl = 'https://1-tm.ru';

    constructor(page) {
        super(page);

        // Хедер
        this.header = page.locator('header');
        // Кнопка "Оставить заявку"
        this.onlineConsultationButtonInHeader = this.header.locator('button[data-popup="consult"]');
        // Бургер-меню
        this.burgerMenuButton = this.header.locator('button[data-toggle="menu"]');
        // Само бургер-меню
        this.burgerMenu = this.header.locator('div.__active[data-toggle-id="menu"]');
        // Услуги
        this.categoriesItems = this.burgerMenu.locator('div.header-menu__col-categories a.header-menu__category');

        // Поп-апы
        // Оставьте заявку
        // Сам поп-ап
        this.onlineConsultationPopup = page.locator('div.popup--consult.popup--active');
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

            await this.page.pause();
        });

        await this.takeAScreenshotForReport();
    }

    async checkingOnlineConsultationPopup() {
        await test.step('Открытие поп-апа "Онлайн-консультация"', async () => {
            await this.onlineConsultationButtonInHeader.click();
            // await this.page.waitForTimeout(1 * 1000); // Пропуск анимации
            await this.onlineConsultationPopup.waitFor('visible');
        });

        await this.takeAScreenshotForReport();
    }
}
