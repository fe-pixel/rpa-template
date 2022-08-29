#!/bin/bash

# 打包插件
# ./buildPlug.sh

# 打包插件（生产环境）
# ./buildPlug.sh prod

proPath=$(/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=dist --pack-extension-key=dist-crx/helloWorld_prod.pem);

devPath=$(/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=dist --pack-extension-key=dist-crx/helloWorld.pem);

echo -e "\n\n====== 开始打包插件"
oldVer=$(sed -n 5p ./public/manifest.json | cut -d '"' -f 4)
oldVerDate=${oldVer: 0: 8}
newVer=$(date +%Y%m%d)00
gitBranchName=$(git rev-parse --abbrev-ref HEAD)

if [ "$(date +%Y%m%d)" -gt "$oldVerDate" ];then
  let newVer++
else
  newVer=$oldVer
  let newVer++
fi
# echo -e "\noldVer: "$oldVer"\nnewVer:\033[32m "$newVer"\033[0m\ngitBranch:\033[32m" $gitBranchName"\033[0m\n"
echo -e "\noldVer: "$oldVer"\nnewVer:\033[32m "$newVer"\033[0m\n"

read -r -p "请确认新版本号是否正确？ Y - 继续  n - 退出 ：" input
case $input in
    [yY][eE][sS]|[yY])
		echo -e "\n\033[32m确认，继续打包\033[0m"
		;;
    [nN][oO]|[nN])
		echo -e "\n中断打包\n"
		exit 1
    ;;
    *)
		echo -e "\n确认失败\n"
		exit 1
		;;
esac

yarn
yarn run build

perl -pi -e 's/'$oldVer'/'$newVer'/g' ./public/manifest.json
cp ./public/manifest.json ./dist
if [ $1 == "prod" ];then
  $proPath
else
  $devPath
fi

if [ $? -ne 0 ];then
  perl -pi -e 's/'$newVer'/'$oldVer'/g' ./public/manifest.json
  rm -rf dist
  echo -e "====== 打包插件失败\n\n\n\n\n"
  exit 1
fi

if [ $1 == "prod" ];then
  mv dist.crx dist-crx/$newVer'_prod.crx'
  mv dist dist-crx/$newVer'_prod'
else
  mv dist.crx dist-crx/$newVer.crx
  mv dist dist-crx/$newVer
fi

echo -e "\n\n====== 打包插件成功\n\n\n\n\n"
