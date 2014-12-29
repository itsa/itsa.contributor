uglifyjs ../src/$1 -b ascii_only=true,beautify=false -c drop_debugger,drop_console,warnings=false -m >./gzipped-min.js
gzip ./gzipped-min.js
mv gzipped-min.js.gz gzipped
ls -all gzipped
rm -f ./gzipped
rm -f ./gzipped.js
echo READY