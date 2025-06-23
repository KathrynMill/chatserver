# C++ Crow 最小多線程 WebSocket/HTTP Demo

[English version below]

## 項目簡介
本倉庫基於 [Crow](https://github.com/CrowCpp/Crow) 框架，實現了一個最小的多線程 C++ Web 服務，支持 HTTP 路由和 WebSocket echo，適合 C++ Web 入門、教學和二次開發。

## 主要特性
- 🚀 基於 Crow，現代 C++17 語法
- 🌐 支持 HTTP 路由
- 🔄 支持 WebSocket echo
- 🧵 多線程自動啟動（根據 CPU 核心數）
- 🛠️ 易於擴展，適合集成業務邏輯

## 依賴
- C++17 編譯器
- Boost (>=1.64，需 boost_system)
- OpenSSL

安裝依賴（以 CentOS/Ubuntu 為例）：
```bash
# CentOS
sudo yum install boost-devel openssl-devel
# Ubuntu
sudo apt-get install libboost-all-dev libssl-dev
```

## 編譯
```bash
mkdir -p build
cmake -B build -S .
cmake --build build --target web_server_minimal -j4
```

## 運行
```bash
./bin/web_server_minimal
```

## 測試
### HTTP 測試
```bash
curl http://localhost:3000/
# 返回: Hello, Crow minimal demo!
```

### WebSocket 測試
可用 [websocat](https://github.com/vi/websocat) 或瀏覽器 ws 客戶端：
```bash
websocat ws://localhost:3000/ws
# 發送: hello
# 返回: echo: hello
```

## 貢獻
歡迎提交 Issue 或 Pull Request！

## License
MIT

---

# C++ Crow Minimal Multithreaded WebSocket/HTTP Demo

## Introduction
This repository provides a minimal multithreaded C++ web service based on the [Crow](https://github.com/CrowCpp/Crow) framework, supporting HTTP routing and WebSocket echo. Ideal for C++ web beginners, teaching, and further development.

## Features
- 🚀 Modern C++17, Crow-based
- 🌐 HTTP routing
- 🔄 WebSocket echo
- 🧵 Multithreaded by default (auto-detects CPU cores)
- 🛠️ Easy to extend for your own business logic

## Dependencies
- C++17 compiler
- Boost (>=1.64, with boost_system)
- OpenSSL

Install dependencies (CentOS/Ubuntu example):
```bash
# CentOS
sudo yum install boost-devel openssl-devel
# Ubuntu
sudo apt-get install libboost-all-dev libssl-dev
```

## Build
```bash
mkdir -p build
cmake -B build -S .
cmake --build build --target web_server_minimal -j4
```

## Run
```bash
./bin/web_server_minimal
```

## Test
### HTTP
```bash
curl http://localhost:3000/
# Output: Hello, Crow minimal demo!
```
### WebSocket
Use [websocat](https://github.com/vi/websocat) or browser ws client:
```bash
websocat ws://localhost:3000/ws
# Send: hello
# Output: echo: hello
```

## Contributing
PRs and issues are welcome!

## License
MIT
