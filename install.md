
#### 安装 node
```sh
sudo apt-get install git
```

```sh
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.32.1/install.sh | bash
```

```sh
source ~/.bashrc
```
```sh
nvm install node
```
```sh
nvm use node
```

#### 安装 mongodb

```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
```

```sh
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
```

```sh
sudo apt-get update
```

```sh
sudo apt-get install -y mongodb-org
```

```sh
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections
```

```sh
sudo service mongod start
```
