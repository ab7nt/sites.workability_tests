import { BasePage } from './BasePage';

export class VeaMainPage extends BasePage {
    pageUrl = 'https://vea.ru';

    constructor(page) {
        super(page);

        // Локаторы
        this.header = page.locator('header');
        this.requestButtonInHeader = this.header.locator('div.header__request button.popup-open');
    }
}
