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
    console.log("Hola");
    firebase.initializeApp(config);
    
    var database = firebase.database();
    
    // Escaneamos la base de datos en busca de registros y los representamos en la lista
    var query = database.ref("/");
    query.once("value").then(function(snapshot) {
        console.log(snapshot.val().name);
        
    });
    
    
    
});