var currentUser = {
    uid: null,
    name: null
};

var currentLocation = window.location.href;
var currentPage = currentLocation.split("/")[currentLocation.split("/").length - 1];

function checkUsername(username) {
    return username.length >= 5 && username.length <= 20 && username.indexOf(" ") < 0;
}

function signIn() {
    firebase.auth().signInWithEmailAndPassword($("#email").val(), $("#password").val()).catch(function(error) {
        $("#accountError").text(error.message);
    });
}

function signUp() {
    if ($("#password").val() == $("#retypedPassword").val() && checkUsername($("#username").val())) {
        firebase.auth().createUserWithEmailAndPassword($("#email").val(), $("#password").val()).catch(function(error) {
            $("#accountError").text(error.message);
        });
    } else if (!checkUsername($("#username").val())) {
        $("#accountError").text("Your username must contain between 5 to 20 characters and must not contain spaces");
    } else {
        $("#accountError").text("Make sure that both passwords you typed are the same");
    }
}

function signOut() {
    firebase.auth().signOut();
}

$(function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in

            currentUser.uid = user.uid;

            if ($("body").attr("data-account") == "signedOut") {
                window.location.href = "index.html";
            }

            firebase.database().ref("users/" + currentUser.uid + "/name").once("value", function(snapshot) {
                var username = snapshot.val();
                
                if (username == null) {
                    firebase.database().ref("users/" + currentUser.uid).set({
                        name: $("#username").val(),
                        score: 0
                    }).then(function() {
                        window.location.href = "index.html";
                    });
                } else {
                    $(".accountName").text(snapshot.val());
                    $(".signedIn").show();
                    $(".signedOut").hide();
                }
            });
        } else {
            // User is signed out

            currentUser.uid = null;
            currentUser.name = null;

            if ($("body").attr("data-account") == "signedIn") {
                window.location.href = "index.html";
            }

            $(".accountName").text("User");
            $(".signedIn").hide();
            $(".signedOut").show();
        }
    });

    $("#password").on("keypress", function(event) {
        if (event.keyCode == 13) {
            if (currentPage == "signin.html") {
                signIn();
            }
        }
    });

    $("#retypedPassword").on("keypress", function(event) {
        if (event.keyCode == 13) {
            if (currentPage == "signup.html") {
                signUp();
            }
        }
    });
});