
// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyATpmAbYaNiEHT5I-JFDP9d9wqsUhT71nU",
//     authDomain: "movecdn.firebaseapp.com",
//     databaseURL: "https://movecdn.firebaseio.com",
//     projectId: "movecdn",
//     storageBucket: "movecdn.appspot.com",
//     messagingSenderId: "611915891832"
// };

//DOWNLOAD CONFIG FILE FROM YOUR FIREBASE ACCOUNT
var config = {
    apiKey: "FIREBASE_API_KEY",
    authDomain: "FIREBASE_PROJECT_DOMAIN",
    databaseURL: "FIREBASE_DB_URL",
    projectId: "FIREBASE_PORJECT_ID",
    storageBucket: "FIREBASE_BUCKET_DOMAIN",
    messagingSenderId: "FIREBASE_MESSAGING_ID"
};
firebase.initializeApp(config);


$('#save').click(function () {
    var checkType = document.forms["richmediaForm"]["type"].value,
        marka = document.forms["richmediaForm"]["marka"].value,
        proje = document.forms["richmediaForm"]["proje"].value,
        QRCode = document.forms["richmediaForm"]["QRCode"].value,
        poster = document.forms["richmediaForm"]["poster"].value,
        videoNo = document.forms["richmediaForm"]["videoNo"].value,
        aciklama = document.forms["richmediaForm"]["aciklama"].value;


    if (checkType == "" || marka == "" || proje == "" || QRCode == "" || poster == "" || videoNo == "" || aciklama == "") {
        alert("Lan İstenilenleri Girsene PİÇ");
    }
    else {
        var file = $('input[name="poster"]').prop("files")[0];
        var fileName = Date.now() + "-" + file.name;
        var storageRef = firebase.storage().ref("poster/" + fileName);


        var task = storageRef.put(file);
        $('form[name="richmediaForm"]').prop('value', fileName);

        task.on('state_changed', function (snaphot) {

        }, function error(err) {
            console.log("Hata: " + err.code_ + err.message_);
            alert("Poster Yüklenmedi GERİZEKALI TEKRAR DENE.");

        }, function complate() {
            console.log("Poster Uploaded");

            var postData = {
                type: checkType,
                marka: marka,
                proje: proje,
                QRCode: QRCode,
                aciklama: aciklama,
                videoNo: videoNo,
                poster: fileName
            }

            $.ajax({
                url: "/add_richmedia",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=UTF-8",
                data: JSON.stringify(postData),
                statusCode: {
                    200: function (data) {
                        alert("DONE. PROJECT ADDED.");
                        window.location.reload();
                    },
                    400: function (err) {
                        alert("ERROR. CHECK CONSOLE AND TRY AGAIN.");
                        console.log(err)
                        window.location.reload();
                    }
                }

            });

        });

    }

})

