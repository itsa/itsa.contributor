echo STARTING - this may take a couple of seconds...
cd ..
jshint src/**/*.js
jekyll build
rm -f ./site-preview/dist/itsabuild.js
rm -f ./site-preview/dist/itsabuild-min.js
yuidoc . -q --themedir apitheme
browserify -r ./src/itsa.build:itsa -u node-win > ./site-preview/dist/itsabuild.js
uglifyjs ./site-preview/dist/itsabuild.js -b ascii_only=true,beautify=false -c drop_debugger,drop_console,warnings=false -m >./site-preview/dist/itsabuild-min.js
echo READY