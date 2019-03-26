export function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function keepOnlyCharacters(string) {
    return string.replace(/[^a-zA-Z]+/g, '');
}

export function keepIpCharacters(string) {
    return string.replace(/[^a-zA-Z1-90:.]+/g, '');
}