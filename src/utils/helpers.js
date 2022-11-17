export const getRandomInt = max => Math.floor(Math.random() * max);

export const getTodaysDate = () => new Date().toLocaleDateString().split('/').join('');
