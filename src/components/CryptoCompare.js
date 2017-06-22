import { Component } from 'react'

class CryptoCompare extends Component {

    componentDidMount () {
        var baseUrl = "https://widgets.cryptocompare.com/";
        (function (){
            var appName = encodeURIComponent(window.location.hostname);
            if(appName===""){appName="local";}
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            var theUrl = baseUrl+'serve/v2/coin/chart?fsym=XEM&tsym=USD&period=1W';
            s.src = theUrl + ( theUrl.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
            document.getElementById("cryptoCompare").appendChild(s);
        })();
    }
    
    render() {
        return null;
    }
}
export default CryptoCompare;