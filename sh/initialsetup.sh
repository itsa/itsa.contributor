cd ..
npm install
mkdir -p src
cd src
rm -f node_modules
ln -s ../src node_modules
cd ../server/mocha
rm -f chai-as-promised.js
rm -f chai.js
ln -s ../../node_modules/chai-as-promised/lib/chai-as-promised.js chai-as-promised.js
ln -s ../../node_modules/chai/chai.js chai.js
echo READY