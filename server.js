//Server.js by Surya Vadivashagu 9/30
var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , util = require('util')
  , port = 8080
  , mongo = require('mongodb')
  , formidable = require('formidable');

var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)
  //console.log(req.url);
  if(req.method === "GET") {
      switch( uri.pathname ) {
        case '/':
          sendFile(res, 'public/index.html');
          break;
        case '/index.html':
          sendFile(res, 'public/index.html');
          break;
        case '/css/loading.gif':
          sendFile(res, 'public/css/loading.gif','img/gif');
          break;
        case '/css/style.css':
          sendFile(res, 'public/css/style.css', 'text/css');
          break;
        case '/js/scripts.js':
          sendFile(res, 'public/js/scripts.js', 'text/javascript');
          break;
        case '/503.html':
          send503(res,'public/503.html');
          break;
        default:
          send404(res, 'public/404.html');
          //res.end('404 not found')
      }
    }
    else if(req.method === "POST") {
      switch(uri.pathname){
        case '/flare':
          getdata(req,res);
          break;
        case '/update':
          update(req,res)
          break;

        default:
          send404(res, 'public/404.html');
          break;
        }
      }
      else{
        send404(res, 'public/404.html');
      }
  });

server.listen(process.env.PORT || port);
console.log('listening on 8080')

var MongoClient = require('mongodb').MongoClient;
//var Server = require('mongodb').Server;
var MDBuri = "mongodb+srv://svadivazhagu:goatshead@occupation-rqsol.mongodb.net/test?retryWrites=true";
//var client = new MongoClient(new Server(MDBuri), {useNewUrlParser: true});
var dbo;

MongoClient.connect(MDBuri,{ useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
 console.log("Database Connected!");

  dbo  = db.db("occupationDb");
   dbo.createCollection("occupation", function(err, res) {
     if (err) throw err;
     console.log("Collection Occupation created!");
   });


});


// subroutines
// NOTE: this is an ideal place to add your data functionality

function getdata(req, res) {
  //contentType = contentType || 'text/html';

  dbo.collection("occupation").find("children").toArray(function(err, result){
      if (err) throw err;
      console.log(result);
      var obj = {};
      obj.result = result;
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(JSON.stringify(obj));
    //  var query = result.length; //get the length of the results
      res.end();

    });
}

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';
  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}

function send404(res, filename, contentType) {
  contentType = contentType || 'text/html';
  fs.readFile(filename, function(error, content) {
    res.writeHead(404, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}

function send503(res, filename, contentType) {
  contentType = contentType || 'text/html';
  fs.readFile(filename, function(error, content) {
    res.writeHead(503, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })
}


function input(req, res) {
    var parse = '';
    var set = [];
    req.on('data', function(d) {
      parse = JSON.parse(d);
      console.log(parse);
  });
    req.on('end', function() {
       res.writeHead(200, {'Content-Type': 'text/html'});
       res.write( JSON.stringify(parse));

       //db.close();
       //client.mset(JSON.stringify(parse.teamname), JSON.stringify(parse.teamname),JSON.stringify(parse.author), JSON.stringify(parse.author),JSON.stringify(parse.format), JSON.stringify(parse.format),JSON.stringify(parse.gen), JSON.stringify(parse.gen), redis.print);
       res.end();
    })
}

//Upload function
function upload(req,res){
      var parse = '';
      var set = [];
      var link;
      var inDatabase;

      //on get data
      req.on('data', function(d) {
        parse = JSON.parse(d); //parse the data
        //console.log(parse);

        //get the link
        job = { job: parse.job };
        console.log("Uploading data: "+ parse.job)

        //check if link already exists in the DB
        dbo.collection("occupation").find("children").toArray(function(err, result) {
           if (err) throw err;
           console.log(result);
           inDatabase = result.length; //get the length of the results
           console.log(inDatabase);
           //on done in the on data due to async
           res.writeHead(200, {'Content-Type': 'text/html'});

           //if no results found
          if(inDatabase == 0){
            //pass data back to UI and ut into database
            res.write( JSON.stringify(parse));
            dbo.collection("occupation").insertOne(parse, function(err, res) {
             if (err) throw err;
             console.log("Occupation Uploaded");
          });
        } //otherwise send response w/ number of other eleements in the database
           else{
             console.log(inDatabase + ' Other Items found...');
             parse.responselen = inDatabase;
             //otherwise pass back data and database length
             res.write(JSON.stringify(parse));
           }
            res.end();
         });

      });
}


function query(req, res) {
//  console.log("TOUCH QUERY");
    var team = {};
    var author = {};
    var gen = {};
    var format = {};
    var parse = '';
    req.on('data', function(d) {
      parse = JSON.parse(d);

      if(parse.teamname == ''){

      }else{
        team.teamname = parse.teamname;
      }
      if(parse.author == ''){

      }else{
        author.author = parse.author;
      }

      if(parse.gen == 0){
        gen.gen = {$gte:0};
      }else{
        gen.gen = parse.gen;
      }

      if(parse.format == ''){
        format.format = {$gte:parse.format};
      }
      else{
        format.format = parse.format;
      }
      console.log(parse)
      console.log(query)
      res.writeHead(200, {'Content-Type': 'text/html'});

      dbo.collection("occupation").find(team,author,format,gen).limit(10).toArray(function(err, result){
          if (err) throw err;
          console.log(result);
          var obj = {};
          obj.result = result;
          res.write(JSON.stringify(obj));
        //  var query = result.length; //get the length of the results
          res.end();
         });

    })
}


function update(req,res){
    var link;
    var parse = '';
    req.on('data', function(d) {
      parse = JSON.parse(d);
      name = { name: parse.name };
      console.log(parse)
      res.writeHead(200, {'Content-Type': 'text/html'});
      dbo.collection("occupation").deleteOne(parse.id);
      dbo.collection("occupation").insertOne(parse, function(err, res) {
       if (err) throw err;
       console.log("Occupation Uploaded");
      });
      res.write(JSON.stringify(parse));
      console.log("Item Updated");
      res.end();
    })
}

function del(req,res){
  var parse= '';
  req.on('data', function(d) {
    parse = JSON.parse(d);
    dbo.collection("occupation").deleteOne(parse);
    console.log("Item Deleted");
    req.on('end', function() {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end();
    });
  });
}


function rand(req, res) {
//  console.log("TOUCH QUERY");
  console.log("Random Search...");
    req.on('data', function(d) {

      res.writeHead(200, {'Content-Type': 'text/html'});

      dbo.collection("occupation").find().limit(10).skip( Math.floor(Math.random() * 10) + 1    ).toArray(function(err, result){
          if (err) throw err;
          console.log(result);
          var obj = {};
          obj.result = result;
          res.write(JSON.stringify(obj));
        //  var query = result.length; //get the length of the results
          res.end();
         });

    })
}
