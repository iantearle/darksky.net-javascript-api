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
		Forked and amended by
		Richard Bultitude
		github.com/rjbultitude
	*/

	//Forecast Class

	function ForecastIO(config) {
		//var PROXY_SCRIPT = '/proxy.php';
		console.log('config', config);
		if(!config) { 
			console.log('You must pass ForecastIO configurations');
		}
		if(!config.PROXY_SCRIPT) {
			if(!config.API_KEY) {
				console.log('API_KEY or PROXY_SCRIPT must be set in ForecastIO config');
			}
		}
		this.API_KEY = config.API_KEY;
		this.url = (typeof config.PROXY_SCRIPT !== 'undefined') ? config.PROXY_SCRIPT : 'https://api.forecast.io/forecast/' + config.API_KEY + '/';
	}

	//Request data method with added callback
	//should return a promise
	ForecastIO.prototype.requestData = function requestData(latitude, longitude, ready) {
		var request_url = this.url + '?url=' + latitude + ',' + longitude + '?units=auto';
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
		        var contentJSON = JSON.parse(content);
		        var currData = new ForecastIOConditions(contentJSON.currently);
		        ready(currData);
            }
	        else {
				console.log('there was a problem getting the weather data. Status: ' + xhr.status + ' State: ' + xhr.readyState);
				return false;
	        }
		};
		xhr.open('GET', request_url, true);
		xhr.send();
	};

	/**
	 * Will return the current conditions
	 *
	 * @param float $latitude
	 * @param float $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	ForecastIO.prototype.getCurrentConditions = function getCurrentConditions(latitude, longitude, ready) {
		var data = this.requestData(latitude, longitude, ready);
	};

	/**
	 * Will return conditions on hourly basis for today
	 *
	 * @param type $latitude
	 * @param type $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	ForecastIO.prototype.getForecastToday = function getForecastToday(latitude, longitude) {
		data = this.requestData(latitude, longitude);
		if(data !== false) {
			conditions = [];
			today = moment().format("YYYY-MM-DD");
			for(i=0; i<data.hourly.data.length; i++) {
				raw_data = data.hourly.data[i];
				if(moment.unix(raw_data.time).format("YYYY-MM-DD") == today) {
					conditions.push(new ForecastIOConditions(raw_data));
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
		data = this.requestData(latitude, longitude);
		if(data !== false) {
			conditions = [];
			for(i=0; i<data.daily.data.length; i++) {
				raw_data = data.daily.data[i];
				conditions.push(new ForecastIOConditions(raw_data));
			}
			return conditions;
		} else {
			return false;
		}
	};

	function ForecastIOConditions(raw_data) {
		ForecastIOConditions.prototype = {
			raw_data: raw_data
		};
		/**
		 * Will return the temperature
		 *
		 * @return String
		 */
		this.getTemperature = function() {
			return raw_data.temperature;
		};
		/**
		 * Get the summary of the conditions
		 *
		 * @return String
		 */
		this.getSummary = function() {
			return raw_data.summary;
		};
		/**
		 * Get the icon of the conditions
		 *
		 * @return String
		 */
		this.getIcon = function() {
			return raw_data.icon;
		};
		/**
		 * Get the time, when $format not set timestamp else formatted time
		 * Disabled due to moment js not supporting CJS
		 *
		 * @param String $format
		 * @return String
		 */
		this.getTime = function(format) {
			format = 'feature not available';
			if(!format) {
				return raw_data.time;
			} else {
				return moment.unix(raw_data.time).format(format);
			}
		};
		/**
		 * Get the pressure
		 *
		 * @return String
		 */
		this.getPressure = function() {
			return raw_data.pressure;
		};
		/**
		 * get humidity
		 *
		 * @return String
		 */
		this.getHumidity = function() {
			return raw_data.humidity;
		};
		/**
		 * Get the wind speed
		 *
		 * @return String
		 */
		this.getWindSpeed = function() {
			return raw_data.windSpeed;
		};
		/**
		 * Get wind direction
		 *
		 * @return type
		 */
		this.getWindBearing = function() {
			return raw_data.windBearing;
		};
		/**
		 * get precipitation type
		 *
		 * @return type
		 */
		this.getPrecipitationType = function() {
			return raw_data.precipType;
		};
		/**
		 * get the probability 0..1 of precipitation type
		 *
		 * @return type
		 */
		this.getPrecipitationProbability = function() {
			return raw_data.precipProbability;
		};
		/**
		 * Get the cloud cover
		 *
		 * @return type
		 */
		this.getCloudCover = function() {
			return raw_data.cloudCover;
		};
		/**
		 * get the min temperature
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getMinTemperature = function() {
			return raw_data.temperatureMin;
		};
		/**
		 * get max temperature
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getMaxTemperature = function() {
			return raw_data.temperatureMax;
		};
		/**
		 * get sunrise time
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getSunrise = function() {
			return raw_data.sunriseTime;
		};
		/**
		 * get sunset time
		 *
		 * only available for week forecast
		 *
		 * @return type
		 */
		this.getSunset = function() {
			return raw_data.sunsetTime;
		};
		/**
		 * get precipitation intensity
		 *
		 * @return number
		 */
		this.getPrecipIntensity = function() {
			return raw_data.precipIntensity;
		};
		/**
		 * get dew point
		 *
		 * @return number
		 */
		this.getDewPoint = function() {
			return raw_data.dewPoint;
		};
		/**
		 * get the ozone
		 *
		 * @return number
		 */
		this.getOzone = function() {
			return raw_data.ozone;
		};
	}

	return ForecastIO;
}));