let timeNow = new Date();

const dateNowFormattedET = function(){
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"]
	return timeNow.getDate() + "."+ (monthNamesET[timeNow.getMonth()]) + "." + timeNow.getFullYear();
}

const timeNowFormattedET = function(){
	return timeNow.getHours() + ":" + timeNow.getMinutes() + ":" + timeNow.getSeconds();
}

const weekdayNowET = function(){
	const dayNamesET =["esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev", "pühapäev"]
	return dayNamesET[timeNow.getDay()-1]
}

const partOfDay = function(){
	let dayPart = "suvaline aeg";
	let hourNow = timeNow.getHours();
	if (hourNow <= 6){
		dayPart="varahommik";
	} else if (hourNow <12){
		dayPart="hommik";
	}else if (hourNow ==12){
		dayPart="lõuna";
	}else if (hourNow<18){
		dayPart="päev";
	} else if (hourNow<24){
		dayPart="õhtu";
	} else {
		dayPart="öö";
	}
	return dayPart;
}

//ekspordin kõik vajaliku
module.exports={fullDate: dateNowFormattedET, fullTime: timeNowFormattedET, weekDay: weekdayNowET, partOfDay: partOfDay};
