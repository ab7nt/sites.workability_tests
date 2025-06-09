import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Класс для главной страницы sequoiapay.io
export class SequoiaMainPage extends BasePage {
    pageUrl: string = 'https://sequoiapay.io';
    // header: Locator;
    changeLanguageDropdownButton: Locator;
    changeLanguageDropdown: Locator;
    changeLanguageItemLink: Locator;
    topSection: Locator;
    topSectionTitle: Locator;

    constructor(page: Page) {
        super(page);

        // Инициализация локаторов
        /// Хедер
        // this.header = page.locator('header#header');
        // Смена языка
        this.changeLanguageDropdownButton = this.header.sequoia.locator('div.dropdown');
        // Сам дропдаун
        this.changeLanguageDropdown = this.header.sequoia.locator('div.dropdown__list');
        // Услуги
        this.changeLanguageItemLink = this.changeLanguageDropdown.locator('a');
        // Блок с заголовком
        this.topSection = page.locator('section#top-section');
        // Заголовок
        this.topSectionTitle = this.topSection.locator('h1');
    }

    // Метод для проверки смены языка
    async changeSiteLanguage(): Promise<void> {
        await test.step('Проверка английского текста в заголовке', async () => {
            // Проверка английского текста в заголовке (с заменёнными неразрывными пробелами)
            const headerTitleText = await this.topSectionTitle.innerText();
            expect(headerTitleText.replace(/\s/g, ' ')).toEqual('Processing payments for various Business Segments');
        });

        await test.step('Выбор языка в меню хедера', async () => {
            // Выбор языка в дропдауне
            // if (this.isMobile) {
            //     await this.changeLanguageDropdownButton.click();
            // } else {
            //     await this.changeLanguageDropdownButton.hover();
            // }
            if (this.isMobile) {
                await this.clickOnElement(this.changeLanguageDropdownButton);
            } else {
                await this.changeLanguageDropdownButton.hover();
            }

            // await this.changeLanguageItemLink.click();
            await this.clickOnElement(this.changeLanguageItemLink);
            await this.page.waitForLoadState('networkidle');
        });

        await test.step('Проверка русского текста в заголовке', async () => {
            // Проверка русского текста в заголовке (с заменёнными неразрывными пробелами)
            const headerTitleText = await this.topSectionTitle.innerText();
            expect(headerTitleText.replace(/\s/g, ' ')).toEqual('Приём платежей для бизнеса различных сегментов');
        });

        // Скриншот для отчёта
        await this.takeAScreenshotForReport('Главная страница на русском языке', { fullPage: true });
    }
}
