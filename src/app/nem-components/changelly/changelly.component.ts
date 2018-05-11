import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anms-changelly',
  templateUrl: './changelly.component.html',
  styleUrls: ['./changelly.component.scss']
})
export class ChangellyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var baseUrl = "https://widgets.cryptocompare.com/";
    var scripts = document.getElementsByTagName("script");
    (function (){
    var appName = encodeURIComponent(window.location.hostname);
    if(appName==""){appName="local";}
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    var theUrl = baseUrl+'serve/v1/coin/chart?fsym=XEM&tsym=USD';
    s.src = theUrl + ( theUrl.indexOf("?") >= 0 ? "&" : "?") + "app=" + appName;
    document.getElementById("cryptoCompare").appendChild(s);
    })();
  }

}
