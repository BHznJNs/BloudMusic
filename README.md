<h1>BloudMusic</h1>
<h3>简介</h3>
<p>一个第三方的网易云音乐客户端，使用 Electron.js 开发</p>
<p>基于这位大佬写的 api <a href="https://github.com/Binaryify/NeteaseCloudMusicApi">Binaryify / NeteaseCloudMusicApi</a>开发，在此致谢。</p>
<hr />
<h3>屏幕截图</h3>
<img src="imgs/screenshot_main.png"/>
<img src="imgs/screenshot_playWidget.png"/>
<hr />
<h3>使用方法</h3>
<ul>
  <li><a href="https://nodejs.org/en/download/">到此</a>下载并安装 Node.js</li>
  <li><a href="https://github.com/BHznJNs/BloudMusic/releases/">到此</a>下载并解压源码压缩包</li>
  <li>打开你的 终端/terminal/cmd/powershell ，<code>cd</code> 进入解压目录，如 <code>cd ~/BloudMusic</code> </li>
  <li>输入 <code>npm install</code> 以安装依赖（Electron 有时会安装失败，你可能需要 <code>cd</code> 到 node_module 中的 electron 使用 <code>node install.js</code> 以安装 Electron）</li>
  <li><a href="https://github.com/Binaryify/NeteaseCloudMusicApi">到此</a>下载 api 包，解压后移动至项目文件夹</li>
  <li>进入 api 包，用 npm 安装 express，并将 app.js 改名为 NCMapi.js (防止运行时与其它 js 脚本撞名)</li>
  <li>输入 <code>npm start</code> 以运行程序</li>
</ul>
<hr />
<h3>注：</h3>
<ul>
  <li>本项目适合爱折腾的用户使用（折腾本项目需要一定的 CSS 和 Javascript 基础）</li>
  <li>本项目未加入任何社交功能</li>
  <li>本项目仍处于开发中</li>
</ul>
<hr />
<h3>TODO</h3>
<ul>
  <li>右键点击歌单封图显示下载选项</li>
  <li>歌手单击名字打开详情页</li>
  <li>黑暗模式</li>
  <li>喜欢 / 取消喜欢单曲</li>
  <li>歌单编辑</li>
  <li>歌词显示</li>
  <li>设置界面</li>
  <li>...</li>
</ul>
