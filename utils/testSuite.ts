import { test } from '../fixtures';

/**
 * Обёртка над test.describe, которая автоматически
 * задаёт suiteName для allure через test.use()
 */
export function testSuite(suiteName: string, fn: () => void) {
    test.describe(suiteName, () => {
        test.use({ suiteName });
        fn();
    });
}
