echo STARTING - this may take a couple of seconds...
cd ..
jshint src/**/*.js
yuidoc . -q -c ./site/yuidoc.json --themedir apitheme
browserify -r ./src/itsa.build:itsa -u node-win > ./site/dist/itsabuild.js
uglifyjs ./site/dist/itsabuild.js -b ascii_only=true,beautify=false -c drop_debugger,drop_console,warnings=false -m >./site/dist/itsabuild-min.js
cd ./site
rm -f ./dist/itsabuild.tar
tar cf ./dist/itsabuild.tar ./dist/*
rm -f ./dist/itsabuild.js
rm -f ./dist/itsabuild-min.js


#git add api


cd ..
jekyll build
echo READY