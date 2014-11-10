echo STARTING - this may take a couple of seconds...
cd ..
jshint src/**/*.js
jshint src/**/**/*.js
yuidoc . -q -c ./site/yuidoc.json --themedir apitheme
browserify -g cssify -r ./src/itsa.build:itsa -u node-win > ./site/dist/itsabuild.js
uglifyjs ./site/dist/itsabuild.js -b ascii_only=true,beautify=false -c drop_debugger,drop_console,warnings=false -m >./site/dist/itsabuild-min.js
cd ./site
rm -f ./dist/itsabuild.tar
tar cf ./dist/itsabuild.tar ./dist/*



#git add api


cd ..
jekyll build
echo READY