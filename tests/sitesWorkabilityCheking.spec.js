import { test, describe } from 'playwright/test';
import { VeaMainPage } from '../PageObjects/VeaMainPage';
import { MdmprintMainPage } from '../PageObjects/MdmprintMainPage';
import { CopyRuMainPage } from '../PageObjects/CopyRuMainPage';
import { OneTmMainPage } from '../PageObjects/OneTmMainPage';
import { LiteraMainPage } from '../PageObjects/LiteraMainPage';
import { SequoiaMainPage } from '../PageObjects/SequoiaMainPage';

describe('Проверка работоспособности сайтов', () => {
    test('Проверка работоспособности сайта mdmprint.ru', async ({ page }) => {
        const mdmprintMainPage = new MdmprintMainPage(page);

        // Общая проверка работоспособности
        await mdmprintMainPage.generalWorkabilityChecking();
    });

    test('Проверка работоспособности сайта copy.ru', async ({ page }) => {
        const copyRuMainPage = new CopyRuMainPage(page);

        // Общая проверка работоспособности
        await copyRuMainPage.generalWorkabilityChecking();
    });

    test('Проверка работоспособности сайта 1tm.ru', async ({ page }) => {
        const oneTmMainPage = new OneTmMainPage(page);

        // Общая проверка работоспособности
        await oneTmMainPage.generalWorkabilityChecking();
    });

    test('Проверка работоспособности сайта litera.studio', async ({ page }) => {
        const literaMainPage = new LiteraMainPage(page);

        // Общая проверка работоспособности
        await literaMainPage.generalWorkabilityChecking();
    });

    test('Проверка работоспособности сайта vea.ru', async ({ page }) => {
        const veaMainPage = new VeaMainPage(page);
        // Общая проверка работоспособности
        await veaMainPage.generalWorkabilityChecking();
    });

    test('Проверка работоспособности сайта sequoiapay.io', async ({ page }) => {
        const sequoiaMainPage = new SequoiaMainPage(page);

        // Общая проверка работоспособности
        await sequoiaMainPage.generalWorkabilityChecking();
    });
});
