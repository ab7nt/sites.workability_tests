import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Класс для главной страницы 1-tm.ru
export class OneTmMainPage extends BasePage {
    pageUrl: string = 'https://1-tm.ru';
    header: Locator;
    onlineConsultationButtonInHeader: Locator;
    burgerMenuButton: Locator;
    burgerMenu: Locator;
    categoriesItems: Locator;
    onlineConsultationPopup: Locator;

    constructor(page: Page) {
        super(page);

        // Инициализация локаторов
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
        this.onlineConsultationPopup = page.locator('div.popup--consult.popup--active');
    }

    // Метод для проверки бургер-меню
    async burgerMenuChecking(): Promise<void> {
        await test.step('Открытие бургер-меню', async () => {
            await this.burgerMenuButton.click();
            await this.burgerMenu.waitFor({ state: 'visible' });
        });

        await test.step('Наведение на случайный пункт в меню услуг', async () => {
            // Получаем все элементы категорий
            const categories = await this.categoriesItems.all();

            // Выбираем случайный индекс
            let randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];

            // Наведение курсора на случайную категорию
            await randomCategory.hover();
            await this.page.waitForTimeout(1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Бургер меню');
    }

    // Метод для проверки поп-апа "Онлайн-консультация"
    async checkingOnlineConsultationPopup(): Promise<void> {
        await test.step('Открытие поп-апа "Онлайн-консультация"', async () => {
            await this.onlineConsultationButtonInHeader.click();
            await this.onlineConsultationPopup.waitFor({ state: 'visible' });
            await this.page.waitForTimeout(1000); // Пропуск анимации
        });

        await this.takeAScreenshotForReport('Поп-ап "Онлайн-консультация"');
    }
}
