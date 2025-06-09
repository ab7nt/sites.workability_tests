import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
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

let userState: Record<
    number,
    {
        currentSite?: string;
        runningTest?: string;
        runId?: number;
        isCheckAllRunning?: boolean;
        waitingMessage?: {
            chatId: number;
            messageId: number;
        };
    }
> = {};

// Функции
// Кнопки главного меню
function mainMenuMarkup() {
    return Markup.inlineKeyboard([
        [Markup.button.callback('🌐 Проверить все сайты', 'check_all')],
        [Markup.button.callback('📁 Выбрать сайт', 'choose_site')],
    ]);
}

// Запуск workflow
async function startWorkflow(grep: string = 'Проверка работоспособности сайтов') {
    try {
        const res = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/${process.env.GITHUB_WORKFLOW}/dispatches`,
            // `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/runs?event=workflow_dispatch`,
            {
                method: 'POST',
                // method: 'GET',
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({ ref: process.env.GITHUB_REF, inputs: { grep } }),
            }
        );

        if (!res.ok) {
            return `❌ Ошибка запуска: ${await res.text()}`;
        }
    } catch (err: any) {
        return `❌ Не удалось запустить: ${err.message}`;
    }
}

// Логика работы бота
// Главное меню
bot.start((ctx) => {
    userState[ctx.from.id] = {};
    ctx.reply('Нужно выбрать:', mainMenuMarkup());
});

// Возврат к главному меню
bot.action('back_main', async (ctx) => {
    userState[ctx.from.id] = {};
    await ctx.editMessageText('Нужно выбрать:', mainMenuMarkup());
});

// Проверка всех сайтов
bot.action('check_all', async (ctx) => {
    await ctx.answerCbQuery();

    if (userState[ctx.from.id]?.isCheckAllRunning) return;

    userState[ctx.from.id] = { isCheckAllRunning: true };

    const result = await startWorkflow();

    if (result) {
        userState[ctx.from.id].isCheckAllRunning = false;
        await ctx.reply(result);
    } else {
        // Удаляем старые кнопки
        await ctx.editMessageReplyMarkup(null);
        await new Promise((res) => setTimeout(res, 300));

        // Показываем "ожидание" и сохраняем messageId
        await ctx.editMessageText(
            'Проверка запускается',
            Markup.inlineKeyboard([[Markup.button.callback('⏳ Ожидайте...', 'noop')]])
        );
    }
});

// Выбор сайта
bot.action('choose_site', async (ctx) => {
    userState[ctx.from.id] = {};
    const siteButtons = sites.map((site) => [Markup.button.callback(site, `site:${site}`)]);
    siteButtons.push([Markup.button.callback('⬅️ Назад', 'back_main')]);
    await ctx.editMessageText('Выберите сайт:', Markup.inlineKeyboard(siteButtons));
});

// Выбор теста для сайта
bot.action(/^site:(.+)$/, async (ctx) => {
    const site = ctx.match[1];
    userState[ctx.from.id] = { currentSite: site };

    const testButtons = siteTests[site].map((test) => [Markup.button.callback(test, `test:${site}:${test}`)]);
    testButtons.push([Markup.button.callback('⬅️ Назад', 'choose_site')]);

    await ctx.editMessageText(`Выберите тест для ${site}:`, Markup.inlineKeyboard(testButtons));
});

// Запуск теста
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
            btn.text === test ? Markup.button.callback('⏳ Тест выполняется. Отменить?', 'cancelRun') : btn
        )
    );

    await ctx.editMessageReplyMarkup({ inline_keyboard: updatedKeyboard });
});

// Отмена workflow
bot.action('cancelRun', async (ctx) => {
    const runId = ctx.match[1];

    await ctx.answerCbQuery(); // скрыть "часики"

    try {
        const res = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/runs/${runId}/cancel`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (res.ok) {
            await ctx.editMessageText('❌ Проверка отменена пользователем.');
        } else {
            await ctx.reply(`Не удалось отменить запуск. Статус: ${res.status}`);
        }
    } catch (err: any) {
        await ctx.reply(`Ошибка при отмене: ${err.message}`);
    }
});

// Слушаем текстовые сообщения для отмены workflow
// bot.on(message('text'), async (ctx) => {
//     console.log('Получено текстовое сообщение:', ctx.message.text);
//     try {
//         const text = ctx.message.text;
//         if (!text) {
//             return ctx.reply('❌ Пустое сообщение.');
//         }

//         // Ищем Run ID (регистр не важен, допускаем пробелы)
//         const match = text.match(/Run\s*ID:\s*(\d+)/i);
//         if (!match) {
//             return ctx.reply(
//                 '❌ Не удалось найти Run ID в сообщении. Пожалуйста, отправьте сообщение в формате "Run ID: <число>".'
//             );
//         } else {
//             console.log('Найден Run ID:', match[1]);
//         }

//         const runId = match[1];
//         if (!runId) {
//             return ctx.reply('❌ Run ID пустой или некорректный.');
//         }

//         const userId = ctx.from.id;
//         const msgInfo = userState[userId]?.waitingMessage;
//         console.log('waitingMessage:', msgInfo);

//         if (!msgInfo) {
//             return ctx.reply('❌ Нет активного запуска, который можно обновить.');
//         }

//         // Пытаемся обновить сообщение с кнопкой отмены
//         try {
//             await bot.telegram.editMessageText(
//                 msgInfo.chatId,
//                 msgInfo.messageId,
//                 undefined,
//                 'Проверка запущена.',
//                 Markup.inlineKeyboard([Markup.button.callback('⛔ Отменить?', `cancel_${runId}`)])
//             );
//             console.log('Сообщение успешно отредактировано');
//         } catch (err) {
//             console.error('Ошибка при редактировании сообщения:', err);
//             await ctx.reply('❌ Не удалось обновить сообщение с кнопкой отмены. Попробуйте ещё раз.');
//         }

//         userState[userId].runId = Number(runId);
//         userState[userId].isCheckAllRunning = false;
//         await ctx.reply('✅ Информация обновлена. Вы можете отменить проверку кнопкой ниже.');
//     } catch (error) {
//         console.error('Ошибка в обработчике текста:', error);
//         await ctx.reply('❌ Произошла непредвиденная ошибка. Пожалуйста, попробуйте ещё раз.');
//     }
// });

bot.launch();
