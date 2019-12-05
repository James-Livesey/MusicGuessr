$(function() {
    firebase.database().ref("users").orderByChild("score").limitToLast(20).on("value", function(snapshot) {
        $(".highscoreTableData").html("");

        snapshot.forEach(function(childSnapshot) {
            $(".highscoreTableData").prepend(
                $("<tr>").append([
                    $("<td>").text(childSnapshot.val().name),
                    $("<td>").text(childSnapshot.val().score)
                ])
            );
        });
    });
});