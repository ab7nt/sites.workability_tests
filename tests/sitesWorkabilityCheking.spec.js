import { test, describe } from 'playwright/test';
import { VeaMainPage } from '../PageObjects/VeaMainPage';
import { MdmprintMainPage } from '../PageObjects/MdmprintMainPage';
import { CopyRuMainPage } from '../PageObjects/CopyRuMainPage';
import { OneTmMainPage } from '../PageObjects/OneTmMainPage';
import { LiteraMainPage } from '../PageObjects/LiteraMainPage';
import { SequoiaMainPage } from '../PageObjects/SequoiaMainPage';

describe('Проверка работоспособности сайтов', () => {
    // test('Проверка работоспособности сайта mdmprint.ru', async ({ page }) => {
    //     const mdmprintMainPage = new MdmprintMainPage(page);

    //     await test.step('Проверка главной страницы', async () => {
    //         await mdmprintMainPage.generalWorkabilityChecking();
    //     });

    //     await test.step('Проверка меню каталога', async () => {
    //         await mdmprintMainPage.catalogChecking();
    //     });

    //     await test.step('Проверка поп-апа "Быстрый заказ"', async () => {
    //         await mdmprintMainPage.checkingQuickOrderPopup();
    //     });
    // });

    // test('Проверка работоспособности сайта copy.ru', async ({ page }) => {
    //     const copyRuMainPage = new CopyRuMainPage(page);

    //     await test.step('Проверка главной страницы', async () => {
    //         await copyRuMainPage.generalWorkabilityChecking();
    //     });

    //     await test.step('Проверка меню каталога', async () => {
    //         await copyRuMainPage.catalogChecking();
    //     });

    //     await test.step('Проверка поп-апа "Быстрый заказ"', async () => {
    //         await copyRuMainPage.checkingQuickOrderPopup();
    //     });
    // });

    test('Проверка работоспособности сайта 1tm.ru', async ({ page }) => {
        const oneTmMainPage = new OneTmMainPage(page);

        await test.step('Проверка главной страницы', async () => {
            await oneTmMainPage.generalWorkabilityChecking();
        });

        await test.step('Проверка бургер-меню', async () => {
            await oneTmMainPage.burgerMenuChecking();
        });

        await test.step('Проверка поп-апа "Быстрый заказ"', async () => {
            await oneTmMainPage.checkingOnlineConsultationPopup();
        });
    });

    // test('Проверка работоспособности сайта litera.studio', async ({ page }) => {
    //     const literaMainPage = new LiteraMainPage(page);

    //     // Общая проверка работоспособности
    //     await literaMainPage.generalWorkabilityChecking();
    // });

    // test('Проверка работоспособности сайта vea.ru', async ({ page }) => {
    //     const veaMainPage = new VeaMainPage(page);

    //     await test.step('Проверка главной страницы', async () => {
    //         await veaMainPage.generalWorkabilityChecking();
    //     });

    //     await test.step('Проверка меню услуг', async () => {
    //         await veaMainPage.navMenuChecking();
    //     });

    //     await test.step('Проверка поп-апа "Оставьте заявку"', async () => {
    //         await veaMainPage.checkingQuickOrderPopup();
    //     });
    // });

    // test('Проверка работоспособности сайта sequoiapay.io', async ({ page }) => {
    //     const sequoiaMainPage = new SequoiaMainPage(page);

    //     // Общая проверка работоспособности
    //     await sequoiaMainPage.generalWorkabilityChecking();
    // });
});
