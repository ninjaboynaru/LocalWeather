/*
	API Used: http://openweathermap.org
	Condition IDs for updating picture icon can be found at:
		http://openweathermap.org/weather-conditions
*/

$(document).ready(UpdateWeather);
function UpdateWeather()
{
	navigator.geolocation.getCurrentPosition(GetWeatherData);
}

function GetWeatherData(position)
{
	var urlPart1 = "https://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude;
	var urlPart2 = "&lon=" + position.coords.longitude + "&appid=9de5e5c188e423ac7e6bda7f5f1d761a&units=imperial";
	
	$.getJSON(urlPart1 + urlPart2, SetWeatherUI);
}

function SetWeatherUI(weatherData)
{
	var location = weatherData.name + "," + weatherData.sys.country;
	var temp = Math.round(weatherData.main.temp) + "°F";
	var description = ToTitleCase(weatherData.weather[0].description);
	var humidity = weatherData.main.humidity;
	var wind = Math.round(weatherData.wind.speed);
	
	var locationUI = document.getElementById("Location");
	var tempUI = document.getElementById("Temp");
	var descriptionUI = document.getElementById("Description");
	var humidityUI = document.getElementById("Humidity");
	var windUI = document.getElementById("Wind");
	
	locationUI.textContent = location;
	tempUI.textContent = temp;
	descriptionUI.textContent = description;
	humidityUI.textContent = "Humidity: " + humidity + "%";
	windUI.textContent = "Wind: " + wind + "mph";
	
	SetWeatherIcon(weatherData);
}



function SetWeatherIcon(weatherData)
{
	function IconData(className, idMin, idMax, idExtra)
	{
		/*
		- Class name corisponds to a css class that renders an icon. 
		- ID relates to a series of id's on openweathermap that corispond to a specific weather condition.
		- EXAMPLE: id 500 is light rain, id 502 is heavy reain.
		*/
		this.className = "wi " + className;
		this.idMin = idMin;
		this.idMax = idMax;
		this.idExtra = idExtra;
	}
	
		var iconSets = 
		[
			new IconData("wi-day-sunny", 800, 800),
			new IconData("wi-cloudy", 801, 804),
			new IconData("wi-rain", 500, 531),
			new IconData("wi-sprinkle", 300, 321),
			new IconData("wi-thunderstorm", 200, 232, 960),
			new IconData("wi-snowflake-cold", 600, 622),
			new IconData("wi-tornado", 900, 900),
			new IconData("wi-hurricane", 902, 902, 962),
			new IconData("wi-hail", 906, 906),
			new IconData("wi-volcano", 762, 762),
			new IconData("wi-strong-wind", 905, 905)
		]
	
	var id = weatherData.weather[0].id;
	var iconUI = document.getElementById("Icon");
	for(var i = 0; i < iconSets.length; i++)
	{
		if( (id >= iconSets[i].idMin && id <= iconSets[i].idMax) || id == iconSets[i].idExtra)
		{
			iconUI.className = iconSets[i].className;
			return;
		}
	}
	iconUI.className = "wi wi-alien";
}

function ChangeUnitSystem()
{
	var tempUI = document.getElementById("Temp");
	var windUI = document.getElementById("Wind");
	var tempChar = tempUI.textContent[tempUI.textContent.length - 1];
	
	if(tempChar === "F")
	{
		var newTemp = ExtractFirstNum(tempUI.textContent);
		newTemp -= 32;
		newTemp *= 5/9;
		newTemp = Math.round(newTemp);
		tempUI.textContent = newTemp + " °C";
		
		var newWind = ExtractFirstNum(windUI.textContent);
		newWind *= 1.6;
		newWind = Math.round(newWind);
		windUI.textContent = "Wind: " + newWind + "kmh";
	}
	else if(tempChar === "C")
	{
		var newTemp = ExtractFirstNum(tempUI.textContent);
		newTemp /= 5/9;
		newTemp += 32;
		newTemp = Math.round(newTemp);
		tempUI.textContent = newTemp + " °F";
		
		var newWind = ExtractFirstNum(windUI.textContent);
		newWind /= 1.6;
		newWind = Math.round(newWind);
		windUI.textContent = "Wind: " + newWind + "mph";
	}
}



//Non core functions below
function ToTitleCase(str)
{
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function ExtractFirstNum(mixedString)
{
	var numberStarted = false;
	var numberString = "";
	for(var i = 0; i < mixedString.length; i++)
	{
		var currentChar = mixedString[i];
		if(currentChar == "." || isNaN(Number(currentChar)) === false)
		{
			numberStarted = true;
			numberString += currentChar;
		}
		else if(numberStarted == true)
		{
			break;
		}
	}
	return Number(numberString);
}











