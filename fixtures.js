import { test } from '@playwright/test';

import { finalScreenshots } from './data/finalScreenshots';

test.afterEach(async () => {
    await attachFinalScreenshots();
});

// Метод для прикрепления всех скриншотов в конец отчёта
async function attachFinalScreenshots() {
    if (finalScreenshots.length > 0) {
        await test.step('Все скриншоты теста', async () => {
            for (const shot of finalScreenshots) {
                await test.info().attach(`[ФИНАЛЬНЫЙ] ${shot.name} (${shot.timestamp})`, {
                    body: shot.content,
                    contentType: 'image/png',
                });
            }
        });
    }
}
