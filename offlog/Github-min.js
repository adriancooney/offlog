var gh={request:function(e,t){function n(e){throw new Error(e)}url=e.url||n("No URL supplied to request");dataType=e.dataType.toLowerCase()||"JSON";method=e.method||"GET";data=e.data||{};t=dataType=="jsonp"?function(){}:t||n("Please provide a callback.");var r=new XMLHttpRequest;r.onreadystatechange=function(i){if(r.readyState==4){var s=r.responseText;switch(dataType){case"json":s=JSON.parse(s);break;case"jsonp":e.jsonpCallback||n("Please provide a jsonp callback name");var o=document.createElement("script");o.innerText=s;setTimeout(function(){document.body.removeChild(o)},300)}t(s)}};r.open(method,url,!0);method.toLowerCase()=="post"&&r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");r.send(data)},modal:function(e){var t=document.createElement("div");t.classList.add("modal");t.style.height=window.innerHeight+"px";var n=document.createElement("div"),r=document.createElement("iframe");t.appendChild(n);n.appendChild(r);r.src="";document.body.insertBefore(t,document.body.children[0]);n.style.marginTop=window.innerHeight/2-160+"px";window.addEventListener("resize",function(){t.style.height=window.innerHeight+"px";n.style.marginTop=window.innerHeight/2-160+"px"})},init:function(){window.addEventListener("DOMContentLoaded",function(){var e=".modal {position: fixed;background: rgba(0,0,0,0.5);z-index: 30;width: 100%;margin: 0;}.modal div {width: 400px;height: 320px;margin-left: auto;margin-right: auto;margin-top: 30%;background: #fff;border: 12px solid rgba(0,0,0,0.6);}.modal div iframe {width: inherit;height: inherit;border: none;}",t=document.createElement("style");t.setAttribute("type","text/css");t.innerText=e;document.getElementsByTagName("head")[0].appendChild(t)})}()};