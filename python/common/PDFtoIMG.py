import os,sys,json,fitz

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
    #arg1 = 'D:/Python/uploads/1557366588289_test.pdf'
    pdf_path=  arg1
    pdf_path2='./uploads/test_out.pdf'

    #jpg_path='../uploads/test_out.jpg'
    png_path='./uploads/test.png'

    try:
        with open(pdf_path, "rb") as binary_file:
            # Read the whole file at once
            b_data = binary_file.read()
            #print(b_data)

        new_file = open(pdf_path2, "wb")
        new_fileByteArray = bytearray(b_data)
        new_file.write(new_fileByteArray)
        new_file.close()

        doc = fitz.open(pdf_path2)
        page = doc.loadPage(0) #number of page
        zoom_x = 2.0                       # horizontal zoom
        zomm_y = 2.0                       # vertical zoom
        mat = fitz.Matrix(zoom_x, zomm_y)  # zoom factor 2 in each dimension
        pix = page.getPixmap(matrix = mat) # use 'mat' instead of the identity matrix
        output = png_path
        pix.writePNG(output)
        #END def ufn_pdf_to_img(p_data)

    except Exception as msg:
        print(msg)
    else:
        print(os.getcwd())

if __name__ == "__main__":  #서버에서 호출시 파일을 호출하므로 main으로 동작
    main()
