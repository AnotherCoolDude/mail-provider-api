const express = require('express');
const app = express();
const { connect, disconnectClient, fetch } = require('./mailfetcher');
const lowDB = require('lowdb');
const { nanoid } = require('nanoid');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');
const { exit } = require('process');
const cors = require('cors');

let id_length = parseInt(process.env.ID_LENGTH) || 6;
let client;
let low;
let dbPath = __dirname + process.env.DB_PATH || __dirname + "./db/html";

app.use(cors)

app.get('/api/v1', (req, res) => {

    let payload = low.get("newsletter").value();
    res.json(payload);

});

app.get('/*', (req, res) => {
    return res.send({
        message: "Route not implemented"
    })
})


let port = process.env.SERVER_PORT || 8080;
app.listen(port, async () => {
    console.log(`listening on localhost:${port}`);
    console.log("initiating mailparser")
    if (client === undefined) {
        client = await connect();
    }
    console.log("initiating lowdb database");
    if (!fs.existsSync(__dirname + dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
    }
    const adapter = new FileSync("db/nl_db.json");
    low = lowDB(adapter);
    low.defaults({ lastUpdated: "", newsletter: [] }).write();
    if (low.get("lastUpdated").value() == "") {
        console.log("updating lowdb database");
    }
    await updateDatabase(client, new Date("2020-12-01"));
    console.log("done initiating");
});

let updateDatabase = async (client, date = undefined, queryMethod = "since") => {
    let d = date || date.now()
    let msg = await fetch(client, d, queryMethod, "Newsletter", true);
    for (let m of msg) {

        let idx = low
            .get("newsletter")
            .findIndex(nl => new Date(nl.id).getTime() === new Date(m.envelope.date).getTime())
            .value();

        if (idx == -1) {
            low.get("newsletter").push({
                id: m.envelope.date,
                envelope: m.envelope,
                htmlPath: writeHTMLToFile(m.source),
                added: new Date()
            }).write();
        } else {
            low.update(`newsletter[${idx}]`, nl => {
                let p = fs.existsSync(nl.htmlPath) ? nl.htmlPath : writeHTMLToFile(m.source);
                nl.htmlPath = p;
                nl.added = new Date();
                return nl;
            }).write();
        }
        low.set("lastUpdated", Date.now()).write();
    }
    console.log("database updated");
}

let writeHTMLToFile = (source) => {
    let id = nanoid(id_length);
    let p = `${dbPath}/${id}.html`;
    fs.writeFileSync(p, source);
    return p;
}

// let createOrInsert = (lowdb, path, obj) => {
//     lowdb
//         .find({""})
// }