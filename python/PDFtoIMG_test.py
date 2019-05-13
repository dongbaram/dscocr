import json, sys

def main():         #main function
    try:

        lines = sys.stdin.readlines()  # 파라미터를 읽음
        #return json.loads(lines[0])     #첫줄을 리턴
        msg = json.loads(lines[0])["filename"]
    except Exception as msg:
        print(msg)
    else:
        print(msg)

if __name__ == "__main__":  #서버에서 호출시 파일을 호출하므로 main으로 동작
    main()
