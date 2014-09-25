cp ../src/itsa.build/.gitignore ../src/$1
cp ../src/itsa.build/.travis.yml ../src/$1
cp ../src/itsa.build/.jshintrc ../src/$1
cp ../default_readme.md ../src/$1/README.md
cp ../default_package.json ../src/$1/package.json
cp ../src/itsa.build/LICENSE ../src/$1
mkdir -p ../src/$1/tests
cp ../default_test.js ../src/$1/tests/$1.js
echo READY