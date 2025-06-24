# 分布式聊天室 KathrynMill/chatserver

## 项目简介
本项目是一套基于 C++/Node.js/Redis/MariaDB 的分布式聊天室系统，支持高并发、群组聊天、WebSocket 实时通信，适用于企业内网、教学与分布式部署学习场景。

## 技术栈
- C++（核心服务端）
- Node.js + Express + WebSocket（前端/中间层）
- Redis（消息队列/状态同步）
- MariaDB（用户数据库）
- Docker/Kubernetes（容器化与分布式部署）
- NGINX（反向代理，可选）

## 功能特点
- 注册/登录/好友/群组/私聊/群聊
- WebSocket 实时消息推送
- 支持多用户同时在线
- 支持本地化私有部署与 K8s 集群扩展

## 快速开始

### 1. 编译并启动 C++ 服务端
```bash
cd chatserver
mkdir build && cd build
cmake ..
make -j4
# 启动服务（例：6000端口）
./bin/ChatServer 127.0.0.1 6000
```

### 2. 启动 Redis/MariaDB
请确保本机已安装并启动 redis-server、mariadb。

### 3. 启动 Web 前端
```bash
cd web
npm install
npm start
# 浏览器访问 http://127.0.0.1:3000
```

### 4. 测试
- 使用 ChatClient 测试 TCP 聊天协议
- 使用网页端进行注册、登录、聊天

## 分布式部署（Kubernetes 本地方案）

### 1. 本地 Registry 构建与推送
```bash
# 参考 deploy/registry.sh
```

### 2. K8s YAML 一键部署
```bash
kubectl apply -f deploy/all-in-one.yaml
```

### 3. 内网 hosts 配置
请将 chatserver.local 指向本机或 K8s Ingress IP。

### 4. Redis/Kafka 本地安装
可用 Helm Chart 离线安装，详见 deploy/README.md。

## 常见问题
- 端口占用：`sudo lsof -i:6000` 查找并 kill
- 依赖缺失：请参考上方依赖安装命令
- 服务未重启：每次修改后请重启对应服务
- 内存不足：建议 2G+ RAM

---

如需自动化脚本、K8s YAML、Helm Chart、详细部署文档，请参见 `deploy/` 目录。
