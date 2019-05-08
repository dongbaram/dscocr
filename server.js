//  OpenShift sample Node application
var express = require('express');
var multer  =   require('multer');  //파일 업로드
var app     =   express();  

var multer  =   require('multer');  //파일 업로드 //ocr-----------------
    
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
    ;
  
app.get('/', function (req, res) {
  // try to initialize the db on every request if it's not already
  // initialized.
  
    res.end('welcome dscocr');
    //res.render('index.html', { pageCountMessage : null});
});

app.get('/pagecount', function (req, res) {
    //console.log(req.body);      //client 에게  받은 파라미터
    console.log("download filename:"+req.query.filename);
    //res.send("key1:"+req.query.key1);
    /*
    fs.readFile('./uploads/'+req.query.key1,function(req,res){
        res.writeHead(200,{"content-Type":"text/html"});
        res.end(data);
    });
    */
    //res.download('D:/Python/uploads/'+req.query.filename);
    res.send("download filename:"+req.query.filename);
    //console.log("download filename:"+req.query.filename);
    //res.download('./uploads/'+req.query.filename);
});

// error handling
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

//ocr-----------------------------------------------------------------------------------


app.post('/dscocr',function(req,res) {
    var storage =   multer.diskStorage({
        
        destination: function (req, file, cb) {                 // 파일 업로드 경로 지정
          //cb(null, './uploads');          //운영 linux
          cb(null, 'D:/Python/uploads');    //로컬 개발
        },
        
        filename: function (req, file, cb) {                    //파일 업로드 처리
          console.log("file.originalname:"+file.originalname);
 
          upfilename = Date.now()+"_"+file.originalname         //날짜 + 시간 + 원래 파일명
          //upfilename = file.originalname         //날짜 + 시간 + 원래 파일명
          cb(null, upfilename );
          console.log("upfilename:"+upfilename);
          temp2 = upfilename;
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

        //파이썬 호출----------------------------------
        var spawn = require('child_process').spawn,
        py = spawn('python',['D:/Python/MS OCR/nodejs_call_data.py']),  //파이썬 호출 파일
        //py = spawn('python',['./python/nodejs_call_data.py']),  //운영 linux
        
        data = {"param1":"v1","param2":"v2"},       //파이썬에 전달할 파라미터
        dataString = "";
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

});

app.get('/filedownload',function(req,res) {
    //console.log(req.body);      //client 에게  받은 파라미터
    console.log("download filename:"+req.query.filename);
    //res.send("key1:"+req.query.key1);  // // 
    /*
    fs.readFile('./uploads/'+req.query.key1,function(req,res){
        res.writeHead(200,{"content-Type":"text/html"});
        res.end(data);
    });
    */
    //res.download('D:/Python/uploads/'+req.query.filename);
    res.send("download filename:"+req.query.filename);
    //console.log("download filename:"+req.query.filename);
    //res.download('./uploads/'+req.query.filename);
});
 
//ocr--end---------------------------------------------------------------------------------


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
