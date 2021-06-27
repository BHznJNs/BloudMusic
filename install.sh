# 如果文件夹不存在，克隆储存库
if [ ! -d "./NeteaseCloudMusicApi" ]; then
  git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git
fi
cd NeteaseCloudMusicApi
# 安装 express
if [ ! -d "./node_modules/express" ]; then
  npm install express -s
  # 文件重命名
  if [ -d "./app.js" ]; then
    mv app.js NCMapi.js
  fi
fi

cd ../
# 安装依赖库
npm install
# 如果 Electron 未安装成功
if [ ! -d "./node_modules/electron/dist" ]; then
  node ./node_modules/electron/install.js
fi

# 启动程序
# npm start
