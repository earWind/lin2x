# 自动部署 sh deploy.sh
set -e

yarn build

cd ./docs/.vitepress/dist
 
git init
git add -A
git commit -m 'deploy'

# -f 强制 即 强制推送
git push -f "https://github.com/earWind/vue-press.git" master

cd -