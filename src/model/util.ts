export function formatDate(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatServerResponse(message: string) {
    const str = message.replace('Bad Request: data/', '').replace('Forbidden: ', '');
    const split =  str.split(' ');
    // return the first word of str converted from `camelCase` to `Sentence case` prepended to the rest of the message.
    return split[0][0].toUpperCase() + split[0].slice(1).replace(/([A-Z])/g,' $1') + ' ' + split.slice(1).join(' ');
}