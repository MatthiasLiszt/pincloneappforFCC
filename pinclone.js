"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UrlPictures = [];
var Increase = 0;

var UserData = { authenticated: false, userId: undefined, online: false };

var Pix = function (_React$Component) {
  _inherits(Pix, _React$Component);

  function Pix(props) {
    _classCallCheck(this, Pix);

    var _this = _possibleConstructorReturn(this, (Pix.__proto__ || Object.getPrototypeOf(Pix)).call(this, props));

    _this.state = { link: _this.props.link, visible: true };
    _this.onError = _this.onError.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(Pix, [{
    key: "handleClick",
    value: function handleClick() {
      if (UserData.userId != this.props.owner) {
        console.log(this.state.link + " is not yours");
        window.location = this.state.link;
      } else {
        console.log(this.state.link + " has been clicked");
        if (confirm('Do you want to delete the picture ?')) {
          $.get('/delpix?uid=' + this.props.owner + '&link=' + this.state.link, function (data) {
            console.log('pix deleted');
          }); // no data read out
          this.setState(function () {
            return { visible: false };
          });
        }
      }
    }
  }, {
    key: "onError",
    value: function onError() {
      console.log("error: could not find picture");
      this.setState(function () {
        return { link: "missing.png" };
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.visible) {
        return React.createElement(
          "div",
          { className: "grid-item" },
          React.createElement(
            "button",
            { onError: this.onError, onClick: this.handleClick },
            React.createElement("img", { src: this.state.link })
          )
        );
      } else {
        return React.createElement("p", null);
      }
    }
  }]);

  return Pix;
}(React.Component);

function Testing() {
  var f = function testing() {
    console.log("Testing Mode activated");
    UserData.authenticated = true;
    UserData.userId = '123';
    UserData.online = true;
    var u = UserData.authenticated;
    ReactDOM.render(React.createElement(Menubar, { loggedIn: u }), document.getElementById('menubar'));
  };
  console.log("Testing Mode");

  return React.createElement(
    "div",
    null,
    React.createElement(
      "button",
      { onClick: f },
      "testing"
    )
  );
}

function DataHandling(urlpix, option) {
  var pixdata = { url: urlpix, userId: UserData.userId };
  var i;
  var list = [];

  function listElement(e, ow) {
    Increase++;
    //return <div className="grid-item"><Pix id={Increase} link={e} owner={ow}/></div>;
    return React.createElement(Pix, { id: Increase, link: e, owner: ow });
  }

  if (UserData.online && UserData.userId != "undefined") {
    if (option == "add") {
      UrlPictures.push(pixdata);
      $.get('/addpix?uid=' + pixdata.userId + '&link=' + pixdata.url, function (data) {
        console.log('---');
      }); // no data read out
      //window.location='/addpix?uid='+pixdata.userId+'&link='+pixdata.url;
    }
  } else {
    if (option != "show") {
      console.log("user not logged in");
      alert('Please, log in first ! ');
    }
  }

  for (i = 0; i < UrlPictures.length; ++i) {
    list.push(listElement(UrlPictures[i].url, UrlPictures[i].userId));
  }

  ReactDOM.render(React.createElement(
    "div",
    null,
    list
  ), document.getElementById('postedpix'));
}

var InputField = function (_React$Component2) {
  _inherits(InputField, _React$Component2);

  function InputField(props) {
    _classCallCheck(this, InputField);

    //this.state={inputfield: "no value"};   
    var _this2 = _possibleConstructorReturn(this, (InputField.__proto__ || Object.getPrototypeOf(InputField)).call(this, props));

    _this2.handleClick = _this2.handleClick.bind(_this2);
    _this2.updateInputValue = _this2.updateInputValue.bind(_this2);
    return _this2;
  }

  _createClass(InputField, [{
    key: "handleClick",
    value: function handleClick() {
      console.log("trying to add picture url");
      console.log("value of input field : " + this.state.inputfield);
      DataHandling(this.state.inputfield, "add");
    }
  }, {
    key: "updateInputValue",
    value: function updateInputValue(evt) {
      //console.log("input field updated with "+evt.target.value);
      this.state = { inputfield: evt.target.value };
    }
  }, {
    key: "render",
    value: function render() {
      var r;
      r = React.createElement(
        "div",
        null,
        React.createElement("input", { type: "text", id: "addpixinputfield",
          onChange: this.updateInputValue }),
        React.createElement("input", { type: "button", value: "add", id: "addpix", onClick: this.handleClick })
      );
      return r;
    }
  }]);

  return InputField;
}(React.Component);

var TwitterLogin = function (_React$Component3) {
  _inherits(TwitterLogin, _React$Component3);

  function TwitterLogin(props) {
    _classCallCheck(this, TwitterLogin);

    var _this3 = _possibleConstructorReturn(this, (TwitterLogin.__proto__ || Object.getPrototypeOf(TwitterLogin)).call(this, props));

    if (!_this3.props.loggedIn) {
      _this3.state = { value: "Twitter Login", pressed: false };
    }
    if (_this3.props.loggedIn) {
      _this3.state = { value: "Logout", pressed: true };
    }
    _this3.handleClick = _this3.handleClick.bind(_this3);
    return _this3;
  }

  _createClass(TwitterLogin, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      //this.click();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "handleClick",
    value: function handleClick() {
      var pressed = this.state.pressed;
      if (UserData.online && !this.props.loggedIn) {
        var mm = "Warning ! Should Twitter not redirect you to the main page,";
        var mm2 = "please use the back button of your browser and then reload. Thanks ! ";
        alert(mm + mm2);
        window.location = '/twitterauth';
      } else {
        if (UserData.online) {
          window.location = '/logout';
        } else {
          console.log("you are offline !");
        }
      }
      this.setState(function (x) {
        if (!pressed) {
          return { value: "Logout", pressed: true };
        } else {
          return { value: "Twitter Login", pressed: false };
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!UserData.online) {
        this.state = { value: "Offline!", pressed: false };
      }

      var twitterbutton = React.createElement(
        "button",
        { onClick: this.handleClick, className: "bq" },
        this.state.value
      );

      return twitterbutton;
    }
  }]);

  return TwitterLogin;
}(React.Component);

var BrowseUsers = function (_React$Component4) {
  _inherits(BrowseUsers, _React$Component4);

  function BrowseUsers(props) {
    _classCallCheck(this, BrowseUsers);

    var _this4 = _possibleConstructorReturn(this, (BrowseUsers.__proto__ || Object.getPrototypeOf(BrowseUsers)).call(this, props));

    _this4.handleClick = _this4.handleClick.bind(_this4);
    return _this4;
  }

  _createClass(BrowseUsers, [{
    key: "handleClick",
    value: function handleClick() {
      console.log("BrowseUsersButton clicked");
      $.get("/getUserPix", function (data) {
        UrlPictures = data;
        console.log("data: " + JSON.stringify(data));
        DataHandling(undefined, "show");
      }).fail(function () {
        UrlPictures = { url: "error", userId: "error" };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var browsebutton = React.createElement(
        "button",
        { id: "browse", onClick: this.handleClick, className: "bq" },
        "Browse Users"
      );
      return browsebutton;
    }
  }]);

  return BrowseUsers;
}(React.Component);

var MyPix = function (_React$Component5) {
  _inherits(MyPix, _React$Component5);

  function MyPix(props) {
    _classCallCheck(this, MyPix);

    var _this5 = _possibleConstructorReturn(this, (MyPix.__proto__ || Object.getPrototypeOf(MyPix)).call(this, props));

    _this5.handleClick = _this5.handleClick.bind(_this5);
    return _this5;
  }

  _createClass(MyPix, [{
    key: "handleClick",
    value: function handleClick() {
      console.log("MyPix clicked");
      $.get("/getMyPix?uid=" + UserData.userId, function (data) {
        UrlPictures = data;
        console.log("data: " + JSON.stringify(data));
        DataHandling(undefined, "show");
      }).fail(function () {
        UrlPictures = { url: "error", userId: "error" };
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.loggedIn) {
        var b = React.createElement(
          "button",
          { id: "mypix", onClick: this.handleClick, className: "bq" },
          "My Pictures"
        );
        return b;
      } else {
        return React.createElement("p", null);
      }
    }
  }]);

  return MyPix;
}(React.Component);

var Menubar = function (_React$Component6) {
  _inherits(Menubar, _React$Component6);

  function Menubar() {
    _classCallCheck(this, Menubar);

    return _possibleConstructorReturn(this, (Menubar.__proto__ || Object.getPrototypeOf(Menubar)).apply(this, arguments));
  }

  _createClass(Menubar, [{
    key: "render",
    value: function render() {
      var twitterlogin = React.createElement(TwitterLogin, { loggedIn: this.props.loggedIn });
      var browseusers = React.createElement(BrowseUsers, null);
      var mypix = React.createElement(MyPix, { loggedIn: this.props.loggedIn });
      var allcomponents = React.createElement(
        "div",
        null,
        twitterlogin,
        browseusers,
        mypix
      );

      return allcomponents;
    }
  }]);

  return Menubar;
}(React.Component);

//entry point to index.html div id=pinclonemain


ReactDOM.render(React.createElement(InputField, null), document.getElementById('pinclonemain'));

//ReactDOM.render(<Testing/>,document.getElementById('testing'));


//========= retrieving DATA from server 
//========= data exchange between FrontEnd JS and Node.js 
//should be used to manipulate the menubar ( div id=menubar )
//ReactDOM.render(<Menubar/>,document.getElementById('menubar'));
$.get("/getlogstat", function (data) {
  console.log(data);
  UserData.userId = "nobody";
  UserData.authenticated = data.authenticated;
  UserData.userId = UserData.userId.replace(UserData.userId, data.userId);
  UserData.online = true;
  console.log("UserData ", JSON.stringify(UserData));
  ReactDOM.render(React.createElement(Menubar, { loggedIn: data.authenticated }), document.getElementById('menubar'));
}).fail(function () {
  UserData.online = false;
  console.log("no data retrieved , because server is down");
  ReactDOM.render(React.createElement(Menubar, { loggedIn: UserData.online }), document.getElementById('menubar'));
});

//$('img').error(function(){
//        $(this).attr('src', 'missing.png');
//});