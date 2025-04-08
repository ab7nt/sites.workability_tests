import { test, expect } from 'playwright/test';

export class BasePage {
    pageUrl = null;

    constructor(page) {
        this.page = page;

        // Общие локаторы
        this.headerTitle = page.locator('h1');
    }

    // Метод для отслеживания медленных запросов
    async logSlowRequests(threshold = 10 * 1000) {
        const slowRequests = [];

        this.page.on('requestfinished', async (request) => {
            const timing = request.timing();
            if (!timing) return;

            const duration = timing.responseEnd - timing.startTime;
            if (duration > threshold) {
                // больше threshold секунд
                slowRequests.push({
                    url: request.url(),
                    duration: (duration / 1000).toFixed(2) + 's',
                    method: request.method(),
                    resourceType: request.resourceType(),
                });
            }
        });

        return slowRequests;
    }

    // Открытие страницы с отслеживанием медленных запросов
    async open() {
        // Стартуем отслеживание медленных запросов
        const slowRequests = await this.logSlowRequests();

        // Открываем страницу
        const response = await this.page.goto(this.pageUrl, { referer: 'workability-checking' });
        expect(response.status()).toBe(200);

        // Ожидаем полной загрузки страницы (networkidle)
        await this.page.waitForLoadState('networkidle');

        // Логируем и прикрепляем медленные запросы, если они есть
        if (slowRequests.length > 0) {
            console.log('⏱ Медленные запросы (более 10 сек):');
            slowRequests.forEach((r) => {
                console.log(`- ${r.method} ${r.url} [${r.duration}] (${r.resourceType})`);
            });

            // Генерируем HTML-таблицу
            const html = `
              <!DOCTYPE html>
              <html>
              <head>
                  <meta charset="UTF-8">
                  <style>
                      body { font-family: Arial, sans-serif; padding: 1rem; background: #fff; }
                      table { border-collapse: collapse; width: 100%; }
                      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                      th { background-color: #f5f5f5; }
                  </style>
              </head>
              <body>
                  <h2>Медленные запросы (более 10 секунд)</h2>
                  <table>
                      <tr>
                          <th>Метод</th>
                          <th>URL</th>
                          <th>Длительность</th>
                          <th>Тип ресурса</th>
                      </tr>
                      ${slowRequests
                          .map(
                              (req) => `
                          <tr>
                              <td>${req.method}</td>
                              <td>${req.url}</td>
                              <td>${req.duration}</td>
                              <td>${req.resourceType}</td>
                          </tr>
                      `
                          )
                          .join('')}
                  </table>
              </body>
              </html>
          `;

            const htmlBuffer = Buffer.from(html, 'utf-8');

            // Прикрепляем к отчёту
            await test.info().attach('Медленные запросы (таблица)', {
                body: htmlBuffer,
                contentType: 'text/html',
            });
        }
    }

    // // Открытие страницы
    // async open() {
    //     const response = await this.page.goto(this.pageUrl, { referer: 'workability-checking' });
    //     expect(response.status()).toBe(200);
    //     await this.page.waitForLoadState('networkidle');
    // }

    // Провека видимости элементов
    async checkingTheVisibilityOfElements() {
        expect(this.headerTitle).toBeVisible();
    }

    // Снятие скриншота
    async takeAScreenshot() {
        const screenshotName = this.pageUrl.split('//')[1];
        await this.page.screenshot({ path: `test-results/screenshots/${screenshotName}.png`, fullPage: true });
    }

    // Снятие скриншота и прикрепление его к отчёту
    async takeAScreenshotForReport(page) {
        const screenshot = await page.screenshot({ fullPage: true });

        await test.info().attach('Скриншот страницы', {
            body: screenshot,
            contentType: 'image/png',
        });
    }

    // Объединение методов проверки в одну функцию
    async generalWorkabilityChecking() {
        await this.open();
        await this.checkingTheVisibilityOfElements();
        await this.takeAScreenshotForReport(this.page);
    }
}
