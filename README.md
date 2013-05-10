forecast.io-javascript-api
==========================

forecast.io Javascript API

For a how to, simply run index.html - php is required for proxy to work (cross domain policy workaround).

TODO: 
  Make ASYNCHRONOUS - introduce callbacks.

ti.forecast.io-javascript-api
=============================

ti.forecast.io Javascript API

The Titanium version works a little differently. Callbacks help with data manipulation over the standard javascript API,
there is also no need for a proxy.

    Ti.include("ti.forecast.io.js");
    var forecast = new ForecastIO();
    
    var condition = forecast.getCurrentConditions(lat, lon, onSuccessCallback, onErrorCallback);
    
    function onSuccessCallback(weather) {
      weather.getSummary();
    };
    
    function onErrorCallback(e) {
      // Handle your errors in here
    };
    
There are also more returns which will be added into the plain Javascript in due course. 

TODO: CommonJS
    
