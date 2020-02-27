function suggestSong() {
    if ($("#title").val().trim() != "" && $("#artist").val().trim() != "") {
        firebase.database().ref("songs").push().set({
            name: $("#title").val().trim(),
            artist: $("#artist").val().trim(),
            uid: currentUser.uid
        }).then(function() {
            window.location.replace("songsuggest.html?done=true");
        });
    } else {
        $("#suggestError").text("It looks like you're missing something...");
    }
}

$(function() {
    if (getURLParameter("done") == "true") {
        $("#suggestError").text("Thank you for suggesting your song!");
    }
});