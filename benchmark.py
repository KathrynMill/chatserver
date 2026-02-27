import socket
import json
import time
import threading
import sys

# 目标 Nginx 代理端口
HOST = '127.0.0.1'
PORT = 8000

# 模拟并发数
CONCURRENCY = 8500

# 线程安全的计数器
success_count = 0
fail_count = 0
lock = threading.Lock()

def simulate_client(client_id):
    global success_count, fail_count
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5.0)
        s.connect((HOST, PORT))
        
        # 组装登录请求
        login_msg = {
            "msgid": 1,
            "id": 1000 + client_id,
            "password": "123"
        }
        
        # 发送登录报文
        msg_str = json.dumps(login_msg)
        s.sendall(msg_str.encode('utf-8'))
        
        # 接收登录响应
        resp = s.recv(1024)
        if not resp:
            raise Exception("Empty response")
        
        # 模拟发包
        for i in range(5):
            chat_msg = {
                "msgid": 6,
                "id": 1000 + client_id,
                "toid": 1000 + ((client_id + 1) % CONCURRENCY),
                "msg": f"Hello from {client_id} message {i}",
                "time": str(time.time())
            }
            s.sendall(json.dumps(chat_msg).encode('utf-8'))
            time.sleep(0.1)
            
        # 接收残留消息
        s.settimeout(1.0)
        try:
            while True:
                data = s.recv(4096)
                if not data:
                    break
        except:
            pass
            
        s.close()
        
        with lock:
            success_count += 1
            
    except Exception as e:
        with lock:
            fail_count += 1

if __name__ == '__main__':
    print(f"=" * 50)
    print(f"  负载测试：{CONCURRENCY} 并发客户端")
    print(f"=" * 50)
    
    start_time = time.time()
    threads = []
    
    for i in range(CONCURRENCY):
        t = threading.Thread(target=simulate_client, args=(i,))
        threads.append(t)
        t.start()
        
    for t in threads:
        t.join()
    
    elapsed = time.time() - start_time
    total = success_count + fail_count
    rate = (success_count / total * 100) if total > 0 else 0
    
    print(f"-" * 50)
    print(f"  测试结果")
    print(f"-" * 50)
    print(f"  并发数量：{CONCURRENCY}")
    print(f"  成功连接：{success_count}")
    print(f"  失败连接：{fail_count}")
    print(f"  成功率  ：{rate:.1f}%")
    print(f"  总耗时  ：{elapsed:.2f} 秒")
    print(f"=" * 50)

