
var UrlPictures=[];
var Increase=0;

var UserData={authenticated: false , userId: undefined, online: false };

class Pix extends React.Component{

      constructor(props){
        super(props);
       this.state={link: this.props.link};
       this.onError=this.onError.bind(this);
       this.handleClick = this.handleClick.bind(this);
      }
   
      handleClick(){
         if(UserData.userId!=this.props.owner)
          {console.log(this.state.link+" is not yours");}
         else
           {console.log(this.state.link+" has been clicked");}
       }
   
      onError(){
          console.log("error: could not find picture");
          this.setState(function(){ return {link: "missing.png"}; });
         };
 
      render(){
      //return <img onError={this.onError} onClick={this.handleClick} src={this.state.link}/>;
     return <button onError={this.onError} onClick={this.handleClick}><img src={this.state.link} /></button>;
      } 
}

function Testing(){
 var f=function testing(){
         console.log("Testing Mode activated");
         UserData.authenticated=true;
         UserData.userId='123';
         UserData.online=true;
       };
 console.log("Testing Mode");
  
 return (<div><button onClick={f}>testing</button></div>);
}


function DataHandling(urlpix,option){
  var pixdata={url: urlpix, userId: UserData.userId};
  var i;
  var list=[];
  
  
  function listElement(e,ow){
     Increase++;
     return <div className="grid-item"><Pix id={Increase} link={e} owner={ow}/></div>;
  }
  
  if(UserData.online && UserData.userId!="undefined" )
   {if(option=="add")
      {UrlPictures.push(pixdata);
       $.get('/addpix?uid='+pixdata.userId+'&link='+pixdata.url,function(data){console.log('---');}); // no data read out
      //window.location='/addpix?uid='+pixdata.userId+'&link='+pixdata.url;
     } 
   }
  else
   {if(option!="show")        
      {console.log("user not logged in");
        alert('Please, log in first ! ');
      }
   }   

  for(i=0;i<UrlPictures.length;++i)
   {list.push(listElement(UrlPictures[i].url,UrlPictures[i].userId));
   }

  ReactDOM.render(<div>{list}</div>,document.getElementById('postedpix'));
}

class InputField extends React.Component{

    
  constructor(props){
   super(props);
   //this.state={inputfield: "no value"};   
   this.handleClick = this.handleClick.bind(this);
   this.updateInputValue = this.updateInputValue.bind(this);
  }
  
  handleClick(){
   console.log("trying to add picture url");
   console.log("value of input field : "+this.state.inputfield);
   DataHandling(this.state.inputfield,"add");   
  }
 
  updateInputValue(evt){
    //console.log("input field updated with "+evt.target.value);
    this.state={inputfield: evt.target.value};   
    
  }

  render(){
    var r; 
    r=<div><input type="text" id="addpixinputfield" 
            onChange={this.updateInputValue} />
      <input type="button" value="add" id="addpix" onClick={this.handleClick}/>
      </div>;    
    return r;
   }
}

class TwitterLogin extends React.Component{
  constructor(props){
    super(props);
    if(!this.props.loggedIn)
     {this.state = {value: "Twitter Login", pressed: false};}
    if(this.props.loggedIn)
     {this.state = {value: "Logout" , pressed: true};}
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    //this.click();
  }

  componentWillUnmount() {
  }

  handleClick(){
   var pressed=this.state.pressed;
   if(UserData.online && !this.props.loggedIn)
    {var mm="Warning ! Should Twitter not redirect you to the main page,"; 
     var mm2="please use the back button of your browser and then reload. Thanks ! ";
     alert(mm+mm2);
     window.location='/twitterauth';}
   else
    {if(UserData.online){window.location='/logout';}
     else{console.log("you are offline !");}
    }
   this.setState(function(x){
        if(!pressed){return {value: "Logout" , pressed: true  };}
        else {return {value: "Twitter Login" , pressed: false };}
   });
  }

  render(){
    if(!UserData.online)
     {this.state={value: "Offline!" , pressed: false};}   
  
    var twitterbutton=<button onClick={this.handleClick} className="bq">
                      {this.state.value}</button>;
    
    return twitterbutton;
   }
}

class BrowseUsers extends React.Component{
  
  constructor(props){
   super(props);
   this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
   console.log("BrowseUsersButton clicked");
   $.get("/getUserPix",function(data){
                 UrlPictures=data;
                 console.log("data: "+JSON.stringify(data));
                 DataHandling(undefined,"show");
   }).fail(function(){
                 UrlPicutres={url: "error", userId: "error"};
         });
  }

  render(){
   var browsebutton=<button onClick={this.handleClick} className="bq">
                    Browse Users</button>;
   return browsebutton;
  }
}

class Menubar extends React.Component{

  render(){
   var twitterlogin=<TwitterLogin loggedIn={this.props.loggedIn}/>; 
   var browseusers=<BrowseUsers/>;
   var allcomponents=<div>{twitterlogin}{browseusers}</div>;
   
   return allcomponents;
  }
}

//entry point to index.html div id=pinclonemain
ReactDOM.render(<InputField/>,document.getElementById('pinclonemain'));

ReactDOM.render(<Testing/>,document.getElementById('testing'));


//========= retrieving DATA from server 
//========= data exchange between FrontEnd JS and Node.js 
//should be used to manipulate the menubar ( div id=menubar )
//ReactDOM.render(<Menubar/>,document.getElementById('menubar'));
$.get("/getlogstat",function(data){
    console.log(data);
    UserData.userId="nobody";
    UserData.authenticated=data.authenticated;
    UserData.userId=UserData.userId.replace(UserData.userId,data.userId);
    UserData.online=true;
    console.log("UserData ",JSON.stringify(UserData));
    ReactDOM.render(<Menubar loggedIn={data.authenticated}/>,document.getElementById('menubar'));
}).fail(function(){
   UserData.online=false;
   console.log("no data retrieved , because server is down");
   ReactDOM.render(<Menubar loggedIn={UserData.online}/>,document.getElementById('menubar'));
});

$('img').error(function(){
        $(this).attr('src', 'missing.png');
});
