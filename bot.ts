import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const {
    BOT_TOKEN,
    GITHUB_TOKEN,
    GITHUB_REPO,
    GITHUB_WORKFLOW,
    GITHUB_REF = 'main', // fallback если не указано явно
} = process.env;

if (!BOT_TOKEN || !GITHUB_TOKEN || !GITHUB_REPO || !GITHUB_WORKFLOW) {
    throw new Error('❌ Не заданы обязательные переменные окружения');
}

const bot = new Telegraf(BOT_TOKEN);

// Кнопочное стартовое меню
bot.start((ctx) => {
    ctx.reply(
        '👋 Привет! Я бот для запуска тестов.\nВыбери, что нужно проверить:',
        Markup.inlineKeyboard([
            [Markup.button.callback('🌐 Все сайты', 'run_all')],
            [Markup.button.callback('🔹 mdmprint.ru', 'run_mdm')],
            [Markup.button.callback('🔸 copy.ru', 'run_copy')],
        ])
    );
});

// Обработка кнопок
bot.action(/run_(.+)/, async (ctx) => {
    const site = ctx.match[1] as 'all' | 'mdm' | 'sequoiapay';

    const grepMap = {
        all: 'Проверка работоспособности сайтов',
        mdm: 'mdmprint.ru - Проверка главной страницы',
        sequoiapay: 'sequoiapay.io - Проверка сайта',
    } as const;

    const grep = grepMap[site];
    if (!grep) {
        ctx.reply('❌ Неизвестный параметр grep');
        return;
    }

    await ctx.answerCbQuery(); // скрываем "часики"
    ctx.reply(`🚀 Запускаю тесты для: ${grep}`);

    try {
        const res = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${GITHUB_WORKFLOW}/dispatches`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    ref: GITHUB_REF,
                    inputs: { grep },
                }),
            }
        );

        if (res.ok) {
            ctx.reply('✅ Тесты успешно запущены!');
        } else {
            const errorText = await res.text();
            ctx.reply(`❌ Ошибка запуска:\n${errorText}`);
        }
    } catch (err) {
        ctx.reply(`❌ Не удалось запустить: ${(err as Error).message}`);
    }
});

bot.launch();
