//Bot Will react with ⛔ when an insult is detecting in a message.

function isDeletedByBot(msg) {
    if (msg.reactions.cache.get('⛔')) {
        return true;
    } else {
        return false;
    }
}

module.exports = { isDeletedByBot }