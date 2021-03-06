import sys,json

def read_in():      #처리 function
    lines = sys.stdin.readlines()   #파라미터를 읽음
    return json.loads(lines[0])     #첫줄을 리턴

def main():         #main function
    try:
        param_data = read_in()
        arg1 = param_data["filename"]
        #arg1 = 'D:/Python/uploads/1557385604481_test.pdf'
        pdf_path=  arg1
        pdf_path2='./uploads/test_out.pdf'

        #jpg_path='../uploads/test_out.jpg'
        png_path='./uploads/test.png'


    except Exception as msg:
        print(msg)
    else:
        print(arg1)

if __name__ == "__main__":  #서버에서 호출시 파일을 호출하므로 main으로 동작
    main()
