#include "chatserver.hpp"
#include "json.hpp"
#include "chatservice.hpp"

#include <iostream>
#include <functional>
#include <string>
using namespace std;
using namespace placeholders;
using json = nlohmann::json;

// 初始化聊天服务器对象
ChatServer::ChatServer(EventLoop *loop,
                       const InetAddress &listenAddr,
                       const string &nameArg)
    : _server(loop, listenAddr, nameArg), _loop(loop)
{
    // 注册链接回调
    _server.setConnectionCallback(std::bind(&ChatServer::onConnection, this, _1));

    // 注册消息回调
    _server.setMessageCallback(std::bind(&ChatServer::onMessage, this, _1, _2, _3));

    // 设置线程数量
    _server.setThreadNum(4);
}

// 启动服务
void ChatServer::start()
{
    _server.start();
}

// 上报链接相关信息的回调函数
void ChatServer::onConnection(const TcpConnectionPtr &conn)
{
    // 客户端断开链接
    if (!conn->connected())
    {
        ChatService::instance()->clientCloseException(conn);
        conn->shutdown();
    }
}

// 上报读写事件相关信息的回调函数
// 解决 TCP 粘包：一次 read 可能读到多条 JSON，需逐条拆分
void ChatServer::onMessage(const TcpConnectionPtr &conn,
                           Buffer *buffer,
                           Timestamp time)
{
    string buf = buffer->retrieveAllAsString();

    // 按花括号深度拆分出每一条完整的 JSON 报文
    int depth = 0;
    size_t start = 0;
    for (size_t i = 0; i < buf.size(); ++i)
    {
        if (buf[i] == '{') ++depth;
        else if (buf[i] == '}') --depth;

        if (depth == 0 && i > start)
        {
            string single = buf.substr(start, i - start + 1);
            start = i + 1;

            try
            {
                json js = json::parse(single);
                cout << single << endl;
                auto msgHandler = ChatService::instance()->getHandler(js["msgid"].get<int>());
                msgHandler(conn, js, time);
            }
            catch (const std::exception &e)
            {
                cerr << "JSON parse error: " << e.what() << endl;
            }
        }
    }
}