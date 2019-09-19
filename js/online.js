window.addEventListener('load', function() {
    var status = document.getElementById("online-status");
    var log = document.getElementById("log");

    var condition = navigator.onLine ? "online" : "offline";

    // status.className = condition;
    status.innerHTML = condition.toUpperCase();

    function updateOnlineStatus(event) {
        var condition = navigator.onLine ? "online" : "offline";

        // status.className = condition;
        status.innerHTML = condition.toUpperCase();

        log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
    }

    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});