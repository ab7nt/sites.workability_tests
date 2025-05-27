import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Стартовое меню
bot.start((ctx) => {
    ctx.reply(
        'Запустить общую проверку или выбрать сайт:',
        Markup.inlineKeyboard([
            [Markup.button.callback('🌐 Проверить все сайты', 'run_all')],
            [Markup.button.callback('📁 Выбрать сайт', 'choose_site')],
        ])
    );
});

// Обработка кнопки "Проверить все сайты"
bot.action('run_all', async (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('🚀 Запускаю общую проверку работоспособности сайтов');

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
                        grep: 'Проверка работоспособности сайтов',
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

// Обработка кнопки "Выбрать сайт"
bot.action('choose_site', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
        'Выбрать сайт:',
        Markup.inlineKeyboard([
            [Markup.button.callback('mdmprint.ru', 'site_mdm')],
            [Markup.button.callback('copy.ru', 'site_copy')],
            [Markup.button.callback('1-tm.ru', 'site_1tm')],
            [Markup.button.callback('litera.studio', 'site_litera')],
            [Markup.button.callback('vea.ru', 'site_vea')],
            [Markup.button.callback('sequoiapay.io', 'site_sequoia')],
        ])
    );
});

bot.action('site_mdm', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
        'Выбрать тест для mdmprint.ru:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Все тесты сайта', 'run_mdm_all')],
            [Markup.button.callback('Главная', 'run_mdm_main')],
            [Markup.button.callback('Каталог', 'run_mdm_catalog')],
            [Markup.button.callback('Быстрый заказ', 'run_mdm_order')],
            [Markup.button.callback('Поиск', 'run_mdm_search')],
        ])
    );
});

bot.action('site_copy', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
        'Выбрать тест для copy.ru:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Все тесты сайта', 'run_copy_all')],
            [Markup.button.callback('Главная', 'run_copy_main')],
            [Markup.button.callback('Каталог', 'run_copy_catalog')],
            [Markup.button.callback('Быстрый заказ', 'run_copy_order')],
            [Markup.button.callback('Поиск', 'run_copy_search')],
        ])
    );
});

bot.action('site_1tm', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
        'Выбрать тест для 1-tm.ru:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Все тесты сайта', 'run_1tm_all')],
            [Markup.button.callback('Главная', 'run_1tm_main')],
            [Markup.button.callback('Бургер-меню', 'run_1tm_catalog')],
            [Markup.button.callback('Онлайн-консультация', 'run_1tm_order')],
            [Markup.button.callback('Поиск', 'run_1tm_search')],
        ])
    );
});

bot.action('site_litera', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
        'Выбрать тест для litera.studio:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Все тесты сайта', 'run_litera_all')],
            [Markup.button.callback('Главная', 'run_litera_main')],
            [Markup.button.callback('Бургер-меню', 'run_litera_catalog')],
            [Markup.button.callback('Оставьте заявку', 'run_litera_order')],
            [Markup.button.callback('Поиск', 'run_litera_search')],
        ])
    );
});

bot.action('site_vea', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
        'Выбрать тест для vea.ru:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Все тесты сайта', 'run_vea_all')],
            [Markup.button.callback('Главная', 'run_vea_main')],
            [Markup.button.callback('Меню услуг', 'run_vea_catalog')],
            [Markup.button.callback('Оставьте заявку', 'run_vea_order')],
        ])
    );
});

bot.action('site_sequoia', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply(
        'Выбрать тест для sequoiapay.io:',
        Markup.inlineKeyboard([
            [Markup.button.callback('Все тесты сайта', 'run_sequoia_all')],
            [Markup.button.callback('Главная', 'run_sequoia_main')],
            [Markup.button.callback('Смена языка', 'run_sequoia_lang')],
        ])
    );
});

bot.action(/run_(.+)/, async (ctx) => {
    const grepMap: Record<string, string> = {
        mdm_all: 'mdmprint.ru - Проверка сайта',
        mdm_main: 'mdmprint.ru - Проверка главной страницы',
        mdm_catalog: 'mdmprint.ru - Проверка меню каталога',
        mdm_order: 'mdmprint.ru - Проверка поп-апа "Быстрый заказ"',
        mdm_search: 'mdmprint.ru - Проверка поиска',

        copy_all: 'copy.ru - Проверка сайта',
        copy_main: 'copy.ru - Проверка главной страницы',
        copy_catalog: 'copy.ru - Проверка меню каталога',
        copy_order: 'copy.ru - Проверка поп-апа "Быстрый заказ"',
        copy_search: 'copy.ru - Проверка поиска',

        '1tm_all': '1-tm.ru - Проверка сайта',
        '1tm_main': '1-tm.ru - Проверка главной страницы',
        '1tm_catalog': '1-tm.ru - Проверка бургер-меню',
        '1tm_order': '1-tm.ru - Проверка поп-апа "Онлайн-консультация"',
        '1tm_search': '1-tm.ru - Проверка поиска',

        litera_all: 'litera.studio - Проверка сайта',
        litera_main: 'litera.studio - Проверка главной страницы',
        litera_catalog: 'litera.studio - Проверка бургер-меню',
        litera_order: 'litera.studio - Проверка поп-апа "Оставьте заявку"',
        litera_search: 'litera.studio - Проверка поиска',

        vea_all: 'vea.ru - Проверка сайта',
        vea_main: 'vea.ru - Проверка главной страницы',
        vea_catalog: 'vea.ru - Проверка меню услуг',
        vea_order: 'vea.ru - Проверка поп-апа "Оставьте заявку"',

        sequoia_all: 'sequoiapay.io - Проверка сайта',
        sequoia_main: 'sequoiapay.io - Проверка главной страницы',
        sequoia_lang: 'sequoiapay.io - Проверка смены языка',
    };

    const grepKey = ctx.match[1];
    const grep = grepMap[grepKey];

    if (!grep) {
        ctx.reply('❌ Неизвестный тест.');
        return;
    }

    ctx.answerCbQuery();
    ctx.reply(`🚀 Запускаю тест: ${grep}`);

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
            ctx.reply('✅ Тест запущен!');
        } else {
            const err = await res.text();
            ctx.reply(`❌ Ошибка запуска: ${err}`);
        }
    } catch (err) {
        ctx.reply('❌ Не удалось запустить: ' + (err as Error).message);
    }
});

bot.launch();
