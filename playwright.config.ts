import { defineConfig, devices } from '@playwright/test';
// import { settings } from './data/settings';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import path from 'path';
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    // globalSetup: require.resolve('./globalSetup.js'),
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: false,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: false,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        [
            'allure-playwright',
            {
                detail: true,
                outputFolder: 'allure-results',
                suiteTitle: false,
                environmentInfo: {
                    project: 'Мониторинг сайтов',
                },
            },
        ],
        // ['html', { open: 'always' }],
        // ['list'],
        // ['allure-playwright', { outputFolder: 'allure-results' }],
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    timeout: 30 * 1000, // Время ожидания для всех неявных ожиданий
    use: {
        headless: true,
        // baseURL: settings.envURL, // Base URL to use in actions like `await page.goto('/')`
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        launchOptions: {
            args: ['--force-prefers-reduced-motion'], // Системное отключение анимаций
        },
        // video: 'retain-on-failure', // Запись видео только при ошибке (по желанию)
        // timeout: 10 * 1000, // Время ожидания для всех явных ожиданий
    },
    outputDir: 'test-results/', // Папка для сохранения результатов

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'Desktop Chrome',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1560, height: 850 },
            },
        },

        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //         viewport: { width: 1560, height: 850 },
        //     },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 7'] },
        },
        // {
        //     name: 'Mobile Safari',
        //     use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
