const { ImapFlow } = require('imapflow');
require('dotenv').config()

const connect = async () => {
    const client = new ImapFlow({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        logger: false,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
    });
    // Wait until client connects and authorizes
    await client.connect()
    return client
}

const disconnectClient = async (client) => {
    // log out and close connection
    await client.logout()
    return true
}

const fetch = async(client, date, queryMethod, mailbox, includeContent) => {
    let msg = [];
    // Select and lock a mailbox. Throws if mailbox does not exist
    let lock = await client.getMailboxLock(mailbox);
    try {
        // fetch latest message source
        // let message = await client.fetchOne('*', { source: true });
        // console.log(message.source.toString());

        // list subjects for all messages
        // uid value is always included in FETCH response, envelope strings are in unicode.
        let query = queryMethod === 'since' ? {since: date} : {on: date};
        for await (let message of client.fetch(query, { envelope: true, source: includeContent })) {
            console.log(`${message.envelope.date} -> ${message.envelope.subject}\n\tcontent available: ${message.source != null}`);
            msg.push(message);
        }
    } finally {
        // Make sure lock is released, otherwise next `getMailboxLock()` never returns
        lock.release();
    }
    return msg;
}

module.exports = {
    connect,
    disconnectClient,
    fetch
}