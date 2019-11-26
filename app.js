const express = require('express');
const app = express();
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//DOWNLOAD PROJECT KEY FILES FROM YOUR FIREBASE ACCOUNT
var serviceAccount = require('./api/accountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "FIREBASE_DB_URL"
});

var db = admin.database();
var gallery = db.ref("gallery"); //FIREBASE DB REF NAME


app.post("/add_richmedia", (req, res, next) => {

    const urun = req.body.type,
        marka = req.body.marka,
        proje = req.body.proje,
        QRCode = req.body.QRCode,
        aciklama = req.body.aciklama,
        video = req.body.videoNo,
        poster = "https://firebasestorage.googleapis.com/v0/b/movecdn.appspot.com/o/poster%2F" + req.body.poster + "?alt=media";

    var richmediaObject = {};


    gallery.once("value", snapshot => {
        var checkUrun = snapshot.child(urun).exists();
        if (checkUrun) {
            gallery = db.ref("gallery/" + urun);
            richmediaObject = {
                [marka]: {
                    [proje]: {
                        "QRCode": QRCode,
                        "description": aciklama,
                        "image": poster,
                        "videoLink": video
                    }

                }
            }
        }
        else {
            gallery = db.ref("gallery");
            richmediaObject = {
                [urun]: {
                    [marka]: {
                        [proje]: {
                            "QRCode": QRCode,
                            "description": aciklama,
                            "image": poster,
                            "videoLink": video
                        }

                    }
                }
            }
        }
        gallery.update(richmediaObject).then((result) => {
            res.status(200);

        }).catch((error) => {
            console.log(error);
            res.status(400);
        });


    });
    res.end();
});


app.get("/", (req, res) => {

    gallery.once("value", function (snapshot) {
        res.send(
            snapshot.val()
        )
    })
});

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log("Server is Listening..." + PORT);
});


