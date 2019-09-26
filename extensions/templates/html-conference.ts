const html = ({ body }: { body: string }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
      <meta name="description" content="RoomRTC - Live Channel Video Conferencing with WebRTC">
      <title>RoomRTC Community Edition</title>
      <link rel="icon" href="data:,">
    </head>
    <body style="margin:0">
      <div id="app">${body}</div>
      <div id="app-container"></div>
      <div id="app-media-query-detector"></div>
    </body>
    <script src="/app.js" defer></script>
  </html>
`;

export default html;
