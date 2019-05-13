//  OpenShift sample Node application
var express = require('express');
var multer  =   require('multer');  //파일 업로드
var app     =   express();  
var fs = require('fs');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
    ;

//운영 linux------------------------------------
var pyfile1 = './python/nodejs_call_data.py';
var pyfile_pdftoimg = './python/common/PDFtoIMG.py';
 
// error handling
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
  });

//pdf to image -- 기존 올려진 파일이 있어야 함
app.post('/pdfimg',function(req,res) {
    try{
        var pdffile = '/'+req.body.filename;
        console.log('pdffile:'+pdffile);
  
        var returnstr = "";
        //파이썬 호출----------------------------------
        var spawn = require('child_process').spawn, 
        py = spawn('python',['./python/PDFtoIMG_test.py']),  //파이썬 호출 파일

        data = {"filename":pdffile,"param2":"v2"},       //파이썬에 전달할 파라미터
        dataString = "";
        py.stdout.on('data',function(data){
            dataString += data.toString();
        });
        py.stdout.on('end',function(){ 
            //결과 리턴 -----------------------------------------
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

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;
