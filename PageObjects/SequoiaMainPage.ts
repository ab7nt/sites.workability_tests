import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SequoiaMainPage extends BasePage {
    pageUrl: string = 'https://sequoiapay.io';
    header: Locator;
    changeLanguageDropdownButton: Locator;
    changeLanguageDropdown: Locator;
    changeLanguageItemLink: Locator;
    topSection: Locator;
    topSectionTitle: Locator;

    constructor(page: Page) {
        super(page);

        /// Хедер
        this.header = page.locator('header#header');
        // Смена языка
        this.changeLanguageDropdownButton = this.header.locator('div.dropdown');
        // Сам дропдаун
        this.changeLanguageDropdown = this.header.locator('div.dropdown__list');
        // Услуги
        this.changeLanguageItemLink = this.changeLanguageDropdown.locator('a');
        // Блок с заголовком
        this.topSection = page.locator('section#top-section');
        // Заголовок
        this.topSectionTitle = this.topSection.locator('h1');
    }

    async changeSiteLanguage(): Promise<void> {
        await test.step('Проверка английского текста в заголовке', async () => {
            // Проверка английского текста в заголовке (с заменёнными неразрывными пробелами)
            const headerTitleText = await this.topSectionTitle.innerText();
            expect(headerTitleText.replace(/\s/g, ' ')).toEqual('Processing payments for various Business Segments');
        });

        await test.step('Выбор языка в меню хедера', async () => {
            // Выбор языка в дропдауне
            await this.changeLanguageDropdownButton.hover();
            await this.changeLanguageItemLink.click();
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
