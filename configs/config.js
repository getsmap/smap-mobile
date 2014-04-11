
var config = {
		 
		ws: {
			"localhost": {
				proxy: "http://localhost/cgi-bin/proxy.py?url="
			},
			"xyz.malmo.se": {
				proxy: "http://xyz.malmo.se/myproxy/proxy.py?url="
			},
            "mobile.smap.se": {
                proxy: "http://mobile.smap.se/smap-mobile/ws/proxy.py?url="
            },
			"91.123.201.52": {
				proxy: "http://91.123.201.52/cgi-bin/proxy.py?url="
			}
		},
		
		ol: [
	    	 {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "gangstig",
	    			 displayName: "Gångstig",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 uniqueKey: "objectid",
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "gangstig2",
	    			 displayName: "Gångstig2",
	    			 layers: 'sandboxws:regisln',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Beläggning: ${belaggning}</p><p>${shape_leng}</p>"
	    		 }
		     },
		     {
	    		 init: "L.TileLayer.WMS",
	    		 url: "http://geoserver.smap.se/geoserver/wms",
	    		 options: {
	    			 layerId: "cykelvag",
	    			 displayName: "Cykelväg",
	    			 layers: 'malmows:GK_CYKELVAG_L',
	    			 format: 'image/png',
	    			 selectable: true,
	    			 transparent: true,
	    			 attribution: "@ Malmö Stadsbyggnadskontor",
	    			 popup: "<h3>${_displayName}</h3><p>Typ: ${typ}</p><p>Geom: ${geom}</p>"
	    		 }
		     },
		     {
					init: "L.GeoJSON.WFS",
					url: "http://193.17.67.229/sbkqgis/cgi-bin/externt/kkarta/qgis_mapserv.fcgi",
					options: {
						layerId: "wfstest_qgis_server",
						displayName: "Elnät Kristianstad",
						attribution: "Kristianstads WFS",
						inputCrs: "EPSG:3008",
						reverseAxis: false,
						reverseAxisBbox: false,
						selectable: true,
						popup: 'agare: ${agare}',
						uniqueKey: "id",
						params: {
							typeName: "c4elnat",
							srsName: "EPSG:3008",
							format: "text/geojson",
							maxFeatures: 10000,
							outputFormat: "GeoJSON"
						},
						hoverColor: '#FF0',
						style: {
							weight: 2,
							color: '#F00',
							dashArray: '',
							opacity: .5
						}
					}
				},
		     {
		    	 init: "L.GeoJSON.WFS",
		    	 url: "http://geoserver.smap.se/geoserver/wfs",
		    	 options: {
		    	 	layerId: "malmows_STADSDEL_L",
		    	 	displayName: "Stadsdel Linje",
		    	 	attribution: "Malmö stads WFS",
		    	 	inputCrs: "EPSG:3008",
		    	 	reverseAxis: false,
		    	 	reverseAxisBbox: true,
		    	 	selectable: true,
		    	 	popup: 'The FID: ${fid}',
		    	 	uniqueKey: null,
		    	 	params: {
			    	 	typeName: "malmows:STADSDEL_L",
						version: "1.1.0",
						maxFeatures: 10000,
						format: "text/geojson",
						outputFormat: "json"
		     		},
		     		hoverColor: '#FF0',
		     		style: {
		     			weight: 6,
		     			color: '#F00',
		     			dashArray: '',
		     			opacity: 0.1
		     		},
		     		selectStyle: {
		    			weight: 5,
		    	        color: '#00FF00',
		    	        opacity: 1
		    		}
		     	}
		     },
		     {
				  init: "L.GeoJSON.WFS",
				  url: "http://geoserver.smap.se/geoserver/wfs",
				  options: {
					  layerId: "malmows_ulf_stadsdel",
					  displayName: "Kvarter",
					  attribution: "Malmö stads WFS",
					  inputCrs: "EPSG:3008",
					  reverseAxis: false,
					  reverseAxisBbox: true,
					  selectable: true,
					  popup: 'The FID: ${fid}',
					  uniqueKey: "easting,northing",
					  params: {
				    	 	typeName: "malmows:SUM_KVARTER_P",
							version: "1.1.0",
							maxFeatures: 10000,
							format: "text/geojson",
							outputFormat: "json"
			     		},
					  hoverColor: '#FF0',
					  style: {
						  weight: 2,
						  color: '#F00',
						  dashArray: '',
						  fillOpacity: 0.5
					  }
				  }
		     },
			 {
				init: "L.GeoJSON.Custom",
				url: 'http://www.vakant.nu/gis_json.aspx?',
				options: {
					layerId: "vakant_mark",
					displayName: "Vakant Mark",
					params: {
						mId : "1290",
						type : "Mark"
					},
					selectable: true,
					popup: 'Owner: ${owner_name}',
					style: {
						radius: 8,
						fillColor: "#ff7800",
						color: "#f00",
						weight: 1,
						opacity: 1,
						fillOpacity: 0.8
					}
				}
			}
//		     ,
//		     {
//				  init: "L.GeoJSON.WFS",
//				  url: "http://geoserver.smap.se/geoserver/wfs",
//				  options: {
//					  layerId: "intressepunkter",
//					  displayName: "Intressepunkter",
//					  featureType: "sandboxws:regispt",
//					  attribution: "Malmö stads WFS",
//					  inputCrs: "EPSG:3008",
//					  reverseAxis: false,
//					  popup: '<h1>${namn}</h1><p>En popup med en bild</p><img style="width:200px;max-height:200px;" src="${picture}"></img>',
//					  bigPopup: {
//						  headerHtml: "${namn}",
//						  srcVideo: '<video controls="controls" autoplay width="240" height="135">' +
//				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.m4v" type="video/mp4" />' +
//				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.webm" type="video/webm" />' +
//				        	   			'<source src="http://geoserver.smap.se/~cleber/regis1330/video/video_061.ogg" type="video/ogg" />' +
//			        	   			'</video>',
//			        	   	srcImage: '${pictures}',
//			        	   	srcAudio: '${video}'
//			        }
//		  		}
//		     }
		     ],
		     
		bl: [
  	 	{
			init: "L.TileLayer",
			url: "http://{s}.tile.cloudmade.com/f02f33a9158a425199542d3493b9189d/998/256/{z}/{x}/{y}.png",
			options: {
				layerId: "osm",
				displayName: "OSM"
			}
		},

	 	{
			init: "L.TileLayer",
			url: 'http://xyz.malmo.se/data_e/Tilecache/malmo/malmo_leaflet_cache_EPSG900913/{z}/{x}/{y}.jpeg',
			options: {
				layerId: "malmotile",
				displayName: "Malmö karta",
				attribution: "© Malmö Stadsbyggnadskontor",
				minZoom: 6,
				maxZoom: 18,
				tms: true
			}
		},


		
		{
			init: "L.TileLayer.WMS",
			url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',  // gwc/service/
			options: {
				layerId: "wms-op",
				displayName: "WMS-op",
				layers: "malmows:smap-mobile-bakgrundskarta",
				format: 'image/jpeg',
				subdomains: ["xyz"],
				transparent: true,
				minZoom: 6,
				maxZoom: 18,
				tiled: true
			}
		},		
//		{
//			init: "L.TileLayer.WMS",
//			url: 'http://xyz.malmo.se/geoserver/gwc/service/wms',  // gwc/service/
//			options: {
//				layerId: "wms-topo",
//				displayName: "WMS-Topo (OBS! endast för test)",
//				layers: "malmows:smap-mobile-bakgrundskarta-topo",
//				format: 'image/jpeg',
//				subdomains: ["xyz"],
//				transparent: true,
//				minZoom: 6,
//				maxZoom: 18,
//				tiled: true
//			}
//		},
		{
			init: "L.TileLayer.WMS",
			url: 'http://geoserver.smap.se/geoserver/gwc/service/wms',  // gwc/service/
			options: {
				layerId: "wms",
				displayName: "WMS",
				layers: "malmows:MALMO_SMA_DELOMR_P_3857_TEST2",
				format: 'image/png',
				subdomains: ["xyz"],
				transparent: true,
				minZoom: 1,
				maxZoom: 18,
				tiled: true
			}
		}
//	    {
//			init: "L.TileLayer",
//			url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//			options: {
//				layerId: "osm",
//				displayName: "OSM",
//				attribution: '<span>© OpenStreetMap contributors</span>&nbsp;|&nbsp;<span>Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"></span>',
//				maxZoom: 18
//			}
//		}
		],
		
		plugins: [
		           {
		        	   init: "L.Control.Scale",
		        	   options: {
		        		   imperial: false
		        	   }
		           },
		           {
		        	   init: "L.Control.LayerSwitcher",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.Geolocate",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.SelectWMS",
		        	   options: {
		        		   buffer: 5
		        	   }
		           },
//		           {
//		        	   init: "L.Control.MyPlugin",
//		        	   options: {
//		        	   		position: "bottomright"
//		        	   }
//		           },
//		           {
//		        	   init: "L.Control.ShareTweet",
//		        	   options: {}
//		           },
		           {
		        	   init: "L.Control.SharePosition",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.Search",
		        	   options: {}
		           },
		           {
		        	   init: "L.Control.Info",
		        	   options: {}
		           },
                    {
                        init: "L.Control.Zoombar",
                        options: {}
                    }
                    ,
                    {
                        init: "L.Control.ShareLink",
                        options: {}
                    }
//		           ,
//		           {
//		           	   init: "L.Control.SideBars",
//		           	   options: {}
//		           }
		           
       ]
		
		
};

// Set proxy for WFS
L.GeoJSON.WFS.proxy = config.ws[document.domain].proxy;

// Set proxy for SelectWMS
L.Control.SelectWMS.proxy = config.ws[document.domain].proxy;
