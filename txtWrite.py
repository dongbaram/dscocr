import time

#log 처리를 위한 txt 파일 처리
filePath = "txtTest.txt"
configFile = "testConfig.txt"

## LPAD
def lpad(pStr, pNum):
    strTmp  = pStr
    while len(strTmp) < pNum:
        strTmp = "0" + strTmp
    return strTmp

#Create file
def createFile():
    #파일이 없을 경우 새로 생성
    f=open(filePath,"a")
    #file 옵션
    # 'r' This is the default mode. It Opens file for reading.
    # 'w' This Mode Opens file for writing.
    # If file does not exist, it creates a new file.
    # If file exists it truncates the file.
    # 'x' Creates a new file. If file already exists, the operation fails.
    # 'a' Open file in append mode.
    # If file does not exist, it creates a new file.
    # 't' This is the default mode. It opens in text mode.
    # 'b' This opens in binary mode.
    # '+' This will open a file for reading and writing (updating)

    ##기존파일 삭제 후 생성
    #f=open("txtTest.txt","w+")
    #for i in range(10):
    #    f.write("This is line %d\r\n" % (i+1))

#config 속성파일 읽기
def readFile(strParam):
    f=open(configFile,"r")
    if f.mode == "r":
        #contents = f.read()
        for r in f:
            if r[0:1] != "#":
                if r[0:r.find("|")] == strParam:
                    return r[r.find("|")+1:len(r)]
    else:
        return ""

def writeFile(strMessage):
    f=open(filePath,"a")
    #현재시간 기재 후 내용입력
    ntime = time.localtime()
    f.write(str(ntime.tm_year) + "-"
            + lpad(str(ntime.tm_mon),2) + "-"
            + lpad(str(ntime.tm_mday) ,2) + " "
            + lpad(str(ntime.tm_hour) ,2) + ":"
            + lpad(str(ntime.tm_min) ,2) + ":"
            + lpad(str(ntime.tm_sec),2) + "\n")
    f.write(strMessage + "\n")


if __name__ == "__main__":
    #createFile()
    #print(readFile("속성1"))
    writeFile("message!!!!")