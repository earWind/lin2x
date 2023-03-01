set -e
yarn build
cd ./dist
 
git init
git add -A
git commit -m 'deploy'
 
git push -f "https://github.com/earWind/vue-press.git" master
cd -