import { test, expect, Page, Locator } from '@playwright/test';
import { helpers } from '../utils/helpers';
import { BasePage } from './BasePage';

// Класс для главной страницы mdmprint.ru
export class MdmprintMainPage extends BasePage {
    pageUrl: string = 'https://mdmprint.ru';

    constructor(page: Page) {
        super(page);
    }
}
