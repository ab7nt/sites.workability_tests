import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const sites = ['mdmprint.ru', 'copy.ru', '1-tm.ru', 'litera.studio', 'vea.ru', 'sequoiapay.io'];

const siteTests: Record<string, string[]> = {
    'mdmprint.ru': ['Все тесты сайта', 'Главная', 'Каталог', 'Быстрый заказ', 'Поиск'],
    'copy.ru': ['Все тесты сайта', 'Главная', 'Каталог', 'Быстрый заказ', 'Поиск'],
    '1-tm.ru': ['Все тесты сайта', 'Главная', 'Бургер-меню', 'Онлайн-консультация', 'Поиск'],
    'litera.studio': ['Все тесты сайта', 'Главная', 'Бургер-меню', 'Оставьте заявку', 'Поиск'],
    'vea.ru': ['Все тесты сайта', 'Главная', 'Меню услуг', 'Оставьте заявку'],
    'sequoiapay.io': ['Все тесты сайта', 'Главная', 'Смена языка'],
};

const grepMap: Record<string, string> = {
    'mdmprint.ru:Главная': 'mdmprint.ru - Проверка главной страницы',
    'mdmprint.ru:Каталог': 'mdmprint.ru - Проверка меню каталога',
    'mdmprint.ru:Быстрый заказ': 'mdmprint.ru - Проверка поп-апа "Быстрый заказ"',
    'mdmprint.ru:Поиск': 'mdmprint.ru - Проверка поиска',
    'mdmprint.ru:Все тесты сайта': 'mdmprint.ru - Проверка сайта',

    'copy.ru:Главная': 'copy.ru - Проверка главной страницы',
    'copy.ru:Каталог': 'copy.ru - Проверка меню каталога',
    'copy.ru:Быстрый заказ': 'copy.ru - Проверка поп-апа "Быстрый заказ"',
    'copy.ru:Поиск': 'copy.ru - Проверка поиска',
    'copy.ru:Все тесты сайта': 'copy.ru - Проверка сайта',

    '1-tm.ru:Главная': '1-tm.ru - Проверка главной страницы',
    '1-tm.ru:Бургер-меню': '1-tm.ru - Проверка бургер-меню',
    '1-tm.ru:Онлайн-консультация': '1-tm.ru - Проверка поп-апа "Онлайн-консультация"',
    '1-tm.ru:Поиск': '1-tm.ru - Проверка поиска',
    '1-tm.ru:Все тесты сайта': '1-tm.ru - Проверка сайта',

    'litera.studio:Главная': 'litera.studio - Проверка главной страницы',
    'litera.studio:Бургер-меню': 'litera.studio - Проверка бургер-меню',
    'litera.studio:Оставьте заявку': 'litera.studio - Проверка поп-апа "Оставьте заявку"',
    'litera.studio:Поиск': 'litera.studio - Проверка поиска',
    'litera.studio:Все тесты сайта': 'litera.studio - Проверка сайта',

    'vea.ru:Главная': 'vea.ru - Проверка главной страницы',
    'vea.ru:Меню услуг': 'vea.ru - Проверка меню услуг',
    'vea.ru:Оставьте заявку': 'vea.ru - Проверка поп-апа "Оставьте заявку"',
    'vea.ru:Все тесты сайта': 'vea.ru - Проверка сайта',

    'sequoiapay.io:Главная': 'sequoiapay.io - Проверка главной страницы',
    'sequoiapay.io:Смена языка': 'sequoiapay.io - Проверка смены языка',
    'sequoiapay.io:Все тесты сайта': 'sequoiapay.io - Проверка сайта',
};

let userState: Record<number, { currentSite?: string; runningTest?: string; runId?: number }> = {};

bot.start((ctx) => {
    userState[ctx.from.id] = {};
    ctx.reply(
        'Нужно выбрать:',
        Markup.inlineKeyboard([
            [Markup.button.callback('🌐 Проверить все сайты', 'check_all')],
            [Markup.button.callback('📁 Выбрать сайт', 'choose_site')],
        ])
    );
});

bot.action('choose_site', async (ctx) => {
    userState[ctx.from.id] = {};
    const siteButtons = sites.map((site) => [Markup.button.callback(site, `site:${site}`)]);
    siteButtons.push([Markup.button.callback('⬅️ Назад', 'back_main')]);
    await ctx.editMessageText('Выберите сайт:', Markup.inlineKeyboard(siteButtons));
});

bot.action('back_main', async (ctx) => {
    userState[ctx.from.id] = {};
    await ctx.editMessageText(
        'Выберите действие:',
        Markup.inlineKeyboard([
            [Markup.button.callback('🌐 Проверить все сайты', 'check_all')],
            [Markup.button.callback('📁 Выбрать сайт', 'choose_site')],
        ])
    );
});

bot.action(/^site:(.+)$/, async (ctx) => {
    const site = ctx.match[1];
    userState[ctx.from.id] = { currentSite: site };

    const testButtons = siteTests[site].map((test) => [Markup.button.callback(test, `test:${site}:${test}`)]);
    testButtons.push([Markup.button.callback('⬅️ Назад', 'choose_site')]);

    await ctx.editMessageText(`Выберите тест для ${site}:`, Markup.inlineKeyboard(testButtons));
});

bot.action(/^test:(.+):(.+)$/, async (ctx) => {
    const site = ctx.match[1];
    const test = ctx.match[2];
    const grep = grepMap[`${site}:${test}`];
    if (!grep) return ctx.reply('❌ Неизвестный тест.');

    const user = userState[ctx.from.id];
    if (user.runningTest === test) return ctx.answerCbQuery('⏳ Этот тест уже выполняется');

    user.runningTest = test;

    const originalKeyboard = (ctx.callbackQuery.message as any).reply_markup?.inline_keyboard;
    const updatedKeyboard = originalKeyboard?.map((row: any[]) =>
        row.map((btn: any) =>
            btn.text === test ? Markup.button.callback('⏳ Тест выполняется. Отменить?', 'cancel') : btn
        )
    );

    await ctx.editMessageReplyMarkup({ inline_keyboard: updatedKeyboard });

    try {
        const res = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/${process.env.GITHUB_WORKFLOW}/dispatches`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({ ref: process.env.GITHUB_REF, inputs: { grep } }),
            }
        );

        if (!res.ok) {
            user.runningTest = undefined;
            return ctx.reply(`❌ Ошибка запуска: ${await res.text()}`);
        }

        const runsRes = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/runs?event=workflow_dispatch`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        const runsData = await runsRes.json();

        // Фильтруем только запущенные или ожидающие run'ы на нужной ветке
        const activeRuns = runsData.workflow_runs
            .filter(
                (r: any) =>
                    r.head_branch === process.env.GITHUB_REF && (r.status === 'in_progress' || r.status === 'queued')
            )
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const latestRun = activeRuns[0];
        user.runId = latestRun?.id;

        ctx.reply('✅ Тест запущен!');
    } catch (err: any) {
        ctx.reply('❌ Не удалось запустить: ' + err.message);
    }
});

bot.action('cancel', async (ctx) => {
    const user = userState[ctx.from.id];
    if (!user?.runId) return ctx.answerCbQuery('❌ Нет активного теста.');

    try {
        // Пытаемся отменить run
        const cancelRes = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/runs/${user.runId}/cancel`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (cancelRes.ok) {
            user.runId = undefined;
            user.runningTest = undefined;
            return ctx.editMessageText(
                '⛔ Тест отменён.',
                Markup.inlineKeyboard([[Markup.button.callback('⬅️ Назад', `site:${user.currentSite}`)]])
            );
        }

        // Если отмена не удалась — проверяем статус
        const statusRes = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/runs/${user.runId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        const statusData = await statusRes.json();
        const { id, status, conclusion } = statusData;

        user.runId = undefined;
        user.runningTest = undefined;

        if (status === 'completed') {
            return ctx.reply(
                `⚠️ Тест уже завершён.\nРезультат: ${conclusion ?? 'неизвестно'}\nrunId: ${id ?? 'неизвестно'}`
            );
        }

        const errorText = await cancelRes.text();
        return ctx.reply(`❌ Не удалось отменить тест: ${errorText}`);
    } catch (err: any) {
        ctx.reply('❌ Ошибка отмены: ' + err.message);
    }
});

bot.launch();
