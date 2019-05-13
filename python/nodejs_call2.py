import sys, json

msg = json.loads(sys.argv[1])['param2']
print(msg)
