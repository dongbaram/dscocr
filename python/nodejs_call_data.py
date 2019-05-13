import sys,json, os

def read_in():      #처리 function
    lines = sys.stdin.readlines()   #파라미터를 읽음
    return json.loads(lines[1])     #첫줄을 리턴

def main():         #main function
    param_data = read_in()

    arg1 = param_data["param1"]
    arg2 = param_data["param2"]


    #파일삭제
    fileremove = 'notremoved'
    if os.path.isfile(arg1):
        os.remove((arg1))
        fileremove = 'removed'

    #np_lines = np.array(lines)
    #lines_sum = np.sum(np_lines)
    result_ocr = arg1 + '/'+ fileremove + "/Result OCR "
    #return_date = [{"param1":arg1},{"param1":arg2},{"return":result_ocr}]

    print(result_ocr)

if __name__ == "__main__":  #서버에서 호출시 파일을 호출하므로 main으로 동작
    main()
