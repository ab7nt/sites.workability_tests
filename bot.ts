import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Стартовое меню с кнопками
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

// Обработка нажатий по кнопкам
bot.action(/run_(.+)/, async (ctx) => {
    const site = ctx.match[1]; // all, mdm, copy

    const grepMap: Record<string, string> = {
        all: 'Проверка работоспособности сайтов',
        mdm: 'mdmprint.ru - Проверка сайта mdmprint.ru',
        copy: 'copy.ru - Проверка сайта copy.ru',
    };

    const grep = grepMap[site];

    ctx.answerCbQuery(); // скрыть "часики"
    ctx.reply(`🚀 Запускаю тесты для: ${grep}`);

    try {
        const res = await fetch(
            `https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/${process.env.GITHUB_WORKFLOW}/dispatches`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    ref: process.env.GITHUB_REF,
                    inputs: {
                        grep,
                    },
                }),
            }
        );

        if (res.ok) {
            ctx.reply('✅ Тесты запущены!');
        } else {
            const err = await res.text();
            ctx.reply(`❌ Ошибка запуска: ${err}`);
        }
    } catch (err) {
        ctx.reply('❌ Не удалось запустить: ' + (err as Error).message);
    }
});

bot.launch();
