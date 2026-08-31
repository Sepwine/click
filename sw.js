const CACHE_NAME = "click-cache-v1";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});


/*
 * 接收 Web Push
 */
self.addEventListener("push", event => {

  let data = {
    title: "Click.",
    message: "你收到了一条新消息"
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    if (event.data) {
      data.message = event.data.text();
    }
  }


  const title =
    data.title || "Click.";

  const options = {
    body:
      data.message ||
      "你收到了一条新消息",

    icon:
      data.icon ||
      "/icon-192.png",

    badge:
      data.badge ||
      "/icon-192.png",

    data: {
      url:
        data.url ||
        "/"
    },

    tag:
      data.tag ||
      "click-message",

    renotify: true
  };


  event.waitUntil(
    self.registration.showNotification(
      title,
      options
    )
  );

});


/*
 * 点击通知
 */
self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    const targetUrl =
      event.notification.data &&
      event.notification.data.url
        ? event.notification.data.url
        : "/";


    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true
      })

      .then(clientList => {

        for (const client of clientList) {

          if (
            "focus" in client
          ) {

            client.navigate(targetUrl);

            return client.focus();

          }

        }

        if (
          clients.openWindow
        ) {

          return clients.openWindow(
            targetUrl
          );

        }

      })

    );

  }
);
