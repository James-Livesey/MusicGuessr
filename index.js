$(function() {
    firebase.database().ref("users").orderByChild("score").limitToLast(20).on("value", function(snapshot) {
        $(".highscoreTableData").html("");

        var delayValue = 0;

        snapshot.forEach(function(childSnapshot) {
            setTimeout(function() {
                $(".highscoreTableData").prepend(
                    $("<tr" + (
                        childSnapshot.key == currentUser.uid ?
                        " class='me'" :
                        ""
                    ) + ">").append([
                        $("<td>").text(childSnapshot.val().name),
                        $("<td>").text(childSnapshot.val().score)
                    ])
                );
            }, delayValue);

            delayValue += 100;
        });
    });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.database().ref("users/" + currentUser.uid + "/score").on("value", function(snapshot) {
                $(".scoreDisplay").text(snapshot.val());
            });
        }
    });
});