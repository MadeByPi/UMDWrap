@echo off

: Should succeed
:
neko bin/UMDWrap.n -in example/project/bin/haxejs-no-exports.js -out example/module-no-exports.js
neko bin/UMDWrap.n -in example/project/bin/haxejs-exports.js -out example/module-with-exports.js


: Will fail
:

: -in and -out args are required
neko bin/UMDWrap.n 

: input js does not exist
neko bin/UMDWrap.n -in does-not-exist.js -out example/module_test-with-exports1.js

: output js not a writable location
neko bin/UMDWrap.n -in example/with-exports.js -out abc123-doesnt-exist/test.js


: launch the example page (check bowser console output)
echo Launching example/index.html -- Check the browser console output

start example/index.html

pause