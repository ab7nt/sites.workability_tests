import { test } from '../fixtures';

test.describe('Проверка работоспособности сайтов', () => {
    test.describe('mdmprint.ru - Проверка работоспособности сайта', () => {
        test('mdmprint.ru - Проверка главной страницы', async ({ mdmprintMainPage }) => {
            await mdmprintMainPage.generalWorkabilityChecking();
        });

        test('mdmprint.ru - Проверка меню каталога', async ({ mdmprintMainPage }) => {
            await mdmprintMainPage.catalogChecking();
        });

        test('mdmprint.ru - Проверка поп-апа "Быстрый заказ"', async ({ mdmprintMainPage }) => {
            await mdmprintMainPage.checkingQuickOrderPopup();
        });

        test('mdmprint.ru - Проверка поиска', async ({ mdmprintMainPage }) => {
            await mdmprintMainPage.checkingSearch();
        });
    });

    test.describe('Проверка работоспособности сайта copy.ru', () => {
        test('Проверка главной страницы', async ({ copyRuMainPage }) => {
            await copyRuMainPage.generalWorkabilityChecking();
        });

        test('Проверка меню каталога', async ({ copyRuMainPage }) => {
            await copyRuMainPage.catalogChecking();
        });

        test('Проверка поп-апа "Быстрый заказ"', async ({ copyRuMainPage }) => {
            await copyRuMainPage.checkingQuickOrderPopup();
        });

        test('Проверка поиска', async ({ copyRuMainPage }) => {
            await copyRuMainPage.checkingSearch();
        });
    });

    test.describe('Проверка работоспособности сайта 1-tm.ru', () => {
        test('Проверка главной страницы', async ({ oneTmMainPage }) => {
            await oneTmMainPage.generalWorkabilityChecking();
        });

        test('Проверка бургер-меню', async ({ oneTmMainPage }) => {
            await oneTmMainPage.catalogChecking();
        });

        test('Проверка поп-апа "Онлайн-консультация"', async ({ oneTmMainPage }) => {
            await oneTmMainPage.checkingQuickOrderPopup();
        });

        test('Проверка поиска', async ({ oneTmMainPage }) => {
            await oneTmMainPage.checkingSearch();
        });
    });

    test.describe('Проверка работоспособности сайта litera.studio', () => {
        test('Проверка главной страницы', async ({ literaMainPage }) => {
            await literaMainPage.generalWorkabilityChecking();
        });

        test('Проверка бургер-меню', async ({ literaMainPage }) => {
            await literaMainPage.catalogChecking();
        });

        test('Проверка поп-апа "Оставьте заявку"', async ({ literaMainPage }) => {
            await literaMainPage.checkingQuickOrderPopup();
        });
    });

    test.describe('Проверка работоспособности сайта vea.ru', () => {
        test('Проверка главной страницы', async ({ veaMainPage }) => {
            await veaMainPage.generalWorkabilityChecking();
        });

        test('Проверка меню услуг', async ({ veaMainPage }) => {
            await veaMainPage.catalogChecking();
        });

        test('Проверка поп-апа "Оставьте заявку"', async ({ veaMainPage }) => {
            await veaMainPage.checkingQuickOrderPopup();
        });
    });

    test.describe('Проверка работоспособности сайта sequoiapay.io', () => {
        test('Проверка главной страницы', async ({ sequoiaMainPage }) => {
            await sequoiaMainPage.generalWorkabilityChecking();
        });

        test('Проверка смены языка', async ({ sequoiaMainPage }) => {
            await sequoiaMainPage.changeSiteLanguage();
        });
    });
});
