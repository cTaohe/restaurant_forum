# restaurant_forum

餐廳論壇後台管理者實作

## 環境

- bcrypt-nodejs: 0.0.3
- body-parser: ^1.19.0
- connect-flash: ^0.1.1
- dotenv: ^8.1.0
- express: ^4.17.1
- express-handlebars: ^3.1.0
- express-session: ^1.16.2
- faker: ^4.1.0
- imgur-node-api: ^0.1.0
- method-override: ^3.0.0
- multer: ^1.4.2
- mysql2: ^1.6.5
- nodemon: ^1.19.1
- passport: ^0.4.0
- passport-local: ^1.0.0
- pg: ^7.12.1
- sequelize: ^5.15.1
- sequelize-cli: ^5.5.0

## 下載及安裝

下載專案，請在 Terminal 輸入，並安裝套件

```
git clone https://github.com/cTaohe/restaurant_forum.git
cd restaurant_forum/
git install
```

## 設定 MySql

```
drop database if exists forum;
create database forum;
use forum;
```

## 申請 imgur api
請到 [https://api.imgur.com/oauth2/addclient](https://api.imgur.com/oauth2/addclient) 註冊一個 app

* 輸入 Application name
* 選擇 Authorization type -> OAuth 2 authorization without a callback URL
* 輸入 email 之後 submit 取得 Client id 及 Client secret 以便於使用在 .env

## `.env`設定檔

在 restaurant_forum 資料夾中設定一個 .env 檔案
```
touch .env
```
並在裡面填入
```
IMGUR_CLIENT_ID=Client id
```

## 設定 users 及 restaruants 種子

產生種子
```
npx sequelize db:seed:all
```
刪除種子
```
npx sequelize db:seed:undo:all
```

## Demo

[HEROKU](https://quiet-earth-71662.herokuapp.com/signin)

請勿將 root@example.com 的 admin 權限取消。
- admin: root@example.com password: 12345678 
- user1: user1@example.com password: 12345678
- user2: user2@example.com password: 12345678

## 作者
[Tao](https://github.com/cTaohe)
