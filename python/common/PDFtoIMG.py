import os

#pdf_path=os.path.join('D:', os.sep, 'Python', 'test.pdf')
#pdf_path2=os.path.join('D:', os.sep, 'Python', 'test_out.pdf')

#print(pdf_path)

#jpg_path=os.path.join('D:', os.sep, 'Python', 'test_out.jpg')
#png_path=os.path.join('D:', os.sep, 'Python', 'test_out.png')

pdf_path='../uploads/전기공사공제조합.pdf'
pdf_path2='../uploads/test_out.pdf'

jpg_path='../uploads/test_out.jpg'
png_path='../uploads/전기공사공제조합.png'

with open(pdf_path, "rb") as binary_file:
    # Read the whole file at once
    b_data = binary_file.read()
    #print(b_data)

new_file = open(pdf_path2, "wb")
new_fileByteArray = bytearray(b_data)
new_file.write(new_fileByteArray)
new_file.close()

def ufn_pdf_to_img(p_data):
    import fitz
    doc = fitz.open(pdf_path2)
    page = doc.loadPage(0) #number of page
    zoom_x = 2.0                       # horizontal zoom
    zomm_y = 2.0                       # vertical zoom
    mat = fitz.Matrix(zoom_x, zomm_y)  # zoom factor 2 in each dimension
    pix = page.getPixmap(matrix = mat) # use 'mat' instead of the identity matrix
    output = png_path
    pix.writePNG(output)
#END def ufn_pdf_to_img(p_data)

ufn_pdf_to_img(b_data)
