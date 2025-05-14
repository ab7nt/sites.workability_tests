import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Класс для главной страницы vea.ru
export class VeaMainPage extends BasePage {
    pageUrl: string = 'https://vea.ru';

    constructor(page: Page) {
        super(page);
    }
}
