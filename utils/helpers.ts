export const helpers = {
    getRandomSearchWord(): string {
        const words: string[] = ['Визитки', 'Буклеты', 'Брошюры', 'Флаеры'];
        return words[Math.floor(Math.random() * words.length)];
    },
};
