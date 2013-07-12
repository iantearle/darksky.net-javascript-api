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
