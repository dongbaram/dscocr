//  OpenShift sample Node application
var express = require('express');
var multer  =   require('multer');  //파일 업로드
var app     =   express();  
var bodyParser = require('body-parser');
var fs = require('fs');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
    ;

//전역변수
var upfilename = "";
 
//운영 linux------------------------------------
var uploadpath = './uploads';    
var pyfile1 = './python/nodejs_call_data.py';
var pyfile_pdftoimg = './python/common/PDFtoIMG.py';
 
/*
//개발 로컬-------------------------------------
var uploadpath = 'D:/Python/uploads';    
var pyfile1 = 'D:/Python/MS OCR/nodejs_call_data.py';
var pyfile_pdftoimg = 'D:/Python/MS OCR/PDFtoIMG.py';
//-------------------------------------------------
*/
// error handling
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
  });
// body parser
app.use(bodyParser.urlencoded({extend:false}));
  

app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  
    res.end('welcome dscocr');
    //res.render('index.html', { pageCountMessage : null});
});


//ocr-----------------------------------------------------------------------------------
app.post('/dscocr',function(req,res) {
    var storage =   multer.diskStorage({
        
        destination: function (req, file, cb) {                 // 파일 업로드 경로 지정
          cb(null, uploadpath);          //운영 linux
        },
        
        filename: function (req, file, cb) {                    //파일 업로드 처리
          console.log("file.originalname:"+file.originalname);
 
          upfilename = Date.now()+"_"+file.originalname         //날짜 + 시간 + 원래 파일명
          //upfilename = file.originalname         //날짜 + 시간 + 원래 파일명
          cb(null, upfilename );
        }
      }); 

    var upload = multer({ storage : storage}).single('ocrfile'); //client 에서 호출명

    console.log("app post /dscocr"); 

    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }else{
            console.log(req.body);      //client 에게  받은 파라미터
            console.log("doccode:"+req.body.doccode);
        }

        console.log("upfilename:"+upfilename); 
        //파이썬 호출----------------------------------
        var spawn = require('child_process').spawn;
        var py = spawn('python',[pyfile1]);  //파이썬 호출 파일
        
        var data = {"param1":uploadpath+'/'+upfilename,"param2":"v2"};       //파이썬에 전달할 파라미터
        var dataString = "";
        py.stdout.on('data',function(data){
                    dataString += data.toString();
                });
        py.stdout.on('end',function(){ 
            //결과 리턴 -----------------------------------------
            res.writeHead(200,{"content-Type":"text/html; charset=utf-8"});
            //res.write("File is uploaded:",res.filename)
            res.write("File is uploaded:"+upfilename);
            res.end();
            console.log('결과:'+upfilename);
        });
        py.stdin.write(JSON.stringify(data));       //파이썬 실행
        py.stdin.end();
        //--------------------------------------------------


    }); 

});




//pdf to image -- 기존 올려진 파일이 있어야 함
app.post('/PDFtoIMG',function(req,res) {
    try{
        var pdffile = uploadpath+'/'+ req.body.filename;
        console.log(pdffile);
        
        var returnstr = "";
        //파이썬 호출----------------------------------
        var spawn = require('child_process').spawn,
        py = spawn('python',[pyfile_pdftoimg]),  //파이썬 호출 파일
        //pyfile1
        //pyfile_pdftoimg

        data = {"param1":pdffile,"param2":"v2"},       //파이썬에 전달할 파라미터
                dataString = "";
                py.stdout.on('data',function(data){
                    dataString += data.toString();
                });
        py.stdout.on('end',function(){ 
            //결과 리턴 -----------------------------------------
            //res.writeHead(200,{"content-Type":"text/html; charset=utf-8"});
            //res.write("File is uploaded:",res.filename)
            returnstr = dataString;
            console.log('결과:'+dataString);
            res.send("Transfer pdf:"+returnstr);
            //res.send();
        });
        py.stdin.write(JSON.stringify(data));       //파이썬 실행
        py.stdin.end();
        //--------------------------------------------------
    }catch (e){
        res.send("Transfer pdf:"+e.message);
    }
});

 
//ocr--end---------------------------------------------------------------------------------


//TEST------------------------

//GET 방식 호출 -- 브라우저를 통해서 호출할때만 가능한듯...
app.get('/callget',function(req,res) {
    console.log("callget:"+req.query.key1); 
    res.send("callget:"+req.query.key1);
});

//POST 방식 호출
app.post('/callpost',function(req,res) {
    console.log("callpost:"+req.body.key1); 
    res.send("callpost:"+req.body.key1); 
});

//서버 파일 다운로드
app.get('/filedownload',function(req,res) {
    console.log("download filename:"+req.query.filename);
    //res.send("download filename:"+req.query.filename);
    res.download(uploadpath + '/' + req.query.filename);
});

//폴더목록
app.post('/readDir',function(req,res) {
    var testfolder = './'+req.body.path; 
    fs.readdir(testfolder,function(error,filelist){
        console.log(filelist);
        res.send(filelist); 

    });
});




//pdf to image -- 기존 올려진 파일이 있어야 함
app.post('/pdfimg',function(req,res) {
    try{
        var pdffile = uploadpath+'/'+req.body.filename;
        console.log('pdffile:'+pdffile);
  
        var returnstr = "";
        //파이썬 호출----------------------------------
        var spawn = require('child_process').spawn,
        //py = spawn('python',['D:/Python/MS OCR/PDFtoIMG_test.py']),  //파이썬 호출 파일
        py = spawn('python',['./python/PDFtoIMG_test.py']),  //파이썬 호출 파일
        //pyfile1
        //pyfile_pdftoimg

        data = {"filename":pdffile,"param2":"v2"},       //파이썬에 전달할 파라미터
                dataString = "";
                py.stdout.on('data',function(data){
                    dataString += data.toString();
                });
        py.stdout.on('end',function(){ 
            //결과 리턴 -----------------------------------------
            //res.writeHead(200,{"content-Type":"text/html; charset=utf-8"});
            //res.write("File is uploaded:",res.filename)
            returnstr = dataString;
            console.log('결과1:'+dataString);
            res.send("Transfer pdf1:"+returnstr);
            //res.send();
        });
        py.stdin.write(JSON.stringify(data));       //파이썬 실행
        py.stdin.end();
        //--------------------------------------------------
    }catch (e){
        console.log(e.name+e.message);
        res.send("Error:"+e.message);
    }
});



//pdf to image -- 기존 올려진 파일이 있어야 함
app.post('/pdfimg2',function(req,res) {
    try{
        var pdffile = uploadpath+'/'+req.body.filename;
        console.log('pdffile:'+pdffile);
  
        var returnstr = "";
        //파이썬 호출----------------------------------
        var spawn = require('child_process').spawn,
        //py = spawn('python',['D:/Python/MS OCR/PDFtoIMG_test.py']),  //파이썬 호출 파일
        py = spawn('python',['./python/pdftoimg_test.py']),  //파이썬 호출 파일
        //pyfile1
        //pyfile_pdftoimg

        data = {"filename":pdffile,"param2":"v2"},       //파이썬에 전달할 파라미터
                dataString = "";
                py.stdout.on('data',function(data){
                    dataString += data.toString();
                });
        py.stdout.on('end',function(){ 
            //결과 리턴 -----------------------------------------
            //res.writeHead(200,{"content-Type":"text/html; charset=utf-8"});
            //res.write("File is uploaded:",res.filename)
            returnstr = dataString;
            console.log('결과2:'+dataString);
            res.send("Transfer pdf2:"+returnstr);
            //res.send();
        });
        py.stdin.write(JSON.stringify(data));       //파이썬 실행
        py.stdin.end();
        //--------------------------------------------------
    }catch (e){
        console.log(e.name+e.message);
        res.send("Error:"+e.message);
    }
});


//pdf to image -- 기존 올려진 파일이 있어야 함
app.post('/pdfimg3',function(req,res) {
    try{
        var pdffile = uploadpath+'/'+req.body.filename;
        console.log('pdffile:'+pdffile);
  
        var returnstr = "";
        //파이썬 호출----------------------------------
        var spawn = require('child_process').spawn,
        //py = spawn('python',['D:/Python/MS OCR/PDFtoIMG_test.py']),  //파이썬 호출 파일
        py = spawn('python',['./python/pdftoimg.py']),  //파이썬 호출 파일
        //pyfile1
        //pyfile_pdftoimg

        data = {"filename":pdffile,"param2":"v2"},       //파이썬에 전달할 파라미터
                dataString = "";
                py.stdout.on('data',function(data){
                    dataString += data.toString();
                });
        py.stdout.on('end',function(){ 
            //결과 리턴 -----------------------------------------
            //res.writeHead(200,{"content-Type":"text/html; charset=utf-8"});
            //res.write("File is uploaded:",res.filename)
            returnstr = dataString;
            console.log('결과2:'+dataString);
            res.send("Transfer pdf3:"+returnstr);
            //res.send();
        });
        py.stdin.write(JSON.stringify(data));       //파이썬 실행
        py.stdin.end();
        //--------------------------------------------------
    }catch (e){
        console.log(e.name+e.message);
        res.send("Error:"+e.message);
    }
});


//ocr-----------------------------------------------------------------------------------
app.post('/dscocr2',function(req,res) {
    try{
        var storage =   multer.diskStorage({
            
            destination: function (req, file, cb) {                 // 파일 업로드 경로 지정
            cb(null, uploadpath);          //운영 linux
            },
            
            filename: function (req, file, cb) {                    //파일 업로드 처리
            console.log("file.originalname:"+file.originalname);
    
            upfilename = Date.now()+"_"+file.originalname         //날짜 + 시간 + 원래 파일명
            //upfilename = file.originalname         //날짜 + 시간 + 원래 파일명
            cb(null, upfilename );
            }
        }); 

        var upload = multer({ storage : storage}).single('ocrfile'); //client 에서 호출명

        console.log("app post /dscocr"); 

        upload(req,res,function(err) {
            if(err) {
                return res.end("Error uploading file.");
            }else{
                console.log(req.body);      //client 에게  받은 파라미터
                console.log("doccode:"+req.body.doccode);
            }

            console.log("upfilename:"+upfilename); 
            //파이썬 호출----------------------------------
            var spawn = require('child_process').spawn;
            //var py = spawn('python',[pyfile1]);  //파이썬 호출 파일
            var py = spawn('python2',['./python/pdftoimg.py']);  //파이썬 호출 파일 
        

            //var data = {"param1":uploadpath+'/'+upfilename,"param2":"v2"};       //파이썬에 전달할 파라미터
            var data = {"filename":uploadpath+'/'+upfilename,"param2":"v2"};       //파이썬에 전달할 파라미터
            var dataString = "";

            py.stdout.on('data',function(data){
                        dataString += data.toString();
                    });
            py.stdout.on('end',function(){ 
                //결과 리턴 -----------------------------------------
                res.writeHead(200,{"content-Type":"text/html; charset=utf-8"});
                //res.write("File is uploaded:",res.filename)
                res.write("File is uploaded:"+dataString);
                res.end();
                console.log('결과:'+dataString);
            });
            py.stdin.write(JSON.stringify(data));       //파이썬 실행
            py.stdin.end();
            //--------------------------------------------------


        }); 
    }catch (e){
        res.send("Transfer pdf:"+e.message);
    }
});
//TEST END---------------------

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
