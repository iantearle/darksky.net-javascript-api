/**
 * Helper Class for forecast.io webservice
 * Including moment.js for date help.
 * HTTTClient supports Cross-Domain XHR - no need for callbacks
 *
 * MIT License (MIT)
 * Copyright (c) 2013 Ian Tearle @iantearle
 *
 */
var moment = require('alloy/moment');

function ForecastIO() {
	FORECAST_API = 'API_KEY'; // Sign up at https://developer.forecast.io/
	FORECAST_URL = 'https://api.forecast.io/forecast/';

	this.requestData = function(latitude, longitude, onSuccess, onError, timestamp) {
		var onSuccess = onSuccess || function(){};
		var onError = onError || function(){};
		var timestamp = (timestamp) ? ','+timestamp : '';

		var request_url = FORECAST_URL  + FORECAST_API + '/' + latitude + ',' + longitude + timestamp + '?units=uk';

		var xhr = Titanium.Network.createHTTPClient({
			enableKeepAlive: false
		});

		// Create the result object
		var result = {};

		// Open the HTTP connection
		xhr.open("GET", request_url);

		// When the connection was successful
		xhr.onload = function() {
			// Check the status of this
			result.status = xhr.status == 200 ? "ok" : xhr.status;
			result.data = JSON.parse(xhr.responseText);

			onSuccess(result);
		};

		// When there was an error
		xhr.onerror = function(e) {
			// Check the status of this
			result.status = "error";
			result.data = e;
			result.code = xhr.status;
			onError(result);
		};

		xhr.send();
	}
	/**
	 * Will return the current conditions
	 *
	 * @param float $latitude
	 * @param float $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	this.getCurrentConditions = function(latitude, longitude, onSuccess, onError, timestamp) {
		var onSuccess = onSuccess || function(){};
		var onError = onError || function(){};

		this.requestData(latitude, longitude, onSuccessCallback, onErrorCallback, timestamp);

		function onSuccessCallback(e) {
			var bigReturn = new ForecastIOConditions(e.data.currently);
			onSuccess(bigReturn);
		};

		function onErrorCallback(e) {
			// Handle your errors in here
			onError("error");
		};
	}
	/**
	 * Will return conditions on hourly basis for today
	 *
	 * @param type $latitude
	 * @param type $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	this.getForecastToday = function(latitude, longitude, onSuccess, onError, timestamp) {
		var onSuccess = onSuccess || function(){};
		var onError = onError || function(){};

		this.requestData(latitude, longitude, onSuccessCallback, onErrorCallback, timestamp);

		function onSuccessCallback(e) {
			conditions = [];
			today = moment().format("YYYY-MM-DD");
			for(i=0; i<e.data.hourly.data.length; i++) {
				raw_data = e.data.hourly.data[i];
				if(moment.unix(raw_data.time).format("YYYY-MM-DD") == today) {
					conditions.push(new ForecastIOConditions(raw_data));
				}
			}
			onSuccess(conditions);
		};

		function onErrorCallback(e) {
			// Handle your errors in here
			onError("error");
		};
	}
	/**
	 * Will return daily conditions for next seven days
	 *
	 * @param float $latitude
	 * @param float $longitude
	 * @return \ForecastIOConditions|boolean
	 */
	this.getForecastWeek = function(latitude, longitude, onSuccess, onError, timestamp) {
		var onSuccess = onSuccess || function(){};
		var onError = onError || function(){};

		this.requestData(latitude, longitude, onSuccessCallback, onErrorCallback, timestamp);

		function onSuccessCallback(e) {
			var conditions = [];
			for(i=0; i<e.data.daily.data.length; i++) {
				raw_data = e.data.daily.data[i];
				conditions.push(new ForecastIOConditions(raw_data));
			}
			var bigReturn = conditions;
			onSuccess(bigReturn);
		};

		function onErrorCallback(e) {
			// Handle your errors in here
			onError("error");
		};
	}
}
/**
 * Wrapper for get data by getters
 */

function ForecastIOConditions(raw_data) {
	ForecastIOConditions.prototype = {
		raw_data: raw_data
	}

	/**
	 * Get the time, when $format not set timestamp else formatted time
	 *
	 * @param String $format
	 * @return String
	 */
	this.getTime = function(format) {
		if(!format) {
			return raw_data.time;
		} else {
			return moment.unix(raw_data.time).format(format);
		}
	}
	/**
	 * Get the summary of the conditions
	 *
	 * @return String
	 */
	this.getSummary = function() {
		return raw_data.summary;
	}
	/**
	 * Get the icon of the conditions
	 *
	 * @return String
	 */
	this.getIcon = function() {
		return raw_data.icon;
	}
	/**
	 * get sunrise time
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getSunrise = function() {
		return raw_data.sunriseTime;
	}
	/**
	 * get sunset time
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getSunset = function() {
		return raw_data.sunsetTime;
	}
	/**
	 * get precipitation probability
	 *
	 * @return type
	 */
	this.getPrecipitationProbability = function() {
		return raw_data.precipProbability;
	}
	/**
	 * get precipitation accumilation
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getPrecipitationAccumulation = function() {
		return raw_data.precipAccumulation;
	}
	/**
	 * get precipitation intensity
	 *
	 * @return type
	 */
	this.getPrecipitationIntensity = function() {
		return raw_data.precipIntensity;
	}
	/**
	 * get precipitation max
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getPrecipitationIntensityMax = function() {
		return raw_data.precipIntensityMax;
	}
	/**
	 * get precipitation max time
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getPrecipitationIntensityMaxTime = function() {
		return raw_data.precipIntensityMaxTime;
	}
	/**
	 * get precipitation type
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getPrecipitationType = function() {
		return raw_data.precipType;
	}
	/**
	 * Will return the temperature
	 *
	 * only available for week forecast
	 *
	 * @return String
	 */
	this.getTemperature = function() {
		return raw_data.temperature;
	}
	/**
	 * get the min temperature
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getMinTemperature = function() {
		return raw_data.temperatureMin;
	}
	/**
	 * get the min temperature time
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getMinTemperatureTime = function() {
		return raw_data.temperatureMinTime;
	}
	/**
	 * get max temperature
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getMaxTemperature = function() {
		return raw_data.temperatureMax;
	}
	/**
	 * get max temperature time
	 *
	 * only available for week forecast
	 *
	 * @return type
	 */
	this.getMaxTemperatureTime = function() {
		return raw_data.temperatureMaxTime;
	}
	/**
	 * Get the pressure
	 *
	 * @return String
	 */
	this.getDewPoint = function() {
		return raw_data.dewPoint;
	}
	/**
	 * Get the wind speed
	 *
	 * @return String
	 */
	this.getWindSpeed = function() {
		return raw_data.windSpeed;
	}
	/**
	 * Get wind direction
	 *
	 * @return type
	 */
	this.getWindBearing = function() {
		return raw_data.windBearing;
	}
	/**
	 * Get the cloud cover
	 *
	 * @return type
	 */
	this.getCloudCover = function() {
		return raw_data.cloudCover;
	}
	/**
	 * get humidity
	 *
	 * @return String
	 */
	this.getHumidity = function() {
		return raw_data.humidity;
	}
	/**
	 * Get the pressure
	 *
	 * @return String
	 */
	this.getPressure = function() {
		return raw_data.pressure;
	}
	/**
	 * Get the visibility
	 *
	 * @return String
	 */
	this.getVisibility = function() {
		return raw_data.visibility;
	}
	/**
	 * Get the visibility
	 *
	 * @return String
	 */
	this.getOzone = function() {
		return raw_data.ozone;
	}
}