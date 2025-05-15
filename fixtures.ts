import { test as base, Page } from '@playwright/test';

import { VeaMainPage } from './PageObjects/VeaMainPage';
import { MdmprintMainPage } from './PageObjects/MdmprintMainPage';
import { CopyRuMainPage } from './PageObjects/CopyRuMainPage';
import { OneTmMainPage } from './PageObjects/OneTmMainPage';
import { LiteraMainPage } from './PageObjects/LiteraMainPage';
import { SequoiaMainPage } from './PageObjects/SequoiaMainPage';

type Fixtures = {
    veaMainPage: VeaMainPage;
    mdmprintMainPage: MdmprintMainPage;
    copyRuMainPage: CopyRuMainPage;
    oneTmMainPage: OneTmMainPage;
    literaMainPage: LiteraMainPage;
    sequoiaMainPage: SequoiaMainPage;
};

export const test = base.extend<Fixtures>({
    veaMainPage: async ({ page }, use) => {
        await use(new VeaMainPage(page));
    },
    mdmprintMainPage: async ({ page }, use) => {
        await use(new MdmprintMainPage(page));
    },
    copyRuMainPage: async ({ page }, use) => {
        await use(new CopyRuMainPage(page));
    },
    oneTmMainPage: async ({ page }, use) => {
        await use(new OneTmMainPage(page));
    },
    literaMainPage: async ({ page }, use) => {
        await use(new LiteraMainPage(page));
    },
    sequoiaMainPage: async ({ page }, use) => {
        await use(new SequoiaMainPage(page));
    },
});

export { expect } from '@playwright/test';

test.afterEach(async ({ page }) => {
    await page.close();
});
