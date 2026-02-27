#include "db.h"
#include <muduo/base/Logging.h>
#include <mutex>

// 数据库配置信息
static string server = "127.0.0.1";
static string user = "root";
static string password = "123456";
static string dbname = "chat";

// 全局互斥锁，保护 libmysqlclient 在多线程下的安全
static std::mutex g_mysql_mutex;

// 初始化数据库连接
MySQL::MySQL()
{
    std::lock_guard<std::mutex> lock(g_mysql_mutex);
    _conn = mysql_init(nullptr);
}

// 释放数据库连接资源
MySQL::~MySQL()
{
    if (_conn != nullptr)
    {
        std::lock_guard<std::mutex> lock(g_mysql_mutex);
        mysql_close(_conn);
    }
}

// 连接数据库
bool MySQL::connect()
{
    std::lock_guard<std::mutex> lock(g_mysql_mutex);
    MYSQL *p = mysql_real_connect(_conn, server.c_str(), user.c_str(),
                                  password.c_str(), dbname.c_str(), 3306, nullptr, 0);
    if (p != nullptr)
    {
        // C和C++代码默认的编码字符是ASCII，如果不设置，从MySQL上拉下来的中文显示？
        mysql_query(_conn, "set names gbk");
        LOG_INFO << "connect mysql success!";
    }
    else
    {
        LOG_INFO << "connect mysql fail!";
    }

    return p;
}

// 更新操作
bool MySQL::update(string sql)
{
    std::lock_guard<std::mutex> lock(g_mysql_mutex);
    if (mysql_query(_conn, sql.c_str()))
    {
        LOG_INFO << __FILE__ << ":" << __LINE__ << ":"
                 << sql << "更新失败!";
        return false;
    }

    return true;
}

// 查询操作
MYSQL_RES *MySQL::query(string sql)
{
    std::lock_guard<std::mutex> lock(g_mysql_mutex);
    if (mysql_query(_conn, sql.c_str()))
    {
        LOG_INFO << __FILE__ << ":" << __LINE__ << ":"
                 << sql << "查询失败!";
        return nullptr;
    }
    
    return mysql_store_result(_conn);
}

// 获取连接
MYSQL* MySQL::getConnection()
{
    return _conn;
}