import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Класс для главной страницы Copy.ru
export class CopyRuMainPage extends BasePage {
    pageUrl: string = 'https://copy.ru';

    constructor(page: Page) {
        super(page);
    }
}
