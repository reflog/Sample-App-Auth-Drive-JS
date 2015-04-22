/**
 * Our spark drive object
 */
var sparkDrive = function () {


	/***** PRIVATE METHODS *****/

	/**
	 * Create asset thumbnail
 	 * @param asset_id
	 * @param file_ids
	 * @param callback
	 */
	var createAssetThumbnail = function (asset_id, file_ids, callback) {


		var thumbnails = [];

		for (var i = 0; i < file_ids.length; i++) {
			var thumbnail = {
				id: file_ids[i],
				caption: "thumbnail",
				description: "thumbnail",
				is_primary: true
			}

			thumbnails.push(thumbnail);
		}



		var params = "thumbnails=" + JSON.stringify(thumbnails);

		var headers = {
			"Authorization": "Bearer " + sparkAuth.accessToken(),
			"Content-type": "application/x-www-form-urlencoded"
		}
		var url = protocol + '://' + apiHost + '/assets/' + asset_id + "/thumbnails";

		Util.xhr(url, 'POST', params, headers, callback);

	};

	var createAssetSource = function (asset_id, file_ids, callback) {
		var headers = {
			"Authorization": "Bearer " + sparkAuth.accessToken(),
			"Content-type": "application/x-www-form-urlencoded"
		}
		var url = protocol + '://' + apiHost + '/assets/' + asset_id + "/sources?file_ids="+file_ids;

		Util.xhr(url, 'POST', '', headers, callback);
	};


	/**
	 * Return the factory object
	 */
	return {

		/**
		 * Get public assets - requires only a guest token
		 * @param conditions - Various conditions for the query
		 * @param callback
		 */
		getAssetsByConditions: function (conditions, callback) {
			//Make sure token is still valid
			sparkAuth.getGuestToken(function (guestToken) {
				if (guestToken) {

					var headers = {
						"Authorization": "Bearer " + guestToken,
						"Content-type": "application/x-www-form-urlencoded"
					}

					//default limit/offset
					conditions.limit = conditions.limit ? conditions.limit : 12;
					conditions.offset = conditions.offset ? conditions.offset : 0;

					//Construct the full request
					var params = Object.keys(conditions).map(function(k) {
						return encodeURIComponent(k) + "=" + encodeURIComponent(conditions[k]);
					}).join('&');

					var url = protocol + '://' + apiHost + '/assets?' + params;
					Util.xhr(url, 'GET', '', headers, callback);
				} else {
					callback(false);
				}
			});
		},
		/**
		 * Get my assets
		 * @param callback
		 */
		getMyAssets: function (limit, offset, callback) {
			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {

					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					}

					var assetsLimit = limit ? limit : 12;
					var assetsOffset = offset ? offset : 0;

					var url = protocol + '://' + apiHost + '/members/' + sparkAuth.accessToken(true).spark_member_id + '/assets?limit=' + assetsLimit + '&offset=' + assetsOffset;
					Util.xhr(url, 'GET', '', headers, callback);
				} else {
					callback(false);
				}
			});
		},
		/**
		 * Get my asset
		 * @param callback
		 */
		getAsset: function (assetId, callback) {
			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {

					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					};


					var url = protocol + '://' + apiHost + '/assets/'+assetId;
					Util.xhr(url, 'GET', '', headers, callback);
				} else {
					callback(false);
				}
			});
		},
		/**
		 * Create a new asset
		 * @param assetPost
		 */
		createAsset: function (assetPost, callback) {
			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {
					var params = "title=" + assetPost.title + "&description=" + assetPost.description +
						"&media_type=file&tags=" + assetPost.tags;
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					}
					Util.xhr(protocol + '://' + apiHost + '/assets', 'POST', params, headers, callback);
				} else {
					callback(false);
				}
			});
		},
		/**
		 * Create a new asset
		 * @param assetPost
		 */
		updateAsset: function (assetPost, callback) {
			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {

					var params = "title=" + assetPost.title + "&description=" + assetPost.description +  "&tags=" + assetPost.tags
						"&publish=true";
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					}
					var url = protocol + '://' + apiHost + '/assets/' + assetPost.assetId + '?' + params;
					Util.xhr(url, 'PUT', '', headers, callback);
				} else {
					callback(false);
				}
			});
		},
		/**
		 * Remove an asset
		 * @param assetId
		 * @param callback
		 */
		removeAsset: function (assetId, callback) {

			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					}
					var url = protocol + '://' + apiHost + '/assets/' + assetId;
					Util.xhr(url, 'DELETE', '', headers, callback);
				} else {
					callback(false);
				}
			});
		},


		uploadFileToAsset: function (assetId, fileData, callback) {

			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken()
					}
					var url = protocol + '://' + apiHost + '/files/upload?unzip=false';

					var fd = new FormData();
					fd.append("file", fileData);

					Util.xhr(url, 'POST', fd, headers, function (filesResp) {
						if (filesResp.files != undefined && filesResp.files.length > 0) {

							var files_ids_array = [filesResp.files[0].file_id];

							createAssetSource(assetId, files_ids_array, callback);
						}
						else {
							callback(response);
						}

					});
				} else {
					callback(false);
				}
			});
		},

		uploadFile: function (fileData, callback) {

			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken()
					}
					var url = protocol + '://' + apiHost + '/files/upload?unzip=false';

					var fd = new FormData();
					fd.append("file", fileData);

					Util.xhr(url, 'POST', fd, headers, function (filesResp) {
						callback(response);
					});

				} else {
					callback(false);
				}
			});
		},
		/**
		 * Retrieve all thumbnails for an asset
		 * @param assetId
		 * @param callback
		 */
		retrieveUserAssetThumbnails: function(assetId, callback){
			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {

					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					}
					var url = protocol + '://' + apiHost + '/assets/' + assetId + '/thumbnails';
					Util.xhr(url, 'GET', '', headers, function(response){
						var thumbnailsResp = {
							assetId: assetId,
							thumbnails: response.thumbnails
						}
						callback(thumbnailsResp);
					});
				} else {
					callback(false);
				}
			});
		},

		retrieveUserAssetSources: function(assetId, callback){
			//Make sure token is still valid
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {

					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken(),
						"Content-type": "application/x-www-form-urlencoded"
					}
					var url = protocol + '://' + apiHost + '/assets/' + assetId + '/sources';
					Util.xhr(url, 'GET', '', headers, function(response){
						var sourcesResp = {
							assetId: assetId,
							sources: response.sources
						}
						callback(sourcesResp);
					});
				} else {
					callback(false);
				}
			});
		},
		uploadFileToDrive: function(files,zipFile,callback){
			sparkAuth.checkTokenValidity(function (response) {
				if (response) {
					var headers = {
						"Authorization": "Bearer " + sparkAuth.accessToken()
					};
					if (zipFile == undefined){
						zipFile = false;
					}
					var formData = new FormData();

					// Add the file to the request.
					formData.append(files[0].name, files[0]);
					var url = protocol + '://' + apiHost + '/files/upload?unzip='+zipFile;



					Util.xhr(url, 'POST', formData, headers, function (filesResp) {
						if (filesResp.files != undefined && filesResp.files.length > 0) {

							callback(filesResp)


						}
						else {
							console.log('An upload error occurred!');
						}

					});
				}
			});
		}
	}


}();
