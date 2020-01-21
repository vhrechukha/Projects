const fs = require('fs');
const http = require("http");
const express = require('express');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const OpenWeatherMapHelper = require("openweathermap-node");

let app = express();
let server = http.createServer(app);
let $ = cheerio.load(fs.readFileSync(__dirname + '/index.html', 'utf8')); 

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false 
}));

app.get ('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


app.post ('/weather',function(req,res){
  let city = req.body.city;
  let check = new Promise(function(resolve, reject) {
    if(city) {
      $('#text').text(city).removeClass('error');
      getWeatherData(city);
    } else {
      $('#text').text('Write the city').addClass('error');
    }
    setTimeout(() => resolve("done"), 300);
  });
  check.then(function(value) {
    fs.writeFileSync(__dirname + '/index.html', $.html());
    res.redirect('/');
  });
  
});

const helper = new OpenWeatherMapHelper(
  {
    APPID: 'f98448038ad82ce2ecf0e51e6349fe58',
    units: "imperial"
  }
);

function getWeatherData(city) {
  helper.getThreeHourForecastByCityName(city, (err, threeHourForecast) => {
    if(err){
      console.log(err);
    } else{
        let data = threeHourForecast;
        let timeSlot = getDataAsPerCurrentTimeSlot(data);
        let weather = [
            "coming soon",
            "coming soon",
            "coming soon",
            "coming soon",
            "coming soon",
            "coming soon",
            "coming soon"
        ];
    
        fillTheArrayWithWeather(weather, data, timeSlot);
        displayWeatherData(weather);
    }
  });
}

// find and write in array weather of the city
function fillTheArrayWithWeather(weather, data, timeSlot){
  let dataList = data.list,
      dayName,
      cHours,
      path;

  for(let i = 0; i < dataList.length; i++){
    path = new Date(data.list[i].dt_txt);
    cHours = path.getHours();
    dayName = path.getDay();

    if(cHours == timeSlot){
      weather[dayName] = dataList[i].weather[0].main;
    }
  }
}


// remove old data and upload new
function displayWeatherData(weather){ 
  $('#weather').empty();

  for(let i = 0; i < weather.length; i++){
    $('#weather').append(
      `<td>
        <img src= 'img/${weather[i]}.png' class='images' height='50px'/>
      </td>`);
    fs.writeFileSync(__dirname + '/index.html', $.html());

  }
}

// get user's times
function getDataAsPerCurrentTimeSlot(data) {
  let d = new Date();
  let cHours = d.getHours();
  let timeSlot = '';
  if (cHours>= 0 && cHours<3) {
      timeSlot = '0'
  } else if (cHours>= 3 && cHours<6) {
      timeSlot = '3'
  } else if (cHours>= 6 && cHours<9) {
      timeSlot = '6'
  } else if (cHours>= 9 && cHours<12) {
      timeSlot = '9'
  } else if (cHours>= 12 && cHours<15) {
      timeSlot = '12'
  } else if (cHours>= 15 && cHours<18) {
      timeSlot = '15'
  } else if (cHours>= 18 && cHours<21) {
      timeSlot = '18'
  } else if (cHours>= 21) {
      timeSlot = '21'
  }

  return timeSlot;
}

server.listen (3000, function () {
  console.log('Server running at http://127.0.0.1:3000/');
});
