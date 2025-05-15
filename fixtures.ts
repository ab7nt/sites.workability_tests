import { test as base, Page } from '@playwright/test';
import { allure } from 'allure-playwright';

import { VeaMainPage } from './PageObjects/VeaMainPage';
import { MdmprintMainPage } from './PageObjects/MdmprintMainPage';
import { CopyRuMainPage } from './PageObjects/CopyRuMainPage';
import { OneTmMainPage } from './PageObjects/OneTmMainPage';
import { LiteraMainPage } from './PageObjects/LiteraMainPage';
import { SequoiaMainPage } from './PageObjects/SequoiaMainPage';

type Fixtures = {
    suiteName?: string; // для allurе.suite()
    veaMainPage: VeaMainPage;
    mdmprintMainPage: MdmprintMainPage;
    copyRuMainPage: CopyRuMainPage;
    oneTmMainPage: OneTmMainPage;
    literaMainPage: LiteraMainPage;
    sequoiaMainPage: SequoiaMainPage;
};

export const test = base.extend<Fixtures>({
    veaMainPage: async ({ page }, use) => {
        const vea = new VeaMainPage(page);
        await vea.open();
        await use(vea);
    },
    mdmprintMainPage: async ({ page }, use) => {
        const mdm = new MdmprintMainPage(page);
        await mdm.open();
        await use(mdm);
    },
    copyRuMainPage: async ({ page }, use) => {
        const copy = new CopyRuMainPage(page);
        await copy.open();
        await use(copy);
    },
    oneTmMainPage: async ({ page }, use) => {
        const oneTm = new OneTmMainPage(page);
        await oneTm.open();
        await use(oneTm);
    },
    literaMainPage: async ({ page }, use) => {
        const litera = new LiteraMainPage(page);
        await litera.open();
        await use(litera);
    },
    sequoiaMainPage: async ({ page }, use) => {
        const sequoia = new SequoiaMainPage(page);
        await sequoia.open();
        await use(sequoia);
    },

    suiteName: [undefined, { option: true }],
});

test.beforeEach(async ({ suiteName }) => {
    if (suiteName) {
        allure.suite(suiteName);
    }
});

test.afterEach(async ({ page }) => {
    await page.close();
});

export { expect } from '@playwright/test';
