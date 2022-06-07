let searchLink = "https://api.openweathermap.org/data/2.5/weather?q=saigon&appid=ff532977349290d86ac2bc3243a8ca5a";

const firebaseConfig = {
	apiKey: "AIzaSyA9FT00xR_HgeBLDTJMDBK5gm2ie5L35FY",
	authDomain: "doan1-c3b0a.firebaseapp.com",
	databaseURL: "https://doan1-c3b0a-default-rtdb.firebaseio.com",
	projectId: "doan1-c3b0a",
	storageBucket: "doan1-c3b0a.appspot.com",
	messagingSenderId: "977111072526",
	appId: "1:977111072526:web:2ef082ad8736a96afaa15f",
  };
  
  firebase.initializeApp(firebaseConfig);
	
  // Get a reference to the database service
  var database = firebase.database();


var temp;
var humi;
var ctx_tmp = document.getElementById('cv_tmp').getContext('2d');
var ctx_hum = document.getElementById('cv_hum').getContext('2d');
var al_temp = 0;
var al_humi = 0;
var start = 4.72;
var cw = ctx_tmp.canvas.width;
var ch = ctx_tmp.canvas.height; 
var diff;



function httpRequestAsync(url, callback)
{
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = () => { 
		if (httpRequest.readyState == 4 && httpRequest.status == 200)
		callback(httpRequest.responseText);
  }
  httpRequest.open("GET", url, true); 
  httpRequest.send();
}


//lấy nhiệt độ 
function theResponse(response) {
  let jsonObject = JSON.parse(response);  
  temp = parseInt(jsonObject.main.temp - 273);
  humi = parseInt(jsonObject.main.humidity);
  database.ref("/ROOM").update({
	"temp" : temp.toString(),
	"hum" : humi.toString(),

	
  });
}

// vòng tròn
function progressSim(){
	diff = ((al_temp / 100) * Math.PI*2*10).toFixed(2);

	ctx_tmp.clearRect(0, 0, cw, ch);
	ctx_tmp.lineWidth = 15;

	ctx_hum.clearRect(0, 0, cw, ch);
	ctx_hum.lineWidth = 15;

	// nội dung
    ctx_tmp.fillStyle = '#00032d';
	ctx_hum.fillStyle = '#00032d';

	//đổ màu vòng tròn
    var gradient = ctx_tmp.createLinearGradient(0, 0, 180, 0);

    gradient.addColorStop("0", "#cdf9e6");
    gradient.addColorStop("0.5", "#d58bd6");
    gradient.addColorStop("1.0", "#fdf0b7");
    ctx_tmp.strokeStyle = gradient;

    // design và xếp vị trí nội dung
	ctx_tmp.textAlign = "center";
	ctx_tmp.font="20px monospace";
    ctx_tmp.fillText(al_temp+'°C', cw*.52, ch*.5, cw+7);
	ctx_tmp.font="13px dispace";
    // ctx.fillText('Room', cw*.52, ch*.5+30, cw+12);
    // ctx.fillText('Temperature', cw*.52, ch*.5+40, cw+12);
	ctx_tmp.beginPath();
	ctx_tmp.arc(100, 85, 70, start, ((al_temp / 100) * Math.PI*2*10).toFixed(2)/10+start, false);
	ctx_tmp.stroke();

	var gradient_hum = ctx_hum.createLinearGradient(0, 0, 180, 0);

    gradient_hum.addColorStop("0", "#cdf9e6");
    gradient_hum.addColorStop("0.5", "#d58bd6");
    gradient_hum.addColorStop("1.0", "#fdf0b7");
    ctx_hum.strokeStyle = gradient_hum;

    // design và xếp vị trí nội dung
	ctx_hum.textAlign = "center";
	ctx_hum.font="20px monospace";
    ctx_hum.fillText(al_humi+'%', cw*.52, ch*.5, cw+7);
	ctx_hum.font="13px dispace";
    // ctx.fillText('Room', cw*.52, ch*.5+30, cw+12);
    // ctx.fillText('Temperature', cw*.52, ch*.5+40, cw+12);
	ctx_hum.beginPath();
	ctx_hum.arc(100, 85, 70, start, ((al_humi / 100) * Math.PI*2*10).toFixed(2)/10+start, false);
	ctx_hum.stroke();


	if(al_temp < temp){
		al_temp++;
	}
	if(al_humi < humi){
		al_humi++;
	}
	if(al_temp >= temp && al_humi >= humi) {
		
		clearTimeout(sim);
	}
}
var sim = setInterval(progressSim, 50);



httpRequestAsync(searchLink, theResponse);

// --------------------------------------------------------------------------------
  
  var switchLamp = document.getElementById("switchLamp");

  
	switchLamp.onclick = function(){
	  
		if(switchLamp.checked){
			document.getElementById("den").src = "./img/light_bulb.png";
	
			database.ref("/ROOM").update({
				"lamp" : "1"
			});
		} else {
			document.getElementById("den").src = "./img/light_bulb_off.png";
   			database.ref("/ROOM").update({
				"lamp" : "0"
			});
		}	  
	}

  
// -------------------------------------------------------------------------
  
var switchTV = document.getElementById("switchTV");
  
switchTV.onclick = function(){
	  
	if(switchTV.checked){
		document.getElementById("tv").src = "./img/tv_on.png";

		database.ref("/ROOM").update({
			"tv" : "1"
		});
	} else {
		document.getElementById("tv").src = "./img/tv_off.png";
		   database.ref("/ROOM").update({
			"tv" : "0"
		});
	}	  
}

  
// ----------------------------------------------------------------------------  
var switchWarn = document.getElementById("switchWarn");
  
switchWarn.onclick = function(){
	  
	if(switchWarn.checked){
		document.getElementById("warn").src = "./img/warning_on.png";

		database.ref("/ROOM").update({
			"warn" : "1"
		});
	} else {
		document.getElementById("warn").src = "./img/warning_off.png";
		   database.ref("/ROOM").update({
			"warn" : "0"
		});
	}	  
}

// ---------------------------------------------------------------------------
//auto update ImgDen
  database.ref("/ROOM/lamp").on("value", function(snapshot) {
    if(snapshot.exists()){
      let lamp = snapshot.val();
      if(lamp == 1){
			document.getElementById("den").src = "./img/light_bulb.png";
			switchLamp.checked = true;
	  }

      else{
		  document.getElementById("den").src = "./img/light_bulb_off.png"
		  switchLamp.checked = false;
	  }
    }else
      console.log("No data available!")
  });
  database.ref("/ROOM/tv").on("value", function(snapshot) {
    if(snapshot.exists()){
      let tv = snapshot.val();
      if(tv==1){
		  document.getElementById("tv").src = "./img/tv_on.png";
		  switchTV.checked = true;
	  }
      else{
		  document.getElementById("tv").src = "./img/tv_off.png";
		  switchTV.checked = false;
	  }
    }else
      console.log("No data available!")
  });
  database.ref("/ROOM/warn").on("value", function(snapshot) {
    if(snapshot.exists()){
      let warn = snapshot.val();
      if(warn==1){
		  document.getElementById("warn").src = "./img/warning_on.png";
		  switchWarn.checked = true;
	  }
      else{
		  document.getElementById("warn").src = "./img/warning_off.png"
		  switchWarn.checked = false;
	  }
    }else
      console.log("No data available!")
  });