#!/bin/bash
set +m

# start_test_env.sh
# 自动启动两个聊天服务器实例和压测脚本

ulimit -n 65535

echo "Starting ChatServer instances..."
stdbuf -o0 -e0 ./bin/ChatServer 127.0.0.1 6004 > server1.log 2>&1 &
PID1=$!

stdbuf -o0 -e0 ./bin/ChatServer 127.0.0.1 6006 > server2.log 2>&1 &
PID2=$!

echo "Servers started at 6004 (PID: $PID1) and 6006 (PID: $PID2)."
echo "Waiting 2 seconds for servers to initialize..."
sleep 2

echo "Running Python benchmark script..."
python3 benchmark.py

echo "Benchmark finished. Waiting 5 seconds before stopping servers..."
sleep 5

kill -9 $PID1 $PID2 2>/dev/null
wait $PID1 $PID2 2>/dev/null
echo "Servers stopped."
