import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

const mainMenu = Markup.keyboard([['🌐 Проверить все сайты'], ['📁 Выбрать сайт']]).resize();

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

let userState: Record<number, { currentSite?: string }> = {};

bot.start((ctx) => {
    userState[ctx.from!.id] = {};
    ctx.reply('Выберите действие:', mainMenu);
});

bot.hears('📁 Выбрать сайт', (ctx) => {
    userState[ctx.from!.id] = {};
    const siteButtons = sites.map((site) => [site]);
    ctx.reply('Выберите сайт:', Markup.keyboard([...siteButtons, ['⬅️ Назад']]).resize());
});

bot.hears('⬅️ Назад', (ctx) => {
    userState[ctx.from!.id] = {};
    ctx.reply('Выберите действие:', mainMenu);
});

bot.hears('🌐 Проверить все сайты', async (ctx) => {
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
        ctx.reply(res.ok ? '✅ Тесты запущены!' : `❌ Ошибка запуска: ${await res.text()}`);
    } catch (err) {
        ctx.reply('❌ Не удалось запустить: ' + (err as Error).message);
    }
});

bot.hears(/^(.+)$/, (ctx) => {
    const text = ctx.message.text.trim();
    const user = userState[ctx.from!.id];

    if (!user.currentSite && sites.includes(text)) {
        user.currentSite = text;
        const tests = siteTests[text].map((t) => [t]);
        ctx.reply(`Выберите тест для ${text}:`, Markup.keyboard([...tests, ['⬅️ Назад']]).resize());
        return;
    }

    if (user.currentSite) {
        const grepKey = `${user.currentSite}:${text}`;
        const grep = grepMap[grepKey];
        if (!grep) {
            ctx.reply('❌ Неизвестный тест.');
            return;
        }

        ctx.reply(`🚀 Запускаю тест: ${grep}`);
        fetch(
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
        )
            .then((res) =>
                res.ok
                    ? ctx.reply('✅ Тест запущен!')
                    : res.text().then((err) => ctx.reply(`❌ Ошибка запуска: ${err}`))
            )
            .catch((err) => ctx.reply('❌ Не удалось запустить: ' + err.message));
    }
});

bot.launch();
