// To handle string letter replacement
String.prototype.replaceAt = function(i, replacement) {
    return (
        this.substring(0, i) +
        replacement +
        this.substring(i + replacement.length)
    );
}

$(function() {
    var songKeys;
    var randomSongKey;
    var songName;
    var songArtist;
    var songLetters;
    var userText = "";

    function getSong() {
        firebase.database().ref("songs").once("value", function(snapshot) {
            songKeys = Object.keys(snapshot.val());
            randomSongKey = songKeys[Math.floor(Math.random() * songKeys.length)];

            songName = snapshot.val()[randomSongKey].name;
            songArtist = snapshot.val()[randomSongKey].artist;

            songLetters = "";

            for (var i = 0; i < songName.split(" ").length; i++) {
                songLetters += songName.split(" ")[i][0];
                songLetters += "_".repeat(songName.split(" ")[i].length - 1);
                songLetters += " ";
            }

            songLetters = songLetters.substring(0, songLetters.length - 1);

            $(".songLetters").text(songLetters);
            $(".songArtist").text(songArtist);
        });
    }

    function renderText() {
        var songDisplay = songLetters;

        for (var i = 0; i < userText.length; i++) {
            if (i < songDisplay.length) {
                if (songLetters[i] == "_") {
                    songDisplay = songDisplay.replaceAt(i, userText[i]);
                }
            }
            
            if (i >= songDisplay.length - 1) {
                setTimeout(function() {
                    userText = "";

                    getSong();
                }, 500);
            }
        }

        $(".songLetters").text(songDisplay);
    }

    function backspaceText() {
        userText = userText.substring(0, userText.length - 1);

        renderText();
    }

    function typeText(character) {
        userText += character;

        renderText();
    }

    $("body").keyup(function(event) {
        if (event.keyCode == 8) {
            backspaceText();
        } else if (event.keyCode == 192) {
            typeText("'");
        } else {
            typeText(String.fromCharCode(event.keyCode));
        }
    });

    getSong();
});