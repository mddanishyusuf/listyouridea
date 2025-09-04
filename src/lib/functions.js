export const formatContent = (content) => {
    // Convert new lines to <br> tags
    content = content.replace(/\n/g, '<br>');

    // Convert spaces to &nbsp;
    // content = content.replace(/ /g, '&nbsp;');

    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    content = content.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    return content;
};

export const randomString = function (length, chars) {
    let mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    let result = '';
    for (let i = length; i > 0; --i) result += mask[Math.round(Math.random() * (mask.length - 1))];
    return result;
};

export const nameToUsername = async (name) => {
    let username = name.toLowerCase();
    username = username.replace(/ /g, '_');
    const randomNumber = Math.floor(Math.random() * 90) + 10;
    username += `_${randomNumber}`;
    return username;
};
