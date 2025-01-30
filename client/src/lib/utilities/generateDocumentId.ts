export const generateObjectId = () => {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
    const randomValue = Math.random().toString(16).slice(2, 12);
    const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
    return timestamp + randomValue + counter;
  };