$(function() {
    firebase.database().ref("songs").once("value", function(snapshot) {
        var songKeys = Object.keys(snapshot.val());
        var randomSongKey = songKeys[Math.floor(Math.random() * songKeys.length)];

        var songName = snapshot.val()[randomSongKey].name;
        var songArtist = snapshot.val()[randomSongKey].artist;

        var songLetters = "";

        for (var i = 0; i < songName.split(" ").length; i++) {
            songLetters += songName.split(" ")[i][0];
            songLetters += "_".repeat(songName.split(" ")[i].length - 1);
            songLetters += " ";
        }

        songLetters = songLetters.substring(0, songLetters.length - 1);

        $(".songLetters").text(songLetters);
        $(".songArtist").text(songArtist);
    });
});