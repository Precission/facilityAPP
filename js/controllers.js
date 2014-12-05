'use strict';

/* Controllers */

/*  It has become considered better practise to separate controllers into
    different files. Not like it's done here. See angular-seed for an example
    of how it's done (this is based on angular-seed one year ago.

    Note that when you get an object from a $resource, this object
    automatically gets some $get/$save methods that can use if you want to
    update or save the object again onto the server.

    See: https://docs.angularjs.org/api/ngResource/service/$resource for info
*/

angular.module('myApp.controllers', ['ui.bootstrap']).
    controller('MyCtrl1', ['$scope', 'MeService', 'ProfileService',
        function ($scope, MeService, ProfileService) {

        $scope.dhisAPI = dhisAPI;

        $scope.me = MeService.get(function () {
            console.log('$scope.me='+JSON.stringify($scope.me));
        });

        $scope.refreshMe = function() {
            $scope.me.$get();
        };

        $scope.profile = ProfileService.get(function () {
            console.log('$scope.profie='+JSON.stringify($scope.profile));
        });

        $scope.saveProfile = function() {
            $scope.profile.$save({}, function() {
                    alert("Profile saved successfully.");
                },
                function() {
                    alert("Profile save failed.");
                }
            );
            console.log('$scope.profie='+JSON.stringify($scope.profile));
        };
    }])
    .controller('MyUnitCtrl', ['$scope', '$http', 'OrgUnits', 'SpecificUnit',
        function ($scope, $http, OrgUnits, SpecificUnit) {
        //Use for dropp down facility view:
        $scope.oneViewOn = true;
        $scope.showExtraUnitData = false;
        $scope.status = {
            viewOpen: true,
            viewClosed: false
        };
        $scope.currentFacility = NaN; // current facility
        //function for the edit unit button
        $scope.editUnit = function(myId) {
          $scope.showExtraUnitData = !$scope.showExtraUnitData;
          $scope.getSpecific(myId);
        };
        $scope.exitUnit = function() {
          $scope.showExtraUnitData = !$scope.showExtraUnitData;
        };
        // inital scope:
        $scope.dhisAPI = dhisAPI;

        $scope.me = OrgUnits.get(function () {
            console.log('$scope.me='+JSON.stringify($scope.me));
        });

        $scope.refreshMe = function() {
            $scope.me.$get();
            console.log("RefreshMe function is run")
        };

	//gets specific facility api
        $scope.getSpecific = function(myId) {
                $scope.mySpecific = SpecificUnit.get({id:myId}, function() {
                        console.log("mySpecific="+JSON.stringify($scope.mySpecific));
                });
        };

	//saves specific facility changes
        $scope.saveSpecific = function () {
            console.log('Saving setting:'+JSON.stringify($scope.mySpecific));
            $scope.mySpecific.$save({}, function() {
                $scope.showExtraUnitData = false;
                $scope.me.$get();
                alert("Data saved successfully.");
            });
        }
	
	//search related functions:
	$scope.search = "";

        $scope.searchAll = function() {
            if ($scope.search != null) {
                console.log("Searching all " + $scope.page);
                $http.get("http://inf5750-23.uio.no/api/organisationUnits?paging=false").
                success(function(data, status, headers, config) {
                    $scope.me = data;
                    console.log('$scope.me='+JSON.stringify($scope.me));
                }).
                error(function(data, status, headers, config) {
                   console.log('Failed: searchAll');
                });
            }
        };
	$scope.resetPage = function() {
            if ($scope.search != null) {
                console.log("Reset page to page1 " + $scope.page);
                $http.get("http://inf5750-23.uio.no/api/organisationUnits?filter=").
                success(function(data, status, headers, config) {
                    $scope.me = data;
                    console.log('$scope.me='+JSON.stringify($scope.me));
                }).
                error(function(data, status, headers, config) {
                   console.log('Failed: restePage');
                });
            }
        };

        //Paging functions:
        $scope.page = "";

        $scope.$watch("page", function() {
            if ($scope.page > 0 && $scope.page <= $scope.me.pager.pageCount) {
                console.log("Changing page to " + $scope.page);
                $http.get("http://inf5750-23.uio.no/api/organisationUnits?page=" + $scope.page +"&filter=").
                success(function(data, status, headers, config) {
                    $scope.me = data;
                    console.log('$scope.me='+JSON.stringify($scope.me));
                }).
                error(function(data, status, headers, config) {
                   console.log('$Watch page failede: Failed');
                });
            }
        });

	$scope.nextPageOfUnits = function() {
	    console.log("NextPage: " + $scope.me.pager.nextPage);
            $http.get($scope.me.pager.nextPage + "&filter=").
                success(function(data, status, headers, config) {
                    $scope.me = data;
                    console.log('$scope.me='+JSON.stringify($scope.me));
                }).
                error(function(data, status, headers, config) {
                   console.log('NextPage: Failed');
                });

            console.log("new dhisAPI in MyUnitCtrl=" + JSON.stringify($scope.dhisAPI));
        };
        $scope.prevPageOfUnits = function() {
            if ($scope.me.pager.prevPage == "http://inf5750-23.uio.no/api/organisationUnits"){
		console.log("Last PrevPage: " + $scope.me.pager.prevPage);
		$http.get($scope.me.pager.prevPage + "?filter=").
                    success(function(data, status, headers, config) {
			$scope.me = data;
			console.log('$scope.me='+JSON.stringify($scope.me));
                    }).
                    error(function(data, status, headers, config) {
			console.log('PrevPage: Failed');
                    });
	    } else {
		console.log("PrevPage: " + $scope.me.pager.prevPage);
		$http.get($scope.me.pager.prevPage + "&filter=").
                    success(function(data, status, headers, config) {
			$scope.me = data;
			console.log('$scope.me='+JSON.stringify($scope.me));
                    }).
                    error(function(data, status, headers, config) {
			console.log('PrevPage: Failed');
                    });
	    }
        };
	}])
    .controller('MyCtrl2', ['$scope', 'UserSettingService', function ($scope, UserSettingService) {

        $scope.userSetting = UserSettingService.get(function () {
            console.log("$scope.userSetting="+JSON.stringify($scope.userSetting));
        });

        $scope.saveSetting = function () {
            console.log('Saving setting:'+JSON.stringify($scope.userSetting));
            $scope.userSetting.$save({}, function() {
                alert("Data saved successfully.");
            });
        }

        $scope.refreshSetting = function () {
            $scope.userSettingFetched = UserSettingService.get(function () {
                $scope.earlierSetting = $scope.userSettingFetched.value;
            });
        }

    }])
    .controller('MyCtrl3', ['$scope', '$http', 'SpecificUnit', function ($scope, $http, SpecificUnit) {
        console.log('Ctrl3');

        $scope.location = {lat: 8.4494988, lng: -11.7868289};

        $scope.center = {
            lat: 8.4494988,
            lng: -11.7868289,
            zoom: 8
        };

        $scope.markers = new Array();

        $scope.addMarkers = function () {
            console.log('Ctrl3 Add markers');
            $scope.markers.push({
                lat: $scope.location.lat,
                lng: $scope.location.lng,
                //message: "My Added Marker"
		message: "Latitude: " + lat + "Longitude: " + lng
            });

        };

	$scope.addUnitMarkers = function (name, lvl, id) {
	    // http://inf5750-23.uio.no/api/geoFeatures.json?ou=ou:LEVEL-2;O6uvpzGd5pu
            console.log('Ctrl3 Add Unit marker(s)');
            console.log('\t name: ' + name);
            console.log('\t id: ' + id);
            console.log('\t lvl: ' + lvl);
	    $scope.unitData;
	    var len = 0;
	    var coord_array;
	    $http.get("http://inf5750-23.uio.no/api/geoFeatures.json?ou=ou:LEVEL-" + lvl + ";" + id)
            .success(function(data, status, headers, config) {
                $scope.unitData = data;
		console.log("unitData=" + JSON.stringify($scope.unitData));
		coord_array = JSON.parse($scope.unitData[0].co); // string array to array
		console.log("coord_array: " + coord_array)

		if (angular.isUndefined(coord_array.length)) {
			console.log("coord_array is undefined")
		}
		else {
			if(lvl === 4) {
	    			len = coord_array.length;
	    			console.log("The length of the array coord_array is " + len);
			}
			else {
	    			len = coord_array[0][0].length;
	    			console.log("The length of the array coord_array is " + len);
			}
		}

		if(lvl === 4) {
			console.log("Location: " + coord_array);
            		$scope.location.lat = coord_array[1];
            		$scope.location.lng = coord_array[0];

            		$scope.markers.push({
            		    lat: coord_array[1],
            		    lng: coord_array[0],
            		    //message: "My Added Marker"
	    		    message: name,
            		    draggable: false
            		});
		}
		else {
			for(var i=0; i < len; i++) {
				console.log("In for-loop: " + coord_array[0][0][i]);
            			$scope.location.lat = coord_array[0][0][i][1];
            			$scope.location.lng = coord_array[0][0][i][0];
				var tmpMarker = {
            			    lat: coord_array[0][0][i][1],
            			    lng: coord_array[0][0][i][0],
            			    //message: "My Added Marker"
	    			    message: name,
            			    draggable: false
				}
				console.log("Adding marker " + JSON.stringify(tmpMarker));
            			$scope.markers.push(tmpMarker);
			}
			console.log("Marker array: " + JSON.stringify($scope.markers))
		}
	    })
            .error(function(data, status, headers, config) {
               console.log('Failed to get coordinates data for Unit');
            });

        };

        $scope.$on("leafletDirectiveMap.click", function (event, args) {
            var leafEvent = args.leafletEvent;
            console.log('Ctrl3 adding marker at lat=' + leafEvent.latlng.lat + ', lng=' + leafEvent.latlng.lng);
            $scope.location.lng = leafEvent.latlng.lng;
            $scope.location.lat = leafEvent.latlng.lat;

            $scope.markers.push({
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                message: "My Added Marker"
            });
        });

        $scope.removeMarkers = function () {
            console.log('Ctrl3 remove markers');
            $scope.markers = new Array();
        }

        // Add an initial marker
        $scope.markers.push({
            lat: $scope.location.lat,
            lng: $scope.location.lng,
            focus: true,
            message: "Welcome to Sierra Leone",
            draggable: true
        });

        $scope.removeOsmLayer = function() {
            delete this.layers.baselayers.osm;
            delete this.layers.baselayers.googleTerrain;
            delete this.layers.baselayers.googleRoadmap;
            delete this.layers.baselayers.googleHybrid;
            this.layers.baselayers.cycle = {
                name: 'OpenCycleMap',
                type: 'xyz',
                url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                layerOptions: {
                    subdomains: ['a', 'b', 'c'],
                    attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    continuousWorld: true
                }
            };
        };

        $scope.addOsmLayer = function() {
            delete this.layers.baselayers.cycle;
            delete this.layers.baselayers.googleTerrain;
            delete this.layers.baselayers.googleRoadmap;
            delete this.layers.baselayers.googleHybrid;
            this.layers.baselayers.osm = {
                name: 'OpenStreetMap',
                type: 'xyz',
                url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                layerOptions: {
                    subdomains: ['a', 'b', 'c'],
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    continuousWorld: true
                }
            };
        };

        $scope.showGoogleLayers = function() {
            delete this.layers.baselayers.cycle;
            delete this.layers.baselayers.osm;
            this.layers.baselayers = {
                googleTerrain: {
                    name: 'Google Terrain',
                    layerType: 'TERRAIN',
                    type: 'google'
                },
                googleHybrid: {
                    name: 'Google Hybrid',
                    layerType: 'HYBRID',
                    type: 'google'
                },
                googleRoadmap: {
                    name: 'Google Streets',
                    layerType: 'ROADMAP',
                    type: 'google'
                }
            };
        };

        angular.extend($scope, {
            layers: {
                baselayers: {
                    osm: {
                        name: 'OpenStreetMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    cycle: {
                        name: 'OpenCycleMap',
                        type: 'xyz',
                        url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.opencyclemap.org/copyright">OpenCycleMap</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    googleTerrain: {
                        name: 'Google Terrain',
                        layerType: 'TERRAIN',
                        type: 'google'
                    },
                    googleHybrid: {
                        name: 'Google Hybrid',
                        layerType: 'HYBRID',
                        type: 'google'
                    },
                    googleRoadmap: {
                        name: 'Google Streets',
                        layerType: 'ROADMAP',
                        type: 'google'
                    }/*,
                    landscape: {
                        name: 'Landscape',
                        type: 'xyz',
                        url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: '&copy; <a href="http://www.thunderforest.com/about/">Thunderforest</a> contributors - &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            continuousWorld: true
                        }
                    },
                    cloudmade1: {
                        name: 'Cloudmade Night Commander',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 999
                        },
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            continuousWorld: true
                        }
                    },
                    cloudmade2: {
                        name: 'Cloudmade Tourist',
                        type: 'xyz',
                        url: 'http://{s}.tile.cloudmade.com/{key}/{styleId}/256/{z}/{x}/{y}.png',
                        layerParams: {
                            key: '007b9471b4c74da4a6ec7ff43552b16f',
                            styleId: 7
                        },
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            continuousWorld: true
                        }
                    }*/
                }
            }
        });
    }]);

