import { test, expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Класс для главной страницы litera.studio
export class LiteraMainPage extends BasePage {
    pageUrl: string = 'https://litera.studio';

    constructor(page: Page) {
        super(page);
    }
}
