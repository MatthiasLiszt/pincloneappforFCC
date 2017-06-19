
module.exports=function(mongoose,app){

//database schemas and models

var pixSchema = mongoose.Schema({    url: String,
                                      userId: String
                                    });
 var Pix=mongoose.model('Pix',pixSchema);


app.get('/addpix',function(req,res){
          var n={url: req.query.link, userId: req.query.uid};
          console.log('in /addpix procedure');
          Pix.find(n,function(e,d){
                 if(d.length)
                  {console.log("picture already exists");
                    res.json({error: "picture already exists"});}
                else
                  {Pix.create(n,function(e,d){
                            if(e){return handleError(e);}
                            console.log(JSON.stringify(n)+" picture added");
                            res.json(n);
                    });
                  }
         });
   
});

app.get('/delpix',function(req,res){
          var n={url: req.query.link, userId: req.query.uid};
          Pix.remove(n,function(e,d){
                  if(e){return handleError(e);}
                  console.log("picture deleted");
                  res.json(n);
           });
       
});

app.get('/getMyPix',function(req,res){
          var r={userId: "error", url: "error", error: "no data retrievable"};
          var s={userId: req.query.uid};
          Pix.find(s,function(e,d){
                  console.log(JSON.stringify(d));
                  if(e){res.json(r);}
                  res.json(d);            
          });
});

app.get('/getUserPix',function(req,res){
          var r={userId: "error", url: "error", error: "no data retrievable"};
          Pix.find(undefined,function(e,d){
                  console.log(JSON.stringify(d));
                  if(e){res.json(r);}
                  res.json(d);            
          });
     
});

}; //module.exports end

