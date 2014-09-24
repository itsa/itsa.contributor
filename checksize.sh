browserify -r $1 -u node-win > ./testbuild.js
uglifyjs ./testbuild.js -c drop_debugger,drop_console,warnings=false -m >./testbuild-min.js
rm -f ./testbuild.js