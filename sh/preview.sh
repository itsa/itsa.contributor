cd ..
jshint src/**/*.js
jekyll build
yuidoc -q --themedir apitheme
browserify -r ./src/itsa.build:itsa.build -u node-win > ./site-preview/dist/itsabuild.js
uglifyjs ./site-preview/dist/itsabuild.js -c drop_debugger,drop_console,warnings=false -m >./site-preview/dist/itsabuild-min.js
cd ./sh