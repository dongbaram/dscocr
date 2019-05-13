import sys, json
try:
    msg = json.loads(sys.argv[1])['param2']
except Exception as msg:
    print(msg)
else:
    print(msg)
