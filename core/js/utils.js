﻿var utils = {
		rmPx: function(text) {
			if (text && text.replace)
				return parseInt( text.replace(/px/gi, "").replace(/em/gi, "").replace(/pt/gi, "") );
			return text;
		},
		
		log: function(msg) {
			if (window.console) {
				window.console.log(msg);
			}
		},

		isTouchOnly: function() {
			return (L.Browser.touch && L.Browser.msPointer) || (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf("windows phone") > -1);
		},

		capitalize: function(theString) {
			return theString.charAt(0).toUpperCase() + theString.slice(1);
		},

		addImageLoadIndicator: function($img, options) {
			options = options || {};

			var defaults = {
				"height": "100px"
			};
			$.extend(defaults, options);


			var $indicator = $('<div class="img-load-indicator"><i class="fa fa-spinner"></i></div>');
			$indicator.css("height", "100px");	
			$img.before( $indicator );
			$img.addClass("hidden img-smooth-loading");
			$img.on("load", function() {
				var $this = $(this);
				$this.prev(".img-load-indicator").remove();
				$this.removeClass("hidden");
				setTimeout(function() {
					$this.addClass("img-fade-in");
				}, 200);
			});
		},

		/**
		 * Python/C like insert using %s. E.g.
		 * utils.textInsert('First name is %s and surname is %s.', ["Sven", "Svensson"]);
		 * Result -> 'First name is Sven and surname is Svensson.'
		 * 
		 * @param  {String} textString
		 * @param  {Array} valueArr 
		 * @return {String}
		 */
		textInsert: function(textString, valueArr) {
			for (var i=0,len=valueArr.length; i<len; i++) {
				textString = textString.replace("%s", valueArr[i]);
			}
			return textString;
		},

		getBrowser: function() {
			var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
    		var ieVersion = match ? parseInt(match[1]) : undefined;

			return {
				ie: match,
				ieVersion: ieVersion,
				ie8: ieVersion === 8,
				ie9: ieVersion === 9,
				ie10: ieVersion === 10,
				ie11: ieVersion === 11
			};
		},

		urlAppend: function(baseUrl, params, separator) {
			separator = separator || "?";

			var sepReg = separator === "?" ? /\?/g : /#/g;

			var lastChar = params.charAt(params.length-1);
			// Remove any trailing "&"
			if (lastChar === "&") {
				baseUrl = lastChar.substring(0, params.length-1);
			}

			// Add separator
			if (baseUrl.search(sepReg) === -1) {
				baseUrl += separator;
			}
			return baseUrl + params;
		},

		isInIframe: function() {
			return top.location != self.location;
		},
		
		/**
		 * Remove all duplicates in the array.
		 * @param arr {Array}
		 * @returns {Array} A new array containing only unique values.
		 */
		makeUniqueArr: function(arr) {
			var newArr = [];
			$.each(arr, function(i, val) {
				if ( $.inArray(val, newArr) === -1) {
					newArr.push(val);
				}
			});
			return newArr;
		},

		/**
		 * Transforms all keys in an object into upper-case.
		 * @param  {Object} o
		 * @return {Object} Upper-case object.
		 */
		objectToUpperCase: function(o) {
			var out = {};
			for (var key in o) {
				out[key.toUpperCase()] = o[key];
			}
			return out;
		},
		
		drawDialog: function(title, bodyContent, footerContent, options) {
			options = options || {};
			
			options.size = options.size || "";
			
			var d = $('<div class="modal fade"><div class="modal-dialog">'+
				'<div class="modal-content">'+
			  '<div class="modal-header">'+
				'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
				(title.search(/</g) === -1 ? '<h4 class="modal-title">'+title+'</h4>' : title) + 
			  '</div>'+
			  '<div class="modal-body"></div>'+
			'</div>');
			d.find(".modal-body").append(bodyContent);
			if (footerContent) {
				var footer = $('<div class="modal-footer"></div>');
				d.find(".modal-body").after(footer);
				footer.append(footerContent);
			}
			
			if (options.size) {
				// d.addClass("modal-"+options.size);
				d.find(".modal-dialog").addClass("modal-"+options.size);
			}
			
			return d;
		},
		
		/**
		 * Due to the way Leaflet is designed, a feature is packed inside
		 * a layer (which is actually more like "true" feature). To be able to
		 * do anything with the feature, one must find its layer – which is the
		 * purpose of this function.
		 * @param parentLayer {L.Layer} The layer containing other layers, of which one layer must contain our feature.
		 * @param feature {Object} A Leaflet feature, who's layer we want to find. This layer must be added to the parentLayer.
		 * @returns {L.Layer | null}
		 */
		getLayerFromFeature: function(feature, parentLayer) {
			var layersObj = parentLayer._layers;
			for (var nbr in layersObj) {
				var _lay = layersObj[nbr];
				if (_lay.feature && _lay.feature.id === feature.id) {
					return _lay;
				}
			}
			return null;
		},
		
		round: function(val, nbrOfDecimals) {
			var exp = Math.pow(10, nbrOfDecimals || 0);
			return Math.round(val * exp) / exp;
		},
		
		makeUnselectable: function(tag) {
			tag.attr("unselectable", "unselectable").addClass("unselectable");
		},
		
		extractToHtml: function(html, props) {
			if (!props) {
				return "";
			}
			function getFunctionEnd(text) {
				var p = 1,
					found = false,
					startIndex = text.search(/\{/g); // get starting "{"
				text = text.substring(startIndex+1);
				var i=0;			
				for (i=0,len=text.length; i<len; i++) {
					if (text.charAt(i) === "{") {
						p += 1;
					}
					else if (text.charAt(i) === "}") {
						p -= 1;
					}
					if (p === 0) {
						found = true;
						i = i + startIndex + 2;
						break;
					}
				}
				if (!found) {
					i = -1;
				}
				return i;
			};
			
			
			function extractAttribute(a, txt) {
				var index = txt.search(/\${/g);
				if (index !== -1) {
					var extractedAttribute = "";
					
					// Find the end of the attribute
					var attr = html.substring(index + 2);
					var endIndex = 0;
					if (attr.substring(0, 8) === "function") {
						endIndex = getFunctionEnd(attr);
					}
					else {
						endIndex = attr.search(/\}/g);
					}
					attr = attr.substring(0, endIndex);
					
					if (attr.substring(0, 8) === "function") {
						var theFunc = attr.replace("function", "function f");
						eval(theFunc);
						extractedAttribute = f.call(this, a);
					}
					else {
						// Replace ${...} by the extracted attribute.
						
						// Check if any parameter was sent in here
						var paramsArr = attr.split(",");
						if (paramsArr.length > 1) {
							var firstParam = $.trim(paramsArr[0]),
								secondParam = $.trim(paramsArr[1]);
							extractedAttribute = a[firstParam] || "";
							if (secondParam && parseInt(secondParam) === 1) {
								// Decode parameter
								try {
									extractedAttribute = decodeURIComponent(extractedAttribute);
								}
								catch(e) {}
							}
						}
						else {
							extractedAttribute = a[attr] || ""; // If attribute does not exist – use empty string "".
						}
					}
					txt = txt.replace("${"+attr+"}", extractedAttribute && extractedAttribute.replace ? extractedAttribute.replace(/^\'+|\'+$/gm,'') : extractedAttribute );
				}
				return txt;
			}
			
			//If a selectable layer misses a popup parameter in config.
			if( typeof html === 'undefined' ){
				html = null;
				return html;
			}

			// Extract props until there are no left to extract.
			var index = html.search(/\${/g);
			while (index !== -1) {
				html = extractAttribute(props, html);			
				index = html.search(/\${/g);
			}
			return html;
		},

		/**
		 * Create a label that can be added to the map.
		 * @param  {Array|L.LatLng} center
		 * @param  {String|HTML} html
		 * @return {L.Marker]}
		 */
		createLabel: function(center, html, className) {
			className = className || "leaflet-maplabel";
			var label = L.marker(center, {
					icon: new L.DivIcon({
						iconSize: null,
						className: className,
						// iconAnchor: L.point(100, 50),
						html: '<div>'+html+'</div>'
					})
			});
			label.options._noprint = true;
			label.options.clickable = false;
			label.options.selectable = false;
			return label;
		},

		/**
		 * Get real-world distance from an array of latLng.
		 * @param  {Array({LatLng})} arrLatLng Array containing latLngs
		 * @return {Integer} Length of polyline in meters.
		 */
		getLength: function(arrLatLng) {
			var dist = 0, i;
			for (i=0,len=arrLatLng.length-1; i<len; i++) {
				dist += arrLatLng[i].distanceTo(arrLatLng[i+1]);
			}
			return dist; // in meters
		},

		paramsStringToObject: function(pString, keysToUpperCase) {
			keysToUpperCase = keysToUpperCase || false;

			// The following code taken and modified from OpenLayers 2.13.1.
			var out = {},
				key, value, keyValue,
				pairs = pString.split(/[&;]/);
			for (var i=0,len=pairs.length; i<len; i++) {
				keyValue = pairs[i].split('=');
				if (keyValue[0]) {
					key = keyValue[0];
					try {
						key = decodeURIComponent(key);
					} catch (err) {
						key = unescape(key);
					}
					// being liberal by replacing "+" with " "
					value = (keyValue[1] || '').replace(/\+/g, " ");
					try {
						value = decodeURIComponent(value);
					} catch (err) {
						value = unescape(value);
					}
					// follow OGC convention of comma delimited values
					value = value.split(",");

					//if there's only one value, do not return as array					
					if (value.length == 1) {
						value = value[0];
					}
					if (keysToUpperCase) {
						key = key.toUpperCase();
					}
					out[key] = value;
				 }
			}
			return out;
		},

		projectPoint: function(east, north, srsSrc, srsDest) {
			return window.proj4(srsSrc, srsDest, [east, north]);
		},

		projectLatLng: function(latLng, srsSrc, srsDest, reverseAxisSrc, reverseAxisDest) {
			var coords = reverseAxisSrc ? [latLng.lat, latLng.lng] : [latLng.lng, latLng.lat];
			var arr = window.proj4(srsSrc, srsDest, coords);
			var outLatLng = reverseAxisDest ? L.latLng(arr[0], arr[1]) : L.latLng(arr[1], arr[0]);
			return outLatLng;
		},


		projectFeature: function(feature, inputCrs, outputCrs, options) {
			options = options || {};

			var decimals = options.decimals;
			var doRound = options.decimals || options.decimals === 0 ? true : false;


			var roundIt = this.round;

			var _projectPoint = this.projectPoint;
			function projectPoint(coordinates, inputCrs) {
				var out = _projectPoint(coordinates[0], coordinates[1], inputCrs, outputCrs);
				if (doRound) {
					out = [roundIt(out[0], decimals), roundIt(out[1], decimals)];
				}
				return out;
			};

			function swapCoords(coords) {
				return [coords[1], coords[0]];
			};
			
			var coords, coordsArr, projectedCoords, i, p, geom;
			
			geom = feature.geometry;
			switch (geom.type) {
				case "Point":
					coords = geom.coordinates;
					if (options.reverseAxisInput) {
						coords = swapCoords(coords);
					}
					projectedCoords = projectPoint(coords, inputCrs);
					if (options.reverseAxisOutput) {
						projectedCoords = swapCoords(projectedCoords);
					}
					geom.coordinates = projectedCoords;
					break;
				case "MultiPoint":
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coords = geom.coordinates[p];
						if (options.reverseAxisInput) {
							coords = swapCoords(coords);
						}
						projectedCoords = projectPoint(coords, inputCrs);
						if (options.reverseAxisOutput) {
							projectedCoords = swapCoords(projectedCoords);
						}
						geom.coordinates[p] = projectedCoords;
					}
					break;
				case "LineString":
					// TODO Not yet tested
					coordsArr = geom.coordinates;
					for (p=0, lenP=coordsArr.length; p<lenP; p++) {
						coords = coordsArr[p];
						if (options.reverseAxisInput) {
							coords = swapCoords( coords );
						}
						projectedCoords = projectPoint(coords, inputCrs);
						if (options.reverseAxisOutput) {
							projectedCoords = swapCoords(projectedCoords);
						}
						coordsArr[p] = projectedCoords;
					}
					break;
				case "MultiLineString":
					coordsArr = [];
					var pp, len2, len3;
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coordsArr = geom.coordinates[p];
						for (pp=0, len3=coordsArr.length; pp<len3; pp++) {
							coords = coordsArr[pp];
							if (options.reverseAxisInput) {
								coords = swapCoords( coords );
							}
							projectedCoords = projectPoint(coords, inputCrs);
							if (options.reverseAxisOutput) {
								projectedCoords = swapCoords(projectedCoords);
							}
							coordsArr[pp] = projectedCoords;
						}
						geom.coordinates[p] = coordsArr; // needed?
					}
					break;
				case "Polygon":
					coordsArr = geom.coordinates[0];
					for (p=0, lenP=coordsArr.length; p<lenP; p++) {
						coords = coordsArr[p];
						if (options.reverseAxisInput) {
							coords = swapCoords( coords );
						}
						projectedCoords = projectPoint(coords, inputCrs);
						if (options.reverseAxisOutput) {
							projectedCoords = swapCoords(projectedCoords);
						}
						coordsArr[p] = projectedCoords;
					}
					break;
				case "MultiPolygon":
					coordsArr = [];
					var pp, ppp, len2, len3, len4, coordsArr2;
					for (p=0, len2=geom.coordinates.length; p<len2; p++) {
						coordsArr = geom.coordinates[p];
						for (pp=0, len3=coordsArr.length; pp<len3; pp++) {
							coordsArr2 = coordsArr[pp];
							for (ppp=0, len4=coordsArr2.length; ppp<len4; ppp++) {
								coords = coordsArr2[ppp];
								if (options.reverseAxisInput) {
									coords = swapCoords( coords );
								}
								projectedCoords = projectPoint(coords, inputCrs);
								if (options.reverseAxisOutput) {
									projectedCoords = swapCoords(projectedCoords);
								}
								coordsArr2[ppp] = projectedCoords;
							}
						}
					}
					break;
			}
		}
		
		
};