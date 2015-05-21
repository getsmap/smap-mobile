
L.Control.MMP = L.Control.extend({
	options: {
		position: 'bottomright',
		forcedDomain: null,
		wsSave: "//gkkundservice.test.malmo.se/KartService.svc/saveGeometry"
	},
	
	_lang: {
		"sv": {
			btnLabel: "Spara",
			clickHereToSave: "Klicka här för att spara positionen",
			dragMe: '<ol><li>Dra markören till platsen som ärendet avser</li>'+
				'<li>Zooma in så långt som möjligt</li>'+
				'<li>Tryck sen på <b><span class="fa fa-save" style="margin-right: 4px;"></span>Spara</b></li></ol>'
		},
		"en": {
			btnLabel: "Save",
			clickHereToSave: "Click here to save new position",
			dragMe: 'Drag the marker and then press <b>"Save"</b>.'
		}
	},
	
	_setLang: function(langCode) {
		langCode = langCode || smap.config.langCode;
		if (this._lang) {
			this.lang = this._lang ? this._lang[langCode] : null;
		}
	},

	initialize: function(options) {
		L.setOptions(this, options);
		this._setLang(options.langCode);
	},

	onAdd: function(map) {
		if (document.domain === "kartor.malmo.se" && this.options.forcedDomain) {
			// Solve cross-domain issue between iframe and parent
			document.domain = this.options.forcedDomain;
		}
		this.map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-mmp');
		L.DomEvent.disableClickPropagation(this._container);
		this.$container = $(this._container);
		this._createBtn();

		var self = this;
		smap.event.on("smap.core.beforeapplyparams", function(e, p) {
			// Make the category layer visible so we can snap to it
			var ol = p.OL || "";
			ol = ol.split(",");
			ol.push(p.CATEGORY);
			ol = ol.join(",");
			p.OL = ol;
		});
		smap.event.on("smap.core.applyparams", function(e, p) {
			// self._snapLayer = smap.cmd.getLayer(p.CATEGORY);
			// if (self._snapLayer) {
			// 	self._addEditInterface();
			// }

			var xy3008 = null,
				latLng = null;
			if (p.MMP_XY) {
				var xy3008 = p.MMP_XY instanceof Array ? p.MMP_XY : p.MMP_XY.split(",");

				// Convert items into floats
				xy3008 = $.map(xy3008, function(val) {
					return parseFloat(val);
				});
				latLng = utils.projectLatLng(L.latLng(xy3008), "EPSG:3008", "EPSG:4326", true, false);
			}
			if (p.MMP_ID) {
				// This id is used by MMP to connect the report with the map data we return to them
				self._tempId = p.MMP_ID; // parseInt needed?
			}
			self._startEditAtLatLng(latLng);


		});
		return this._container;
	},

	onRemove: function(map) {},

	_save: function(data) {

		var url = this.options.wsSave;
		if (document.domain === "localhost") {
			// For debug
			url = url.replace("gkkundservice.test.malmo.se", "localhost");
		}
		else if (document.domain === "kartor.malmo.se") {
			// While testing, and maybe keep after deploy
			url = url.replace("gkkundservice.test.malmo.se/KartService.svc", "kartor.malmo.se/gkkundservicedev");
		}

		smap.cmd.loading(true);
		$.ajax({
			url: url,
			type: "GET",
			data: data,
			context: this,
			dataType: "json",
			success: function(resp) {
				if (resp.success) {
					// Save successful
					alert("Success, indeed yes");
				}
				else {
					alert("Could not save because "+resp.msg+". Error code: "+resp.code);
				}
				// "Reset" the map
				this._tempId = null;
			},
			error: function(a, b, c) {
				alert("Could not save because: "+b);
			},
			complete: function() {
				smap.cmd.loading(false);
			}
		});
	},

	save: function() {
		var self = this;
		// var p = this.map.getCenter();

		// setTimeout(function() {
		// 	var data = {easting: self._latLng.lng, northing: self._latLng.lat};
		// 	parent.$("body").trigger("smap:updatedata", data);
		// 	smap.cmd.loading(false);
		// }, 1000);

		// -- Create params --

		var p3008 = utils.projectPoint(this._latLng.lng, this._latLng.lat, "EPSG:4326", "EPSG:3008");
		var east = p3008[0],
			north = p3008[1];
		var selectWmsInst = smap.cmd.getControl("SelectWMS");
		if (!selectWmsInst) {
			alert("MMP plugin requires plugin SelectWMS");
			return false;
		}

		function getFeatureInfo(typeName, latLng) {
			var wsGeoserver = "//kartor.malmo.se/geoserver/malmows/wms";
			if (document.domain === "localhost") {
				// For debug
				wsGeoserver = wsGeoserver.replace("kartor.malmo.se", "localhost");
			}
			var wfsParams = selectWmsInst._makeParams({
					layers: typeName,
					version: "1.1.0", 
					info_format: "application/json",
					latLng: latLng,
					srs: "EPSG:4326",
					buffer: 1,
					feature_count: 1
			});
			return $.ajax({
				url: wsGeoserver,
				data: wfsParams,
				context: this,
				dataType: "json"
			});
		}

		// The requests/extractions is to be made from these layers, using given attributes.
		var arrInfoLayers = [
			{
				typeName: "malmows:SMA_DELOMRADE_P",
				keyVals: {
					delomr: "delomrade"
				}
			},
			{
				typeName: "malmows:SMA_STADSDEL_P",
				keyVals: {
					sdfname: "stadsdel"
				}
			},
			{
				typeName: "malmows:SMA_STADSOMRADEN_P",
				keyVals: {
					sdf_namn: "stadsomrade"
				}
			}
		];

		// Create one deferred object for each layer to be requested.
		// When all deferreds are done, the when-function further done 
		// will process the resolved result from each deferred.
		var t, defs = [];
		for (var i=0,len=arrInfoLayers.length; i<len; i++) {
			t = arrInfoLayers[i];
			defs.push( $.Deferred() );
			getFeatureInfo(t.typeName, this._latLng).done(function(resp) {
				var fs = resp.features || [];
				var f = fs[0];
				var tt, keyVals,
					def;

				// Get the correct config object by checking which request we are dealing with
				for (var j = 0; j < arrInfoLayers.length; j++) {
					tt = arrInfoLayers[j];
					if (tt.typeName.split(":")[1] === f.id.split(".")[0]) {
						keyVals = tt.keyVals;
						def = defs[j];
						break;
					}
				}
				var p = f.properties,
					out = {},
					kv;
				for (kv in keyVals) {
					out[keyVals[kv]] = p[kv];
				}
				def.resolve(out);
			}).fail(function(a, b, c) {
				defs[i].reject({});
			});
		}

		// -- Get-nearest-address deferred object --
		
		var dAddress = $.Deferred();  // Nearest address
		defs.push(dAddress);
		var wsAddressLocate = "//kartor.malmo.se/api/v1/nearest_address/";
		if (document.domain === "localhost") {
			// For debug
			wsAddressLocate = wsAddressLocate.replace("kartor.malmo.se", "localhost");
		}

		$.ajax({
			url: wsAddressLocate,
			data: {
				e: east,
				n: north
			},
			context: this,
			dataType: "json",
			success: function(resp) {
				var t = resp.address[0];
				dAddress.resolve({
					namn: t.address
					// address_distm: t.distance
				});
			},
			error: function(a, b, c) {
				dAddress.reject({});
			}
		});

		// http://kartor.malmo.se:8080/geoserver/malmows/wms?service=WMS&version=1.1.0&request=GetMap&layers=malmows:gk_entreprenorsomr_p&styles=&bbox=111087.4296875,6153218.0,128122.8046875,6168696.5&width=512&height=465&srs=EPSG:3008&format=application/openlayers
		// http://kartor.malmo.se/api/v1/gk_entreprenorsomr/?e=119139&n=6164197
		// http://kartor.malmo.se/api/v1/nearest_address/?e=119149&n=6164197


		// 3. Merge the requests into one. Save into MMPs service when done.
		smap.cmd.loading(true);
		// $.when.apply($, defs).done(function() {
		$.when.apply($, defs).done(function(a,b,c,d,e) {
			var data = {
					tempId: self._tempId || null,
					x: parseInt(east),
					y: parseInt(north)
			};
			// Extend the output object with responses from the ajax calls
			for (var i=0,len=arguments.length; i<len; i++) {
				$.extend(data, arguments[i]);
			}
			// alert(JSON.stringify(data));
			self._save(data);

		}).always(function() {
			smap.cmd.loading(false);
		}).fail(function(a, b) {
			console.log("Could not save location because: None or erroneous response from one or more services.");
		});

	},

	_createBtn: function() {
		var self = this;

		this.$btn = $('<button id="smap-mmp-btn" disabled title="' + self.lang.clickHereToSave + '" class="btn btn-default"><span class="fa fa-save"></span></button>');
		this.$btn.on("click", function () {
			self.save();
			return false;
		});
		this.$container.append(this.$btn);
	},

	// _addSnapping: function(marker) {
	// 	marker.snapediting = new L.Handler.MarkerSnap(this.map, marker);
	// 	marker.snapediting.addGuideLayer(this._snapLayer);
	// 	marker.snapediting.enable();
	// },

	_startEditAtLatLng: function(latLng) {
		var self = this;
		if (!latLng) {
			latLng = this.map.getCenter();
		}
		var marker = L.marker(latLng, {
				draggable: true
		});
		marker.bindPopup(this.lang.dragMe);
		marker.on("dragstart", function(e) {
			e.target.closePopup();
		});
		marker.on("dragend", function(e) {
			$("#smap-mmp-btn").prop("disabled", false).tooltip({
				// title: self.lang.clickHereToSave,
				placement: "bottom"
			}).tooltip("show");

			// e.target.openPopup();
			self._latLng = e.target.getLatLng();
		});
		this.map.addLayer(marker);
		// this._addSnapping(marker);
		marker.openPopup();
	}
});





















//L.control.template = function (options) {
//	return new L.Control.Template(options);
//};