# C++ Crow 最小多線程 WebSocket/HTTP Demo

## 項目簡介
本項目基於 [Crow](https://github.com/CrowCpp/Crow) 框架，實現了一個最小的多線程 C++ Web 服務，支持 HTTP 路由和 WebSocket echo。

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

## 多線程
- 默認啟動時自動使用多線程（根據 CPU 核心數）。

---
如需集成更完整的 C++ 業務邏輯，請逐步擴展本 demo。
