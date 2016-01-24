'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['moment'], function(moment) {
        	return (root.ForecastIO = factory(moment));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = (root.ForecastIO = factory(require('moment')));
    } else {
        // Browser globals (root is window)
        root.ForecastIO = factory(root.moment);
  }
}(this, function (moment) {

	/* 	By Ian Tearle
		github.com/iantearle

		Other contributors
		Richard Bultitude
		github.com/rjbultitude
		Brandon Love
		github.com/brandonlove
	*/

	//Forecast Class

	function ForecastIO(config) {
		//var PROXY_SCRIPT = '/proxy.php';
		if(!config) {
			console.log('You must pass ForecastIO configurations');
		}
		if(!config.PROXY_SCRIPT) {
			if(!config.API_KEY) {
				console.log('API_KEY or PROXY_SCRIPT must be set in ForecastIO config');
			}
		}
		this.API_KEY = config.API_KEY;
		this.url = (typeof config.PROXY_SCRIPT !== 'undefined') ? config.PROXY_SCRIPT + '?url=': 'https://api.forecast.io/forecast/' + config.API_KEY + '/';
	}

	ForecastIO.prototype.requestData = function requestData(latitude, longitude) {
		var requestUrl = this.url + latitude + ',' + longitude;
		var xhr = new XMLHttpRequest();
		var content = null;
		xhr.onreadystatechange = function() {
			if(xhr.readyState < 4) {
                return;
            }
            if(xhr.status !== 200) {
                return;
            }
            if(xhr.readyState === 4) {
		        content = xhr.responseText;
            }
	        else {
				console.log('there was a problem getting the weather data. Status: ' + xhr.status + ' State: ' + xhr.readyState);
				return false;
	        }
		};
		xhr.open('GET', requestUrl, false);
		xhr.send();

		if(content !== '' && (content)) {
			return JSON.parse(content);
		} else {
			return false;
		}
	};

	/**
	 * Will return the current conditions
	 *
	 * @param float $latitude
	 * @param float $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	ForecastIO.prototype.getCurrentConditions = function getCurrentConditions(latitude, longitude) {
		var data = this.requestData(latitude, longitude);
		if(data !== false) {
			return new ForecastIOConditions(data.currently);
		} else {
			return false;
		}
	};

	/**
	 * Will return conditions on hourly basis for today
	 *
	 * @param type $latitude
	 * @param type $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	ForecastIO.prototype.getForecastToday = function getForecastToday(latitude, longitude) {
		var data = this.requestData(latitude, longitude);
		if(data !== false) {
			var conditions = [];
			var today = moment().format('YYYY-MM-DD');
			for(var i = 0; i < data.hourly.data.length; i++) {
				var rawData = data.hourly.data[i];
				if(moment.unix(rawData.time).format('YYYY-MM-DD') === today) {
					conditions.push(new ForecastIOConditions(rawData));
				}
			}
			return conditions;
		} else {
			return false;
		}
	};

	/**
	 * Will return daily conditions for next seven days
	 *
	 * @param float $latitude
	 * @param float $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	ForecastIO.prototype.getForecastWeek = function getForecastWeek(latitude, longitude) {
		var data = this.requestData(latitude, longitude);
		if(data !== false) {
			var conditions = [];
			for(var i = 0; i < data.daily.data.length; i++) {
				var rawData = data.daily.data[i];
				conditions.push(new ForecastIOConditions(rawData));
			}
			return conditions;
		} else {
			return false;
		}
	};

	function ForecastIOConditions(rawData) {
		ForecastIOConditions.prototype = {
			rawData: rawData
		};
		/**
		 * Will return the temperature
		 *
		 * @return String
		 */
		this.getTemperature = function() {
			return rawData.temperature;
		};
		/**
		 * Get the summary of the conditions
		 *
		 * @return String
		 */
		this.getSummary = function() {
			return rawData.summary;
		};
		/**
		 * Get the icon of the conditions
		 *
		 * @return String
		 */
		this.getIcon = function() {
			return rawData.icon;
		};
		/**
		 * Get the time, when $format not set timestamp else formatted time
		 *
		 * @param String $format
		 * @return String
		 */
		this.getTime = function(format) {
			if(!format) {
				return rawData.time;
			} else {
				return moment.unix(rawData.time).format(format);
			}
		};
		/**
		 * Get the pressure
		 *
		 * @return String
		 */
		this.getPressure = function() {
			return rawData.pressure;
		};
		/**
		 * get humidity
		 *
		 * @return String
		 */
		this.getHumidity = function() {
			return rawData.humidity;
		};
		/**
		 * Get the wind speed
		 *
		 * @return String
		 */
		this.getWindSpeed = function() {
			return rawData.windSpeed;
		};
		/**
		 * Get wind direction
		 *
		 * @return type
		 */
		this.getWindBearing = function() {
			return rawData.windBearing;
		};
		/**
		 * get precipitation type
		 *
		 * @return type
		 */
		this.getPrecipitationType = function() {
			return rawData.precipType;
		};
		/**
		 * get the probability 0..1 of precipitation type
		 *
		 * @return type
		 */
		this.getPrecipitationProbability = function() {
			return rawData.precipProbability;
		};
		/**
		 * Get the cloud cover
		 *
		 * @return type
		 */
		this.getCloudCover = function() {
			return rawData.cloudCover;
		};
		/**
		 * get the min temperature
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getMinTemperature = function() {
			return rawData.temperatureMin;
		};
		/**
		 * get max temperature
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getMaxTemperature = function() {
			return rawData.temperatureMax;
		};
		/**
		 * get sunrise time
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getSunrise = function() {
			return rawData.sunriseTime;
		};
		/**
		 * get sunset time
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getSunset = function() {
			return rawData.sunsetTime;
		};
		/**
		 * get precipitation intensity
		 *
		 * @return number
		 */
		this.getPrecipIntensity = function() {
			return rawData.precipIntensity;
		};
		/**
		 * get dew point
		 *
		 * @return number
		 */
		this.getDewPoint = function() {
			return rawData.dewPoint;
		};
		/**
		 * get the ozone
		 *
		 * @return number
		 */
		this.getOzone = function() {
			return rawData.ozone;
		};
	}

	return ForecastIO;
}));
