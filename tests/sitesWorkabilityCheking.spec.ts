import { test } from '../fixtures';

test.describe('Проверка работоспособности сайтов', () => {
    test.describe('mdmprint.ru - Проверка сайта', () => {
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

    test.describe('copy.ru - Проверка сайта', () => {
        test('copy.ru - Проверка главной страницы', async ({ copyRuMainPage }) => {
            await copyRuMainPage.generalWorkabilityChecking();
        });

        test('copy.ru - Проверка меню каталога', async ({ copyRuMainPage }) => {
            await copyRuMainPage.catalogChecking();
        });

        test('copy.ru - Проверка поп-апа "Быстрый заказ"', async ({ copyRuMainPage }) => {
            await copyRuMainPage.checkingQuickOrderPopup();
        });

        test('copy.ru - Проверка поиска', async ({ copyRuMainPage }) => {
            await copyRuMainPage.checkingSearch();
        });
    });

    test.describe('1-tm.ru - Проверка сайта', () => {
        test('1-tm.ru - Проверка главной страницы', async ({ oneTmMainPage }) => {
            await oneTmMainPage.generalWorkabilityChecking();
        });

        test('1-tm.ru - Проверка бургер-меню', async ({ oneTmMainPage }) => {
            await oneTmMainPage.catalogChecking();
        });

        test('1-tm.ru - Проверка поп-апа "Онлайн-консультация"', async ({ oneTmMainPage }) => {
            await oneTmMainPage.checkingQuickOrderPopup();
        });

        test('1-tm.ru - Проверка поиска', async ({ oneTmMainPage }) => {
            await oneTmMainPage.checkingSearch();
        });
    });

    test.describe('litera.studio - Проверка сайта', () => {
        test('litera.studio - Проверка главной страницы', async ({ literaMainPage }) => {
            await literaMainPage.generalWorkabilityChecking();
        });

        test('litera.studio - Проверка бургер-меню', async ({ literaMainPage }) => {
            await literaMainPage.catalogChecking();
        });

        test('litera.studio - Проверка поп-апа "Оставьте заявку"', async ({ literaMainPage }) => {
            await literaMainPage.checkingQuickOrderPopup();
        });
    });

    test.describe('vea.ru - Проверка сайта', () => {
        test('vea.ru - Проверка главной страницы', async ({ veaMainPage }) => {
            await veaMainPage.generalWorkabilityChecking();
        });

        test('vea.ru - Проверка меню услуг', async ({ veaMainPage }) => {
            await veaMainPage.catalogChecking();
        });

        test('vea.ru - Проверка поп-апа "Оставьте заявку"', async ({ veaMainPage }) => {
            await veaMainPage.checkingQuickOrderPopup();
        });
    });

    test.describe('sequoiapay.io - Проверка сайта', () => {
        test('sequoiapay.io - Проверка главной страницы', async ({ sequoiaMainPage }) => {
            await sequoiaMainPage.generalWorkabilityChecking();
        });

        test('sequoiapay.io - Проверка смены языка', async ({ sequoiaMainPage }) => {
            await sequoiaMainPage.changeSiteLanguage();
        });
    });
});
