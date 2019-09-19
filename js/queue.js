localStorage.setItem('queue', JSON.stringify([]));

queueForm = function(){
    var formData = new FormData(document.querySelector('form'));

    fname = document.getElementById('fname').value;
    lname = document.getElementById('lname').value;

    pendingSubs = JSON.parse(localStorage.getItem("queue"));
    pendingSubs.push({'fname': fname, 'lname': lname});

    localStorage.setItem('queue', JSON.stringify(pendingSubs));
};

submitForm = function(form) {
    // Add a new document in collection "cities"
    firebase.firestore().collection("users").add({
        firstname: form.fname,
        lastname: form.lname
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
};

submitQueue = function(){
    var queue = JSON.parse(localStorage.getItem('queue'));
    console.log("Submitting " + queue.length + " submissions...");
    queueLen = queue.length;
    for (var i = 0; i < queueLen; i++) {
        // console.log(queue.pop());
        submitForm(queue.pop());
    }
    localStorage.setItem('queue', JSON.stringify([]));
};

attemptSubmit = function() {
    queueForm();
    if (navigator.onLine) {
        // Attempt submit
        submitQueue();
    } else {
        // Can't submit
        console.log("Can't submit because offline! Will retry when back online.")
    }
    return false;
};

window.addEventListener('load', function() {
    var log = document.getElementById("log");

    function retryPending(event) {
        var condition = navigator.onLine ? "online" : "offline";
        submitQueue();

        log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
    }

    window.addEventListener('online',  retryPending);
});