# DegreeSheep WWW Component
## Web interface to the degreesheep system

# Compilation

To build the javascript and less to a deployable form, you'll need
[browserify](http://browserify.org/) and [lessc](http://lesscss.org/).

To build, enter the repo and perform the following:

    mkdir -p js/build 2>/dev/null
    pushd js > /dev/null
    browserify -d -t reactify src/app.js -o build/app.js
    popd >/dev/null
    mkdir -p css/{build,src} 2>/dev/null
    pushd css >/dev/null
    lessc src/app.less > build/app.css
    popd >/dev/null

This will generate the monolithic app.css and app.js, which are the only things
referenced by index.html
