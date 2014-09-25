browserify -r ../src/$1 -u node-win > ./gzipped.js
uglifyjs ./gzipped.js -c drop_debugger,drop_console,warnings=false -m >./gzipped-min.js
gzip ./gzipped-min.js
mv gzipped-min.js.gz gzipped
ls -all gzipped
rm -f ./gzipped
rm -f ./gzipped.js
echo READY