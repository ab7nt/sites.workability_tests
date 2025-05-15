import { test } from '../fixtures';

test.describe('Проверка работоспособности сайтов', () => {
    test('Проверка работоспособности сайта mdmprint.ru', async ({ mdmprintMainPage }) => {
        await test.step('Проверка главной страницы', async () => {
            await mdmprintMainPage.generalWorkabilityChecking();
        });

        await test.step('Проверка меню каталога', async () => {
            await mdmprintMainPage.catalogChecking();
        });

        await test.step('Проверка поп-апа "Быстрый заказ"', async () => {
            await mdmprintMainPage.checkingQuickOrderPopup();
        });

        await test.step('Проверка поиска', async () => {
            await mdmprintMainPage.checkingSearch();
        });
    });

    test('Проверка работоспособности сайта copy.ru', async ({ copyRuMainPage }) => {
        await test.step('Проверка главной страницы', async () => {
            await copyRuMainPage.generalWorkabilityChecking();
        });

        await test.step('Проверка меню каталога', async () => {
            await copyRuMainPage.catalogChecking();
        });

        await test.step('Проверка поп-апа "Быстрый заказ"', async () => {
            await copyRuMainPage.checkingQuickOrderPopup();
        });

        await test.step('Проверка поиска', async () => {
            await copyRuMainPage.checkingSearch();
        });
    });

    test('Проверка работоспособности сайта 1-tm.ru', async ({ oneTmMainPage }) => {
        await test.step('Проверка главной страницы', async () => {
            await oneTmMainPage.generalWorkabilityChecking();
        });

        await test.step('Проверка бургер-меню', async () => {
            await oneTmMainPage.catalogChecking();
        });

        await test.step('Проверка поп-апа "Онлайн-консультация"', async () => {
            await oneTmMainPage.checkingQuickOrderPopup();
        });

        await test.step('Проверка поиска', async () => {
            await oneTmMainPage.checkingSearch();
        });
    });

    test('Проверка работоспособности сайта litera.studio', async ({ literaMainPage }) => {
        await test.step('Проверка главной страницы', async () => {
            await literaMainPage.generalWorkabilityChecking();
        });

        await test.step('Проверка бургер-меню', async () => {
            await literaMainPage.catalogChecking();
        });

        await test.step('Проверка поп-апа "Оставьте заявку"', async () => {
            await literaMainPage.checkingQuickOrderPopup();
        });
    });

    test('Проверка работоспособности сайта vea.ru', async ({ veaMainPage }) => {
        await test.step('Проверка главной страницы', async () => {
            await veaMainPage.generalWorkabilityChecking();
        });

        await test.step('Проверка меню услуг', async () => {
            await veaMainPage.catalogChecking();
        });

        await test.step('Проверка поп-апа "Оставьте заявку"', async () => {
            await veaMainPage.checkingQuickOrderPopup();
        });
    });

    test('Проверка работоспособности сайта sequoiapay.io', async ({ sequoiaMainPage }) => {
        await test.step('Проверка главной страницы', async () => {
            await sequoiaMainPage.generalWorkabilityChecking();
        });

        await test.step('Проверка смены языка', async () => {
            await sequoiaMainPage.changeSiteLanguage();
        });
    });
});
