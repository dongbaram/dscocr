import os,sys,json
#,fitz

#pdf_path=os.path.join('D:', os.sep, 'Python', 'test.pdf')
#pdf_path2=os.path.join('D:', os.sep, 'Python', 'test_out.pdf')

#print(pdf_path)

#jpg_path=os.path.join('D:', os.sep, 'Python', 'test_out.jpg')
#png_path=os.path.join('D:', os.sep, 'Python', 'test_out.png')
def read_in():      #처리 function
    lines = sys.stdin.readlines()   #파라미터를 읽음
    return json.loads(lines[0])     #첫줄을 리턴

def main():         #main function
    
    param_data = read_in()
    arg1 = param_data["param1"]
    try:
        #arg1 = 'D:/Python/uploads/1557366588289_test.pdf'
        pdf_path=  arg1
        pdf_path2='./uploads/test_out.pdf'

    except Exception as msg:
        print(msg)
    else:
        print(os.getcwd())

if __name__ == "__main__":  #서버에서 호출시 파일을 호출하므로 main으로 동작
    main()
