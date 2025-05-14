import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Класс для главной страницы 1-tm.ru
export class OneTmMainPage extends BasePage {
    pageUrl: string = 'https://1-tm.ru';

    constructor(page: Page) {
        super(page);
    }
}
