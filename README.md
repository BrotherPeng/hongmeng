# hongmeng
first repository

1.ssh登录服务器
填写好你的ip地址120.27.37.212，后连接，需要输入用户名root和你设置好的密码。于是就登录到你的服务器了
2.更新服务器应用
yum -y update
3.配置nodejs环境
1.安装nvm
运行：curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.6/install.sh | bash
运行：export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
2.通过nvm安装nodejs
nvm install node
3.安装git
yum install git
4.安装mongodb
下载
curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.9.tgz
解压
tar -zxvf mongodb-linux-x86_64-3.2.9.tgz
移到文件夹（可不）
mkdir -p mongodb cp -R -n mongodb-linux-x86_64-3.2.9/ mongodb
命令加入系统环境
export PATH=<mongodb-install-directory>/bin:$PATH
后台运行（进入mongo目录） ./bin/mongod --dbpath=./db --logpath=./log/mongodb.log --fork
开机启动
echo "/usr/src/mongodb/mongodb-linux-x86_64-3.2.9/bin/mongod --dbpath=/usr/src/mongodb/mongodb-linux-x86_64-3.2.9/db --logpath=/usr/src/mongodb/mongodb-linux-x86_64-3.2.9/log/mongodb.log --fork" >> /etc/rc.local
5.安装mysql