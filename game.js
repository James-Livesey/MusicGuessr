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
    var lives = 2;
    var deductingLife = false;

    function getSong() {
        firebase.database().ref("songs").once("value", function(snapshot) {
            songKeys = Object.keys(snapshot.val());
            randomSongKey = songKeys[Math.floor(Math.random() * songKeys.length)];

            songName = snapshot.val()[randomSongKey].name;
            songArtist = snapshot.val()[randomSongKey].artist;
            songUID = snapshot.val()[randomSongKey].uid;

            songLetters = "";

            for (var i = 0; i < songName.split(" ").length; i++) {
                songLetters += songName.split(" ")[i][0].toUpperCase();
                songLetters += "_".repeat(songName.split(" ")[i].length - 1);
                songLetters += " ";
            }

            songLetters = songLetters.substring(0, songLetters.length - 1);

            $(".songLetters").text(songLetters);
            $(".songArtist").text(songArtist);

            firebase.database().ref("users/" + songUID + "/name").once("value", function(snapshot) {
                $(".songSuggester").text(snapshot.val());
            });
        });
    }

    function updateLivesDisplay() {
        $(".livesDisplay").text("❤️".repeat(lives));
    }

    function deductLife() {
        if (!deductingLife) {
            deductingLife = true;
            var oldLives = lives;

            for (var i = 0; i < 10; i++) {
                setTimeout(function() {
                    if (lives != oldLives) {
                        lives++;
                    } else {
                        lives--;
                    }

                    updateLivesDisplay();
                }, 100 * i);
            }

            lives = oldLives - 1;

            setTimeout(function() {
                if (lives == 0) {
                    window.location.href = "gameover.html";
                }

                deductingLife = false;
            }, 1000);
        }
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
                if (songDisplay.toUpperCase() == songName.toUpperCase()) {
                    firebase.database().ref("users/" + currentUser.uid + "/score").once("value", function(snapshot) {
                        firebase.database().ref("users/" + currentUser.uid + "/score").set(snapshot.val() + (
                            lives == 2 ?
                            3 :
                            1
                        ));
                    });

                    lives = 2;

                    updateLivesDisplay();

                    setTimeout(function() {
                        userText = "";

                        getSong();
                    }, 500);
                } else {
                    deductLife();

                    setTimeout(function() {
                        userText = "";

                        renderText();
                    }, 1000);
                }
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

    firebase.auth().onAuthStateChanged(function() {
        firebase.database().ref("users/" + currentUser.uid + "/score").on("value", function(snapshot) {
            $(".scoreDisplay").text(snapshot.val());
        });
    });
});