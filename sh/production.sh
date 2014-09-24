cd ..
jshint src/**/*.js
cd site
yuidoc . -q --themedir apitheme
cd ..
browserify -r ./src/itsa.build:itsa.build -u node-win > ./site/dist/itsabuild.js
uglifyjs ./site/dist/itsabuild.js -c drop_debugger,drop_console,warnings=false -m >./site/dist/itsabuild-min.js
jekyll build
cd ./sh