Pull Requests welcome, if you have used this script in a project let me know, i'd like to start a directory. Have fun. 

forecast.io-javascript-api
==========================

forecast.io JavaScript API

## Getting Started
PHP is required for proxy to work. This is a cross domain policy workaround.

Forecast.io.js is configured to work with both [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) and [CJS](https://en.wikipedia.org/wiki/CommonJS) applications. When the module is loaded it will return a constructor that, once run, will provide the necessary interface functions, namely:

* `getCurrentConditions`
* `getForecastToday`
* `getForecastWeek`

Use of the above is demonstrated within index.html. 

If you're using [Require.JS](http://requirejs.org/) use the example configuration in index.html as a reference. 

If you're using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/) or some other CJS module loader simply require the module like so

`var ForecastIO = require('forecast.io');`

and use the `ForecastIO` constructor as per the demo on the index page.

## Location data

Forecast.io.js can handle multiple location requests. Any request _must_ be supplied as an array of objects as per the example in index.html. 

## Dependencies

Forecast.io.js uses [moment.js](http://momentjs.com/) to handle date/time data and [jQuery](https://jquery.com/) to handle the requests via promises.

If you're using Require.JS be sure to load include these two libraries somewhere in your application and load them via the module `define` function.

If you're using a CJS module loader be sure to install these two libraries using npm:

`npm install moment`
Ref: https://www.npmjs.com/package/moment

`npm install jquery`
Re: https://www.npmjs.com/package/jquery


ti.forecast.io-javascript-api
=============================

ti.forecast.io Javascript API

The Titanium version works a little differently. Callbacks help with data manipulation over the standard javascript API,
there is also no need for a proxy.

    require("ti.forecast.io");
    var forecast = new ForecastIO({
	    API_KEY: 'API_KEY'
    });
    
    var condition = forecast.getCurrentConditions(lat, lon, onSuccessCallback, onErrorCallback);
    
    function onSuccessCallback(weather) {
      weather.getSummary();
    };
    
    function onErrorCallback(e) {
      // Handle your errors in here
    };
    
There are also more returns which will be added into the plain Javascript in due course. 
    
The MIT License (MIT)

Copyright (c) 2013 Ian Tearle @iantearle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
