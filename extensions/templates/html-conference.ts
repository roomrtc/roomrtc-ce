const html = ({ body }: { body: string }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>RoomRTC Community Edition</title>
      <link rel="icon" href="data:,">
    </head>
    <body style="margin:0">
      <div id="app">${body}</div>
    </body>
    <script src="/app.js" defer></script>
  </html>
`;

export default html;
