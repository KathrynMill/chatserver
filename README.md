# 分散式聊天室 KathrynMill/chatserver

## 專案簡介
本專案是一套基於 C++/Node.js/Redis/MariaDB 的分散式聊天室系統，支持高併發、群組聊天、WebSocket 實時通訊，適用於企業內網、教學與分散式部署學習場景。

## 技術棧
- C++（核心服務端）
- Node.js + Express + WebSocket（前端/中介層）
- Redis（消息隊列/狀態同步）
- MariaDB（用戶資料庫）
- Docker/Kubernetes（容器化與分散式部署）
- NGINX（反向代理，選配）

## 功能特點
- 註冊/登入/好友/群組/私聊/群聊
- WebSocket 即時消息推送
- 支援多用戶同時在線
- 支援本地化私有部署與 K8s 集群擴展

## 快速開始

### 1. 編譯與啟動 C++ 服務端
```bash
cd chatserver
mkdir build && cd build
cmake ..
make -j4
# 啟動服務（例：6000端口）
./bin/ChatServer 127.0.0.1 6000
```

### 2. 啟動 Redis/MariaDB
請確保本機已安裝並啟動 redis-server、mariadb。

### 3. 啟動 Web 前端
```bash
cd web
npm install
npm start
# 瀏覽器訪問 http://127.0.0.1:3000
```

### 4. 測試
- 使用 ChatClient 測試 TCP 聊天協議
- 使用網頁端進行註冊、登入、聊天

## 分散式部署（Kubernetes 本地方案）

### 1. 本地 Registry 構建與推送
```bash
# 參考 deploy/registry.sh
```

### 2. K8s YAML 一鍵部署
```bash
kubectl apply -f deploy/all-in-one.yaml
```

### 3. 內網 hosts 配置
請將 chatserver.local 指向本機或 K8s Ingress IP。

### 4. Redis/Kafka 本地安裝
可用 Helm Chart 離線安裝，詳見 deploy/README.md。

## 常見問題
- 端口佔用：`sudo lsof -i:6000` 查找並 kill
- 依賴缺失：請參考上方依賴安裝命令
- 服務未重啟：每次修改後請重啟對應服務
- 記憶體不足：建議 2G+ RAM

---

如需自動化腳本、K8s YAML、Helm Chart、詳細部署文檔，請參見 `deploy/` 目錄。
