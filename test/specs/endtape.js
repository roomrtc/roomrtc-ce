// close server by exit application
require('tape')('Close server after testing done', function (test) {
    // just exit application
    test.end();
    process.exit();
});