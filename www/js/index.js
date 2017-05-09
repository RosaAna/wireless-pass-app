$(document).ready(function() {
    // Inicio de Firebase
    var config = {
        apiKey: "AIzaSyAX0Idb2Au81gJK1EXEJil5I4XTUCloLJ0",
        authDomain: "wireless-pass-app.firebaseapp.com",
        databaseURL: "https://wireless-pass-app.firebaseio.com",
        projectId: "wireless-pass-app",
        storageBucket: "wireless-pass-app.appspot.com",
        messagingSenderId: "710737740178"
    };
    
    firebase.initializeApp(config);
    
    $(".list, .back-button").hide();
    
    $("#ssid, #pass, #mac, #country, #search-input").val("");
    
    var database = firebase.database();
    
    // Escaneamos la base de datos en busca de registros y los representamos en la lista
    readFromDatabase();
    
    $(".add-button").click(function() {
        if(checkAddForm()) {
            var query = database.ref("/");
            var data = {
                "ssid": $("#ssid").val().toLowerCase(),
                "pass": $("#pass").val(),
                "mac": $("#mac").val(),
                "country": $("#country").val()
            }
            
            query.push(data);
            appendDataToList($("#ssid").val(), $("#pass").val(), $("#mac").val(), $("#country").val());
            showPopup('Registro añadido correctamente.');
            
        }
    });
    
    $(".search-button").click(function() {
        var query = $("#search-input").val().toLowerCase();
        
        if(query == "") {
           showPopup("No puedes buscar sin parámetros.", "#list-error-snackbar", ".search-button");
           
        } else {
            var check = true;
            
            var dbQuery = database.ref("/");
            dbQuery.once("value").then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var name = childSnapshot.val().ssid;
                    
                    if(name.includes(query)) {
                        if(check) {
                            $(".trdata").fadeOut().remove();
                        }
                        check = false;
                        appendDataToList(childSnapshot.val().ssid, childSnapshot.val().pass, childSnapshot.val().mac,                             childSnapshot.val().country);
                    
                    }
                    
                });
            });
            
            $(".back-button").fadeIn(400);
            
        }
    });
    
    $(".back-button").click(function() {
        $(".trdata").fadeOut().remove();
        
        readFromDatabase();
        
        $(".back-button").fadeOut(400);
        
    });
    
});

function readFromDatabase() {
    var query = firebase.database().ref("/");
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            appendDataToList(childSnapshot.val().ssid, childSnapshot.val().pass, childSnapshot.val().mac, childSnapshot.val().country)
        });
    });
    
}

// Función que representa en una lista el contenido de la base de datos
function appendDataToList(ssid, pass, mac, country) {
    var tr = $('<tr class="trdata"></tr>');
    
    tr.append($('<td>' + ssid.toUpperCase() + '</td>'));
    tr.append($('<td>' + pass + '</td>'));
    
    if(isMac(mac)) {
        tr.append($('<td>' + mac + '</td>'));
    } else {
        tr.append($('<td>No conocida</td>'));
    }
    
    if(country == "") {
        tr.append($('<td>No conocida</td>'));
    } else {
        tr.append($('<td>' + country + '</td>'));
    }
    
    $('.list').append(tr);
    
    $(".list").fadeIn();
    
}

function isMac(mac) {
    var check = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/
    
    return check.test(mac);
}

function checkAddForm() {
    var check = true;
    
    var ssid = $("#ssid").val();
    var pass = $("#pass").val();
    
    if(ssid == "" || pass == "") {
        check = false;
        showPopup('Los campos no pueden estar vacíos.', '#error-snackbar', '.add-button');
        
    }
    
    return check;
    
}

function showPopup(infoMsg, location, trigger) {
    var snackbarContainer = document.querySelector(location);
    var showToastButton = document.querySelector(trigger);
    
    var data = {message: infoMsg};
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
        
    
}