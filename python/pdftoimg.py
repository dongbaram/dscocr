
 
def main():         #main function
    try:
        arg1 = "123"

    except Exception as msg:
        print(msg)
    else:
        print(arg1)

if __name__ == "__main__":  #서버에서 호출시 파일을 호출하므로 main으로 동작
    main()
