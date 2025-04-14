import { test, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SequoiaMainPage extends BasePage {
    pageUrl = 'https://sequoiapay.io';

    constructor(page) {
        super(page);

        /// Хедер
        this.header = page.locator('header#header');
        // Кнопка "Оставить заявку"
        // this.requestButtonInHeader = this.header.locator('div.header__request button.popup-open');
        // Смена языка
        this.changeLanguageDropdownButton = this.header.locator('div.dropdown');
        // Сам дропдаун
        this.changeLanguageDropdown = this.header.locator('div.dropdown__list');
        // Услуги
        this.changeLanguageItemLink = this.changeLanguageDropdown.locator('a');

        // Поп-апы
        // Сам поп-ап
    }

    async changeSiteLanguage() {
        await test.step('Проверка английского текста в заголовке', async () => {
            // Проверка английского текста в заголовке (с заменёнными неразрывными пробелами)
            let headerTitleText = await this.headerTitle.innerText();
            expect(headerTitleText.replace(/\s/g, ' ')).toEqual('Processing payments for various Business Segments');
        });

        await test.step('Выбор языка в меню хедера', async () => {
            // Выбор языка в дропдауне
            await this.changeLanguageDropdownButton.hover();
            await this.changeLanguageItemLink.click();
            await this.page.waitForLoadState('networkidle');
        });

        await test.step('Проверка руссского текста в заголовке ', async () => {
            // Проверка руссского текста в заголовке  (с заменёнными неразрывными пробелами) и снятие скриншота
            headerTitleText = await this.headerTitle.innerText();
            expect(headerTitleText.replace(/\s/g, ' ')).toEqual('Приём платежей для бизнеса различных сегментов');
        });

        await this.takeAScreenshotForReport({ fullPage: true });
    }
}
