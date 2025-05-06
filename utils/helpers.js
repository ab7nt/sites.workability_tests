export const helpers = {
    getRandomSearchWord() {
        const words = ['Визитки', 'Буклеты', 'Брошюры', 'Флаеры'];
        return words[Math.floor(Math.random() * words.length)];
    },
};
