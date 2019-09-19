var messaging = firebase.messaging();

// Add the public key generated from the console here.
const key = "BHK9U7NPtqFxtJvFuFDOL2KbFcfkuicdVsm-mvhRQmgKWkfqOEzC1GqmsaTklmV-y-WGzELmjpubghsoSFK-QkY";
messaging.usePublicVapidKey(key);

Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');

        // Get Instance ID token. Initially this makes a network call, once retrieve
        // subsequent calls to getToken will return from cache.
        messaging.getToken().then((currentToken) => {
            if (currentToken) {
                sendTokenToServer(currentToken);
                updateUIForPushEnabled(currentToken);
            } else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');

                // Show permission UI.
                updateUIForPushPermissionRequired();
                setTokenSentToServer(false);
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            showToken('Error retrieving Instance ID token. ', err);
            setTokenSentToServer(false);
        });

        // Callback fired if Instance ID token is updated.
        messaging.onTokenRefresh(() => {
            messaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.');

                // Indicate that the new Instance ID token has not yet been sent to the app server.
                setTokenSentToServer(false);

                // Send Instance ID token to app server.
                sendTokenToServer(refreshedToken);
            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
                showToken('Unable to retrieve refreshed token ', err);
            });
        });

        // Handle incoming messages. Called when:
        // - a message is received while the app has focus
        // - the user clicks on an app notification created by a service worker
        //   `messaging.setBackgroundMessageHandler` handler.
        messaging.onMessage((payload) => {
            console.log('Message received. ', payload);
            // ...
        });
    } else {
        console.log('Unable to get permission to notify.');
    }
});