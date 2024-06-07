window.addEventListener('beforeunload', function (event) {
    // Perform an action before the user closes the browser or navigates away
    fetch(`/logout`, { method: 'GET', keepalive: true });
  });