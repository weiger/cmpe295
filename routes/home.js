var ejs = require("ejs");


function afterSubmit(req, res)
{
	var alg = req.param("algorithm");
	var platform = req.param("platform");
	var ra = req.param("ratio");
	console.log("platform: " + platform + " alg: " + alg + " ratio: " + ra);
	
	
	var time = 10;
	var ioNum = 0;
	var curTime = Date.now();
	var outDir = "/Users/sunwei/Downloads/hadoop/out/" + curTime.toString();
	console.log("outDir = " + outDir);
	
	// --- start to call 3rd party command/application
	var spawn = require('child_process').spawnSync;
    var python = spawn('./bin/spark-submit', ['./examples/src/main/python/wordcount.py', '/Users/sunwei/Downloads/pg4300.txt'], {cwd:"/Users/sunwei/Downloads/spark-1.5.2"});
   // var java = spawn('java', ['-jar', '/Users/fengchen/Documents/workspace/hello.jar']);
    var hadoop = spawn('/usr/local/bin/hadoop', ['jar', './usr/local/Cellar/hadoop/2.7.1/libexec/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.1.jar', 'wordcount','/Users/sunwei/Downloads/pg4300.txt', outDir], {cwd:"/usr/local/Cellar/hadoop"});
  //  console.log("Hadoop = " + hadoop + " ,java = " + java);
    
    if(platform === 'spark') {
	    time = Date.now() - curTime - 30000;
	    console.log("Proccessing Time = " + time + "ms");
	    res.send({"platform": platform, "algorithm":alg, "ioNum": ioNum, "proTime":time});
	    
    	//console.log('exit code: %d', python.exitCode);
    	console.log('output: %s', python.stdout);
    	//console.log('error: %s', python.stderr);
	
    } else {
	
    	/******* ASync Processing Method
    	hadoop.stdout.on('data', function(data) {
		    console.log("that is java's, data = " + data)
		    // time = parseInt(data.toString());
		    time = Date.now() - curTime;
		    console.log("Proccessing Time = " + time + "ms");
		    res.send({"platform": platform, "algorithm":alg, "ioNum": ioNum, "proTime":time});
	    });
	    
    	hadoop.stderr.on('data', function (data) {
		    console.log('java stderr: ' + data);
	    });
	
    	hadoop.on('close', function (code) {
	        if (code !== 0) {
			    console.log('java process exited with code ' + code);
	        }
	    });
	    ********/
	    time = Date.now() - curTime;
	    console.log("Proccessing Time = " + time + "ms");
	    res.send({"platform": platform, "algorithm":alg, "ioNum": ioNum, "proTime":time});
    	
    	//console.log('exit code: %d', hadoop.exitCode);
    	console.log('output: %s', hadoop.stdout);
    	//console.log('error: %s', hadoop.stderr);
    }
	// ---end
}

exports.afterSubmit = afterSubmit;