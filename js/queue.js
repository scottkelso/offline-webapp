localStorage.setItem('queue', JSON.stringify([]));
ENDPOINT = "https://p9st462m4l.execute-api.eu-west-1.amazonaws.com/prod";

queueForm = function(){
    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;

    let pendingSubs = JSON.parse(localStorage.getItem("queue"));
    pendingSubs.push({'fname': fname, 'lname': lname});

    localStorage.setItem('queue', JSON.stringify(pendingSubs));
};

submitForm = function(form) {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(JSON.stringify(form), " successfully written!");
        }
    });
    xhttp.open("POST", ENDPOINT + "/ride", true);
    xhttp.send(JSON.stringify(form));
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