/**
 * Copyright 2009 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

if (!Array.prototype.shift) {
	Array.prototype.shift = function() {
		if (this.length > 0) {
			var firstItem = this[0];
			for (var i = 0, len = this.length - 1; i < len; i++) {
				this[i] = this[i + 1];
			}
			this.length = this.length - 1;
			return firstItem;
		}
	};
}

var log4javascript;

(function() {
	var newLine = "\r\n";
	function Log4JavaScript() {}
	log4javascript = new Log4JavaScript();
	log4javascript.version = "1.4.2";
	log4javascript.edition = "log4javascript_lite";

	function getExceptionMessage(ex) {
		if (ex.message) {
			return ex.message;
		} else if (ex.description) {
			return ex.description;
		} else {
			return String(ex);
		}
	}

	// Gets the portion of the URL after the last slash
	function getUrlFileName(url) {
		var lastSlashIndex = Math.max(url.lastIndexOf("/"), url.lastIndexOf("\\"));
		return url.substr(lastSlashIndex + 1);
	}

	// Returns a nicely formatted representation of an error
	function getExceptionStringRep(ex) {
		if (ex) {
			var exStr = "Exception: " + getExceptionMessage(ex);
			try {
				if (ex.lineNumber) {
					exStr += " on line number " + ex.lineNumber;
				}
				if (ex.fileName) {
					exStr += " in file " + getUrlFileName(ex.fileName);
				}
			} catch (localEx) {
			}
			if (showStackTraces && ex.stack) {
				exStr += newLine + "Stack trace:" + newLine + ex.stack;
			}
			return exStr;
		}
		return null;
	}

	function isError(err) {
		return (err instanceof Error);
	}

	function bool(obj) {
		return Boolean(obj);
	}

	var enabled = (typeof log4javascript_disabled != "undefined") &&
		log4javascript_disabled ? false : true;

	log4javascript.setEnabled = function(enable) {
		enabled = bool(enable);
	};

	log4javascript.isEnabled = function() {
		return enabled;
	};

	var showStackTraces = false;

	log4javascript.setShowStackTraces = function(show) {
		showStackTraces = bool(show);
	};

	/* ---------------------------------------------------------------------- */
	// Levels

	var Level = function(level, name) {
		this.level = level;
		this.name = name;
	};

	Level.prototype = {
		toString: function() {
			return this.name;
		},
		equals: function(level) {
			return this.level == level.level;
		},
		isGreaterOrEqual: function(level) {
			return this.level >= level.level;
		}
	};

	Level.ALL = new Level(Number.MIN_VALUE, "ALL");
	Level.TRACE = new Level(10000, "TRACE");
	Level.DEBUG = new Level(20000, "DEBUG");
	Level.INFO = new Level(30000, "INFO");
	Level.WARN = new Level(40000, "WARN");
	Level.ERROR = new Level(50000, "ERROR");
	Level.FATAL = new Level(60000, "FATAL");
	Level.OFF = new Level(Number.MAX_VALUE, "OFF");

	log4javascript.Level = Level;

	/* ---------------------------------------------------------------------- */
	// Appenders

	function Appender() {
		var getConsoleHtmlLines = function() {
			return [
'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
'<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">',
'	<head>',
'		<title>log4javascript</title>',
'		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />',
'		<!-- Make IE8 behave like IE7, having gone to all the trouble of making IE work -->',
'		<meta http-equiv="X-UA-Compatible" content="IE=7" />',
'		<script type="text/javascript">',
'			//<![CDATA[',
'			var loggingEnabled = true;',
'			var messagesBeforeDocLoaded = [];',
'',
'			function toggleLoggingEnabled() {',
'				setLoggingEnabled($("enableLogging").checked);',
'			}',
'',
'			function setLoggingEnabled(enable) {',
'				loggingEnabled = enable;',
'			}',
'',
'			function scrollToLatestEntry() {',
'				var l = getLogContainer();',
'				if (typeof l.scrollTop != "undefined") {',
'					var latestLogEntry = l.lastChild;',
'					if (latestLogEntry) {',
'						l.scrollTop = l.scrollHeight;',
'					}',
'				}',
'			}',
'',
'			function log(logLevel, formattedMessage) {',
'				if (loggingEnabled) {',
'					if (loaded) {',
'						doLog(logLevel, formattedMessage);',
'					} else {',
'						messagesBeforeDocLoaded.push([logLevel, formattedMessage]);',
'					}',
'				}',
'			}',
'',
'			function doLog(logLevel, formattedMessage) {',
'				var logEntry = document.createElement("div");',
'				logEntry.appendChild(document.createTextNode(formattedMessage));',
'				logEntry.className = "logentry " + logLevel.name;',
'				getLogContainer().appendChild(logEntry);',
'				scrollToLatestEntry();',
'			}',
'',
'			function mainPageReloaded() {',
'				var separator = document.createElement("div");',
'				separator.className = "separator";',
'				separator.innerHTML = "&nbsp;";',
'				getLogContainer().appendChild(separator);',
'			}',
'',
'			var loaded = false;',
'			var logLevels = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];',
'',
'			window.onload = function() {',
'				setLogContainerHeight();',
'				toggleLoggingEnabled();',
'				for (var i = 0; i < messagesBeforeDocLoaded.length; i++) {',
'					doLog(messagesBeforeDocLoaded[i][0], messagesBeforeDocLoaded[i][1]);',
'				}',
'				messagesBeforeDocLoaded = [];',
'				loaded = true;',
'',
'				// Workaround to make sure log div starts at the correct size',
'				setTimeout(setLogContainerHeight, 20);',
'			};',
'',
'			function getLogContainer() {',
'				return $("log");',
'			}',
'',
'			function clearLog() {',
'				getLogContainer().innerHTML = "";',
'			}',
'',
'			/* ------------------------------------------------------------------------- */',
'',
'			// Other utility functions',
'',
'			// Syntax borrowed from Prototype library',
'			function $(id) {',
'				return document.getElementById(id);',
'			}',
'',
'			function getWindowHeight() {',
'				if (window.innerHeight) {',
'					return window.innerHeight;',
'				} else if (document.documentElement && document.documentElement.clientHeight) {',
'					return document.documentElement.clientHeight;',
'				} else if (document.body) {',
'					return document.body.clientHeight;',
'				}',
'				return 0;',
'			}',
'',
'			function getChromeHeight() {',
'				return $("toolbar").offsetHeight;',
'			}',
'',
'			function setLogContainerHeight() {',
'				var windowHeight = getWindowHeight();',
'				$("body").style.height = getWindowHeight() + "px";',
'				getLogContainer().style.height = "" +',
'					Math.max(0, windowHeight - getChromeHeight()) + "px";',
'			}',
'',
'			window.onresize = function() {',
'				setLogContainerHeight();',
'			};',
'',
'			//]]>',
'		</script>',
'		<style type="text/css">',
'			body {',
'				background-color: white;',
'				color: black;',
'				padding: 0;',
'				margin: 0;',
'				font-family: tahoma, verdana, arial, helvetica, sans-serif;',
'				overflow: hidden;',
'			}',
'			',
'			div#toolbar {',
'				border-top: solid #ffffff 1px;',
'				border-bottom: solid #aca899 1px;',
'				background-color: #f1efe7;',
'				padding: 3px 5px;',
'				font-size: 68.75%;',
'			}',
'',
'			div#toolbar input.button {',
'				padding: 0 5px;',
'				font-size: 100%;',
'			}',
'',
'			div#log {',
'				font-family: Courier New, Courier;',
'				font-size: 75%;',
'				width: 100%;',
'				overflow: auto;',
'				clear: both;',
'			}',
'',
'			*.logentry {',
'				overflow: visible;',
'				white-space: pre;',
'			}',
'',
'			*.TRACE {',
'				color: #666666;',
'			}',
'',
'			*.DEBUG {',
'				color: green;',
'			}',
'',
'			*.INFO {',
'				color: #000099;',
'			}',
'',
'			*.WARN {',
'				color: #999900;',
'			}',
'',
'			*.ERROR {',
'				color: red;',
'			}',
'',
'			*.FATAL {',
'				color: #660066;',
'			}',
'',
'			div#log div.separator {',
'				background-color: #cccccc;',
'				margin: 5px 0;',
'				line-height: 1px;',
'			}',
'		</style>',
'	</head>',
'',
'	<body id="body">',
'		<div id="toolbar">',
'			Options:',
'			<input type="checkbox" id="enableLogging" onclick="toggleLoggingEnabled()" class="stateful" checked="checked" title="Enable/disable logging" /><label for="enableLogging" id="enableLoggingLabel">Enable logging</label>',
'			<input type="button" id="clearButton" value="Clear" onclick="clearLog()" class="stateful button" title="Clear all log messages"  />',
'			<input type="button" id="closeButton" value="Close" onclick="closeWindow()" class="stateful button" title="Close the window" />',
'		</div>',
'		<div id="log" class="TRACE DEBUG INFO WARN ERROR FATAL"></div>',
'	</body>',
'</html>'
];
		};

		var popUp = null;
		var popUpsBlocked = false;
		var popUpClosed = false;
		var popUpLoaded = false;
		var complainAboutPopUpBlocking = true;
		var initialized = false;
		var isSupported = true;
		var width = 600;
		var height = 400;
		var focusPopUp = false;
		var queuedLoggingEvents = new Array();

		function isLoaded(win) {
			try {
				return bool(win.loaded);
			} catch (ex) {
				return false;
			}
		}

		function finalInit() {
			popUpLoaded = true;
			appendQueuedLoggingEvents();
		}

		function writeHtml(doc) {
			var lines = getConsoleHtmlLines();
			doc.open();
			for (var i = 0, len = lines.length; i < len; i++) {
				doc.writeln(lines[i]);
			}
			doc.close();
		}

		function pollConsoleWindow() {
			function pollConsoleWindowLoaded() {
				if (popUpLoaded) {
					clearInterval(poll);
				} else if (bool(popUp) && isLoaded(popUp)) {
					clearInterval(poll);
					finalInit();
				}
			}

			// Poll the pop-up since the onload event is not reliable
			var poll = setInterval(pollConsoleWindowLoaded, 100);
		}

		function init() {
			var windowProperties = "width=" + width + ",height=" + height + ",status,resizable";
			var windowName = "log4javascriptLitePopUp" + location.host.replace(/[^a-z0-9]/gi, "_");

			popUp = window.open("", windowName, windowProperties);
			popUpClosed = false;
			if (popUp) {
				if (isLoaded(popUp)) {
					popUp.mainPageReloaded();
					finalInit();
				} else {
                    writeHtml(popUp.document);

                    // Check if the pop-up window object is available
                    if (isLoaded(popUp)) {
                        finalInit();
                    } else {
                        pollConsoleWindow();
					}
				}
			} else {
				isSupported = false;
				if (complainAboutPopUpBlocking) {
					alert("log4javascript: pop-up windows appear to be blocked. Please unblock them to use pop-up logging.");
				}
			}
			initialized = true;
		}

		function safeToAppend() {
			if (!popUpsBlocked && !popUpClosed) {
				if (popUp.closed) {
					popUpClosed = true;
					return false;
				}
				if (!popUpLoaded && popUp.loaded) {
					popUpLoaded = true;
				}
			}
			return !popUpsBlocked && popUpLoaded && !popUpClosed;
		}

		function padWithZeroes(num, len) {
			var str = "" + num;
			while (str.length < len) {
				str = "0" + str;
			}
			return str;
		}

		function padWithSpaces(str, len) {
			while (str.length < len) {
				str += " ";
			}
			return str;
		}

		this.append = function(loggingEvent) {
			if (!initialized) {
				init();
			}
			queuedLoggingEvents.push(loggingEvent);
			if (safeToAppend()) {
				appendQueuedLoggingEvents();
			}
		};

		function appendQueuedLoggingEvents() {
			if (safeToAppend()) {
				while (queuedLoggingEvents.length > 0) {
					var currentLoggingEvent = queuedLoggingEvents.shift();
                    var date = currentLoggingEvent.timeStamp;
					var formattedDate = padWithZeroes(date.getHours(), 2) + ":" +
						padWithZeroes(date.getMinutes(), 2) + ":" + padWithZeroes(date.getSeconds(), 2);
					var formattedMessage = formattedDate + " " + padWithSpaces(currentLoggingEvent.level.name, 5) +
						" - " + currentLoggingEvent.getCombinedMessages();
					var throwableStringRep = currentLoggingEvent.getThrowableStrRep();
					if (throwableStringRep) {
						formattedMessage += newLine + throwableStringRep;
					}
					popUp.log(currentLoggingEvent.level, formattedMessage);
				}
				if (focusPopUp) {
					popUp.focus();
				}
			}
		}
	}

	log4javascript.Appender = Appender;

	/* ---------------------------------------------------------------------- */
	// Loggers

	function Logger() {
		var appender = new Appender();
		var loggerLevel = Level.ALL;

		this.log = function(level, params) {
			if (level.isGreaterOrEqual(this.getLevel())) {
				// Check whether last param is an exception
				var exception;
				var finalParamIndex = params.length - 1;
				var lastParam = params[params.length - 1];
				if (params.length > 1 && isError(lastParam)) {
					exception = lastParam;
					finalParamIndex--;
				}

				// Construct genuine array for the params
				var messages = [];
				for (var i = 0; i <= finalParamIndex; i++) {
					messages[i] = params[i];
				}

				var loggingEvent = new LoggingEvent(
					this, new Date(), level, messages, exception);

				appender.append(loggingEvent);
			}
		};

		this.setLevel = function(level) {
			loggerLevel = level;
		};

		this.getLevel = function() {
			return loggerLevel;
		};
	}

	Logger.prototype = {
		trace: function() {
			this.log(Level.TRACE, arguments);
		},

		debug: function() {
			this.log(Level.DEBUG, arguments);
		},

		info: function() {
			this.log(Level.INFO, arguments);
		},

		warn: function() {
			this.log(Level.WARN, arguments);
		},

		error: function() {
			this.log(Level.ERROR, arguments);
		},

		fatal: function() {
			this.log(Level.FATAL, arguments);
		},

		isEnabledFor: function(level) {
			return level.isGreaterOrEqual(this.getLevel());
		},

		isTraceEnabled: function() {
			return this.isEnabledFor(Level.TRACE);
		},

		isDebugEnabled: function() {
			return this.isEnabledFor(Level.DEBUG);
		},

		isInfoEnabled: function() {
			return this.isEnabledFor(Level.INFO);
		},

		isWarnEnabled: function() {
			return this.isEnabledFor(Level.WARN);
		},

		isErrorEnabled: function() {
			return this.isEnabledFor(Level.ERROR);
		},

		isFatalEnabled: function() {
			return this.isEnabledFor(Level.FATAL);
		}
	};

	/* ---------------------------------------------------------------------- */
	// Logger access methods

	var defaultLogger = null;
	log4javascript.getDefaultLogger = function() {
		if (!defaultLogger) {
			defaultLogger = new Logger();
		}
		return defaultLogger;
	};

	log4javascript.getLogger = log4javascript.getDefaultLogger;

	var nullLogger = null;
	log4javascript.getNullLogger = function() {
		if (!nullLogger) {
			nullLogger = new Logger();
			nullLogger.setLevel(Level.OFF);
		}
		return nullLogger;
	};

	/* ---------------------------------------------------------------------- */
	// Logging events

	var LoggingEvent = function(logger, timeStamp, level, messages,
			exception) {
		this.logger = logger;
		this.timeStamp = timeStamp;
		this.level = level;
		this.messages = messages;
		this.exception = exception;
	};

	LoggingEvent.prototype = {
		getThrowableStrRep: function() {
			return this.exception ?
				getExceptionStringRep(this.exception) : "";
		},

		getCombinedMessages: function() {
			return (this.messages.length === 1) ? this.messages[0] :
				   this.messages.join(newLine);
		}
	};

	log4javascript.LoggingEvent = LoggingEvent;

	// Ensure that the log4javascript object is available in the window. This
	// is necessary for log4javascript to be available in IE if loaded using
	// Dojo's module system
	window.log4javascript = log4javascript;
})();
/*! jQuery v1.7.2 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cu(a){if(!cj[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){ck||(ck=c.createElement("iframe"),ck.frameBorder=ck.width=ck.height=0),b.appendChild(ck);if(!cl||!ck.createElement)cl=(ck.contentWindow||ck.contentDocument).document,cl.write((f.support.boxModel?"<!doctype html>":"")+"<html><body>"),cl.close();d=cl.createElement(a),cl.body.appendChild(d),e=f.css(d,"display"),b.removeChild(ck)}cj[a]=e}return cj[a]}function ct(a,b){var c={};f.each(cp.concat.apply([],cp.slice(0,b)),function(){c[this]=a});return c}function cs(){cq=b}function cr(){setTimeout(cs,0);return cq=f.now()}function ci(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ch(){try{return new a.XMLHttpRequest}catch(b){}}function cb(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function ca(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function b_(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bD.test(a)?d(a,e):b_(a+"["+(typeof e=="object"?b:"")+"]",e,c,d)});else if(!c&&f.type(b)==="object")for(var e in b)b_(a+"["+e+"]",b[e],c,d);else d(a,b)}function b$(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function bZ(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bS,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=bZ(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=bZ(a,c,d,e,"*",g));return l}function bY(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bO),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bB(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?1:0,g=4;if(d>0){if(c!=="border")for(;e<g;e+=2)c||(d-=parseFloat(f.css(a,"padding"+bx[e]))||0),c==="margin"?d+=parseFloat(f.css(a,c+bx[e]))||0:d-=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0;return d+"px"}d=by(a,b);if(d<0||d==null)d=a.style[b];if(bt.test(d))return d;d=parseFloat(d)||0;if(c)for(;e<g;e+=2)d+=parseFloat(f.css(a,"padding"+bx[e]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+bx[e]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+bx[e]))||0);return d+"px"}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;b.nodeType===1&&(b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase(),c==="object"?b.outerHTML=a.outerHTML:c!=="input"||a.type!=="checkbox"&&a.type!=="radio"?c==="option"?b.selected=a.defaultSelected:c==="input"||c==="textarea"?b.defaultValue=a.defaultValue:c==="script"&&b.text!==a.text&&(b.text=a.text):(a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value)),b.removeAttribute(f.expando),b.removeAttribute("_submit_attached"),b.removeAttribute("_change_attached"))}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c,i[c][d])}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?+d:j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.2",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a!=null&&a==a.window},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){if(typeof c!="string"||!c)return null;var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h,i){var j,k=d==null,l=0,m=a.length;if(d&&typeof d=="object"){for(l in d)e.access(a,c,l,d[l],1,h,f);g=1}else if(f!==b){j=i===b&&e.isFunction(f),k&&(j?(j=c,c=function(a,b,c){return j.call(e(a),c)}):(c.call(a,f),c=null));if(c)for(;l<m;l++)c(a[l],d,j?f.call(a[l],l,c(a[l],d)):f,i);g=1}return g?a:k?c.call(a):m?c(a[0],d):h},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m,n=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?n(g):h==="function"&&(!a.unique||!p.has(g))&&c.push(g)},o=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,j=!0,m=k||0,k=0,l=c.length;for(;c&&m<l;m++)if(c[m].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}j=!1,c&&(a.once?e===!0?p.disable():c=[]:d&&d.length&&(e=d.shift(),p.fireWith(e[0],e[1])))},p={add:function(){if(c){var a=c.length;n(arguments),j?l=c.length:e&&e!==!0&&(k=a,o(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){j&&f<=l&&(l--,f<=m&&m--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&p.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(j?a.once||d.push([b,c]):(!a.once||!e)&&o(b,c));return this},fire:function(){p.fireWith(this,arguments);return this},fired:function(){return!!i}};return p};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p=c.createElement("div"),q=c.documentElement;p.setAttribute("className","t"),p.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=p.getElementsByTagName("*"),e=p.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=p.getElementsByTagName("input")[0],b={leadingWhitespace:p.firstChild.nodeType===3,tbody:!p.getElementsByTagName("tbody").length,htmlSerialize:!!p.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:p.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0,pixelMargin:!0},f.boxModel=b.boxModel=c.compatMode==="CSS1Compat",i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete p.test}catch(r){b.deleteExpando=!1}!p.addEventListener&&p.attachEvent&&p.fireEvent&&(p.attachEvent("onclick",function(){b.noCloneEvent=!1}),p.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),i.setAttribute("name","t"),p.appendChild(i),j=c.createDocumentFragment(),j.appendChild(p.lastChild),b.checkClone=j.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,j.removeChild(i),j.appendChild(p);if(p.attachEvent)for(n in{submit:1,change:1,focusin:1})m="on"+n,o=m in p,o||(p.setAttribute(m,"return;"),o=typeof p[m]=="function"),b[n+"Bubbles"]=o;j.removeChild(p),j=g=h=p=i=null,f(function(){var d,e,g,h,i,j,l,m,n,q,r,s,t,u=c.getElementsByTagName("body")[0];!u||(m=1,t="padding:0;margin:0;border:",r="position:absolute;top:0;left:0;width:1px;height:1px;",s=t+"0;visibility:hidden;",n="style='"+r+t+"5px solid #000;",q="<div "+n+"display:block;'><div style='"+t+"0;display:block;overflow:hidden;'></div></div>"+"<table "+n+"' cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",d=c.createElement("div"),d.style.cssText=s+"width:0;height:0;position:static;top:0;margin-top:"+m+"px",u.insertBefore(d,u.firstChild),p=c.createElement("div"),d.appendChild(p),p.innerHTML="<table><tr><td style='"+t+"0;display:none'></td><td>t</td></tr></table>",k=p.getElementsByTagName("td"),o=k[0].offsetHeight===0,k[0].style.display="",k[1].style.display="none",b.reliableHiddenOffsets=o&&k[0].offsetHeight===0,a.getComputedStyle&&(p.innerHTML="",l=c.createElement("div"),l.style.width="0",l.style.marginRight="0",p.style.width="2px",p.appendChild(l),b.reliableMarginRight=(parseInt((a.getComputedStyle(l,null)||{marginRight:0}).marginRight,10)||0)===0),typeof p.style.zoom!="undefined"&&(p.innerHTML="",p.style.width=p.style.padding="1px",p.style.border=0,p.style.overflow="hidden",p.style.display="inline",p.style.zoom=1,b.inlineBlockNeedsLayout=p.offsetWidth===3,p.style.display="block",p.style.overflow="visible",p.innerHTML="<div style='width:5px;'></div>",b.shrinkWrapBlocks=p.offsetWidth!==3),p.style.cssText=r+s,p.innerHTML=q,e=p.firstChild,g=e.firstChild,i=e.nextSibling.firstChild.firstChild,j={doesNotAddBorder:g.offsetTop!==5,doesAddBorderForTableAndCells:i.offsetTop===5},g.style.position="fixed",g.style.top="20px",j.fixedPosition=g.offsetTop===20||g.offsetTop===15,g.style.position=g.style.top="",e.style.overflow="hidden",e.style.position="relative",j.subtractsBorderForOverflowNotVisible=g.offsetTop===-5,j.doesNotIncludeMarginInBodyOffset=u.offsetTop!==m,a.getComputedStyle&&(p.style.marginTop="1%",b.pixelMargin=(a.getComputedStyle(p,null)||{marginTop:0}).marginTop!=="1%"),typeof d.style.zoom!="undefined"&&(d.style.zoom=1),u.removeChild(d),l=p=d=null,f.extend(b,j))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h,i,j=this[0],k=0,m=null;if(a===b){if(this.length){m=f.data(j);if(j.nodeType===1&&!f._data(j,"parsedAttrs")){g=j.attributes;for(i=g.length;k<i;k++)h=g[k].name,h.indexOf("data-")===0&&(h=f.camelCase(h.substring(5)),l(j,h,m[h]));f._data(j,"parsedAttrs",!0)}}return m}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split(".",2),d[1]=d[1]?"."+d[1]:"",e=d[1]+"!";return f.access(this,function(c){if(c===b){m=this.triggerHandler("getData"+e,[d[0]]),m===b&&j&&(m=f.data(j,a),m=l(j,a,m));return m===b&&d[1]?this.data(d[0]):m}d[1]=c,this.each(function(){var b=f(this);b.triggerHandler("setData"+e,d),f.data(this,a,c),b.triggerHandler("changeData"+e,d)})},null,c,arguments.length>1,null,!1)},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){var d=2;typeof a!="string"&&(c=a,a="fx",d--);if(arguments.length<d)return f.queue(this[0],a);return c===b?this:this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise(c)}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,f.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,f.prop,a,b,arguments.length>1)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.type]||f.valHooks[this.nodeName.toLowerCase()];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.type]||f.valHooks[g.nodeName.toLowerCase()];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h,i=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;i<g;i++)e=d[i],e&&(c=f.propFix[e]||e,h=u.test(e),h||f.attr(a,e,""),a.removeAttribute(v?e:c),h&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0,coords:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/(?:^|\s)hover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(
a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler,g=p.selector),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:g&&G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=f.event.special[c.type]||{},j=[],k,l,m,n,o,p,q,r,s,t,u;g[0]=c,c.delegateTarget=this;if(!i.preDispatch||i.preDispatch.call(this,c)!==!1){if(e&&(!c.button||c.type!=="click")){n=f(this),n.context=this.ownerDocument||this;for(m=c.target;m!=this;m=m.parentNode||this)if(m.disabled!==!0){p={},r=[],n[0]=m;for(k=0;k<e;k++)s=d[k],t=s.selector,p[t]===b&&(p[t]=s.quick?H(m,s.quick):n.is(t)),p[t]&&r.push(s);r.length&&j.push({elem:m,matches:r})}}d.length>e&&j.push({elem:this,matches:d.slice(e)});for(k=0;k<j.length&&!c.isPropagationStopped();k++){q=j[k],c.currentTarget=q.elem;for(l=0;l<q.matches.length&&!c.isImmediatePropagationStopped();l++){s=q.matches[l];if(h||!c.namespace&&!s.namespace||c.namespace_re&&c.namespace_re.test(s.namespace))c.data=s.data,c.handleObj=s,o=((f.event.special[s.origType]||{}).handle||s.handler).apply(q.elem,g),o!==b&&(c.result=o,o===!1&&(c.preventDefault(),c.stopPropagation()))}}i.postDispatch&&i.postDispatch.call(this,c);return c.result}},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){a._submit_bubble=!0}),d._submit_attached=!0)})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=d||c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.origType+"."+e.namespace:e.origType,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9||d===11){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));o.match.globalPOS=p;var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.globalPOS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")[\\s/>]","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){return f.access(this,function(a){return a===b?f.text(this):this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a))},null,a,arguments.length)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f
.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function(){for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){return f.access(this,function(a){var c=this[0]||{},d=0,e=this.length;if(a===b)return c.nodeType===1?c.innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(;d<e;d++)c=this[d]||{},c.nodeType===1&&(f.cleanData(c.getElementsByTagName("*")),c.innerHTML=a);c=0}catch(g){}}c&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,function(a,b){b.src?f.ajax({type:"GET",global:!1,url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)})}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||f.isXMLDoc(a)||!bc.test("<"+a.nodeName+">")?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g,h,i,j=[];b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);for(var k=0,l;(l=a[k])!=null;k++){typeof l=="number"&&(l+="");if(!l)continue;if(typeof l=="string")if(!_.test(l))l=b.createTextNode(l);else{l=l.replace(Y,"<$1></$2>");var m=(Z.exec(l)||["",""])[1].toLowerCase(),n=bg[m]||bg._default,o=n[0],p=b.createElement("div"),q=bh.childNodes,r;b===c?bh.appendChild(p):U(b).appendChild(p),p.innerHTML=n[1]+l+n[2];while(o--)p=p.lastChild;if(!f.support.tbody){var s=$.test(l),t=m==="table"&&!s?p.firstChild&&p.firstChild.childNodes:n[1]==="<table>"&&!s?p.childNodes:[];for(i=t.length-1;i>=0;--i)f.nodeName(t[i],"tbody")&&!t[i].childNodes.length&&t[i].parentNode.removeChild(t[i])}!f.support.leadingWhitespace&&X.test(l)&&p.insertBefore(b.createTextNode(X.exec(l)[0]),p.firstChild),l=p.childNodes,p&&(p.parentNode.removeChild(p),q.length>0&&(r=q[q.length-1],r&&r.parentNode&&r.parentNode.removeChild(r)))}var u;if(!f.support.appendChecked)if(l[0]&&typeof (u=l.length)=="number")for(i=0;i<u;i++)bn(l[i]);else bn(l);l.nodeType?j.push(l):j=f.merge(j,l)}if(d){g=function(a){return!a.type||be.test(a.type)};for(k=0;j[k];k++){h=j[k];if(e&&f.nodeName(h,"script")&&(!h.type||be.test(h.type)))e.push(h.parentNode?h.parentNode.removeChild(h):h);else{if(h.nodeType===1){var v=f.grep(h.getElementsByTagName("script"),g);j.splice.apply(j,[k+1,0].concat(v))}d.appendChild(h)}}}return j},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bp=/alpha\([^)]*\)/i,bq=/opacity=([^)]*)/,br=/([A-Z]|^ms)/g,bs=/^[\-+]?(?:\d*\.)?\d+$/i,bt=/^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,bu=/^([\-+])=([\-+.\de]+)/,bv=/^margin/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Top","Right","Bottom","Left"],by,bz,bA;f.fn.css=function(a,c){return f.access(this,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)},a,c,arguments.length>1)},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=by(a,"opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bu.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(by)return by(a,c)},swap:function(a,b,c){var d={},e,f;for(f in b)d[f]=a.style[f],a.style[f]=b[f];e=c.call(a);for(f in b)a.style[f]=d[f];return e}}),f.curCSS=f.css,c.defaultView&&c.defaultView.getComputedStyle&&(bz=function(a,b){var c,d,e,g,h=a.style;b=b.replace(br,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b))),!f.support.pixelMargin&&e&&bv.test(b)&&bt.test(c)&&(g=h.width,h.width=c,c=e.width,h.width=g);return c}),c.documentElement.currentStyle&&(bA=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f==null&&g&&(e=g[b])&&(f=e),bt.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),by=bz||bA,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){if(c)return a.offsetWidth!==0?bB(a,b,d):f.swap(a,bw,function(){return bB(a,b,d)})},set:function(a,b){return bs.test(b)?b+"px":b}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return bq.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bp,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bp.test(g)?g.replace(bp,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){return f.swap(a,{display:"inline-block"},function(){return b?by(a,"margin-right"):a.style.marginRight})}})}),f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)}),f.each({margin:"",padding:"",border:"Width"},function(a,b){f.cssHooks[a+b]={expand:function(c){var d,e=typeof c=="string"?c.split(" "):[c],f={};for(d=0;d<4;d++)f[a+bx[d]+b]=e[d]||e[d-2]||e[0];return f}}});var bC=/%20/g,bD=/\[\]$/,bE=/\r?\n/g,bF=/#.*$/,bG=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bH=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bI=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bJ=/^(?:GET|HEAD)$/,bK=/^\/\//,bL=/\?/,bM=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bN=/^(?:select|textarea)/i,bO=/\s+/,bP=/([?&])_=[^&]*/,bQ=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bR=f.fn.load,bS={},bT={},bU,bV,bW=["*/"]+["*"];try{bU=e.href}catch(bX){bU=c.createElement("a"),bU.href="",bU=bU.href}bV=bQ.exec(bU.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bR)return bR.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bM,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bN.test(this.nodeName)||bH.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bE,"\r\n")}}):{name:b.name,value:c.replace(bE,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b$(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b$(a,b);return a},ajaxSettings:{url:bU,isLocal:bI.test(bV[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bW},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bY(bS),ajaxTransport:bY(bT),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?ca(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cb(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bG.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bF,"").replace(bK,bV[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bO),d.crossDomain==null&&(r=bQ.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bV[1]&&r[2]==bV[2]&&(r[3]||(r[1]==="http:"?80:443))==(bV[3]||(bV[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),bZ(bS,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bJ.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bL.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bP,"$1_="+x);d.url=y+(y===d.url?(bL.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bW+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=bZ(bT,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)b_(g,a[g],c,e);return d.join("&").replace(bC,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cc=f.now(),cd=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cc++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=typeof b.data=="string"&&/^application\/x\-www\-form\-urlencoded/.test(b.contentType);if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(cd.test(b.url)||e&&cd.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(cd,l),b.url===j&&(e&&(k=k.replace(cd,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var ce=a.ActiveXObject?function(){for(var a in cg)cg[a](0,1)}:!1,cf=0,cg;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ch()||ci()}:ch,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,ce&&delete cg[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n);try{m.text=h.responseText}catch(a){}try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cf,ce&&(cg||(cg={},f(a).unload(ce)),cg[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var cj={},ck,cl,cm=/^(?:toggle|show|hide)$/,cn=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,co,cp=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cq;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(ct("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),(e===""&&f.css(d,"display")==="none"||!f.contains(d.ownerDocument.documentElement,d))&&f._data(d,"olddisplay",cu(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(ct("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(ct("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o,p,q;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]);if((k=f.cssHooks[g])&&"expand"in k){l=k.expand(a[g]),delete a[g];for(i in l)i in a||(a[i]=l[i])}}for(g in a){h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cu(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cm.test(h)?(q=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),q?(f._data(this,"toggle"+i,q==="show"?"hide":"show"),j[q]()):j[h]()):(m=cn.exec(h),n=j.cur(),m?(o=parseFloat(m[2]),p=m[3]||(f.cssNumber[i]?"":"px"),p!=="px"&&(f.style(this,i,(o||1)+p),n=(o||1)/j.cur()*n,f.style(this,i,n+p)),m[1]&&(o=(m[1]==="-="?-1:1)*o+n),j.custom(n,o,p)):j.custom(n,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:ct("show",1),slideUp:ct("hide",1),slideToggle:ct("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a){return a},swing:function(a){return-Math.cos(a*Math.PI)/2+.5}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cq||cr(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){f._data(e.elem,"fxshow"+e.prop)===b&&(e.options.hide?f._data(e.elem,"fxshow"+e.prop,e.start):e.options.show&&f._data(e.elem,"fxshow"+e.prop,e.end))},h()&&f.timers.push(h)&&!co&&(co=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cq||cr(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(co),co=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(cp.concat.apply([],cp),function(a,b){b.indexOf("margin")&&(f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)})}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cv,cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?cv=function(a,b,c,d){try{d=a.getBoundingClientRect()}catch(e){}if(!d||!f.contains(c,a))return d?{top:d.top,left:d.left}:{top:0,left:0};var g=b.body,h=cy(b),i=c.clientTop||g.clientTop||0,j=c.clientLeft||g.clientLeft||0,k=h.pageYOffset||f.support.boxModel&&c.scrollTop||g.scrollTop,l=h.pageXOffset||f.support.boxModel&&c.scrollLeft||g.scrollLeft,m=d.top+k-i,n=d.left+l-j;return{top:m,left:n}}:cv=function(a,b,c){var d,e=a.offsetParent,g=a,h=b.body,i=b.defaultView,j=i?i.getComputedStyle(a,null):a.currentStyle,k=a.offsetTop,l=a.offsetLeft;while((a=a.parentNode)&&a!==h&&a!==c){if(f.support.fixedPosition&&j.position==="fixed")break;d=i?i.getComputedStyle(a,null):a.currentStyle,k-=a.scrollTop,l-=a.scrollLeft,a===e&&(k+=a.offsetTop,l+=a.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(a.nodeName))&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),g=e,e=a.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&d.overflow!=="visible"&&(k+=parseFloat(d.borderTopWidth)||0,l+=parseFloat(d.borderLeftWidth)||0),j=d}if(j.position==="relative"||j.position==="static")k+=h.offsetTop,l+=h.offsetLeft;f.support.fixedPosition&&j.position==="fixed"&&(k+=Math.max(c.scrollTop,h.scrollTop),l+=Math.max(c.scrollLeft,h.scrollLeft));return{top:k,left:l}},f.fn.offset=function(a){if(arguments.length)return a===b?this:this.each(function(b){f.offset.setOffset(this,a,b)});var c=this[0],d=c&&c.ownerDocument;if(!d)return null;if(c===d.body)return f.offset.bodyOffset(c);return cv(c,d,d.documentElement)},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,c){var d=/Y/.test(c);f.fn[a]=function(e){return f.access(this,function(a,e,g){var h=cy(a);if(g===b)return h?c in h?h[c]:f.support.boxModel&&h.document.documentElement[e]||h.document.body[e]:a[e];h?h.scrollTo(d?f(h).scrollLeft():g,d?g:f(h).scrollTop()):a[e]=g},a,e,arguments.length,null)}}),f.each({Height:"height",Width:"width"},function(a,c){var d="client"+a,e="scroll"+a,g="offset"+a;f.fn["inner"+a]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,c,"padding")):this[c]():null},f.fn["outer"+a]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,c,a?"margin":"border")):this[c]():null},f.fn[c]=function(a){return f.access(this,function(a,c,h){var i,j,k,l;if(f.isWindow(a)){i=a.document,j=i.documentElement[d];return f.support.boxModel&&j||i.body&&i.body[d]||j}if(a.nodeType===9){i=a.documentElement;if(i[d]>=i[e])return i[d];return Math.max(a.body[e],i[e],a.body[g],i[g])}if(h===b){k=f.css(a,c),l=parseFloat(k);return f.isNumeric(l)?l:k}f(a).css(c,h)},c,a,arguments.length,null)}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
/* ===================================================
 * bootstrap-transition.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $(target).collapse(option)
    })
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu'))  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
(function() {

  log4javascript.getLogger().setLevel(log4javascript.Level.ALL);

}).call(this);

(function() {
  var log;

  log = log4javascript.getLogger();

  this.Utils = (function() {

    function Utils() {}

    Utils.isBitSet = function(n, bit) {
      if ((((n >>> (bit - 1)) >>> 0) % 2) === 0) {
        return false;
      } else {
        return true;
      }
    };

    Utils.setBit = function(n, bit) {
      return (n | 1 << (bit - 1)) >>> 0;
    };

    Utils.unsetBit = function(n, bit) {
      return (n ^ 1 << (bit - 1)) >>> 0;
    };

    Utils.toggleBit = function(n, bit) {
      if (this.isBitSet(n, bit)) {
        return this.unsetBit(n, bit);
      } else {
        return this.setBit(n, bit);
      }
    };

    Utils.getHighestBitSet = function(n, from, to) {
      var bit, _i;
      for (bit = _i = to; to <= from ? _i <= from : _i >= from; bit = to <= from ? ++_i : --_i) {
        if (this.isBitSet(n, bit) === true) {
          return bit;
        }
      }
      return void 0;
    };

    Utils.getLowestBitSet = function(n, from, to) {
      var bit, _i;
      for (bit = _i = from; from <= to ? _i <= to : _i >= to; bit = from <= to ? ++_i : --_i) {
        if (this.isBitSet(n, bit) === true) {
          return bit;
        }
      }
      return void 0;
    };

    Utils.extractNum = function(n, from, to) {
      var bit, num, _i;
      num = 0;
      for (bit = _i = to; to <= from ? _i <= from : _i >= from; bit = to <= from ? ++_i : --_i) {
        if (this.isBitSet(n, bit) === true) {
          num = this.setBit(num, bit - from + 1);
        }
      }
      return num;
    };

    Utils.isNegative = function(n) {
      return this.isBitSet(n, 32);
    };

    Utils.randomBitSequence = function(n) {
      return Math.floor(Math.random() * Math.pow(2, n));
    };

    Utils.getLogger = function(prefix) {
      return {
        prefixLogging: function(logfun, invoker, callback) {
          var msg;
          if (callback != null) {
            msg = callback.call(invoker);
          } else {
            callback = invoker;
            msg = callback();
          }
          return logfun.call(log, '[' + prefix + '] ' + msg);
        },
        trace: function(invoker, callback) {
          if (log.isTraceEnabled()) {
            return this.prefixLogging(log.trace, invoker, callback);
          }
        },
        debug: function(invoker, callback) {
          if (log.isDebugEnabled()) {
            return this.prefixLogging(log.debug, invoker, callback);
          }
        },
        info: function(invoker, callback) {
          if (log.isInfoEnabled()) {
            return this.prefixLogging(log.info, invoker, callback);
          }
        },
        warn: function(invoker, callback) {
          if (log.isWarnEnabled()) {
            return this.prefixLogging(log.warn, invoker, callback);
          }
        },
        error: function(invoker, callback) {
          if (log.isErrorEnabled()) {
            return this.prefixLogging(log.error, invoker, callback);
          }
        },
        fatal: function(invoker, callback) {
          if (log.isFatalEnabled()) {
            return this.prefixLogging(log.fatal, invoker, callback);
          }
        }
      };
    };

    Utils.decToHex = function(decimal, chars) {
      return (decimal + Math.pow(16, chars)).toString(16).slice(-chars).toUpperCase();
    };

    Utils.decToBin = function(decimal, chars) {
      return (decimal + Math.pow(2, chars)).toString(2).slice(-chars);
    };

    Utils.sanitizeNum = function(num, mask) {
      if (isNaN(num)) {
        num = 0;
      }
      num = (num & mask) >>> 0;
      return num;
    };

    Utils.sanitizeMicrocode = function(mc) {
      mc.mode = this.sanitizeNum(mc.mode, 0x3);
      mc.mcnext = this.sanitizeNum(mc.mcnext, 0x3F);
      mc.alufc = this.sanitizeNum(mc.alufc, 0x7F);
      mc.xbus = this.sanitizeNum(mc.xbus, 0xFFFFFFFF);
      mc.ybus = this.sanitizeNum(mc.ybus, 0xFFFFFFFF);
      mc.zbus = this.sanitizeNum(mc.zbus, 0xFFFFFFFF);
      mc.ioswitch = this.sanitizeNum(mc.ioswitch, 0xFFFFFFFF);
      mc.byte = this.sanitizeNum(mc.byte, 0x3);
      return mc;
    };

    Utils.functionCodeToText = function(functionCode) {
      var copyCC, fc, result;
      copyCC = Utils.isBitSet(functionCode, 7);
      if (Utils.isBitSet(functionCode, 7)) {
        fc = Utils.unsetBit(functionCode, 7);
      } else {
        fc = functionCode;
      }
      switch (fc) {
        case 0:
          result = "NOP";
          break;
        case 1:
          result = "-Z -> Z";
          break;
        case 2:
          result = "X -> Z";
          break;
        case 3:
          result = "-X -> Z";
          break;
        case 4:
          result = "Y -> Z";
          break;
        case 5:
          result = "-Y -> Z";
          break;
        case 6:
          result = "Y -> Z, X <-> Y";
          break;
        case 7:
          result = "X -> Z, X <-> Y";
          break;
        case 8:
          result = "Y -> Z, Y -> X";
          break;
        case 9:
          result = "X+1 -> Z";
          break;
        case 10:
          result = "X-1 -> Z";
          break;
        case 11:
          result = "X+Y -> Z";
          break;
        case 12:
          result = "X-Y -> Z";
          break;
        case 13:
          result = "X*Y -> Z";
          break;
        case 14:
          result = "X/Y -> Z";
          break;
        case 15:
          result = "X%Y -> Z";
          break;
        case 16:
          result = "X SAL Y -> Z";
          break;
        case 17:
          result = "X SAR Y -> Z";
          break;
        case 18:
          result = "CMPa X Y -> Z";
          break;
        case 19:
          result = "X AND Y -> Z";
          break;
        case 20:
          result = "X NAND Y -> Z";
          break;
        case 21:
          result = "X OR Y -> Z";
          break;
        case 22:
          result = "X NOR Y -> Z";
          break;
        case 23:
          result = "X NOR Y -> Z";
          break;
        case 24:
          result = "X NXOR Y -> Z";
          break;
        case 25:
          result = "X SLL Y -> Z";
          break;
        case 26:
          result = "X SLR Y -> Z";
          break;
        case 27:
          result = "CMPl X Y -> Z";
          break;
        case 28:
          result = "0 -> X";
          break;
        case 29:
          result = "0xFFFFFFFF -> X";
          break;
        case 30:
          result = "0 -> Y";
          break;
        case 31:
          result = "0xFFFFFFFF -> Y";
          break;
        default:
          log.debug(function() {
            return "fc else...";
          });
          if (fc >= 32 && fc < 48) {
            result = "" + (Utils.decToHex(fc - 32, 8)) + " -> X, X -> Z";
          } else if (fc >= 48 && fc < 64) {
            result = "" + (Utils.decToHex(fc - 42, 8)) + " -> Y, Y -> Z";
          }
      }
      if (copyCC === true) {
        result += ", CC";
      }
      return result;
    };

    return Utils;

  })();

}).call(this);

(function() {

  this.MicrocodeParser = (function() {

    function MicrocodeParser() {}

    MicrocodeParser.parseGetPhase = function(mc) {
      var actions, toXFrom, toYFrom;
      actions = [];
      if (Utils.extractNum(mc.ioswitch, 1, 2) === 1) {
        actions.push("compute ram");
      }
      toXFrom = Utils.getLowestBitSet(mc.xbus, 1, 8);
      if (toXFrom != null) {
        toXFrom = 8 - toXFrom;
      }
      if (toXFrom != null) {
        actions.push("push alu.X registers." + toXFrom);
      }
      toYFrom = Utils.getLowestBitSet(mc.ybus, 1, 8);
      if (toYFrom != null) {
        toYFrom = 8 - toYFrom;
      }
      if (toYFrom != null) {
        actions.push("push alu.Y registers." + toYFrom);
      }
      if (Utils.isBitSet(mc.ioswitch, 5) === true) {
        actions.push("push alu.Y ram.MDR");
      }
      if (Utils.isBitSet(mc.ioswitch, 4) === true) {
        actions.push("push mac.MCOP ram.MDR");
      }
      actions.push("pushval mac.mode " + mc.mode);
      actions.push("pushval mac.MCN " + mc.mcnext);
      actions.push("pushval mac.MASK " + (Utils.extractNum(mc.mcnext, 1, 4)));
      actions.push("pushval alu.FC " + mc.alufc);
      actions.push("push mac.MCAR rom.MCAR");
      return actions;
    };

    MicrocodeParser.parseCalcPhase = function(mc) {
      var actions;
      actions = [];
      actions.push("compute alu");
      actions.push("push mac.CC alu.CC");
      actions.push("compute mac");
      if (Utils.isBitSet(mc.alufc, 7)) {
        action.push("info update cc");
      }
      return actions;
    };

    MicrocodeParser.parsePutPhase = function(mc) {
      var actions, bit, _i;
      actions = [];
      if (Utils.isBitSet(mc.ioswitch, 8) === true) {
        actions.push("push ram.MAR alu.Z");
      }
      if (Utils.isBitSet(mc.ioswitch, 7) === true) {
        actions.push("push ram.MDR alu.Z");
      }
      if (Utils.isBitSet(mc.ioswitch, 6) === true) {
        actions.push("push alu.Z ram.MDR");
      }
      if (Utils.isBitSet(mc.ioswitch, 3) === true) {
        actions.push("push alu.Z ram.MAR");
      }
      if (Utils.extractNum(mc.ioswitch, 1, 2) === 2) {
        actions.push("compute ram");
      }
      for (bit = _i = 1; _i <= 8; bit = ++_i) {
        if (Utils.isBitSet(mc.zbus, bit) === true) {
          actions.push("push registers." + (8 - bit) + " alu.Z");
        }
      }
      actions.push("push rom.MCAR mac.MCARNEXT");
      actions.push("next");
      return actions;
    };

    return MicrocodeParser;

  })();

}).call(this);

(function() {

  this.AluListener = (function() {

    function AluListener(onSetX, onSetY, onSetZ, onSetCC, onSetFlags, onsetFC) {
      this.onSetX = onSetX != null ? onSetX : void 0;
      this.onSetY = onSetY != null ? onSetY : void 0;
      this.onSetZ = onSetZ != null ? onSetZ : void 0;
      this.onSetCC = onSetCC != null ? onSetCC : void 0;
      this.onSetFlags = onSetFlags != null ? onSetFlags : void 0;
      this.onsetFC = onsetFC != null ? onsetFC : void 0;
    }

    AluListener.prototype.setOnSetX = function(f) {
      return this.onSetX = f;
    };

    AluListener.prototype.setOnSetY = function(f) {
      return this.onSetY = f;
    };

    AluListener.prototype.setOnSetZ = function(f) {
      return this.onSetZ = f;
    };

    AluListener.prototype.setOnSetCC = function(f) {
      return this.onSetCC = f;
    };

    AluListener.prototype.setOnSetFlags = function(f) {
      return this.onSetFlags = f;
    };

    AluListener.prototype.setOnSetFC = function(f) {
      return this.onSetFC = f;
    };

    return AluListener;

  })();

}).call(this);

(function() {

  this.RomListener = (function() {

    function RomListener(onSetMc, onSetMcar) {
      this.onSetMc = onSetMc != null ? onSetMc : void 0;
      this.onSetMcar = onSetMcar != null ? onSetMcar : void 0;
    }

    RomListener.prototype.setOnSetMc = function(f) {
      return this.onSetMc = f;
    };

    RomListener.prototype.setOnSetMcar = function(f) {
      return this.onSetMcar = f;
    };

    return RomListener;

  })();

}).call(this);

(function() {

  this.MacListener = (function() {

    function MacListener(onSetMode, onSetCC, onSetMask, onSetTimes4, onSetMcop, onSetMcarNext, onSetMcn, onSetMcar) {
      this.onSetMode = onSetMode != null ? onSetMode : void 0;
      this.onSetCC = onSetCC != null ? onSetCC : void 0;
      this.onSetMask = onSetMask != null ? onSetMask : void 0;
      this.onSetTimes4 = onSetTimes4 != null ? onSetTimes4 : void 0;
      this.onSetMcop = onSetMcop != null ? onSetMcop : void 0;
      this.onSetMcarNext = onSetMcarNext != null ? onSetMcarNext : void 0;
      this.onSetMcn = onSetMcn != null ? onSetMcn : void 0;
      this.onSetMcar = onSetMcar != null ? onSetMcar : void 0;
    }

    MacListener.prototype.setOnSetMode = function(f) {
      return this.onSetMode = f;
    };

    MacListener.prototype.setOnSetCC = function(f) {
      return this.onSetCC = f;
    };

    MacListener.prototype.setOnSetMask = function(f) {
      return this.onSetMask = f;
    };

    MacListener.prototype.setOnSetTimes4 = function(f) {
      return this.onSetTimes4 = f;
    };

    MacListener.prototype.setOnSetMcop = function(f) {
      return this.onSetMcop = f;
    };

    MacListener.prototype.setOnSetMcarNext = function(f) {
      return this.onSetMcarNext = f;
    };

    MacListener.prototype.setOnSetMcn = function(f) {
      return this.onSetMcn = f;
    };

    MacListener.prototype.setOnSetMcar = function(f) {
      return this.onSetMcar = f;
    };

    return MacListener;

  })();

}).call(this);

(function() {

  this.CpuListener = (function() {

    function CpuListener(onSignal, onNextPhase, onSetRegister, onSetMicrocode) {
      this.onSignal = onSignal != null ? onSignal : void 0;
      this.onNextPhase = onNextPhase != null ? onNextPhase : void 0;
      this.onSetRegister = onSetRegister != null ? onSetRegister : void 0;
      this.onSetMicrocode = onSetMicrocode != null ? onSetMicrocode : void 0;
    }

    CpuListener.prototype.setOnSignal = function(f) {
      return this.onSignal = f;
    };

    CpuListener.prototype.setOnNextPhase = function(f) {
      return this.onNextPhase = f;
    };

    CpuListener.prototype.setOnSetRegister = function(f) {
      return this.onSetRegister = f;
    };

    CpuListener.prototype.setOnSetMicrocode = function(f) {
      return this.onSetMicrocode = f;
    };

    return CpuListener;

  })();

}).call(this);

(function() {

  this.RamListener = (function() {

    function RamListener(onSetFormat, onSetMode, onSetMar, onSetMdr, onSetByte) {
      this.onSetFormat = onSetFormat != null ? onSetFormat : void 0;
      this.onSetMode = onSetMode != null ? onSetMode : void 0;
      this.onSetMar = onSetMar != null ? onSetMar : void 0;
      this.onSetMdr = onSetMdr != null ? onSetMdr : void 0;
      this.onSetByte = onSetByte != null ? onSetByte : void 0;
    }

    RamListener.prototype.setOnSetFormat = function(f) {
      return this.onSetFormat = f;
    };

    RamListener.prototype.setOnSetMode = function(f) {
      return this.onSetMode = f;
    };

    RamListener.prototype.setOnSetMar = function(f) {
      return this.onSetMar = f;
    };

    RamListener.prototype.setOnSetMdr = function(f) {
      return this.onSetMdr = f;
    };

    RamListener.prototype.setOnSetByte = function(f) {
      return this.onSetByte = f;
    };

    return RamListener;

  })();

}).call(this);

(function() {

  this.Mac = (function() {

    function Mac(macListeners) {
      this.macListeners = macListeners != null ? macListeners : [];
      this.log = Utils.getLogger("MAC");
      this.reset();
    }

    Mac.prototype.setMacListeners = function(l) {
      return this.macListeners = l;
    };

    Mac.prototype.getMcarNext = function() {
      return this.mcarNextRegister;
    };

    Mac.prototype.setMode = function(val) {
      val = Utils.sanitizeNum(val, 0x3);
      this.mode = val;
      this.updateTimes4();
      return this.notifySetMode(this.mode);
    };

    Mac.prototype.setCC = function(val) {
      val = Utils.sanitizeNum(val, 0xF);
      this.ccRegister = val;
      this.updateTimes4();
      return this.notifySetCC(this.ccRegister);
    };

    Mac.prototype.setMask = function(val) {
      val = Utils.sanitizeNum(val, 0xF);
      this.maskRegister = val;
      this.updateTimes4();
      return this.notifySetMask(this.maskRegister);
    };

    Mac.prototype.setTimes4 = function(val) {
      val = Utils.sanitizeNum(val, 0x1);
      this.times4 = val;
      return this.notifySetTimes4(this.times4);
    };

    Mac.prototype.setMcop = function(val) {
      val = Utils.sanitizeNum(val, 0xFF);
      this.mcopRegister = val;
      this.updateTimes4();
      return this.notifySetMcop(this.mcopRegister);
    };

    Mac.prototype.setMcarNext = function(val) {
      val = Utils.sanitizeNum(val, 0xFFF);
      this.mcarNextRegister = val;
      this.updateTimes4();
      return this.notifySetMcarNext(this.mcarNextRegister);
    };

    Mac.prototype.setMcn = function(val) {
      var mask;
      val = Utils.sanitizeNum(val, 0x3F);
      this.mcnRegister = val;
      mask = Utils.extractNum(val, 1, 4);
      this.setMask(mask);
      this.updateTimes4();
      return this.notifySetMcn(this.mcnRegister);
    };

    Mac.prototype.setMcar = function(val) {
      val = Utils.sanitizeNum(val, 0xFFF);
      this.mcarRegister = val;
      this.updateTimes4();
      return this.notifySetMcar(this.mcarRegister);
    };

    Mac.prototype.updateTimes4 = function() {
      var jumpMode;
      switch (this.mode) {
        case 3:
          jumpMode = Utils.extractNum(this.mcnRegister, 5, 6);
          switch (jumpMode) {
            case 1:
              if (((this.maskRegister & this.ccRegister) >>> 0) !== 0) {
                return this.setTimes4(1);
              } else {
                return this.setTimes4(0);
              }
              break;
            case 2:
              if (((this.maskRegister & this.ccRegister) >>> 0) === 0) {
                return this.setTimes4(1);
              } else {
                return this.setTimes4(0);
              }
              break;
            default:
              return this.setTimes4(0);
          }
          break;
        default:
          return this.setTimes4(0);
      }
    };

    Mac.prototype.compute = function() {
      var jumpMode;
      switch (this.mode) {
        case 0:
          return this.setMcarNext(4 * this.mcnRegister);
        case 1:
          return this.setMcarNext(this.mcarRegister + 1 + 4 * this.mcnRegister);
        case 2:
          return this.setMcarNext(this.mcarRegister + 1 - 4 * this.mcnRegister);
        case 3:
          jumpMode = Utils.extractNum(this.mcnRegister, 5, 6);
          switch (jumpMode) {
            case 0:
              return this.setMcarNext(4 * this.mcopRegister);
            case 1:
              if (((this.maskRegister & this.ccRegister) >>> 0) !== 0) {
                return this.setMcarNext(4 * this.mcopRegister);
              } else {
                return this.setMcarNext(this.mcarRegister + 1);
              }
              break;
            case 2:
              if (((this.maskRegister & this.ccRegister) >>> 0) === 0) {
                return this.setMcarNext(4 * this.mcopRegister);
              } else {
                return this.setMcarNext(this.mcarRegister + 1);
              }
              break;
            case 3:
              return this.setMcarNext(this.mcarRegister + 1);
          }
      }
    };

    Mac.prototype.notifySetMode = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMode === "function" ? listener.onSetMode(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.notifySetCC = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetCC === "function" ? listener.onSetCC(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.notifySetMask = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMask === "function" ? listener.onSetMask(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.notifySetTimes4 = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetTimes4 === "function" ? listener.onSetTimes4(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.notifySetMcop = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMcop === "function" ? listener.onSetMcop(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.notifySetMcarNext = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMcarNext === "function" ? listener.onSetMcarNext(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.notifySetMcn = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMcn === "function" ? listener.onSetMcn(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.notifySetMcar = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.macListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMcar === "function" ? listener.onSetMcar(val) : void 0);
      }
      return _results;
    };

    Mac.prototype.reset = function() {
      this.setMode(0);
      this.setCC(Utils.randomBitSequence(4));
      this.setMask(0);
      this.setTimes4(0);
      this.setMcop(0);
      this.setMcarNext(Utils.randomBitSequence(12));
      this.setMcn(0);
      return this.setMcar(Utils.randomBitSequence(12));
    };

    return Mac;

  })();

}).call(this);

(function() {

  this.Alu = (function() {

    function Alu(aluListeners) {
      this.aluListeners = aluListeners != null ? aluListeners : [];
      this.log = Utils.getLogger("Alu");
      this.log.debug(function() {
        return "constructor start";
      });
      this.log.debug(function() {
        return "creating Alu";
      });
      this.reset();
      this.log.debug(function() {
        return "constructor done";
      });
    }

    Alu.prototype.setAluListeners = function(l) {
      this.log.debug(function() {
        return "setting alu listeners to " + l;
      });
      return this.aluListeners = l;
    };

    Alu.prototype.getXRegister = function() {
      return this.xRegister;
    };

    Alu.prototype.getYRegister = function() {
      return this.yRegister;
    };

    Alu.prototype.getZRegister = function() {
      return this.zRegister;
    };

    Alu.prototype.getCCRegister = function() {
      return this.ccRegister;
    };

    Alu.prototype.getCCFlags = function() {
      return this.ccFlags;
    };

    Alu.prototype.getFunctionCode = function() {
      return this.functionCode;
    };

    Alu.prototype.getState = function() {
      return {
        x: this.xRegister,
        y: this.yRegister,
        z: this.zRegister,
        cc: this.ccRegister,
        ccFlags: this.ccFlags,
        fCode: this.functionCode
      };
    };

    Alu.prototype.setXRegister = function(val) {
      val = Utils.sanitizeNum(val, 0xFFFFFFFF);
      this.xRegister = val;
      return this.notifyX(this.xRegister);
    };

    Alu.prototype.setYRegister = function(val) {
      val = Utils.sanitizeNum(val, 0xFFFFFFFF);
      this.yRegister = val;
      return this.notifyY(this.yRegister);
    };

    Alu.prototype.setZRegister = function(val) {
      val = Utils.sanitizeNum(val, 0xFFFFFFFF);
      this.zRegister = val;
      return this.notifyZ(this.zRegister);
    };

    Alu.prototype.setCCRegister = function(val) {
      val = Utils.sanitizeNum(val, 0xF);
      this.ccRegister = val;
      return this.notifyCC(this.ccRegister);
    };

    Alu.prototype.setCCFlags = function(val) {
      val = Utils.sanitizeNum(val, 0xF);
      this.ccFlags = val;
      return this.notifyFlags(this.ccFlags);
    };

    Alu.prototype.setFunctionCode = function(val) {
      val = Utils.sanitizeNum(val, 0x7F);
      this.functionCode = val;
      return this.notifyFC(this.functionCode);
    };

    Alu.prototype.compute = function() {
      var copyCC, fc, originalXvalue, shift, x, y, z,
        _this = this;
      this.log.debug(function() {
        return "computing functionCode=" + _this.functionCode;
      });
      copyCC = Utils.isBitSet(this.functionCode, 7);
      if (Utils.isBitSet(this.functionCode, 7)) {
        fc = Utils.unsetBit(this.functionCode, 7);
      } else {
        fc = this.functionCode;
      }
      this.log.debug(function() {
        return "fc is functionCode=" + fc;
      });
      switch (fc) {
        case 1:
          z = Utils.isNegative(this.zRegister) ? this.zRegister << 0 : this.zRegister;
          this.setZRegister((-z & 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 2:
          this.setZRegister(this.xRegister);
          this.updateCCFlags();
          break;
        case 3:
          x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
          this.setZRegister((-x & 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 4:
          this.setZRegister(this.yRegister);
          this.updateCCFlags();
          break;
        case 5:
          y = Utils.isNegative(this.yxRegister) ? this.yRegister << 0 : this.yRegister;
          this.setZRegister((-y & 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 6:
          originalXvalue = this.xRegister;
          this.setZRegister(this.yRegister);
          this.setXRegister(this.yRegister);
          this.setYRegister(originalXvalue);
          this.updateCCFlags();
          break;
        case 7:
          originalXvalue = this.xRegister;
          this.setZRegister(this.xRegister);
          this.setXRegister(this.yRegister);
          this.setYRegister(originalXvalue);
          this.updateCCFlags();
          break;
        case 8:
          this.setXRegister(this.yRegister);
          this.setZRegister(this.yRegister);
          this.updateCCFlags();
          break;
        case 9:
          if (this.xRegister === 0x7FFFFFFF) {
            this.setZRegister(0x80000000);
            this.setCCFlags(0x5);
          } else {
            x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
            this.setZRegister(((x + 1) & 0xFFFFFFFF) >>> 0);
            this.updateCCFlags();
          }
          break;
        case 10:
          if (this.xRegister === 0x80000000) {
            this.setZRegister(0x7FFFFFFF);
            this.setCCFlags(0x3);
          } else {
            x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
            this.setZRegister(((x - 1) & 0xFFFFFFFF) >>> 0);
            this.updateCCFlags();
          }
          break;
        case 11:
          this.log.debug(function() {
            return "adding";
          });
          x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          this.setZRegister(((x + y) & 0xFFFFFFFF) >>> 0);
          if (x + y > 0x7FFFFFFF) {
            this.setCCFlags(0x5);
          } else if (x + y < (0x80000000 << 0)) {
            this.setCCFlags(0x3);
          } else {
            this.updateCCFlags();
          }
          break;
        case 12:
          x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          this.setZRegister(((x - y) & 0xFFFFFFFF) >>> 0);
          if (x - y > 0x7FFFFFFF) {
            this.setCCFlags(0x5);
          } else if (x - y < (0x80000000 << 0)) {
            this.setCCFlags(0x3);
          } else {
            this.updateCCFlags();
          }
          break;
        case 13:
          x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          this.setZRegister(((x * y) & 0xFFFFFFFF) >>> 0);
          if (x * y > 0x7FFFFFFF) {
            this.setCCFlags(0x5);
          } else if (x * y < (0x80000000 << 0)) {
            this.setCCFlags(0x3);
          } else {
            this.updateCCFlags();
          }
          break;
        case 14:
          x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          if (y === 0) {
            this.setCCFlags(Utils.setBit(this.ccFlags, 1));
          } else {
            this.setZRegister(((Math.floor(x / y)) & 0xFFFFFFFF) >>> 0);
            this.updateCCFlags();
          }
          break;
        case 15:
          x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          if (y === 0) {
            this.setCCFlags(Utils.setBit(this.ccFlags, 1));
          } else {
            this.setZRegister(((x % y) & 0xFFFFFFFF) >>> 0);
            this.updateCCFlags();
          }
          break;
        case 16:
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          this.setZRegister(((this.xRegister << (y % 32)) & 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 17:
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          this.setZRegister(((this.xRegister >>> (y % 32)) & 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 18:
          x = Utils.isNegative(this.xRegister) ? this.xRegister << 0 : this.xRegister;
          y = Utils.isNegative(this.yRegister) ? this.yRegister << 0 : this.yRegister;
          this.setZRegister(((x - y) & 0xFFFFFFFF) >>> 0);
          if (x - y > 0x7FFFFFFF) {
            this.setCCFlags(0x5);
          } else if (x - y < (0x80000000 << 0)) {
            this.setCCFlags(0x3);
          } else {
            this.updateCCFlags();
          }
          break;
        case 19:
          this.setZRegister((this.xRegister & this.yRegister) >>> 0);
          this.updateCCFlags();
          break;
        case 20:
          this.setZRegister(((this.xRegister & this.yRegister) ^ 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 21:
          this.setZRegister((this.xRegister | this.yRegister) >>> 0);
          this.updateCCFlags();
          break;
        case 22:
          this.setZRegister(((this.xRegister | this.yRegister) ^ 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 23:
          this.setZRegister((this.xRegister ^ this.yRegister) >>> 0);
          this.updateCCFlags();
          break;
        case 24:
          this.setZRegister(((this.xRegister ^ this.yRegister) ^ 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 25:
          shift = this.yRegister % 32;
          this.log.debug(this, function() {
            return "sl is " + (this.xRegister >>> (32 - shift));
          });
          this.setZRegister(((this.xRegister << shift) | (this.xRegister >>> (32 - shift))) >>> 0);
          this.updateCCFlags();
          break;
        case 26:
          shift = this.yRegister % 32;
          this.setZRegister(((this.xRegister << (32 - shift)) | (this.xRegister >>> shift)) >>> 0);
          this.updateCCFlags();
          break;
        case 27:
          this.setZRegister(((this.xRegister - this.yRegister) & 0xFFFFFFFF) >>> 0);
          this.updateCCFlags();
          break;
        case 28:
          this.setXRegister(0);
          break;
        case 29:
          this.setXRegister(0xFFFFFFFF);
          break;
        case 30:
          this.setYRegister(0);
          break;
        case 31:
          this.setYRegister(0xFFFFFFFF);
          break;
        default:
          this.log.debug(function() {
            return "fc else...";
          });
          if (fc >= 32 && fc < 48) {
            this.setXRegister(fc - 32);
            this.setZRegister(this.xRegister);
            this.updateCCFlags();
          } else if (fc >= 48 && fc < 64) {
            this.setYRegister(fc - 48);
            this.setZRegister(this.yRegister);
            this.updateCCFlags();
          }
      }
      if (copyCC === true) {
        return this.setCCRegister(this.ccFlags);
      }
    };

    Alu.prototype.updateCCFlags = function() {
      if (this.zRegister === 0) {
        return this.setCCFlags(8);
      } else {
        if (Utils.isBitSet(this.zRegister, 32) === true) {
          return this.setCCFlags(2);
        } else {
          return this.setCCFlags(4);
        }
      }
    };

    Alu.prototype.notifyX = function(x) {
      var listener, _i, _len, _ref, _results;
      this.log.debug(function() {
        return "notify X for  alu listeners " + this.aluListeners;
      });
      _ref = this.aluListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetX === "function" ? listener.onSetX(x) : void 0);
      }
      return _results;
    };

    Alu.prototype.notifyY = function(x) {
      var listener, _i, _len, _ref, _results;
      _ref = this.aluListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetY === "function" ? listener.onSetY(x) : void 0);
      }
      return _results;
    };

    Alu.prototype.notifyZ = function(x) {
      var listener, _i, _len, _ref, _results;
      _ref = this.aluListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetZ === "function" ? listener.onSetZ(x) : void 0);
      }
      return _results;
    };

    Alu.prototype.notifyCC = function(x) {
      var listener, _i, _len, _ref, _results;
      _ref = this.aluListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetCC === "function" ? listener.onSetCC(x) : void 0);
      }
      return _results;
    };

    Alu.prototype.notifyFlags = function(x) {
      var listener, _i, _len, _ref, _results;
      _ref = this.aluListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetFlags === "function" ? listener.onSetFlags(x) : void 0);
      }
      return _results;
    };

    Alu.prototype.notifyFC = function(x) {
      var listener, _i, _len, _ref, _results;
      _ref = this.aluListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetFC === "function" ? listener.onSetFC(x) : void 0);
      }
      return _results;
    };

    Alu.prototype.reset = function() {
      this.log.debug(function() {
        return "reset alu";
      });
      this.setFunctionCode(0);
      this.setXRegister(Utils.randomBitSequence(32));
      this.setYRegister(Utils.randomBitSequence(32));
      this.setZRegister(Utils.randomBitSequence(32));
      this.setCCRegister(Utils.randomBitSequence(4));
      return this.setCCFlags(Utils.randomBitSequence(4));
    };

    return Alu;

  })();

}).call(this);

(function() {

  this.Ram = (function() {

    function Ram(eventListeners) {
      this.eventListeners = eventListeners != null ? eventListeners : [];
      this.log = Utils.getLogger("Ram");
      this.reset();
      this.memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    Ram.prototype.setMode = function(m) {
      this.mode = m;
      return this.notifyMode(m);
    };

    Ram.prototype.setFormat = function(f) {
      this.format = f;
      this.notifyFormat(f);
      return this.setMdr(this.mdr);
    };

    Ram.prototype.setMar = function(value) {
      value = Utils.sanitizeNum(value, 0x7FF);
      this.mar = value;
      return this.notifyMar(this.mar);
    };

    Ram.prototype.setMdr = function(m) {
      if (isNaN(m)) {
        m = 0;
      }
      this.mdr = Utils.extractNum(m, 1, 1 + (this.format + 1) * 8);
      return this.notifyMdr(this.mdr);
    };

    Ram.prototype.getMdr = function() {
      return this.mdr;
    };

    Ram.prototype.getMar = function() {
      return this.mar;
    };

    Ram.prototype.compute = function() {
      var _this = this;
      this.log.debug(function() {
        return "ram mode is";
      });
      switch (this.mode) {
        case 1:
          this.log.debug(function() {
            return "ram is reading...";
          });
          return this.read();
        case 2:
          this.log.debug(function() {
            return "ram is writing...";
          });
          return this.write();
      }
    };

    Ram.prototype.read = function() {
      var mem;
      mem = 0;
      switch (this.format) {
        case 0:
          mem = this.getByte(this.mar);
          break;
        case 1:
          mem = ((this.getByte(this.mar) << 8) | this.getByte(this.mar + 1)) >>> 0;
          break;
        case 2:
          mem = this.getByte(this.mar) << 16;
          mem |= this.getByte(this.mar + 1) << 8;
          mem |= this.getByte(this.mar + 2);
          mem = mem >>> 0;
          break;
        case 3:
          mem = this.getByte(this.mar) << 24;
          mem |= this.getByte(this.mar + 1) << 16;
          mem |= this.getByte(this.mar + 2) << 8;
          mem |= this.getByte(this.mar + 3);
          mem |= mem >>> 0;
      }
      return this.setMdr(mem);
    };

    Ram.prototype.write = function() {
      var at, _i, _ref, _results;
      _results = [];
      for (at = _i = 0, _ref = this.format; 0 <= _ref ? _i <= _ref : _i >= _ref; at = 0 <= _ref ? ++_i : --_i) {
        this.log.debug(this, function() {
          return "l: " + ((this.format - at) * 8 + 1) + " r: " + ((this.format - at) * 8 + 8);
        });
        this.log.debug(this, function() {
          return "writing @" + (this.mar + at) + " " + (Utils.extractNum(this.mdr, (this.format - at) * 8 + 1, (this.format - at) * 8 + 8).toString(16));
        });
        _results.push(this.setByte(this.mar + at, Utils.extractNum(this.mdr, (this.format - at) * 8 + 1, (this.format - at) * 8 + 8)));
      }
      return _results;
    };

    Ram.prototype.getByte = function(at) {
      var byte, index, mem, offset;
      index = Math.floor(at / 4);
      offset = at % 4;
      mem = this.memory[index];
      byte = 0;
      switch (offset) {
        case 0:
          byte = Utils.extractNum(mem, 25, 32);
          break;
        case 1:
          byte = Utils.extractNum(mem, 17, 24);
          break;
        case 2:
          byte = Utils.extractNum(mem, 9, 16);
          break;
        case 3:
          byte = Utils.extractNum(mem, 1, 8);
      }
      return byte;
    };

    Ram.prototype.setByte = function(at, val) {
      var bit, index, offset, _i;
      val = Utils.sanitizeNum(val, 0xFF);
      index = Math.floor(at / 4);
      offset = at % 4;
      for (bit = _i = 1; _i <= 8; bit = ++_i) {
        if (Utils.isBitSet(val, bit) === true) {
          this.memory[index] = Utils.setBit(this.memory[index], bit + 8 * (3 - offset));
        }
      }
      return this.notifySetByte(at, val);
    };

    Ram.prototype.setRamListeners = function(listeners) {
      return this.eventListeners = listeners;
    };

    Ram.prototype.notifySetByte = function(at, val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.eventListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetByte === "function" ? listener.onSetByte(at, val) : void 0);
      }
      return _results;
    };

    Ram.prototype.notifyMode = function(m) {
      var listener, _i, _len, _ref, _results;
      _ref = this.eventListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMode === "function" ? listener.onSetMode(m) : void 0);
      }
      return _results;
    };

    Ram.prototype.notifyFormat = function(m) {
      var listener, _i, _len, _ref, _results;
      _ref = this.eventListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetFormat === "function" ? listener.onSetFormat(m) : void 0);
      }
      return _results;
    };

    Ram.prototype.notifyMar = function(m) {
      var listener, _i, _len, _ref, _results;
      _ref = this.eventListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMar === "function" ? listener.onSetMar(m) : void 0);
      }
      return _results;
    };

    Ram.prototype.notifyMdr = function(m) {
      var listener, _i, _len, _ref, _results;
      _ref = this.eventListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMdr === "function" ? listener.onSetMdr(m) : void 0);
      }
      return _results;
    };

    Ram.prototype.reset = function() {
      this.setMode(0);
      this.setFormat(0);
      this.setMar(Utils.randomBitSequence(12));
      return this.setMdr(0);
    };

    return Ram;

  })();

}).call(this);

(function() {

  this.Rom = (function() {

    function Rom(romListeners) {
      this.romListeners = romListeners != null ? romListeners : [];
      this.reset();
      this.memory = [];
    }

    Rom.prototype.setMcar = function(m) {
      m = Utils.sanitizeNum(m, 0xFFF);
      this.mcar = m;
      return this.notifySetMcar(m);
    };

    Rom.prototype.getMcar = function() {
      return this.mcar;
    };

    Rom.prototype.setMicrocode = function(at, mc) {
      mc = Utils.sanitizeMicrocode(mc);
      this.memory[at] = mc;
      return this.notifySetMc(at, mc);
    };

    Rom.prototype.getMicrocode = function(at) {
      var mc;
      mc = {
        mode: 0,
        mcnext: 0,
        alufc: 0,
        xbus: 0,
        ybus: 0,
        zbus: 0,
        ioswitch: 0,
        byte: 0,
        mnemonic: "",
        remarks: ""
      };
      if (this.memory[at] != null) {
        mc = this.memory[at];
      }
      return mc;
    };

    Rom.prototype.read = function() {
      return this.getMicrocode(this.mcar);
    };

    Rom.prototype.setRomListeners = function(listeners) {
      return this.romListeners = listeners;
    };

    Rom.prototype.notifySetMcar = function(val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.romListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMcar === "function" ? listener.onSetMcar(val) : void 0);
      }
      return _results;
    };

    Rom.prototype.notifySetMc = function(at, val) {
      var listener, _i, _len, _ref, _results;
      _ref = this.romListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMc === "function" ? listener.onSetMc(at, val) : void 0);
      }
      return _results;
    };

    Rom.prototype.reset = function() {
      return this.setMcar(0);
    };

    return Rom;

  })();

}).call(this);

(function() {
  var __slice = [].slice;

  this.Cpu = (function() {

    function Cpu(alu, ram, mac, rom, cpuListeners, aluListeners, ramListeners, macListeners, romListeners) {
      this.alu = alu != null ? alu : new Alu();
      this.ram = ram != null ? ram : new Ram();
      this.mac = mac != null ? mac : new Mac();
      this.rom = rom != null ? rom : new Rom();
      this.cpuListeners = cpuListeners != null ? cpuListeners : [];
      if (aluListeners == null) {
        aluListeners = [];
      }
      if (ramListeners == null) {
        ramListeners = [];
      }
      if (macListeners == null) {
        macListeners = [];
      }
      if (romListeners == null) {
        romListeners = [];
      }
      this.log = Utils.getLogger('Cpu');
      if (ramListeners !== []) {
        this.ram.setRamListeners(ramListeners);
      }
      if (aluListeners !== []) {
        this.alu.setAluListeners(aluListeners);
      }
      if (macListeners !== []) {
        this.mac.setMacListeners(macListeners);
      }
      if (romListeners !== []) {
        this.rom.setRomListeners(romListeners);
      }
      this.registers = [0, 0, 0, 0, 0, 0, 0, 0];
      this.nextPhase = 0;
      this.microcode = {
        mode: 0,
        mcnext: 0,
        alufc: 0,
        xbus: 0,
        ybus: 0,
        zbus: 0,
        ioswitch: 0,
        byte: 0,
        mnemonic: "",
        remarks: ""
      };
      this.log.debug(function() {
        return "constructor done";
      });
    }

    Cpu.prototype.setCpuListeners = function(l) {
      return this.cpuListeners = l;
    };

    Cpu.prototype.setMicrocodeField = function(field, value) {
      var num;
      switch (field) {
        case "mode":
          num = Utils.sanitizeNum(value, 0x3);
          this.log.debug(function() {
            return "setting mc.mode to " + num;
          });
          this.microcode.mode = num;
          break;
        case "mcnext":
          num = Utils.sanitizeNum(value, 0x3F);
          this.log.debug(function() {
            return "setting mc.mcnext to " + num;
          });
          this.microcode.mcnext = num;
          break;
        case "alufc":
          num = Utils.sanitizeNum(value, 0x7F);
          this.log.debug(function() {
            return "setting mc.alufc to " + num;
          });
          this.microcode.alufc = num;
          break;
        case "xbus":
          num = Utils.sanitizeNum(value, 0xFFFFFFFF);
          this.log.debug(function() {
            return "setting mc.xbus to " + num;
          });
          this.microcode.xbus = num;
          break;
        case "ybus":
          num = Utils.sanitizeNum(value, 0xFFFFFFFF);
          this.log.debug(function() {
            return "setting mc.ybus to " + num;
          });
          this.microcode.ybus = num;
          break;
        case "zbus":
          num = Utils.sanitizeNum(value, 0xFFFFFFFF);
          this.log.debug(function() {
            return "setting mc.zbus to " + num;
          });
          this.microcode.zbus = num;
          break;
        case "ioswitch":
          num = Utils.sanitizeNum(value, 0xFFFFFFFF);
          this.log.debug(function() {
            return "setting mc.ioswitch to " + num;
          });
          this.microcode.ioswitch = num;
          break;
        case "byte":
          num = Utils.sanitizeNum(value, 0x3);
          this.log.debug(function() {
            return "setting mc.byte to " + num;
          });
          this.microcode.byte = num;
          break;
        case "mnemonic":
          this.log.debug(function() {
            return "setting mc.mnemonic to " + value;
          });
          this.microcode.mnemonic = value;
          break;
        case "remarks":
          this.log.debug(function() {
            return "setting mc.remarks to " + value;
          });
          this.microcode.remarks = value;
          break;
        default:
          this.log.warning(function() {
            return "unknown field " + field + " in setMicrocodeField.";
          });
      }
      return this.publishMicrocode();
    };

    Cpu.prototype.setMicrocode = function(code) {
      code = Utils.sanitizeMicrocode(code);
      this.log.debug(function() {
        return "setting microcode to\n                   mode: " + code.mode + "\n                   mcnext: " + code.mcnext + "\n                   alufc: " + code.alufc + "\n                   xbus: " + code.xbus + "\n                   ybus: " + code.ybus + "\n                   zbus: " + code.zbus + "\n                   ioswitch: " + code.ioswitch + "\n                   byte: " + code.byte + "\n";
      });
      this.microcode = code;
      return this.publishMicrocode();
    };

    Cpu.prototype.publishMicrocode = function() {
      this.ram.setMode(Utils.extractNum(this.microcode.ioswitch, 1, 2));
      this.ram.setFormat(this.microcode.byte);
      this.alu.setFunctionCode(this.microcode.alufc);
      this.mac.setMode(this.microcode.mode);
      this.mac.setMcn(this.microcode.mcnext);
      return this.notifyMicrocode(this.microcode);
    };

    Cpu.prototype.setRegister = function(register, value) {
      value = Utils.sanitizeNum(value, 0xFFFFFFFF);
      this.registers[register] = value;
      return this.notifySetRegister(register, value);
    };

    Cpu.prototype.runTact = function() {
      var _results;
      this.runPhase();
      _results = [];
      while (this.nextPhase !== 0) {
        _results.push(this.runPhase());
      }
      return _results;
    };

    Cpu.prototype.runPhase = function() {
      switch (this.nextPhase) {
        case 0:
          return this.runGetPhase();
        case 1:
          return this.runCalcPhase();
        case 2:
          return this.runPutPhase();
      }
    };

    Cpu.prototype.runGetPhase = function() {
      var action, actions, _i, _len;
      this.log.info(function() {
        return "running get phase";
      });
      actions = MicrocodeParser.parseGetPhase(this.microcode);
      for (_i = 0, _len = actions.length; _i < _len; _i++) {
        action = actions[_i];
        this.performAction(action);
      }
      return this.setNextPhase();
    };

    Cpu.prototype.runCalcPhase = function() {
      var action, actions, _i, _len;
      this.log.info(function() {
        return "running calc phase";
      });
      actions = MicrocodeParser.parseCalcPhase(this.microcode);
      for (_i = 0, _len = actions.length; _i < _len; _i++) {
        action = actions[_i];
        this.performAction(action);
      }
      return this.setNextPhase();
    };

    Cpu.prototype.runPutPhase = function() {
      var action, actions, _i, _len;
      this.log.info(function() {
        return "running put phase";
      });
      actions = MicrocodeParser.parsePutPhase(this.microcode);
      for (_i = 0, _len = actions.length; _i < _len; _i++) {
        action = actions[_i];
        this.performAction(action);
      }
      return this.setNextPhase();
    };

    Cpu.prototype.performAction = function(a) {
      var action, from, rest, target, to, value, _ref;
      this.log.debug(function() {
        return "performing action=" + a;
      });
      _ref = a.split(" "), action = _ref[0], rest = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      switch (action) {
        case "compute":
          this.log.debug(function() {
            return "compute...";
          });
          target = rest[0];
          return this.performCompute(target);
        case "push":
          this.log.debug(function() {
            return "push...";
          });
          to = rest[0], from = rest[1];
          return this.performPush(to, from);
        case "pushval":
          this.log.debug(function() {
            return "pushval...";
          });
          to = rest[0], value = rest[1];
          return this.performPushVal(to, value);
        case "next":
          this.log.debug(function() {
            return "fetching next microcode";
          });
          return this.setMicrocode(this.rom.read());
        case "info":
          return this.log.debug(function() {
            return "info";
          });
        default:
          return this.log.error(function() {
            return "unknown command: " + action;
          });
      }
    };

    Cpu.prototype.performPush = function(to, from) {
      var fromDomain, fromRegister, value, _ref,
        _this = this;
      _ref = from.split("."), fromDomain = _ref[0], fromRegister = _ref[1];
      switch (fromDomain) {
        case "registers":
          value = this.registers[parseInt(fromRegister)];
          this.log.debug(function() {
            return "from R" + fromRegister + " = " + value;
          });
          break;
        case "ram":
          switch (fromRegister) {
            case "MAR":
              value = this.ram.getMar();
              this.log.debug(function() {
                return "from ram.MAR = " + value;
              });
              break;
            case "MDR":
              value = this.ram.getMdr();
              this.log.debug(function() {
                return "from ram.MDR = " + value;
              });
          }
          break;
        case "rom":
          switch (fromRegister) {
            case "MCAR":
              value = this.rom.getMcar();
              this.log.debug(function() {
                return "from rom.MCAR = " + value;
              });
          }
          break;
        case "mac":
          switch (fromRegister) {
            case "MCARNEXT":
              value = this.mac.getMcarNext();
              this.log.debug(function() {
                return "from mac.MCARNEXT = " + value;
              });
          }
          break;
        case "alu":
          switch (fromRegister) {
            case "Z":
              value = this.alu.getZRegister();
              this.log.debug(function() {
                return "from alu.Z = " + value;
              });
              break;
            case "CC":
              value = this.alu.getCCRegister();
              this.log.debug(function() {
                return "from alu.CC = " + value;
              });
          }
      }
      if (value === void 0) {
        this.log.error(function() {
          return "unknown push source: " + from;
        });
        this.log.debug(function() {
          return "...push failed";
        });
        return;
      }
      if (this.setTarget(to, value) === true) {
        this.log.debug(function() {
          return "notify push signal";
        });
        this.notifySignal(to, from);
        return this.log.debug(function() {
          return "...push ok";
        });
      } else {
        this.log.error(function() {
          return "unknown push target: " + to;
        });
        return this.log.debug(function() {
          return "...push failed";
        });
      }
    };

    Cpu.prototype.performPushVal = function(to, value) {
      if (this.setTarget(to, parseInt(value)) === true) {
        this.log.debug(function() {
          return "notify pushval signal";
        });
        this.notifySignal(to, "MICROCODE");
        return this.log.debug(function() {
          return "...pushval ok";
        });
      } else {
        this.log.error(function() {
          return "unknown pushval target: " + to;
        });
        return this.log.debug(function() {
          return "...pushval failed";
        });
      }
    };

    Cpu.prototype.setTarget = function(target, value) {
      var targetError, toDomain, toRegister, _ref,
        _this = this;
      _ref = target.split("."), toDomain = _ref[0], toRegister = _ref[1];
      targetError = false;
      switch (toDomain) {
        case "registers":
          this.log.debug(function() {
            return "to R" + (parseInt(toRegister));
          });
          this.registers[parseInt(toRegister)] = value;
          break;
        case "ram":
          switch (toRegister) {
            case "MAR":
              this.log.debug(function() {
                return "to ram.MAR";
              });
              this.ram.setMar(value);
              break;
            case "MDR":
              this.log.debug(function() {
                return "to ram.MDR";
              });
              this.ram.setMdr(value);
              break;
            default:
              targetError = true;
          }
          break;
        case "rom":
          switch (toRegister) {
            case "MCAR":
              this.log.debug(function() {
                return "to rom.MCAR";
              });
              this.rom.setMcar(value);
              break;
            default:
              targetError = true;
          }
          break;
        case "alu":
          switch (toRegister) {
            case "X":
              this.log.debug(function() {
                return "to alu.X";
              });
              this.alu.setXRegister(value);
              break;
            case "Y":
              this.log.debug(function() {
                return "to alu.Y";
              });
              this.alu.setYRegister(value);
              break;
            case "Z":
              this.log.debug(function() {
                return "to alu.Z";
              });
              this.alu.setZRegister(value);
              break;
            case "FC":
              this.log.debug(function() {
                return "to alu.FC";
              });
              this.alu.setFunctionCode(value);
              break;
            default:
              targetError = true;
          }
          break;
        case "mac":
          switch (toRegister) {
            case "MCOP":
              this.log.debug(function() {
                return "to mac.MCOP";
              });
              this.mac.setMcop(value);
              break;
            case "MCAR":
              this.log.debug(function() {
                return "to mac.MCAR";
              });
              this.mac.setMcar(value);
              break;
            case "mode":
              this.log.debug(function() {
                return "to mac.mode";
              });
              this.mac.setMode(value);
              break;
            case "MCN":
              this.log.debug(function() {
                return "to mac.MCN";
              });
              this.mac.setMcn(value);
              break;
            case "MASK":
              this.log.debug(function() {
                return "to mac.MASK";
              });
              this.mac.setMask(value);
              break;
            case "CC":
              this.log.debug(function() {
                return "to mac.CC";
              });
              this.mac.setCC(value);
              break;
            default:
              targetError = true;
          }
          break;
        default:
          targetError = true;
      }
      return !targetError;
    };

    Cpu.prototype.performCompute = function(target) {
      switch (target) {
        case "ram":
          this.log.debug(function() {
            return "running ram";
          });
          return this.ram.compute();
        case "alu":
          this.log.debug(function() {
            return "running alu";
          });
          return this.alu.compute();
        case "mac":
          this.log.debug(function() {
            return "running mac";
          });
          return this.mac.compute();
        default:
          return this.log.error(function() {
            return "unknown compute target: " + target;
          });
      }
    };

    Cpu.prototype.setNextPhase = function(val) {
      if (val == null) {
        val = this.nextPhase + 1;
      }
      this.nextPhase = val % 3;
      return this.notifyNextPhase(this.nextPhase);
    };

    Cpu.prototype.notifySignal = function(to, from) {
      var listener, _i, _len, _ref, _results;
      _ref = this.cpuListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSignal === "function" ? listener.onSignal(to, from) : void 0);
      }
      return _results;
    };

    Cpu.prototype.notifyNextPhase = function(phase) {
      var listener, _i, _len, _ref, _results;
      _ref = this.cpuListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onNextPhase === "function" ? listener.onNextPhase(phase) : void 0);
      }
      return _results;
    };

    Cpu.prototype.notifySetRegister = function(register, value) {
      var listener, _i, _len, _ref, _results;
      _ref = this.cpuListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetRegister === "function" ? listener.onSetRegister(register, value) : void 0);
      }
      return _results;
    };

    Cpu.prototype.notifyMicrocode = function(mc) {
      var listener, _i, _len, _ref, _results;
      _ref = this.cpuListeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        _results.push(typeof listener.onSetMicrocode === "function" ? listener.onSetMicrocode(mc) : void 0);
      }
      return _results;
    };

    Cpu.prototype.reset = function() {
      var register, _i;
      this.setNextPhase(0);
      this.alu.reset();
      this.mac.reset();
      this.ram.reset();
      this.rom.reset();
      for (register = _i = 0; _i <= 7; register = ++_i) {
        this.setRegister(register, Utils.randomBitSequence(32));
      }
      return this.setMicrocode(this.rom.getMicrocode(0));
    };

    return Cpu;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.MacController = (function(_super) {

    __extends(MacController, _super);

    function MacController(mac) {
      this.mac = mac;
      this.log = Utils.getLogger('MacController');
      this.initListener();
      this.initButtonHandlers();
    }

    MacController.prototype.initListener = function() {
      this.macListener = new MacListener();
      this.macListener.setOnSetMode(function(mode) {
        var text;
        switch (mode) {
          case 0:
            text = '4 &times; MCN';
            break;
          case 1:
            text = 'MCAR + 1 + 4 &times; MCN';
            break;
          case 2:
            text = 'MCAR + 1 - 4 &times; MCN';
            break;
          case 3:
            text = '4 &times; MCOP abs./cond.';
        }
        return ($('#mac-jumpmode-label')).html(text);
      });
      this.macListener.setOnSetCC(function(cc) {
        return ($('#mac-cc-tf')).val(Utils.decToBin(cc, 4));
      });
      this.macListener.setOnSetMask(function(mask) {
        return ($('#mac-mask-tf')).val(Utils.decToBin(mask, 4));
      });
      this.macListener.setOnSetTimes4(function(t) {
        var text;
        switch (t) {
          case 0:
            text = '0 &times;';
            break;
          case 1:
            text = '4 &times;';
        }
        return ($('#mac-condition-badge')).html(text);
      });
      this.macListener.setOnSetMcop(function(mcop) {
        return ($('#mac-mcop-tf')).val(Utils.decToHex(mcop, 2));
      });
      this.macListener.setOnSetMcarNext(function(mcnext) {
        return ($('#mac-nextmc-tf')).val(Utils.decToHex(mcnext, 3));
      });
      this.macListener.setOnSetMcn(function(mcn) {
        return ($('#mac-mcn-tf')).val(Utils.decToBin(mcn, 6));
      });
      this.macListener.setOnSetMcar(function(mcar) {
        return ($('#mac-mcar-tf')).val(Utils.decToHex(mcar, 3));
      });
      this.log.debug(function() {
        return 'setting mac listener';
      });
      return this.mac.setMacListeners([this.macListener]);
    };

    MacController.prototype.initButtonHandlers = function() {
      var _this = this;
      ($('#mac-mcn-btn')).click(function() {
        return _this.showSetValueModal(_this.mac.mcnRegister, 0x3F, 6, function(val) {
          return _this.mac.setMcn(val);
        });
      });
      ($('#mac-mcar-btn')).click(function() {
        return _this.showSetValueModal(_this.mac.mcarRegister, 0xFFF, 12, function(val) {
          return _this.mac.setMcar(val);
        });
      });
      ($('#mac-nextmc-btn')).click(function() {
        return _this.showSetValueModal(_this.mac.mcarNextRegister, 0xFFF, 12, function(val) {
          return _this.mac.setMcarNext(val);
        });
      });
      ($('#mac-mcop-btn')).click(function() {
        return _this.showSetValueModal(_this.mac.mcopRegister, 0xFF, 8, function(val) {
          return _this.mac.setMcop(val);
        });
      });
      ($('#mac-mask-btn')).click(function() {
        return _this.showSetValueModal(_this.mac.maskRegister, 0xF, 4, function(val) {
          return _this.mac.setMask(val);
        });
      });
      return ($('#mac-cc-btn')).click(function() {
        return _this.showSetValueModal(_this.mac.ccRegister, 0xF, 4, function(val) {
          return _this.mac.setCC(val);
        });
      });
    };

    return MacController;

  })(AbstractController);

}).call(this);

(function() {

  this.AbstractController = (function() {
    var highlightClass, log;

    function AbstractController() {}

    log = Utils.getLogger('AbstractController');

    highlightClass = "success";

    AbstractController.prototype.highlightElement = function(id) {
      if (!($(id)).hasClass(highlightClass)) {
        return ($(id)).addClass(highlightClass);
      }
    };

    AbstractController.prototype.unhighlightElement = function(id) {
      return ($(id)).removeClass(highlightClass);
    };

    AbstractController.prototype.mkInputHandler = function(input, base, mask, callback) {
      input = $(input);
      return input.bind('change keypress paste focus textInput input', function() {
        var oldSelectionEnd, oldSelectionStart, value;
        oldSelectionStart = input[0].selectionStart;
        oldSelectionEnd = input[0].selectionEnd;
        value = parseInt(input.val(), base);
        value = (value & mask) >>> 0;
        callback(value);
        log.debug(function() {
          return "setting caret start to " + oldSelectionStart;
        });
        log.debug(function() {
          return "setting caret end to " + oldSelectionEnd;
        });
        input[0].selectionStart = oldSelectionStart;
        return input[0].selectionEnd = oldSelectionEnd;
      });
    };

    AbstractController.prototype.showSetValueModal = function(initialValue, mask, format, callback) {
      var cleanup, format16, mkErrorChecker, mode, _i, _len, _ref,
        _this = this;
      format16 = Math.ceil(format / 4);
      ($("#modal-val-2-tf")).val(Utils.decToBin(initialValue, format));
      ($("#modal-val-10-tf")).val(initialValue);
      ($("#modal-val-16-tf")).val(Utils.decToHex(initialValue, format16));
      cleanup = function() {
        ($("#modal-val-2-ctrl")).removeClass("success");
        ($("#modal-val-10-ctrl")).removeClass("success");
        ($("#modal-val-16-ctrl")).removeClass("success");
        ($("#modal-val-2-ctrl")).removeClass("error");
        ($("#modal-val-10-ctrl")).removeClass("error");
        ($("#modal-val-16-ctrl")).removeClass("error");
        return ($("#modal-val-set-btn")).prop("disabled", false);
      };
      mkErrorChecker = function(mode) {
        return function() {
          var value;
          cleanup();
          value = parseInt(($("#modal-val-" + mode + "-tf")).val(), mode);
          if ((value > mask) || ((value | mask) >>> 0) !== mask || isNaN(value)) {
            ($("#modal-val-" + mode + "-ctrl")).removeClass("success");
            ($("#modal-val-set-btn")).prop("disabled", true);
            if (!($("#modal-val-" + mode + "-ctrl")).hasClass("error")) {
              return ($("#modal-val-" + mode + "-ctrl")).addClass("error");
            }
          } else {
            if (mode !== 2) {
              ($("#modal-val-2-tf")).val(Utils.decToBin(value, format));
            }
            if (mode !== 10) {
              ($("#modal-val-10-tf")).val(value);
            }
            if (mode !== 16) {
              ($("#modal-val-16-tf")).val(Utils.decToHex(value, format16));
            }
            ($("#modal-val-" + mode + "-ctrl")).removeClass("error");
            ($("#modal-val-set-btn")).prop("disabled", false);
            if (!($("#modal-val-" + mode + "-ctrl")).hasClass("success")) {
              return ($("#modal-val-" + mode + "-ctrl")).addClass("success");
            }
          }
        };
      };
      _ref = [2, 10, 16];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        mode = _ref[_i];
        ($("#modal-val-" + mode + "-tf")).unbind('change keypress paste\
        focus textInput input');
        ($("#modal-val-" + mode + "-tf")).bind('change keypress paste\
        focus textInput input', mkErrorChecker(mode));
      }
      ($("#modal-val-set-btn")).unbind('click.modal_val');
      ($("#modal-val-set-btn")).bind('click.modal_val', function() {
        callback(parseInt(($("#modal-val-10-tf")).val()));
        return $('#modal-val').modal('hide');
      });
      cleanup();
      return ($("#modal-val")).modal('show');
    };

    return AbstractController;

  })();

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  this.CpuController = (function(_super) {

    __extends(CpuController, _super);

    function CpuController() {
      var alu, mac, ram, rom;
      this.log = Utils.getLogger('CpuController');
      this.cpv = new ConductorPathView();
      alu = new Alu();
      ram = new Ram();
      mac = new Mac();
      rom = new Rom();
      this.cpu = new Cpu(alu, ram, mac, rom);
      this.aluController = new AluController(alu);
      this.ramController = new RamController(ram);
      this.romController = new RomController(rom);
      this.macController = new MacController(mac);
      this.initListener();
      this.cpu.setCpuListeners([this.cpuListener]);
      this.initPowerHandlers();
      this.initMicrocodeInputHandlers();
      this.initMicrocodeButtonHandlers();
      this.initRegistersButtonHandlers();
      this.cpu.reset();
      this.preview();
    }

    CpuController.prototype.initListener = function() {
      var _this = this;
      this.log.debug(function() {
        return "init cpu listener";
      });
      this.cpuListener = new CpuListener();
      this.cpuListener.setOnSetRegister(function(register, value) {
        return ($("#registers-r" + register + "-tf")).val(Utils.decToHex(value, 8));
      });
      this.cpuListener.setOnSetMicrocode(function(mc) {
        ($("#microcode-mode-tf")).val(Utils.decToBin(mc.mode, 2));
        ($("#microcode-mcnext-tf")).val(Utils.decToBin(mc.mcnext, 6));
        ($("#microcode-alufc-tf")).val(Utils.decToBin(mc.alufc, 7));
        ($("#microcode-xbus-tf")).val(Utils.decToBin(mc.xbus, 8));
        ($("#microcode-ybus-tf")).val(Utils.decToBin(mc.ybus, 8));
        ($("#microcode-zbus-tf")).val(Utils.decToBin(mc.zbus, 8));
        ($("#microcode-ioswitch-tf")).val(Utils.decToBin(mc.ioswitch, 8));
        ($("#microcode-byte-tf")).val(Utils.decToBin(mc.byte, 2));
        ($("#info-tarea")).val(mc.remarks);
        return _this.preview();
      });
      this.cpuListener.setOnNextPhase(function(phase) {
        _this.cpv.redraw();
        _this.preview();
        return _this.cpv.resetActive();
      });
      return this.cpuListener.setOnSignal(function(to, from) {
        var domain, register, _ref;
        _ref = from.split("."), domain = _ref[0], register = _ref[1];
        switch (to) {
          case "alu.X":
            return _this.cpv.setActiveX(parseInt(register), true);
          case "alu.Y":
            switch (domain) {
              case "registers":
                return _this.cpv.setActiveY(parseInt(register), true);
              case "ram":
                return _this.cpv.setActiveY(8, true);
            }
        }
      });
    };

    CpuController.prototype.initPowerHandlers = function() {
      var _this = this;
      ($("#power-reset-btn")).click(function() {
        _this.cpu.reset();
        return _this.cpv.resetActive();
      });
      ($("#power-phase-btn")).click(function() {
        return _this.cpu.runPhase();
      });
      return ($("#power-tact-btn")).click(function() {
        return _this.cpu.runTact();
      });
    };

    CpuController.prototype.initMicrocodeInputHandlers = function() {
      var _this = this;
      this.mkInputHandler("#microcode-mode-tf", 2, 0x3, function(value) {
        return _this.cpu.setMicrocodeField("mode", value);
      });
      this.mkInputHandler("#microcode-mcnext-tf", 2, 0x3F, function(value) {
        return _this.cpu.setMicrocodeField("mcnext", value);
      });
      this.mkInputHandler("#microcode-alufc-tf", 2, 0x7F, function(value) {
        return _this.cpu.setMicrocodeField("alufc", value);
      });
      this.mkInputHandler("#microcode-xbus-tf", 2, 0xFF, function(value) {
        return _this.cpu.setMicrocodeField("xbus", value);
      });
      this.mkInputHandler("#microcode-ybus-tf", 2, 0xFF, function(value) {
        return _this.cpu.setMicrocodeField("ybus", value);
      });
      this.mkInputHandler("#microcode-zbus-tf", 2, 0xFF, function(value) {
        return _this.cpu.setMicrocodeField("zbus", value);
      });
      this.mkInputHandler("#microcode-ioswitch-tf", 2, 0xFF, function(value) {
        return _this.cpu.setMicrocodeField("ioswitch", value);
      });
      return this.mkInputHandler("#microcode-byte-tf", 2, 0x3, function(value) {
        return _this.cpu.setMicrocodeField("byte", value);
      });
    };

    CpuController.prototype.initMicrocodeButtonHandlers = function() {
      var _this = this;
      ($("#microcode-mode-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.mode, 0x3, 2, function(val) {
          return _this.cpu.setMicrocodeField("mode", val);
        });
      });
      ($("#microcode-mcnext-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.mcnext, 0x3F, 6, function(val) {
          return _this.cpu.setMicrocodeField("mcnext", val);
        });
      });
      ($("#microcode-alufc-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.alufc, 0x7F, 7, function(val) {
          return _this.cpu.setMicrocodeField("alufc", val);
        });
      });
      ($("#microcode-xbus-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.xbus, 0xFF, 8, function(val) {
          return _this.cpu.setMicrocodeField("xbus", val);
        });
      });
      ($("#microcode-ybus-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.ybus, 0xFF, 8, function(val) {
          return _this.cpu.setMicrocodeField("ybus", val);
        });
      });
      ($("#microcode-zbus-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.zbus, 0xFF, 8, function(val) {
          return _this.cpu.setMicrocodeField("zbus", val);
        });
      });
      ($("#microcode-ioswitch-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.ioswitch, 0xFF, 8, function(val) {
          return _this.cpu.setMicrocodeField("ioswitch", val);
        });
      });
      return ($("#microcode-byte-btn")).click(function() {
        return _this.showSetValueModal(_this.cpu.microcode.byte, 0x3, 2, function(val) {
          return _this.cpu.setMicrocodeField("byte", val);
        });
      });
    };

    CpuController.prototype.initRegistersButtonHandlers = function() {
      var bind, register, _i, _results,
        _this = this;
      bind = function(register) {
        return ($("#registers-r" + register + "-btn")).click(function() {
          return _this.showSetValueModal(_this.cpu.registers[register], 0xFFFFFFFF, 32, function(val) {
            return _this.cpu.setRegister(register, val);
          });
        });
      };
      _results = [];
      for (register = _i = 0; _i <= 7; register = ++_i) {
        _results.push(bind(register));
      }
      return _results;
    };

    CpuController.prototype.clearPreview = function() {
      var register, _i;
      this.unhighlightElement("#rom-mcar-pv");
      this.unhighlightElement("#mac-mcn-pv");
      this.unhighlightElement("#mac-mcar-pv");
      this.unhighlightElement("#mac-nextmc-pv");
      this.unhighlightElement("#mac-mcop-pv");
      this.unhighlightElement("#mac-mask-pv");
      this.unhighlightElement("#mac-cc-pv");
      this.unhighlightElement("#ram-mar-pv");
      this.unhighlightElement("#ram-mdr-pv");
      for (register = _i = 0; _i <= 7; register = ++_i) {
        this.unhighlightElement("#registers-r" + register + "-pv");
      }
      this.aluController.setHighlightXRegister(false);
      this.aluController.setHighlightYRegister(false);
      this.aluController.setHighlightZRegister(false);
      this.aluController.setHighlightCCFlags(false);
      return this.aluController.setHighlightCCRegister(false);
    };

    CpuController.prototype.preview = function() {
      var action, actions, _i, _len, _results;
      this.clearPreview();
      switch (this.cpu.nextPhase) {
        case 0:
          actions = MicrocodeParser.parseGetPhase(this.cpu.microcode);
          break;
        case 1:
          actions = MicrocodeParser.parseCalcPhase(this.cpu.microcode);
          break;
        case 2:
          actions = MicrocodeParser.parsePutPhase(this.cpu.microcode);
      }
      _results = [];
      for (_i = 0, _len = actions.length; _i < _len; _i++) {
        action = actions[_i];
        _results.push(this.previewAction(action));
      }
      return _results;
    };

    CpuController.prototype.previewAction = function(a) {
      var ac, action, from, rest, target, to, value, _ref;
      this.log.debug(function() {
        return "previewing action=" + a;
      });
      _ref = a.split(" "), action = _ref[0], rest = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      switch (action) {
        case "compute":
          this.log.debug(function() {
            return "preview compute...";
          });
          target = rest[0];
          return this.previewCompute(target);
        case "push":
          this.log.debug(function() {
            return "preview push...";
          });
          to = rest[0], from = rest[1];
          return this.previewPush(to, from);
        case "pushval":
          this.log.debug(function() {
            return "preview pushval...";
          });
          to = rest[0], value = rest[1];
          return this.previewPushVal(to, value);
        case "next":
          return this.log.debug(function() {
            return "preview fetching next microcode";
          });
        case "info":
          this.log.debug(function() {
            return "preview info...";
          });
          ac = rest[0], value = rest[1];
          return this.previewInfo(ac, value);
        default:
          return this.log.error(function() {
            return "unknown command: " + action;
          });
      }
    };

    CpuController.prototype.previewInfo = function(action, val) {
      switch (action) {
        case "update":
          switch (val) {
            case "cc":
              this.log.debug(function() {
                return "preview update cc";
              });
              return this.aluController.setHighlightCCRegister(true);
            default:
              return this.log.error(function() {
                return "unknown update target: " + val;
              });
          }
          break;
        default:
          return this.log.error(function() {
            return "unknown info action: " + action;
          });
      }
    };

    CpuController.prototype.previewPush = function(to, from) {
      var fromDomain, fromRegister, _ref;
      _ref = from.split("."), fromDomain = _ref[0], fromRegister = _ref[1];
      switch (fromDomain) {
        case "registers":
          this.log.debug(function() {
            return "adding registers-r" + fromRegister + "-pv";
          });
          this.highlightElement("#registers-r" + fromRegister + "-pv");
          break;
        case "ram":
          switch (fromRegister) {
            case "MAR":
              this.log.debug(function() {
                return "adding ram-mar-pv";
              });
              this.highlightElement("#ram-mar-pv");
              break;
            case "MDR":
              this.log.debug(function() {
                return "adding ram-mdr-pv";
              });
              this.highlightElement("#ram-mdr-pv");
          }
          break;
        case "rom":
          switch (fromRegister) {
            case "MCAR":
              this.log.debug(function() {
                return "adding rom-mcar-pv";
              });
              this.highlightElement("#rom-mcar-pv");
          }
          break;
        case "mac":
          switch (fromRegister) {
            case "MCARNEXT":
              this.log.debug(function() {
                return "adding mac-nextmcar-pv";
              });
              this.highlightElement("#mac-nextmcar-pv");
          }
          break;
        case "alu":
          switch (fromRegister) {
            case "Z":
              this.log.debug(function() {
                return "adding alu-z-pv";
              });
              this.aluController.setHighlightZRegister(true);
              break;
            case "CC":
              this.log.debug(function() {
                return "adding alu-cc-pv";
              });
              this.aluController.setHighlightCCFlags(true);
          }
      }
      if (this.previewSetTarget(to) === true) {
        return this.log.debug(function() {
          return "...push ok";
        });
      } else {
        this.log.error(function() {
          return "unknown push target: " + to;
        });
        return this.log.debug(function() {
          return "...push failed";
        });
      }
    };

    CpuController.prototype.previewPushVal = function(to) {
      if (this.previewSetTarget(to) === true) {
        return this.log.debug(function() {
          return "...pushval ok";
        });
      } else {
        this.log.error(function() {
          return "unknown pushval target: " + to;
        });
        return this.log.debug(function() {
          return "...pushval failed";
        });
      }
    };

    CpuController.prototype.previewSetTarget = function(target) {
      var targetError, toDomain, toRegister, _ref,
        _this = this;
      _ref = target.split("."), toDomain = _ref[0], toRegister = _ref[1];
      targetError = false;
      switch (toDomain) {
        case "registers":
          this.log.debug(function() {
            return "to R" + (parseInt(toRegister));
          });
          this.highlightElement("#registers-r" + toRegister + "-pv");
          break;
        case "ram":
          switch (toRegister) {
            case "MAR":
              this.log.debug(function() {
                return "to ram.MAR";
              });
              this.highlightElement("#ram-mar-pv");
              break;
            case "MDR":
              this.log.debug(function() {
                return "to ram.MDR";
              });
              this.highlightElement("#ram-mdr-pv");
              break;
            default:
              targetError = true;
          }
          break;
        case "rom":
          switch (toRegister) {
            case "MCAR":
              this.log.debug(function() {
                return "to rom.MCAR";
              });
              this.highlightElement("#rom-mcar-pv");
              break;
            default:
              targetError = true;
          }
          break;
        case "alu":
          switch (toRegister) {
            case "X":
              this.log.debug(function() {
                return "to alu.X";
              });
              this.aluController.setHighlightXRegister(true);
              break;
            case "Y":
              this.log.debug(function() {
                return "to alu.Y";
              });
              this.aluController.setHighlightYRegister(true);
              break;
            case "Z":
              this.log.debug(function() {
                return "to alu.Z";
              });
              this.aluController.setHighlightZRegister(true);
              break;
            case "FC":
              this.log.debug(function() {
                return "to alu.FC";
              });
              break;
            default:
              targetError = true;
          }
          break;
        case "mac":
          switch (toRegister) {
            case "MCOP":
              this.log.debug(function() {
                return "to mac.MCOP";
              });
              this.highlightElement("#mac-mcop-pv");
              break;
            case "MCAR":
              this.log.debug(function() {
                return "to mac.MCAR";
              });
              this.highlightElement("#mac-mcar-pv");
              break;
            case "mode":
              this.log.debug(function() {
                return "to mac.mode";
              });
              break;
            case "MCN":
              this.log.debug(function() {
                return "to mac.MCN";
              });
              this.highlightElement("#mac-mcn-pv");
              break;
            case "MASK":
              this.log.debug(function() {
                return "to mac.MASK";
              });
              this.highlightElement("#mac-mask-pv");
              break;
            case "CC":
              this.log.debug(function() {
                return "to mac.CC";
              });
              this.highlightElement("#mac-cc-pv");
              break;
            default:
              targetError = true;
          }
          break;
        default:
          targetError = true;
      }
      return !targetError;
    };

    CpuController.prototype.previewCompute = function(target) {
      switch (target) {
        case "ram":
          return this.log.debug(function() {
            return "preview running ram";
          });
        case "alu":
          return this.log.debug(function() {
            return "preview running alu";
          });
        case "mac":
          return this.log.debug(function() {
            return "preview running mac";
          });
        default:
          return this.log.error(function() {
            return "unknown compute target: " + target;
          });
      }
    };

    return CpuController;

  })(AbstractController);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.RamController = (function(_super) {

    __extends(RamController, _super);

    function RamController(ram) {
      this.ram = ram;
      this.log = Utils.getLogger('RamController');
      this.initRamModal();
      this.initListener();
      this.initButtonHandlers();
    }

    RamController.prototype.initRamModal = function() {
      var doUpdate, errorChecker, hasErrors, offset, parseRamId, row, _i, _j,
        _this = this;
      for (row = _i = 0; _i <= 255; row = ++_i) {
        ($('#modal-ram-table > tbody:last')).append("  <tr id=\"modal-ram-row-" + row + "\">    <td>" + (Utils.decToHex(row * 8, 3)) + "</td>    <td id=\"modal-ram-b" + (row * 8) + "-tf\">00</td>    <td id=\"modal-ram-b" + (row * 8 + 1) + "-tf\">00</td>    <td id=\"modal-ram-b" + (row * 8 + 2) + "-tf\">00</td>    <td id=\"modal-ram-b" + (row * 8 + 3) + "-tf\">00</td>    <td id=\"modal-ram-b" + (row * 8 + 4) + "-tf\">00</td>    <td id=\"modal-ram-b" + (row * 8 + 5) + "-tf\">00</td>    <td id=\"modal-ram-b" + (row * 8 + 6) + "-tf\">00</td>    <td id=\"modal-ram-b" + (row * 8 + 7) + "-tf\">00</td>  </tr>");
      }
      parseRamId = function(id) {
        var u, v, w, _ref;
        _ref = id.split("-"), u = _ref[0], v = _ref[1], w = _ref[2], row = _ref[3];
        return parseInt(row);
      };
      hasErrors = function() {
        var offset, _j;
        for (offset = _j = 0; _j <= 7; offset = ++_j) {
          if (($("#modal-ram-val" + offset + "-ctrl")).hasClass("error")) {
            return true;
          }
        }
        return false;
      };
      errorChecker = function(offset) {
        return function() {
          var mask, value;
          mask = 0xFF;
          value = parseInt(($("#modal-ram-val" + offset + "-tf")).val(), 16);
          if ((value > mask) || ((value | mask) >>> 0) !== mask || isNaN(value)) {
            ($("#modal-ram-val" + offset + "-ctrl")).removeClass("success");
            ($("#modal-ram-set-btn")).prop("disabled", true);
            if (!($("#modal-ram-val" + offset + "-ctrl")).hasClass("error")) {
              return ($("#modal-ram-val" + offset + "-ctrl")).addClass("error");
            }
          } else {
            ($("#modal-ram-val" + offset + "-ctrl")).removeClass("error");
            if (!hasErrors()) {
              ($("#modal-ram-set-btn")).prop("disabled", false);
            }
            if (!($("#modal-ram-val" + offset + "-ctrl")).hasClass("success")) {
              return ($("#modal-ram-val" + offset + "-ctrl")).addClass("success");
            }
          }
        };
      };
      doUpdate = function(row) {
        var offset, _j, _results;
        _results = [];
        for (offset = _j = 0; _j <= 7; offset = ++_j) {
          ($("#modal-ram-val" + offset + "-ctrl")).removeClass("success");
          ($("#modal-ram-val" + offset + "-ctrl")).removeClass("error");
          _results.push(($("#modal-ram-val" + offset + "-tf")).val(Utils.decToHex(_this.ram.getByte(row * 8 + offset), 2)));
        }
        return _results;
      };
      ($('#modal-ram-table tbody tr')).click(function() {
        ($('#modal-ram-table tbody tr')).removeClass('ram-selection-highlight');
        if (!($(this)).hasClass('ram-selection-highlight')) {
          ($(this)).addClass('ram-selection-highlight');
          return doUpdate(parseRamId(($(this)).attr('id')));
        }
      });
      for (offset = _j = 0; _j <= 7; offset = ++_j) {
        ($("#modal-ram-val" + offset + "-tf")).bind('change keypress paste\
        focus textInput input', errorChecker(offset));
      }
      return ($('#modal-ram-set-btn')).click(function() {
        var _k, _results;
        row = parseRamId(_this.getSelectedRamRow().attr('id'));
        _results = [];
        for (offset = _k = 0; _k <= 7; offset = ++_k) {
          _results.push(_this.ram.setByte(row * 8 + offset, parseInt(($("#modal-ram-val" + offset + "-tf")).val(), 16)));
        }
        return _results;
      });
    };

    RamController.prototype.initListener = function() {
      var _this = this;
      this.ramListener = new RamListener();
      this.ramListener.setOnSetFormat(function(value) {
        return ($("#ram-byte-label")).html("" + (value + 1) + " Byte");
      });
      this.ramListener.setOnSetMode(function(value) {
        switch (value) {
          case 1:
            return ($("#ram-mode-label")).html("Reading");
          case 2:
            return ($("#ram-mode-label")).html("Writing");
          default:
            return ($("#ram-mode-label")).html("Waiting");
        }
      });
      this.ramListener.setOnSetMar(function(value) {
        return ($("#ram-mar-tf")).val(Utils.decToHex(value, 3));
      });
      this.ramListener.setOnSetMdr(function(value) {
        return ($("#ram-mdr-tf")).val(Utils.decToHex(value, 2 + _this.ram.format * 2));
      });
      this.ramListener.setOnSetByte(function(at, value) {
        return ($("#modal-ram-b" + at + "-tf")).html(Utils.decToHex(value, 2));
      });
      this.log.debug(function() {
        return 'setting ram listener';
      });
      return this.ram.setRamListeners([this.ramListener]);
    };

    RamController.prototype.initButtonHandlers = function() {
      var _this = this;
      ($("#ram-mar-btn")).click(function() {
        return _this.showSetValueModal(_this.ram.mar, 0x7FF, 11, function(val) {
          return _this.ram.setMar(val);
        });
      });
      ($("#ram-mdr-btn")).click(function() {
        return _this.showSetValueModal(_this.ram.mdr, 0xFFFFFFFF, 32, function(val) {
          return _this.ram.setMdr(val);
        });
      });
      return ($("#ram-ram-btn")).click(function() {
        return _this.showRamModal();
      });
    };

    RamController.prototype.getSelectedRamRow = function() {
      var row;
      row = $('#modal-ram-table\
              tbody\
              tr[class~="ram-selection-highlight"]');
      if (row.length !== 1) {
        ($('#modal-ram-table tbody tr')).removeClass('ram-selection-highlight');
        row = $('#modal-ram-table tbody tr:first-child');
      }
      return row;
    };

    RamController.prototype.showRamModal = function() {
      var row;
      row = this.getSelectedRamRow();
      row.trigger('click');
      return ($('#modal-ram')).modal('show');
    };

    return RamController;

  })(AbstractController);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.AluController = (function(_super) {

    __extends(AluController, _super);

    function AluController(alu) {
      this.alu = alu;
      this.log = Utils.getLogger('AluController');
      this.initListener();
      this.initButtonHandlers();
    }

    AluController.prototype.initListener = function() {
      this.aluListener = new AluListener();
      this.aluListener.setOnSetX(function(value) {
        return ($("#alu-x-tf")).val(Utils.decToHex(value, 8));
      });
      this.aluListener.setOnSetY(function(value) {
        return ($("#alu-y-tf")).val(Utils.decToHex(value, 8));
      });
      this.aluListener.setOnSetZ(function(value) {
        return ($("#alu-z-tf")).val(Utils.decToHex(value, 8));
      });
      this.aluListener.setOnSetCC(function(value) {
        return ($("#cc-cc-tf")).val(Utils.decToBin(value, 4));
      });
      this.aluListener.setOnSetFlags(function(value) {
        return ($("#alu-cc-tf")).val(Utils.decToBin(value, 4));
      });
      this.aluListener.setOnSetFC(function(value) {
        return ($("#alu-fc-label")).html(Utils.functionCodeToText(value));
      });
      this.log.debug(function() {
        return "setting alu listener";
      });
      return this.alu.setAluListeners([this.aluListener]);
    };

    AluController.prototype.initButtonHandlers = function() {
      var _this = this;
      ($("#alu-x-btn")).click(function() {
        return _this.showSetValueModal(_this.alu.getXRegister(), 0xFFFFFFFF, 32, function(val) {
          return _this.alu.setXRegister(val);
        });
      });
      ($("#alu-y-btn")).click(function() {
        return _this.showSetValueModal(_this.alu.getYRegister(), 0xFFFFFFFF, 32, function(val) {
          return _this.alu.setYRegister(val);
        });
      });
      ($("#alu-z-btn")).click(function() {
        return _this.showSetValueModal(_this.alu.getZRegister(), 0xFFFFFFFF, 32, function(val) {
          return _this.alu.setZRegister(val);
        });
      });
      ($("#alu-cc-btn")).click(function() {
        return _this.showSetValueModal(_this.alu.getCCFlags(), 0xF, 4, function(val) {
          return _this.alu.setCCFlags(val);
        });
      });
      return ($("#cc-cc-btn")).click(function() {
        return _this.showSetValueModal(_this.alu.getCCRegister(), 0xF, 4, function(val) {
          return _this.alu.setCCRegister(val);
        });
      });
    };

    AluController.prototype.setHighlightXRegister = function(mode) {
      if (mode === true) {
        return this.highlightElement("#alu-x-pv");
      } else {
        return this.unhighlightElement("#alu-x-pv");
      }
    };

    AluController.prototype.setHighlightYRegister = function(mode) {
      if (mode === true) {
        return this.highlightElement("#alu-y-pv");
      } else {
        return this.unhighlightElement("#alu-y-pv");
      }
    };

    AluController.prototype.setHighlightZRegister = function(mode) {
      if (mode === true) {
        return this.highlightElement("#alu-z-pv");
      } else {
        return this.unhighlightElement("#alu-z-pv");
      }
    };

    AluController.prototype.setHighlightCCFlags = function(mode) {
      if (mode === true) {
        return this.highlightElement("#alu-cc-pv");
      } else {
        return this.unhighlightElement("#alu-cc-pv");
      }
    };

    AluController.prototype.setHighlightCCRegister = function(mode) {
      if (mode === true) {
        return this.highlightElement("#cc-cc-pv");
      } else {
        return this.unhighlightElement("#cc-cc-pv");
      }
    };

    return AluController;

  })(AbstractController);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.RomController = (function(_super) {

    __extends(RomController, _super);

    function RomController(rom) {
      this.rom = rom;
      this.log = Utils.getLogger('RomController');
      this.initRomModal();
      this.initListener();
      this.initButtonHandlers();
    }

    RomController.prototype.initRomModal = function() {
      var doUpdate, errorChecker, fc, hasErrors, parseRomId, row, _i, _j,
        _this = this;
      for (row = _i = 0; _i <= 1023; row = ++_i) {
        ($('#modal-rom-table > tbody:last')).append("  <tr id=\"modal-rom-row-" + row + "\">    <td>" + (Utils.decToHex(row, 3)) + "</td>    <td id=\"modal-rom-" + row + "-tf\">    00 000000 0000000 00000000 00000000 00000000 00000000 00    </td>  </tr>");
      }
      for (fc = _j = 0; _j <= 127; fc = ++_j) {
        ($('#modal-rom-alufc-sl')).append("        <option value=\"" + fc + "\">        " + (Utils.decToBin(fc, 7)) + ": " + (Utils.functionCodeToText(fc)) + "        </option>");
      }
      parseRomId = function(id) {
        var u, v, w, _ref;
        _ref = id.split("-"), u = _ref[0], v = _ref[1], w = _ref[2], row = _ref[3];
        return parseInt(row);
      };
      hasErrors = function() {
        if (($("#modal-rom-mask-ctrl")).hasClass("error")) {
          return true;
        }
        return false;
      };
      errorChecker = function() {
        var mask, value;
        mask = 0xF;
        value = parseInt(($("#modal-rom-mask-tf")).val(), 2);
        if ((value > mask) || ((value | mask) >>> 0) !== mask || isNaN(value)) {
          ($("#modal-rom-mask-ctrl")).removeClass("success");
          ($("#modal-rom-set-btn")).prop("disabled", true);
          if (!($("#modal-rom-mask-ctrl")).hasClass("error")) {
            return ($("#modal-rom-mask-ctrl")).addClass("error");
          }
        } else {
          ($("#modal-rom-mask-ctrl")).removeClass("error");
          if (!hasErrors()) {
            ($("#modal-rom-set-btn")).prop("disabled", false);
          }
          if (!($("#modal-rom-mask-ctrl")).hasClass("success")) {
            return ($("#modal-rom-mask-ctrl")).addClass("success");
          }
        }
      };
      doUpdate = function(row) {
        var bit, mask, mc, smode, _k, _l;
        mc = _this.rom.getMicrocode(row);
        ($("#modal-rom-mode-sl option[value='" + mc.mode + "']")).attr('selected', true);
        smode = Utils.extractNum(mc.mcnext, 5, 6);
        mask = Utils.extractNum(mc.mcnext, 1, 4);
        ($("#modal-rom-smode-sl option[value='" + smode + "']")).attr('selected', true);
        ($('#modal-rom-mask-tf')).val(Utils.decToBin(mask, 4));
        ($("#modal-rom-alufc-sl        option[value='" + mc.alufc + "']")).attr('selected', true);
        for (bit = _k = 1; _k <= 8; bit = ++_k) {
          if (Utils.isBitSet(mc.xbus, bit)) {
            ($("#modal-rom-x-" + bit + "-cb")).attr('checked', true);
          } else {
            ($("#modal-rom-x-" + bit + "-cb")).attr('checked', false);
          }
          if (Utils.isBitSet(mc.ybus, bit)) {
            ($("#modal-rom-y-" + bit + "-cb")).attr('checked', true);
          } else {
            ($("#modal-rom-y-" + bit + "-cb")).attr('checked', false);
          }
          if (Utils.isBitSet(mc.zbus, bit)) {
            ($("#modal-rom-z-" + bit + "-cb")).attr('checked', true);
          } else {
            ($("#modal-rom-z-" + bit + "-cb")).attr('checked', false);
          }
        }
        for (bit = _l = 3; _l <= 8; bit = ++_l) {
          if (Utils.isBitSet(mc.ioswitch, bit)) {
            ($("#modal-rom-ioswitch-" + bit + "-cb")).attr('checked', true);
          } else {
            ($("#modal-rom-ioswitch-" + bit + "-cb")).attr('checked', false);
          }
        }
        ($("#modal-rom-ram-mode-sl          option[value='" + ((mc.ioswitch & 0x3) >>> 0) + "']")).attr('selected', true);
        ($("#modal-rom-ram-format-sl          option[value='" + mc.byte + "']")).attr('selected', true);
        ($('#modal-rom-mnemonic-tf')).val(mc.mnemonic);
        return ($('#modal-rom-remarks-tf')).val(mc.remarks);
      };
      ($('#modal-rom-table tbody tr')).click(function() {
        ($('#modal-rom-table tbody tr')).removeClass('rom-selection-highlight');
        if (!($(this)).hasClass('rom-selection-highlight')) {
          ($(this)).addClass('rom-selection-highlight');
          return doUpdate(parseRomId(($(this)).attr('id')));
        }
      });
      ($("#modal-rom-mask-tf")).bind('change keypress paste\
        focus textInput input', errorChecker);
      return ($('#modal-rom-set-btn')).click(function() {
        var bit, io, mask, mc, smode, x, y, z, _k, _l;
        row = parseRomId(_this.getSelectedRomRow().attr('id'));
        mask = parseInt(($("#modal-rom-mask-tf")).val(), 2);
        smode = ($("#modal-rom-smode-sl option:selected")).val();
        x = 0;
        y = 0;
        z = 0;
        io = ($("#modal-rom-ram-mode-sl option:selected")).val();
        for (bit = _k = 1; _k <= 8; bit = ++_k) {
          if ((($("#modal-rom-x-" + bit + "-cb")).attr('checked')) != null) {
            x = Utils.setBit(x, bit);
          }
          if ((($("#modal-rom-y-" + bit + "-cb")).attr('checked')) != null) {
            y = Utils.setBit(y, bit);
          }
          if ((($("#modal-rom-z-" + bit + "-cb")).attr('checked')) != null) {
            z = Utils.setBit(z, bit);
          }
        }
        for (bit = _l = 3; _l <= 8; bit = ++_l) {
          if ((($("#modal-rom-ioswitch-" + bit + "-cb")).attr('checked')) != null) {
            io = Utils.setBit(io, bit);
          }
        }
        mc = {
          mode: ($("#modal-rom-mode-sl option:selected")).val(),
          mcnext: ((smode << 4) | mask) >>> 0,
          alufc: ($("#modal-rom-alufc-sl option:selected")).val(),
          xbus: x,
          ybus: y,
          zbus: z,
          ioswitch: io,
          byte: ($("#modal-rom-ram-format-sl option:selected")).val(),
          mnemonic: ($('#modal-rom-mnemonic-tf')).val(),
          remarks: ($('#modal-rom-remarks-tf')).val()
        };
        return _this.rom.setMicrocode(row, mc);
      });
    };

    RomController.prototype.initListener = function() {
      this.romListener = new RomListener();
      this.romListener.setOnSetMc(function(at, mc) {
        var text;
        text = "" + (Utils.decToBin(mc.mode, 2)) + " " + (Utils.decToBin(mc.mcnext, 6)) + " " + (Utils.decToBin(mc.alufc, 7)) + " " + (Utils.decToBin(mc.xbus, 8)) + " " + (Utils.decToBin(mc.ybus, 8)) + " " + (Utils.decToBin(mc.zbus, 8)) + " " + (Utils.decToBin(mc.ioswitch, 8)) + " " + (Utils.decToBin(mc.byte, 2));
        return ($("#modal-rom-" + at + "-tf")).html(text);
      });
      this.romListener.setOnSetMcar(function(val) {
        return ($("#rom-mcar-tf")).val(Utils.decToHex(val, 3));
      });
      this.log.debug(function() {
        return 'setting rom listener';
      });
      return this.rom.setRomListeners([this.romListener]);
    };

    RomController.prototype.initButtonHandlers = function() {
      var _this = this;
      ($("#rom-rom-btn")).click(function() {
        return _this.showRomModal();
      });
      return ($("#rom-mcar-btn")).click(function() {
        return _this.showSetValueModal(_this.rom.getMcar(), 0xFFF, 12, function(val) {
          return _this.rom.setMcar(val);
        });
      });
    };

    RomController.prototype.getSelectedRomRow = function() {
      var row;
      row = $('#modal-rom-table\
              tbody\
              tr[class~="rom-selection-highlight"]');
      if (row.length !== 1) {
        ($('#modal-rom-table tbody tr')).removeClass('rom-selection-highlight');
        row = $('#modal-rom-table tbody tr:first-child');
      }
      return row;
    };

    RomController.prototype.showRomModal = function() {
      var row;
      row = this.getSelectedRomRow();
      row.trigger('click');
      return ($('#modal-rom')).modal('show');
    };

    return RomController;

  })(AbstractController);

}).call(this);

(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  this.ConductorPathView = (function() {

    function ConductorPathView(strokeStyle, fillEmpty, fillActive, lineWidth, pathWidth) {
      this.strokeStyle = strokeStyle != null ? strokeStyle : "#000";
      this.fillEmpty = fillEmpty != null ? fillEmpty : "#fff";
      this.fillActive = fillActive != null ? fillActive : "#f00";
      this.lineWidth = lineWidth != null ? lineWidth : 0.5;
      this.pathWidth = pathWidth != null ? pathWidth : 6;
      this.log = Utils.getLogger("ConductorPathView");
      this.createCanvas();
      this.resetActive();
      this.drawXBus();
      this.drawYBus();
    }

    ConductorPathView.prototype.resetActive = function() {
      this.activeX = [false, false, false, false, false, false, false, false];
      return this.activeY = [false, false, false, false, false, false, false, false, false];
    };

    ConductorPathView.prototype.setActiveX = function(register, val) {
      return this.activeX[register] = val;
    };

    ConductorPathView.prototype.setActiveY = function(register, val) {
      return this.activeY[register] = val;
    };

    ConductorPathView.prototype.drawXBus = function() {
      var endX, endY, middleY, offX, offY, register, xPos, yPos, _i;
      this.log.debug(function() {
        return "drawing x bus";
      });
      this.context.strokeStyle = this.strokeStyle;
      this.context.fillStyle = this.fillEmpty;
      this.context.lineWidth = this.lineWidth;
      xPos = $('#registers').offset().left - $('#overlay').offset().left + $('#registers').width();
      yPos = $('#registers-r0-btn').offset().top - $('#overlay').offset().top + $('#registers-r0-btn').height();
      offX = 30;
      offY = $('#registers-r1-btn').offset().top - $('#registers-r0-btn').offset().top;
      middleY = 255.5;
      endX = $('#alu-z-tf').offset().left - $('#overlay').offset().left + $('#alu-z-tf').width() / 2;
      endY = $('#alu-z-tf').offset().top - $('#overlay').offset().top;
      for (register = _i = 0; _i <= 7; register = ++_i) {
        this.context.beginPath();
        this.context.moveTo(xPos, yPos + register * offY);
        if (register === 0) {
          this.context.lineTo(xPos + offX + this.pathWidth, yPos + register * offY);
        } else {
          this.context.lineTo(xPos + offX, yPos + register * offY);
        }
        this.context.moveTo(xPos, yPos + this.pathWidth + register * offY);
        if (register === 7) {
          this.context.lineTo(xPos + offX + this.pathWidth, yPos + this.pathWidth + register * offY);
        } else {
          this.context.lineTo(xPos + offX, yPos + this.pathWidth + register * offY);
        }
        if (register !== 7) {
          this.context.lineTo(xPos + offX, yPos + (register + 1) * offY);
        }
        this.context.stroke();
        this.context.beginPath();
        this.context.rect(xPos, yPos + register * offY + 1, offX, this.pathWidth - 2);
        if (this.activeX[register] === true) {
          this.context.fillStyle = this.fillActive;
        }
        this.context.fill();
        this.context.fillStyle = this.fillEmpty;
      }
      if (__indexOf.call(this.activeX, true) >= 0) {
        this.context.fillStyle = this.fillActive;
      }
      this.context.beginPath();
      this.context.moveTo(xPos + offX + this.pathWidth, yPos);
      this.context.lineTo(xPos + offX + this.pathWidth, middleY);
      this.context.moveTo(xPos + offX + this.pathWidth, middleY + this.pathWidth);
      this.context.lineTo(xPos + offX + this.pathWidth, yPos + this.pathWidth + 7 * offY);
      this.context.stroke();
      this.context.beginPath();
      this.context.rect(xPos + offX + 1, yPos + 1, this.pathWidth - 2, 7 * offY + this.pathWidth - 1);
      this.context.fill();
      this.context.beginPath();
      this.context.moveTo(xPos + offX + this.pathWidth, middleY);
      this.context.lineTo(endX + this.pathWidth, middleY);
      this.context.lineTo(endX + this.pathWidth, endY);
      this.context.moveTo(xPos + offX + this.pathWidth, middleY + this.pathWidth);
      this.context.lineTo(endX, middleY + this.pathWidth);
      this.context.lineTo(endX, endY);
      this.context.stroke();
      this.context.beginPath();
      this.context.rect(xPos + offX + this.pathWidth, middleY + 1, endX - (xPos + offX + this.pathWidth), this.pathWidth - 2);
      this.context.rect(endX, middleY + 1, this.pathWidth - 2, endY - middleY - 1);
      return this.context.fill();
    };

    ConductorPathView.prototype.drawYBus = function() {
      var endX, endY, mdrX, mdrY, middleY, offX, offY, register, xPos, yPos, _i;
      this.log.debug(function() {
        return "drawing y bus";
      });
      this.context.strokeStyle = this.strokeStyle;
      this.context.fillStyle = this.fillEmpty;
      this.context.lineWidth = this.lineWidth;
      xPos = $('#registers').offset().left - $('#overlay').offset().left + $('#registers').width();
      yPos = $('#registers-r0-btn').offset().top - $('#overlay').offset().top + $('#registers-r0-btn').height() / 3;
      offX = 60;
      offY = $('#registers-r1-btn').offset().top - $('#registers-r0-btn').offset().top;
      middleY = 245.5;
      endX = $('#alu-y-tf').offset().left - $('#overlay').offset().left + $('#alu-y-tf').width() / 2;
      endY = $('#alu-y-tf').offset().top - $('#overlay').offset().top;
      mdrX = $('#ram').offset().left - $('#overlay').offset().left + $('#ram').width();
      mdrY = $('#ram-mdr-btn').offset().top - $('#overlay').offset().top + $('#ram-mdr-btn').height() / 2;
      this.context.beginPath();
      this.context.moveTo(mdrX, mdrY);
      this.context.lineTo(xPos + offX + this.pathWidth, mdrY);
      this.context.lineTo(xPos + offX + this.pathWidth, yPos);
      this.context.moveTo(mdrX, mdrY + this.pathWidth);
      this.context.lineTo(xPos + offX, mdrY + this.pathWidth);
      this.context.lineTo(xPos + offX, yPos);
      this.context.stroke();
      this.context.beginPath();
      this.context.rect(mdrX, mdrY + 1, xPos + offX - mdrX, this.pathWidth - 2);
      this.context.rect(xPos + offX, mdrY + 1, this.pathWidth - 2, yPos - mdrY);
      if (this.activeY[8] === true) {
        this.context.fillStyle = this.fillActive;
      }
      this.context.fill();
      this.context.fillStyle = this.fillEmpty;
      for (register = _i = 0; _i <= 7; register = ++_i) {
        this.context.beginPath();
        this.context.moveTo(xPos, yPos + register * offY);
        this.context.lineTo(xPos + offX, yPos + register * offY);
        this.context.moveTo(xPos, yPos + this.pathWidth + register * offY);
        if (register === 7) {
          this.context.lineTo(xPos + offX + this.pathWidth, yPos + this.pathWidth + register * offY);
        } else {
          this.context.lineTo(xPos + offX, yPos + this.pathWidth + register * offY);
          this.context.lineTo(xPos + offX, yPos + (register + 1) * offY);
        }
        this.context.stroke();
        this.context.beginPath();
        this.context.rect(xPos, yPos + register * offY + 1, offX, this.pathWidth - 2);
        if (this.activeY[register] === true) {
          this.context.fillStyle = this.fillActive;
        }
        this.context.fill();
        this.context.fillStyle = this.fillEmpty;
      }
      if (__indexOf.call(this.activeY, true) >= 0) {
        this.context.fillStyle = this.fillActive;
      }
      this.context.beginPath();
      this.context.moveTo(xPos + offX + this.pathWidth, yPos);
      this.context.lineTo(xPos + offX + this.pathWidth, middleY);
      this.context.moveTo(xPos + offX + this.pathWidth, middleY + this.pathWidth);
      this.context.lineTo(xPos + offX + this.pathWidth, yPos + this.pathWidth + 7 * offY);
      this.context.stroke();
      this.context.beginPath();
      this.context.rect(xPos + offX + 1, yPos + 1, this.pathWidth - 2, 7 * offY + this.pathWidth - 1);
      this.context.fill();
      this.context.beginPath();
      this.context.moveTo(xPos + offX + this.pathWidth, middleY);
      this.context.lineTo(endX + this.pathWidth, middleY);
      this.context.lineTo(endX + this.pathWidth, endY);
      this.context.moveTo(xPos + offX + this.pathWidth, middleY + this.pathWidth);
      this.context.lineTo(endX, middleY + this.pathWidth);
      this.context.lineTo(endX, endY);
      this.context.stroke();
      this.context.beginPath();
      this.context.rect(xPos + offX + this.pathWidth, middleY + 1, endX - (xPos + offX + this.pathWidth), this.pathWidth - 2);
      this.context.rect(endX, middleY + 1, this.pathWidth - 2, endY - middleY - 1);
      return this.context.fill();
    };

    ConductorPathView.prototype.createCanvas = function() {
      this.canvas = document.getElementById('canvas');
      return this.context = this.canvas.getContext('2d');
    };

    ConductorPathView.prototype.clearCanvas = function() {
      return this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    ConductorPathView.prototype.redraw = function() {
      this.clearCanvas();
      this.drawXBus();
      return this.drawYBus();
    };

    return ConductorPathView;

  })();

}).call(this);

(function() {

  $(document).ready(function() {
    return new CpuController();
  });

}).call(this);
