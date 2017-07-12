/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "7d753396a0feab67654c"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(53)(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(3);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = vendor_e4322d26b11e9f915b79;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(4);
var router_1 = __webpack_require__(5);
var oidc_client_1 = __webpack_require__(34);
var global_events_manager_1 = __webpack_require__(3);
var settings = {
    authority: 'http://localhost:5000',
    client_id: 'ng',
    redirect_uri: 'http://localhost:5002/callback',
    post_logout_redirect_uri: 'http://localhost:5002/home',
    response_type: 'id_token token',
    scope: 'openid profile apiApp',
    silent_redirect_uri: 'http://localhost:5002/silent-renew.html',
    automaticSilentRenew: true,
    accessTokenExpiringNotificationTime: 4,
    // silentRequestTimeout:10000,
    filterProtocolClaims: true,
    loadUserInfo: true
};
var AuthService = (function () {
    function AuthService(http, router, globalEventsManager) {
        var _this = this;
        this.http = http;
        this.router = router;
        this.globalEventsManager = globalEventsManager;
        this.loggedIn = false;
        this.userLoadedEvent = new core_1.EventEmitter();
        if (typeof window !== 'undefined') {
            //instance needs to be created within the if clause
            //otherwise you'll get a sessionStorage not defined error.
            this.mgr = new oidc_client_1.UserManager(settings);
            this.mgr
                .getUser()
                .then(function (user) {
                if (user) {
                    _this.currentUser = user;
                    _this.userLoadedEvent.emit(user);
                }
            })
                .catch(function (err) {
                console.log(err);
            });
            this.mgr.events.addUserUnloaded(function (e) {
                //if (!environment.production) {
                console.log("user unloaded");
                //}
            });
        }
    }
    AuthService.prototype.clearState = function () {
        this.mgr.clearStaleState().then(function () {
            console.log('clearStateState success');
        }).catch(function (e) {
            console.log('clearStateState error', e.message);
        });
    };
    AuthService.prototype.getUser = function () {
        var _this = this;
        this.mgr.getUser().then(function (user) {
            console.log("got user");
            _this.userLoadedEvent.emit(user);
        }).catch(function (err) {
            console.log(err);
        });
    };
    AuthService.prototype.removeUser = function () {
        var _this = this;
        this.mgr.removeUser().then(function () {
            _this.userLoadedEvent.emit(null);
            console.log("user removed");
        }).catch(function (err) {
            console.log(err);
        });
    };
    AuthService.prototype.startSigninMainWindow = function () {
        this.mgr.signinRedirect({ data: 'some data' }).then(function () {
            console.log("signinRedirect done");
        }).catch(function (err) {
            console.log(err);
        });
    };
    AuthService.prototype.endSigninMainWindow = function () {
        var _this = this;
        if (typeof window !== 'undefined') {
            this.mgr.signinRedirectCallback().then(function (user) {
                console.log("signed in");
                _this.loggedIn = true;
                _this.globalEventsManager.showNavBar(_this.loggedIn);
                _this.router.navigate(['home']);
            }).catch(function (err) {
                console.log(err);
            });
        }
    };
    AuthService.prototype.startSignoutMainWindow = function () {
        this.mgr.signoutRedirect().then(function (resp) {
            console.log("signed out", resp);
            setTimeout(5000, function () {
                console.log("testing to see if fired...");
            });
        }).catch(function (err) {
            console.log(err);
        });
    };
    ;
    AuthService.prototype.endSignoutMainWindow = function () {
        this.mgr.signoutRedirectCallback().then(function (resp) {
            console.log("signed out", resp);
        }).catch(function (err) {
            console.log(err);
        });
    };
    ;
    /**
     * Example of how you can make auth request using angulars http methods.
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthGet = function (url, options) {
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.get(url, options);
    };
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthPut = function (url, data, options) {
        var body = JSON.stringify(data);
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.put(url, body, options);
    };
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthDelete = function (url, options) {
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.delete(url, options);
    };
    /**
     * @param options if options are not supplied the default content type is application/json
     */
    AuthService.prototype.AuthPost = function (url, data, options) {
        var body = JSON.stringify(data);
        if (options) {
            options = this.setRequestOptions(options);
        }
        else {
            options = this.setRequestOptions();
        }
        return this.http.post(url, body, options);
    };
    AuthService.prototype.setAuthHeaders = function (user) {
        this.authHeaders = new http_1.Headers();
        this.authHeaders.append('Authorization', user.token_type + " " + user.access_token);
        this.authHeaders.append('Content-Type', 'application/json');
    };
    AuthService.prototype.setRequestOptions = function (options) {
        if (options) {
            options.headers.append(this.authHeaders.keys[0], this.authHeaders.values[0]);
        }
        else {
            //setting default authentication headers
            this.setAuthHeaders(this.currentUser);
            options = new http_1.RequestOptions({ headers: this.authHeaders, body: "" });
        }
        return options;
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http,
        router_1.Router,
        global_events_manager_1.GlobalEventsManager])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var BehaviorSubject_1 = __webpack_require__(50);
var GlobalEventsManager = (function () {
    function GlobalEventsManager() {
        this._showNavBar = new BehaviorSubject_1.BehaviorSubject(null);
        this.showNavBarEmitter = this._showNavBar.asObservable();
    }
    GlobalEventsManager.prototype.showNavBar = function (ifShow) {
        this._showNavBar.next(ifShow);
    };
    return GlobalEventsManager;
}());
GlobalEventsManager = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], GlobalEventsManager);
exports.GlobalEventsManager = GlobalEventsManager;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(38);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(40);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(5);
var auth_service_1 = __webpack_require__(2);
var AuthGuardService = (function () {
    function AuthGuardService(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuardService.prototype.canActivate = function () {
        if (this.authService.loggedIn) {
            return true;
        }
        else {
            this.router.navigate(['unauthorized']);
        }
    };
    return AuthGuardService;
}());
AuthGuardService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService, router_1.Router])
], AuthGuardService);
exports.AuthGuardService = AuthGuardService;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(38);
__webpack_require__(48);
var core_1 = __webpack_require__(0);
var platform_browser_dynamic_1 = __webpack_require__(47);
var app_module_client_1 = __webpack_require__(14);
if (true) {
    module['hot'].accept();
    module['hot'].dispose(function () {
        // Before restarting the app, we create a new root element and dispose the old one
        var oldRootElem = document.querySelector('app');
        var newRootElem = document.createElement('app');
        oldRootElem.parentNode.insertBefore(newRootElem, oldRootElem);
        modulePromise.then(function (appModule) { return appModule.destroy(); });
    });
}
else {
    core_1.enableProdMode();
}
// Note: @ng-tools/webpack looks for the following expression when performing production
// builds. Don't change how this line looks, otherwise you may break tree-shaking.
var modulePromise = platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_client_1.AppModule);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: ''
};
if (true) {
  var querystring = __webpack_require__(37);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }
  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  connect();
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(39);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(42);
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay && type !== 'warnings') overlay.showProblems(type, obj[type]);
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(43);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
      } else {
        if (reporter) {
          if (obj.warnings.length > 0) {
            reporter.problems('warnings', obj);
          } else {
            reporter.cleanProblemsCache();
          }
          reporter.success();
        }
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    }
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?path=%2F__webpack_hmr", __webpack_require__(44)(module)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(44);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var platform_browser_1 = __webpack_require__(49);
var forms_1 = __webpack_require__(46);
var http_1 = __webpack_require__(4);
var app_module_shared_1 = __webpack_require__(15);
var auth_service_1 = __webpack_require__(2);
var global_events_manager_1 = __webpack_require__(3);
var auth_guard_service_1 = __webpack_require__(6);
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        bootstrap: app_module_shared_1.sharedConfig.bootstrap,
        declarations: app_module_shared_1.sharedConfig.declarations,
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule
        ].concat(app_module_shared_1.sharedConfig.imports),
        providers: [
            { provide: 'ORIGIN_URL', useValue: location.origin },
            { provide: 'API_URL', useValue: "http://localhost:5001/api/" },
            auth_service_1.AuthService, auth_guard_service_1.AuthGuardService, global_events_manager_1.GlobalEventsManager
        ]
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = __webpack_require__(5);
var app_component_1 = __webpack_require__(16);
var navmenu_component_1 = __webpack_require__(21);
var home_component_1 = __webpack_require__(20);
var fetchdata_component_1 = __webpack_require__(19);
var counter_component_1 = __webpack_require__(18);
var callback_component_1 = __webpack_require__(17);
var unauthorized_component_1 = __webpack_require__(22);
var auth_service_1 = __webpack_require__(2);
var global_events_manager_1 = __webpack_require__(3);
var auth_guard_service_1 = __webpack_require__(6);
exports.sharedConfig = {
    bootstrap: [app_component_1.AppComponent],
    declarations: [
        app_component_1.AppComponent,
        navmenu_component_1.NavMenuComponent,
        counter_component_1.CounterComponent,
        fetchdata_component_1.FetchDataComponent,
        home_component_1.HomeComponent,
        callback_component_1.CallbackComponent,
        unauthorized_component_1.UnauthorizedComponent
    ],
    imports: [
        router_1.RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: home_component_1.HomeComponent },
            { path: 'callback', component: callback_component_1.CallbackComponent },
            { path: 'unauthorized', component: unauthorized_component_1.UnauthorizedComponent },
            { path: 'counter', component: counter_component_1.CounterComponent },
            { path: 'fetch-data', component: fetchdata_component_1.FetchDataComponent, canActivate: [auth_guard_service_1.AuthGuardService] },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [auth_service_1.AuthService, auth_guard_service_1.AuthGuardService, global_events_manager_1.GlobalEventsManager]
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app',
        template: __webpack_require__(28),
        styles: [__webpack_require__(40)]
    })
], AppComponent);
exports.AppComponent = AppComponent;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var auth_service_1 = __webpack_require__(2);
var CallbackComponent = (function () {
    function CallbackComponent(_authService) {
        this._authService = _authService;
        _authService.endSigninMainWindow();
    }
    return CallbackComponent;
}());
CallbackComponent = __decorate([
    core_1.Component({
        selector: 'callback',
        template: ''
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], CallbackComponent);
exports.CallbackComponent = CallbackComponent;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var CounterComponent = (function () {
    function CounterComponent() {
        this.currentCount = 0;
    }
    CounterComponent.prototype.incrementCounter = function () {
        this.currentCount++;
    };
    return CounterComponent;
}());
CounterComponent = __decorate([
    core_1.Component({
        selector: 'counter',
        template: __webpack_require__(29)
    })
], CounterComponent);
exports.CounterComponent = CounterComponent;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(4);
var auth_service_1 = __webpack_require__(2);
var FetchDataComponent = (function () {
    function FetchDataComponent(http, apiUrl, authService) {
        var _this = this;
        authService.AuthGet(apiUrl + '/SampleData/WeatherForecasts').subscribe(function (result) {
            _this.forecasts = result.json();
        });
    }
    return FetchDataComponent;
}());
FetchDataComponent = __decorate([
    core_1.Component({
        selector: 'fetchdata',
        template: __webpack_require__(30)
    }),
    __param(1, core_1.Inject('API_URL')),
    __metadata("design:paramtypes", [http_1.Http, String, auth_service_1.AuthService])
], FetchDataComponent);
exports.FetchDataComponent = FetchDataComponent;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var HomeComponent = (function () {
    function HomeComponent() {
    }
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home',
        template: __webpack_require__(31)
    })
], HomeComponent);
exports.HomeComponent = HomeComponent;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var auth_service_1 = __webpack_require__(2);
var global_events_manager_1 = __webpack_require__(3);
var NavMenuComponent = (function () {
    function NavMenuComponent(_authService, _globalEventsManager) {
        var _this = this;
        this._authService = _authService;
        this._globalEventsManager = _globalEventsManager;
        this._loggedIn = false;
        _globalEventsManager.showNavBarEmitter.subscribe(function (mode) {
            // mode will be null the first time it is created, so you need to igonore it when null
            if (mode !== null) {
                console.log("Global Event, sent: " + mode);
                _this._loggedIn = mode;
            }
        });
    }
    NavMenuComponent.prototype.login = function () {
        this._authService.startSigninMainWindow();
    };
    NavMenuComponent.prototype.logout = function () {
        this._authService.startSignoutMainWindow();
    };
    return NavMenuComponent;
}());
NavMenuComponent = __decorate([
    core_1.Component({
        selector: 'nav-menu',
        template: __webpack_require__(32),
        styles: [__webpack_require__(41)]
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        global_events_manager_1.GlobalEventsManager])
], NavMenuComponent);
exports.NavMenuComponent = NavMenuComponent;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(52);
var auth_service_1 = __webpack_require__(2);
var UnauthorizedComponent = (function () {
    function UnauthorizedComponent(location, service) {
        this.location = location;
        this.service = service;
    }
    UnauthorizedComponent.prototype.ngOnInit = function () {
    };
    UnauthorizedComponent.prototype.login = function () {
        this.service.startSigninMainWindow();
    };
    UnauthorizedComponent.prototype.goback = function () {
        this.location.back();
    };
    return UnauthorizedComponent;
}());
UnauthorizedComponent = __decorate([
    core_1.Component({
        selector: 'app-unauthorized',
        template: __webpack_require__(33)
    }),
    __metadata("design:paramtypes", [common_1.Location, auth_service_1.AuthService])
], UnauthorizedComponent);
exports.UnauthorizedComponent = UnauthorizedComponent;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, "@media (max-width: 767px) {\r\n    /* On small screens, the nav menu spans the full width of the screen. Leave a space for it. */\r\n    .body-content {\r\n        padding-top: 50px;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(undefined);
// imports


// module
exports.push([module.i, "li .glyphicon {\r\n    margin-right: 10px;\r\n}\r\n\r\n/* Highlighting rules for nav menu items */\r\nli.link-active a,\r\nli.link-active a:hover,\r\nli.link-active a:focus {\r\n    background-color: #4189C7;\r\n    color: white;\r\n}\r\n\r\n/* Keep the nav menu independent of scrolling and on top of other items */\r\n.main-nav {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    right: 0;\r\n    z-index: 1;\r\n}\r\n\r\n@media (min-width: 768px) {\r\n    /* On small screens, convert the nav menu to a vertical sidebar */\r\n    .main-nav {\r\n        height: 100%;\r\n        width: calc(25% - 20px);\r\n    }\r\n    .navbar {\r\n        border-radius: 0px;\r\n        border-width: 0px;\r\n        height: 100%;\r\n    }\r\n    .navbar-header {\r\n        float: none;\r\n    }\r\n    .navbar-collapse {\r\n        border-top: 1px solid #444;\r\n        padding: 0px;\r\n    }\r\n    .navbar ul {\r\n        float: none;\r\n    }\r\n    .navbar li {\r\n        float: none;\r\n        font-size: 15px;\r\n        margin: 6px;\r\n    }\r\n    .navbar li a {\r\n        padding: 10px 16px;\r\n        border-radius: 4px;\r\n    }\r\n    .navbar a {\r\n        /* If a menu item's text is too long, truncate it */\r\n        width: 100%;\r\n        white-space: nowrap;\r\n        overflow: hidden;\r\n        text-overflow: ellipsis;\r\n    }\r\n}\r\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(27),
  Html4Entities: __webpack_require__(26),
  Html5Entities: __webpack_require__(8),
  AllHtmlEntities: __webpack_require__(8)
};


/***/ }),
/* 26 */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 27 */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<div class='container-fluid'>\r\n    <div class='row'>\r\n        <div class='col-sm-3'>\r\n            <nav-menu></nav-menu>\r\n        </div>\r\n        <div class='col-sm-9 body-content'>\r\n            <router-outlet></router-outlet>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<h1>Counter</h1>\r\n\r\n<p>This is a simple example of an Angular component.</p>\r\n\r\n<p>Current count: <strong>{{ currentCount }}</strong></p>\r\n\r\n<button (click)=\"incrementCounter()\">Increment</button>\r\n";

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "<h1>Weather forecast</h1>\r\n\r\n<p>This component demonstrates fetching data from the server.</p>\r\n\r\n<p *ngIf=\"!forecasts\"><em>Loading...</em></p>\r\n\r\n<table class='table' *ngIf=\"forecasts\">\r\n    <thead>\r\n        <tr>\r\n            <th>Date</th>\r\n            <th>Temp. (C)</th>\r\n            <th>Temp. (F)</th>\r\n            <th>Summary</th>\r\n        </tr>\r\n    </thead>\r\n    <tbody>\r\n        <tr *ngFor=\"let forecast of forecasts\">\r\n            <td>{{ forecast.dateFormatted }}</td>\r\n            <td>{{ forecast.temperatureC }}</td>\r\n            <td>{{ forecast.temperatureF }}</td>\r\n            <td>{{ forecast.summary }}</td>\r\n        </tr>\r\n    </tbody>\r\n</table>\r\n";

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = "<h1>Hello, world!</h1>\r\n<p>Welcome to your new single-page application, built with:</p>\r\n<ul>\r\n    <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>\r\n    <li><a href='https://angular.io/'>Angular</a> and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>\r\n    <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>\r\n    <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>\r\n</ul>\r\n<p>To help you get started, we've also set up:</p>\r\n<ul>\r\n    <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>\r\n    <li><strong>Server-side prerendering</strong>. For faster initial loading and improved SEO, your Angular app is prerendered on the server. The resulting HTML is then transferred to the browser where a client-side copy of the app takes over.</li>\r\n    <li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code> build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file.</li>\r\n    <li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, your Angular app will be rebuilt and a new instance injected is into the page.</li>\r\n    <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the <code>webpack</code> build tool produces minified static CSS and JavaScript files.</li>\r\n</ul>\r\n";

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<div class='main-nav'>\r\n    <div class='navbar navbar-inverse'>\r\n        <div class='navbar-header'>\r\n            <button type='button' class='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>\r\n                <span class='sr-only'>Toggle navigation</span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n                <span class='icon-bar'></span>\r\n            </button>\r\n            <a class='navbar-brand' [routerLink]=\"['/home']\">WebApplicationBasic</a>\r\n        </div>\r\n        <div class='clearfix'></div>\r\n        <div class='navbar-collapse collapse'>\r\n            <ul class='nav navbar-nav'>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/home']\">\r\n                        <span class='glyphicon glyphicon-home'></span> Home\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/counter']\">\r\n                        <span class='glyphicon glyphicon-education'></span> Counter\r\n                    </a>\r\n                </li>\r\n                <li [routerLinkActive]=\"['link-active']\">\r\n                    <a [routerLink]=\"['/fetch-data']\">\r\n                        <span class='glyphicon glyphicon-th-list'></span> Fetch data\r\n                    </a>\r\n                </li>\r\n                <li *ngIf=\"!_loggedIn\" [routerLinkActive]=\"['link-active']\">\r\n                    <a (click)=\"login()\" [routerLink]=\"['/login']\">\r\n                        <span class=\"glyphicon glyphicon-user\"></span> Login\r\n                    </a>\r\n                </li>\r\n                <li *ngIf=\"_loggedIn\" [routerLinkActive]=\"['link-active']\">\r\n                    <a (click)=\"logout()\" [routerLink]=\"['/logout']\">\r\n                        <span class='glyphicon glyphicon-log-out'></span> Logout\r\n                    </a>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<h1>\r\n    Unauthorized Request\r\n</h1>\r\n<div>\r\n    <button (click)=\"login()\">Login</button>\r\n    <button (click)=\"goback()\">Back</button>\r\n</div>";

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){if(true)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=e.Log=n(1),i=e.OidcClient=n(2),s=e.OidcClientSettings=n(3),o=e.WebStorageStateStore=n(4),a=e.InMemoryWebStorage=n(26),u=e.UserManager=n(27),h=e.AccessTokenEvents=n(36),c=e.MetadataService=n(7),f=e.CordovaPopupNavigator=n(43),l=e.CordovaIFrameNavigator=n(45),d=e.CheckSessionIFrame=n(41),g=e.TokenRevocationClient=n(42),p=e.Global=n(5);e.default={Log:r,OidcClient:i,OidcClientSettings:s,WebStorageStateStore:o,InMemoryWebStorage:a,UserManager:u,AccessTokenEvents:h,MetadataService:c,CordovaPopupNavigator:f,CordovaIFrameNavigator:l,CheckSessionIFrame:d,TokenRevocationClient:g,Global:p}},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i={debug:function(){},info:function(){},warn:function(){},error:function(){}},s=0,o=1,a=2,u=3,h=4,c=void 0,f=void 0,l=function(){function t(){n(this,t)}return t.reset=function(){f=u,c=i},t.debug=function(){if(f>=h){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];c.debug.apply(c,Array.from(e))}},t.info=function(){if(f>=u){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];c.info.apply(c,Array.from(e))}},t.warn=function(){if(f>=a){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];c.warn.apply(c,Array.from(e))}},t.error=function(){if(f>=o){for(var t=arguments.length,e=Array(t),n=0;n<t;n++)e[n]=arguments[n];c.error.apply(c,Array.from(e))}},r(t,null,[{key:"NONE",get:function(){return s}},{key:"ERROR",get:function(){return o}},{key:"WARN",get:function(){return a}},{key:"INFO",get:function(){return u}},{key:"DEBUG",get:function(){return h}},{key:"level",get:function(){return f},set:function(t){if(!(s<=t&&t<=h))throw new Error("Invalid log level");f=t}},{key:"logger",get:function(){return c},set:function(t){if(!t.debug&&t.info&&(t.debug=t.info),!(t.debug&&t.info&&t.warn&&t.error))throw new Error("Invalid logger");c=t}}]),t}();e.default=l,l.reset(),t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=n(3),h=r(u),c=n(10),f=r(c),l=n(18),d=r(l),g=n(23),p=r(g),y=n(24),v=r(y),m=n(25),S=r(m),b=n(20),w=r(b),E=n(21),x=r(E),_=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};i(this,t),e instanceof h.default?this._settings=e:this._settings=new h.default(e)}return t.prototype.createSigninRequest=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.response_type,r=e.scope,i=e.redirect_uri,s=e.data,o=e.state,u=e.prompt,h=e.display,c=e.max_age,f=e.ui_locales,l=e.id_token_hint,g=e.login_hint,p=e.acr_values,y=e.resource,v=e.request,m=e.request_uri,S=arguments[1];a.default.debug("OidcClient.createSigninRequest");var b=this._settings.client_id;n=n||this._settings.response_type,r=r||this._settings.scope,i=i||this._settings.redirect_uri,u=u||this._settings.prompt,h=h||this._settings.display,c=c||this._settings.max_age,f=f||this._settings.ui_locales,p=p||this._settings.acr_values,y=y||this._settings.resource;var w=this._settings.authority;return this._metadataService.getAuthorizationEndpoint().then(function(e){a.default.debug("Received authorization endpoint",e);var E=new d.default({url:e,client_id:b,redirect_uri:i,response_type:n,scope:r,data:s||o,authority:w,prompt:u,display:h,max_age:c,ui_locales:f,id_token_hint:l,login_hint:g,acr_values:p,resource:y,request:v,request_uri:m}),x=E.state;return S=S||t._stateStore,S.set(x.id,x.toStorageString()).then(function(){return E})})},t.prototype.processSigninResponse=function(t,e){var n=this;a.default.debug("OidcClient.processSigninResponse");var r=new p.default(t);return r.state?(e=e||this._stateStore,e.remove(r.state).then(function(t){if(!t)throw a.default.error("No matching state found in storage"),new Error("No matching state found in storage");var e=w.default.fromStorageString(t);return a.default.debug("Received state from storage; validating response"),n._validator.validateSigninResponse(e,r)})):(a.default.error("No state in response"),Promise.reject(new Error("No state in response")))},t.prototype.createSignoutRequest=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.id_token_hint,r=e.data,i=e.state,s=e.post_logout_redirect_uri,o=arguments[1];return a.default.debug("OidcClient.createSignoutRequest"),s=s||this._settings.post_logout_redirect_uri,this._metadataService.getEndSessionEndpoint().then(function(e){if(!e)throw a.default.error("No end session endpoint url returned"),new Error("no end session endpoint");a.default.debug("Received end session endpoint",e);var u=new v.default({url:e,id_token_hint:n,post_logout_redirect_uri:s,data:r||i}),h=u.state;return h&&(a.default.debug("Signout request has state to persist"),o=o||t._stateStore,o.set(h.id,h.toStorageString())),u})},t.prototype.processSignoutResponse=function(t,e){var n=this;a.default.debug("OidcClient.processSignoutResponse");var r=new S.default(t);if(!r.state)return a.default.debug("No state in response"),r.error?(a.default.warn("Response was error",r.error),Promise.reject(new f.default(r))):Promise.resolve(r);var i=r.state;return e=e||this._stateStore,e.remove(i).then(function(t){if(!t)throw a.default.error("No matching state found in storage"),new Error("No matching state found in storage");var e=x.default.fromStorageString(t);return a.default.debug("Received state from storage; validating response"),n._validator.validateSignoutResponse(e,r)})},t.prototype.clearStaleState=function(t){return a.default.debug("OidcClient.clearStaleState"),t=t||this._stateStore,x.default.clearStaleState(t,this.settings.staleStateAge)},s(t,[{key:"_stateStore",get:function(){return this.settings.stateStore}},{key:"_validator",get:function(){return this.settings.validator}},{key:"_metadataService",get:function(){return this.settings.metadataService}},{key:"settings",get:function(){return this._settings}},{key:"metadataService",get:function(){return this._metadataService}}]),t}();e.default=_,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=n(4),h=r(u),c=n(6),f=r(c),l=n(7),d=r(l),g=".well-known/openid-configuration",p="id_token",y="openid",v=60,m=300,S=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.authority,r=e.metadataUrl,s=e.metadata,o=e.signingKeys,a=e.client_id,u=e.client_secret,c=e.response_type,l=void 0===c?p:c,g=e.scope,S=void 0===g?y:g,b=e.redirect_uri,w=e.post_logout_redirect_uri,E=e.prompt,x=e.display,_=e.max_age,A=e.ui_locales,F=e.acr_values,P=e.resource,O=e.filterProtocolClaims,C=void 0===O||O,T=e.loadUserInfo,D=void 0===T||T,j=e.staleStateAge,H=void 0===j?v:j,R=e.clockSkew,I=void 0===R?m:R,k=e.stateStore,B=void 0===k?new h.default:k,N=e.ResponseValidatorCtor,V=void 0===N?f.default:N,M=e.MetadataServiceCtor,K=void 0===M?d.default:M;i(this,t),this._authority=n,this._metadataUrl=r,this._metadata=s,this._signingKeys=o,this._client_id=a,this._client_secret=u,this._response_type=l,this._scope=S,this._redirect_uri=b,this._post_logout_redirect_uri=w,this._prompt=E,this._display=x,this._max_age=_,this._ui_locales=A,this._acr_values=F,this._resource=P,this._filterProtocolClaims=!!C,this._loadUserInfo=!!D,this._staleStateAge=H,this._clockSkew=I,this._stateStore=B,this._validator=new V(this),this._metadataService=new K(this)}return s(t,[{key:"client_id",get:function(){return this._client_id},set:function(t){if(this._client_id)throw a.default.error("client_id has already been assigned."),new Error("client_id has already been assigned.");this._client_id=t}},{key:"client_secret",get:function(){return this._client_secret}},{key:"response_type",get:function(){return this._response_type}},{key:"scope",get:function(){return this._scope}},{key:"redirect_uri",get:function(){return this._redirect_uri}},{key:"post_logout_redirect_uri",get:function(){return this._post_logout_redirect_uri}},{key:"prompt",get:function(){return this._prompt}},{key:"display",get:function(){return this._display}},{key:"max_age",get:function(){return this._max_age}},{key:"ui_locales",get:function(){return this._ui_locales}},{key:"acr_values",get:function(){return this._acr_values}},{key:"resource",get:function(){return this._resource}},{key:"authority",get:function(){return this._authority},set:function(t){if(this._authority)throw a.default.error("authority has already been assigned."),new Error("authority has already been assigned.");this._authority=t}},{key:"metadataUrl",get:function(){return this._metadataUrl||(this._metadataUrl=this.authority,this._metadataUrl&&this._metadataUrl.indexOf(g)<0&&("/"!==this._metadataUrl[this._metadataUrl.length-1]&&(this._metadataUrl+="/"),this._metadataUrl+=g)),this._metadataUrl}},{key:"metadata",get:function(){return this._metadata},set:function(t){this._metadata=t}},{key:"signingKeys",get:function(){return this._signingKeys},set:function(t){this._signingKeys=t}},{key:"filterProtocolClaims",get:function(){return this._filterProtocolClaims}},{key:"loadUserInfo",get:function(){return this._loadUserInfo}},{key:"staleStateAge",get:function(){return this._staleStateAge}},{key:"clockSkew",get:function(){return this._clockSkew}},{key:"stateStore",get:function(){return this._stateStore}},{key:"validator",get:function(){return this._validator}},{key:"metadataService",get:function(){return this._metadataService}}]),t}();e.default=S,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(5),u=r(a),h=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.prefix,r=void 0===n?"oidc.":n,s=e.store,o=void 0===s?u.default.localStorage:s;i(this,t),this._store=o,this._prefix=r}return t.prototype.set=function(t,e){return o.default.debug("WebStorageStateStore.set",t),t=this._prefix+t,this._store.setItem(t,e),Promise.resolve()},t.prototype.get=function(t){o.default.debug("WebStorageStateStore.get",t),t=this._prefix+t;var e=this._store.getItem(t);return Promise.resolve(e)},t.prototype.remove=function(t){o.default.debug("WebStorageStateStore.remove",t),t=this._prefix+t;var e=this._store.getItem(t);return this._store.removeItem(t),Promise.resolve(e)},t.prototype.getAllKeys=function(){o.default.debug("WebStorageStateStore.getAllKeys");for(var t=[],e=0;e<this._store.length;e++){var n=this._store.key(e);0===n.indexOf(this._prefix)&&t.push(n.substr(this._prefix.length))}return Promise.resolve(t)},t}();e.default=h,t.exports=e.default},function(t,e){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),i={setInterval:function(t){function e(e,n){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t,e){return setInterval(t,e)}),clearInterval:function(t){function e(e){return t.apply(this,arguments)}return e.toString=function(){return t.toString()},e}(function(t){return clearInterval(t)})},s=!1,o=null,a=function(){function t(){n(this,t)}return t._testing=function(){s=!0},t.setXMLHttpRequest=function(t){o=t},r(t,null,[{key:"location",get:function(){if(!s)return location}},{key:"localStorage",get:function(){if(!s)return localStorage}},{key:"sessionStorage",get:function(){if(!s)return sessionStorage}},{key:"XMLHttpRequest",get:function(){if(!s)return o||XMLHttpRequest}},{key:"timer",get:function(){if(!s)return i}}]),t}();e.default=a,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(7),u=r(a),h=n(9),c=r(h),f=n(10),l=r(f),d=n(11),g=r(d),p=["nonce","at_hash","iat","nbf","exp","aud","iss","c_hash"],y=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:u.default,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:c.default,s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:g.default;if(i(this,t),!e)throw o.default.error("No settings passed to ResponseValidator"),new Error("settings");this._settings=e,this._metadataService=new n(this._settings),this._userInfoService=new r(this._settings),this._joseUtil=s}return t.prototype.validateSigninResponse=function(t,e){var n=this;return o.default.debug("ResponseValidator.validateSigninResponse"),this._processSigninParams(t,e).then(function(e){return o.default.debug("state processed"),n._validateTokens(t,e).then(function(t){return o.default.debug("tokens validated"),n._processClaims(t).then(function(t){return o.default.debug("claims processed"),t})})})},t.prototype.validateSignoutResponse=function(t,e){return o.default.debug("ResponseValidator.validateSignoutResponse"),t.id!==e.state?(o.default.error("State does not match"),Promise.reject(new Error("State does not match"))):(o.default.debug("state validated"),e.state=t.data,e.error?(o.default.warn("Response was error",e.error),Promise.reject(new l.default(e))):Promise.resolve(e))},t.prototype._processSigninParams=function(t,e){if(o.default.debug("ResponseValidator._processSigninParams"),t.id!==e.state)return o.default.error("State does not match"),Promise.reject(new Error("State does not match"));if(!t.client_id)return o.default.error("No client_id on state"),Promise.reject(new Error("No client_id on state"));if(!t.authority)return o.default.error("No authority on state"),Promise.reject(new Error("No authority on state"));if(this._settings.authority){if(this._settings.authority&&this._settings.authority!==t.authority)return o.default.error("authority mismatch on settings vs. signin state"),Promise.reject(new Error("authority mismatch on settings vs. signin state"))}else this._settings.authority=t.authority;if(this._settings.client_id){if(this._settings.client_id&&this._settings.client_id!==t.client_id)return o.default.error("client_id mismatch on settings vs. signin state"),Promise.reject(new Error("client_id mismatch on settings vs. signin state"))}else this._settings.client_id=t.client_id;return o.default.debug("state validated"),e.state=t.data,e.error?(o.default.warn("Response was error",e.error),Promise.reject(new l.default(e))):t.nonce&&!e.id_token?(o.default.error("Expecting id_token in response"),Promise.reject(new Error("No id_token in response"))):!t.nonce&&e.id_token?(o.default.error("Not expecting id_token in response"),Promise.reject(new Error("Unexpected id_token in response"))):Promise.resolve(e)},t.prototype._processClaims=function(t){var e=this;if(o.default.debug("ResponseValidator._processClaims"),t.isOpenIdConnect){if(o.default.debug("response is OIDC, processing claims"),t.profile=this._filterProtocolClaims(t.profile),this._settings.loadUserInfo&&t.access_token)return o.default.debug("loading user info"),this._userInfoService.getClaims(t.access_token).then(function(n){return o.default.debug("user info claims received from user info endpoint"),n.sub!==t.profile.sub?(o.default.error("sub from user info endpoint does not match sub in id_token"),Promise.reject(new Error("sub from user info endpoint does not match sub in id_token"))):(t.profile=e._mergeClaims(t.profile,n),o.default.debug("user info claims received, updated profile:",t.profile),t)});o.default.debug("not loading user info")}else o.default.debug("response is not OIDC, not processing claims");return Promise.resolve(t)},t.prototype._mergeClaims=function(t,e){var n=Object.assign({},t);for(var r in e){var i=e[r];Array.isArray(i)||(i=[i]);var s=!0,o=!1,a=void 0;try{for(var u,h=i[Symbol.iterator]();!(s=(u=h.next()).done);s=!0){var c=u.value;n[r]?Array.isArray(n[r])?n[r].indexOf(c)<0&&n[r].push(c):n[r]!==c&&(n[r]=[n[r],c]):n[r]=c}}catch(t){o=!0,a=t}finally{try{!s&&h.return&&h.return()}finally{if(o)throw a}}}return n},t.prototype._filterProtocolClaims=function(t){o.default.debug("ResponseValidator._filterProtocolClaims, incoming claims:",t);var e=Object.assign({},t);return this._settings._filterProtocolClaims?(p.forEach(function(t){delete e[t]}),o.default.debug("protocol claims filtered",e)):o.default.debug("protocol claims not filtered"),e},t.prototype._validateTokens=function(t,e){return o.default.debug("ResponseValidator._validateTokens"),e.id_token?e.access_token?(o.default.debug("Validating id_token and access_token"),this._validateIdTokenAndAccessToken(t,e)):(o.default.debug("Validating id_token"),this._validateIdToken(t,e)):(o.default.debug("No id_token to validate"),Promise.resolve(e))},t.prototype._validateIdTokenAndAccessToken=function(t,e){var n=this;return o.default.debug("ResponseValidator._validateIdTokenAndAccessToken"),this._validateIdToken(t,e).then(function(t){return n._validateAccessToken(t)})},t.prototype._validateIdToken=function(t,e){var n=this;if(o.default.debug("ResponseValidator._validateIdToken"),!t.nonce)return o.default.error("No nonce on state"),Promise.reject(new Error("No nonce on state"));var r=this._joseUtil.parseJwt(e.id_token);if(!r||!r.header||!r.payload)return o.default.error("Failed to parse id_token",r),Promise.reject(new Error("Failed to parse id_token"));if(t.nonce!==r.payload.nonce)return o.default.error("Invalid nonce in id_token"),Promise.reject(new Error("Invalid nonce in id_token"));var i=r.header.kid;return this._metadataService.getIssuer().then(function(s){return o.default.debug("Received issuer"),n._metadataService.getSigningKeys().then(function(a){if(!a)return o.default.error("No signing keys from metadata"),Promise.reject(new Error("No signing keys from metadata"));o.default.debug("Received signing keys");var u=void 0;if(i)u=a.filter(function(t){return t.kid===i})[0];else{if(a=n._filterByAlg(a,r.header.alg),a.length>1)return o.default.error("No kid found in id_token and more than one key found in metadata"),Promise.reject(new Error("No kid found in id_token and more than one key found in metadata"));u=a[0]}if(!u)return o.default.error("No key matching kid or alg found in signing keys"),Promise.reject(new Error("No key matching kid or alg found in signing keys"));var h=t.client_id,c=n._settings.clockSkew;return o.default.debug("Validaing JWT; using clock skew (in seconds) of: ",c),n._joseUtil.validateJwt(e.id_token,u,s,h,c).then(function(){return o.default.debug("JWT validation successful"),r.payload.sub?(e.profile=r.payload,e):(o.default.error("No sub present in id_token"),Promise.reject(new Error("No sub present in id_token")))})})})},t.prototype._filterByAlg=function(t,e){o.default.debug("ResponseValidator._filterByAlg",e);var n=null;if(e.startsWith("RS"))n="RSA";else if(e.startsWith("PS"))n="PS";else{if(!e.startsWith("ES"))return o.default.debug("alg not supported: ",e),[];n="EC"}return o.default.debug("Looking for keys that match kty: ",n),t=t.filter(function(t){return t.kty===n}),o.default.debug("Number of keys that match kty: ",n,t.length),t},t.prototype._validateAccessToken=function(t){if(o.default.debug("ResponseValidator._validateAccessToken"),!t.profile)return o.default.error("No profile loaded from id_token"),Promise.reject(new Error("No profile loaded from id_token"));if(!t.profile.at_hash)return o.default.error("No at_hash in id_token"),Promise.reject(new Error("No at_hash in id_token"));if(!t.id_token)return o.default.error("No id_token"),Promise.reject(new Error("No id_token"));var e=this._joseUtil.parseJwt(t.id_token);if(!e||!e.header)return o.default.error("Failed to parse id_token",e),Promise.reject(new Error("Failed to parse id_token"));var n=e.header.alg;if(!n||5!==n.length)return o.default.error("Unsupported alg:",n),Promise.reject(new Error("Unsupported alg: "+n));var r=n.substr(2,3);if(!r)return o.default.error("Unsupported alg:",n,r),Promise.reject(new Error("Unsupported alg: "+n));if(r=parseInt(r),256!==r&&384!==r&&512!==r)return o.default.error("Unsupported alg:",n,r),Promise.reject(new Error("Unsupported alg: "+n));var i="sha"+r,s=this._joseUtil.hashString(t.access_token,i);if(!s)return o.default.error("access_token hash failed:",i),Promise.reject(new Error("Failed to validate at_hash"));var a=s.substr(0,s.length/2),u=this._joseUtil.hexToBase64Url(a);return u!==t.profile.at_hash?(o.default.error("Failed to validate at_hash",u,t.profile.at_hash),Promise.reject(new Error("Failed to validate at_hash"))):Promise.resolve(t)},t}();e.default=y,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=n(8),h=r(u),c=".well-known/openid-configuration",f=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:h.default;if(i(this,t),!e)throw a.default.error("No settings passed to MetadataService"),new Error("settings");this._settings=e,this._jsonService=new n}return t.prototype.getMetadata=function(){var t=this;return a.default.debug("MetadataService.getMetadata"),this._settings.metadata?(a.default.debug("Returning metadata from settings"),Promise.resolve(this._settings.metadata)):this.metadataUrl?(a.default.debug("getting metadata from",this.metadataUrl),this._jsonService.getJson(this.metadataUrl).then(function(e){return a.default.debug("json received"),t._settings.metadata=e,e})):(a.default.error("No authority or metadataUrl configured on settings"),Promise.reject(new Error("No authority or metadataUrl configured on settings")))},t.prototype.getIssuer=function(){return a.default.debug("MetadataService.getIssuer"),this._getMetadataProperty("issuer")},t.prototype.getAuthorizationEndpoint=function(){return a.default.debug("MetadataService.getAuthorizationEndpoint"),this._getMetadataProperty("authorization_endpoint")},t.prototype.getUserInfoEndpoint=function(){return a.default.debug("MetadataService.getUserInfoEndpoint"),this._getMetadataProperty("userinfo_endpoint")},t.prototype.getTokenEndpoint=function(){return a.default.debug("MetadataService.getTokenEndpoint"),this._getMetadataProperty("token_endpoint",!0)},t.prototype.getCheckSessionIframe=function(){return a.default.debug("MetadataService.getCheckSessionIframe"),this._getMetadataProperty("check_session_iframe",!0)},t.prototype.getEndSessionEndpoint=function(){return a.default.debug("MetadataService.getEndSessionEndpoint"),this._getMetadataProperty("end_session_endpoint",!0)},t.prototype.getRevocationEndpoint=function(){return a.default.debug("MetadataService.getRevocationEndpoint"),this._getMetadataProperty("revocation_endpoint",!0)},t.prototype._getMetadataProperty=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return a.default.debug("MetadataService._getMetadataProperty",t),this.getMetadata().then(function(n){if(a.default.debug("metadata recieved"),void 0===n[t]){if(e===!0)return void a.default.warn("Metadata does not contain optional property "+t);throw a.default.error("Metadata does not contain property "+t),new Error("Metadata does not contain property "+t)}return n[t]})},t.prototype.getSigningKeys=function(){var t=this;return a.default.debug("MetadataService.getSigningKeys"),this._settings.signingKeys?(a.default.debug("Returning signingKeys from settings"),Promise.resolve(this._settings.signingKeys)):this._getMetadataProperty("jwks_uri").then(function(e){return a.default.debug("jwks_uri received",e),t._jsonService.getJson(e).then(function(e){if(a.default.debug("key set received",e),!e.keys)throw a.default.error("Missing keys on keyset"),new Error("Missing keys on keyset");return t._settings.signingKeys=e.keys,t._settings.signingKeys})})},s(t,[{key:"metadataUrl",get:function(){return this._metadataUrl||(this._settings.metadataUrl?this._metadataUrl=this._settings.metadataUrl:(this._metadataUrl=this._settings.authority,this._metadataUrl&&this._metadataUrl.indexOf(c)<0&&("/"!==this._metadataUrl[this._metadataUrl.length-1]&&(this._metadataUrl+="/"),this._metadataUrl+=c))),this._metadataUrl}}]),t}();e.default=f,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(5),u=r(a),h=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u.default.XMLHttpRequest;i(this,t),this._XMLHttpRequest=e}return t.prototype.getJson=function(t,e){var n=this;if(o.default.debug("JsonService.getJson",t),!t)throw o.default.error("No url passed"),new Error("url");return new Promise(function(r,i){var s=new n._XMLHttpRequest;s.open("GET",t),s.onload=function(){o.default.debug("HTTP response received, status",s.status),200===s.status?r(JSON.parse(s.responseText)):i(Error(s.statusText+" ("+s.status+")"))},s.onerror=function(){o.default.error("network error"),i(Error("Network Error"))},e&&(o.default.debug("token passed, setting Authorization header"),s.setRequestHeader("Authorization","Bearer "+e)),s.send()})},t}();e.default=h,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(8),o=r(s),a=n(7),u=r(a),h=n(1),c=r(h),f=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:o.default,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:u.default;if(i(this,t),!e)throw c.default.error("No settings passed to UserInfoService"),new Error("settings");this._settings=e,this._jsonService=new n,this._metadataService=new r(this._settings)}return t.prototype.getClaims=function(t){var e=this;return c.default.debug("UserInfoService.getClaims"),t?this._metadataService.getUserInfoEndpoint().then(function(n){return c.default.debug("received userinfo url",n),e._jsonService.getJson(n,t).then(function(t){return c.default.debug("claims received",t),t})}):(c.default.error("No token passed"),Promise.reject(new Error("A token is required")))},t}();e.default=f,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=n(1),u=r(a),h=function(t){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=n.error,o=n.error_description,a=n.error_uri,h=n.state;if(i(this,e),!r)throw u.default.error("No error passed to ErrorResponse"),new Error("error");var c=s(this,t.call(this,o||r));return c.name="ErrorResponse",c.error=r,c.error_description=o,c.error_uri=a,c.state=h,c}return o(e,t),e}(Error);e.default=h,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(12),o=n(1),a=r(o),u=["RS256","RS384","RS512","PS256","PS384","PS512","ES256","ES384","ES512"],h=function(){function t(){i(this,t)}return t.parseJwt=function(t){a.default.debug("JoseUtil.parseJwt");try{var e=s.jws.JWS.parse(t);return{header:e.headerObj,payload:e.payloadObj}}catch(t){a.default.error(t)}},t.validateJwt=function(e,n,r,i,o,u){a.default.debug("JoseUtil.validateJwt");try{if("RSA"===n.kty)if(n.e&&n.n)n=s.KEYUTIL.getKey(n);else{if(!n.x5c||!n.x5c.length)return a.default.error("RSA key missing key material",n),Promise.reject(new Error("RSA key missing key material"));n=s.KEYUTIL.getKey(s.X509.getPublicKeyFromCertPEM(n.x5c[0]))}else{if("EC"!==n.kty)return a.default.error("Unsupported key type",n&&n.kty),Promise.reject(new Error("Unsupported key type: "+n&&n.kty));if(!(n.crv&&n.x&&n.y))return a.default.error("EC key missing key material",n),Promise.reject(new Error("EC key missing key material"));n=s.KEYUTIL.getKey(n)}return t._validateJwt(e,n,r,i,o,u)}catch(t){return a.default.error(t&&t.message||t),Promise.reject("JWT validation failed")}},t._validateJwt=function(e,n,r,i,o,h){a.default.debug("JoseUtil._validateJwt"),o||(o=0),h||(h=parseInt(Date.now()/1e3));var c=t.parseJwt(e).payload;if(!c.iss)return a.default.error("issuer was not provided"),Promise.reject(new Error("issuer was not provided"));if(c.iss!==r)return a.default.error("Invalid issuer in token",c.iss),Promise.reject(new Error("Invalid issuer in token: "+c.iss));if(!c.aud)return a.default.error("aud was not provided"),Promise.reject(new Error("aud was not provided"));var f=c.aud===i||Array.isArray(c.aud)&&c.aud.indexOf(i)>=0;if(!f)return a.default.error("Invalid audience in token",c.aud),Promise.reject(new Error("Invalid audience in token: "+c.aud));var l=h+o,d=h-o;if(!c.iat)return a.default.error("iat was not provided"),Promise.reject(new Error("iat was not provided"));if(l<c.iat)return a.default.error("iat is in the future",c.iat),Promise.reject(new Error("iat is in the future: "+c.iat));if(c.nbf&&l<c.nbf)return a.default.error("nbf is in the future",c.nbf),Promise.reject(new Error("nbf is in the future: "+c.nbf));if(!c.exp)return a.default.error("exp was not provided"),Promise.reject(new Error("exp was not provided"));if(c.exp<d)return a.default.error("exp is in the past",c.exp),Promise.reject(new Error("exp is in the past:"+c.exp));
try{if(!s.jws.JWS.verify(e,n,u))return a.default.error("signature validation failed"),Promise.reject(new Error("signature validation failed"))}catch(t){return a.default.error(t&&t.message||t),Promise.reject(new Error("signature validation failed"))}return Promise.resolve()},t.hashString=function(t,e){a.default.debug("JoseUtil.hashString",t,e);try{return s.crypto.Util.hashString(t,e)}catch(t){a.default.error(t)}},t.hexToBase64Url=function(t){a.default.debug("JoseUtil.hexToBase64Url",t);try{return(0,s.hextob64u)(t)}catch(t){a.default.error(t)}},t}();e.default=h,t.exports=e.default},function(t,e,n){(function(t){function r(t){var e,n,r="";for(e=0;e+3<=t.length;e+=3)n=parseInt(t.substring(e,e+3),16),r+=ur.charAt(n>>6)+ur.charAt(63&n);if(e+1==t.length?(n=parseInt(t.substring(e,e+1),16),r+=ur.charAt(n<<2)):e+2==t.length&&(n=parseInt(t.substring(e,e+2),16),r+=ur.charAt(n>>2)+ur.charAt((3&n)<<4)),hr)for(;(3&r.length)>0;)r+=hr;return r}function i(t){var e,n,r,i="",s=0;for(e=0;e<t.length&&t.charAt(e)!=hr;++e)r=ur.indexOf(t.charAt(e)),r<0||(0==s?(i+=f(r>>2),n=3&r,s=1):1==s?(i+=f(n<<2|r>>4),n=15&r,s=2):2==s?(i+=f(n),i+=f(r>>2),n=3&r,s=3):(i+=f(n<<2|r>>4),i+=f(15&r),s=0));return 1==s&&(i+=f(n<<2)),i}function s(t){var e,n=i(t),r=new Array;for(e=0;2*e<n.length;++e)r[e]=parseInt(n.substring(2*e,2*e+2),16);return r}function o(t,e,n){null!=t&&("number"==typeof t?this.fromNumber(t,e,n):null==e&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,e))}function a(){return new o(null)}function u(t,e,n,r,i,s){for(;--s>=0;){var o=e*this[t++]+n[r]+i;i=Math.floor(o/67108864),n[r++]=67108863&o}return i}function h(t,e,n,r,i,s){for(var o=32767&e,a=e>>15;--s>=0;){var u=32767&this[t],h=this[t++]>>15,c=a*u+h*o;u=o*u+((32767&c)<<15)+n[r]+(1073741823&i),i=(u>>>30)+(c>>>15)+a*h+(i>>>30),n[r++]=1073741823&u}return i}function c(t,e,n,r,i,s){for(var o=16383&e,a=e>>14;--s>=0;){var u=16383&this[t],h=this[t++]>>14,c=a*u+h*o;u=o*u+((16383&c)<<14)+n[r]+i,i=(u>>28)+(c>>14)+a*h,n[r++]=268435455&u}return i}function f(t){return pr.charAt(t)}function l(t,e){var n=yr[t.charCodeAt(e)];return null==n?-1:n}function d(t){for(var e=this.t-1;e>=0;--e)t[e]=this[e];t.t=this.t,t.s=this.s}function g(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0}function p(t){var e=a();return e.fromInt(t),e}function y(t,e){var n;if(16==e)n=4;else if(8==e)n=3;else if(256==e)n=8;else if(2==e)n=1;else if(32==e)n=5;else{if(4!=e)return void this.fromRadix(t,e);n=2}this.t=0,this.s=0;for(var r=t.length,i=!1,s=0;--r>=0;){var a=8==n?255&t[r]:l(t,r);a<0?"-"==t.charAt(r)&&(i=!0):(i=!1,0==s?this[this.t++]=a:s+n>this.DB?(this[this.t-1]|=(a&(1<<this.DB-s)-1)<<s,this[this.t++]=a>>this.DB-s):this[this.t-1]|=a<<s,s+=n,s>=this.DB&&(s-=this.DB))}8==n&&0!=(128&t[0])&&(this.s=-1,s>0&&(this[this.t-1]|=(1<<this.DB-s)-1<<s)),this.clamp(),i&&o.ZERO.subTo(this,this)}function v(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t}function m(t){if(this.s<0)return"-"+this.negate().toString(t);var e;if(16==t)e=4;else if(8==t)e=3;else if(2==t)e=1;else if(32==t)e=5;else{if(4!=t)return this.toRadix(t);e=2}var n,r=(1<<e)-1,i=!1,s="",o=this.t,a=this.DB-o*this.DB%e;if(o-- >0)for(a<this.DB&&(n=this[o]>>a)>0&&(i=!0,s=f(n));o>=0;)a<e?(n=(this[o]&(1<<a)-1)<<e-a,n|=this[--o]>>(a+=this.DB-e)):(n=this[o]>>(a-=e)&r,a<=0&&(a+=this.DB,--o)),n>0&&(i=!0),i&&(s+=f(n));return i?s:"0"}function S(){var t=a();return o.ZERO.subTo(this,t),t}function b(){return this.s<0?this.negate():this}function w(t){var e=this.s-t.s;if(0!=e)return e;var n=this.t;if(e=n-t.t,0!=e)return this.s<0?-e:e;for(;--n>=0;)if(0!=(e=this[n]-t[n]))return e;return 0}function E(t){var e,n=1;return 0!=(e=t>>>16)&&(t=e,n+=16),0!=(e=t>>8)&&(t=e,n+=8),0!=(e=t>>4)&&(t=e,n+=4),0!=(e=t>>2)&&(t=e,n+=2),0!=(e=t>>1)&&(t=e,n+=1),n}function x(){return this.t<=0?0:this.DB*(this.t-1)+E(this[this.t-1]^this.s&this.DM)}function _(t,e){var n;for(n=this.t-1;n>=0;--n)e[n+t]=this[n];for(n=t-1;n>=0;--n)e[n]=0;e.t=this.t+t,e.s=this.s}function A(t,e){for(var n=t;n<this.t;++n)e[n-t]=this[n];e.t=Math.max(this.t-t,0),e.s=this.s}function F(t,e){var n,r=t%this.DB,i=this.DB-r,s=(1<<i)-1,o=Math.floor(t/this.DB),a=this.s<<r&this.DM;for(n=this.t-1;n>=0;--n)e[n+o+1]=this[n]>>i|a,a=(this[n]&s)<<r;for(n=o-1;n>=0;--n)e[n]=0;e[o]=a,e.t=this.t+o+1,e.s=this.s,e.clamp()}function P(t,e){e.s=this.s;var n=Math.floor(t/this.DB);if(n>=this.t)return void(e.t=0);var r=t%this.DB,i=this.DB-r,s=(1<<r)-1;e[0]=this[n]>>r;for(var o=n+1;o<this.t;++o)e[o-n-1]|=(this[o]&s)<<i,e[o-n]=this[o]>>r;r>0&&(e[this.t-n-1]|=(this.s&s)<<i),e.t=this.t-n,e.clamp()}function O(t,e){for(var n=0,r=0,i=Math.min(t.t,this.t);n<i;)r+=this[n]-t[n],e[n++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r-=t.s;n<this.t;)r+=this[n],e[n++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;n<t.t;)r-=t[n],e[n++]=r&this.DM,r>>=this.DB;r-=t.s}e.s=r<0?-1:0,r<-1?e[n++]=this.DV+r:r>0&&(e[n++]=r),e.t=n,e.clamp()}function C(t,e){var n=this.abs(),r=t.abs(),i=n.t;for(e.t=i+r.t;--i>=0;)e[i]=0;for(i=0;i<r.t;++i)e[i+n.t]=n.am(0,r[i],e,i,0,n.t);e.s=0,e.clamp(),this.s!=t.s&&o.ZERO.subTo(e,e)}function T(t){for(var e=this.abs(),n=t.t=2*e.t;--n>=0;)t[n]=0;for(n=0;n<e.t-1;++n){var r=e.am(n,e[n],t,2*n,0,1);(t[n+e.t]+=e.am(n+1,2*e[n],t,2*n+1,r,e.t-n-1))>=e.DV&&(t[n+e.t]-=e.DV,t[n+e.t+1]=1)}t.t>0&&(t[t.t-1]+=e.am(n,e[n],t,2*n,0,1)),t.s=0,t.clamp()}function D(t,e,n){var r=t.abs();if(!(r.t<=0)){var i=this.abs();if(i.t<r.t)return null!=e&&e.fromInt(0),void(null!=n&&this.copyTo(n));null==n&&(n=a());var s=a(),u=this.s,h=t.s,c=this.DB-E(r[r.t-1]);c>0?(r.lShiftTo(c,s),i.lShiftTo(c,n)):(r.copyTo(s),i.copyTo(n));var f=s.t,l=s[f-1];if(0!=l){var d=l*(1<<this.F1)+(f>1?s[f-2]>>this.F2:0),g=this.FV/d,p=(1<<this.F1)/d,y=1<<this.F2,v=n.t,m=v-f,S=null==e?a():e;for(s.dlShiftTo(m,S),n.compareTo(S)>=0&&(n[n.t++]=1,n.subTo(S,n)),o.ONE.dlShiftTo(f,S),S.subTo(s,s);s.t<f;)s[s.t++]=0;for(;--m>=0;){var b=n[--v]==l?this.DM:Math.floor(n[v]*g+(n[v-1]+y)*p);if((n[v]+=s.am(0,b,n,m,0,f))<b)for(s.dlShiftTo(m,S),n.subTo(S,n);n[v]<--b;)n.subTo(S,n)}null!=e&&(n.drShiftTo(f,e),u!=h&&o.ZERO.subTo(e,e)),n.t=f,n.clamp(),c>0&&n.rShiftTo(c,n),u<0&&o.ZERO.subTo(n,n)}}}function j(t){var e=a();return this.abs().divRemTo(t,null,e),this.s<0&&e.compareTo(o.ZERO)>0&&t.subTo(e,e),e}function H(t){this.m=t}function R(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t}function I(t){return t}function k(t){t.divRemTo(this.m,null,t)}function B(t,e,n){t.multiplyTo(e,n),this.reduce(n)}function N(t,e){t.squareTo(e),this.reduce(e)}function V(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var e=3&t;return e=e*(2-(15&t)*e)&15,e=e*(2-(255&t)*e)&255,e=e*(2-((65535&t)*e&65535))&65535,e=e*(2-t*e%this.DV)%this.DV,e>0?this.DV-e:-e}function M(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function K(t){var e=a();return t.abs().dlShiftTo(this.m.t,e),e.divRemTo(this.m,null,e),t.s<0&&e.compareTo(o.ZERO)>0&&this.m.subTo(e,e),e}function L(t){var e=a();return t.copyTo(e),this.reduce(e),e}function U(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var e=0;e<this.m.t;++e){var n=32767&t[e],r=n*this.mpl+((n*this.mph+(t[e]>>15)*this.mpl&this.um)<<15)&t.DM;for(n=e+this.m.t,t[n]+=this.m.am(0,r,t,e,0,this.m.t);t[n]>=t.DV;)t[n]-=t.DV,t[++n]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)}function q(t,e){t.squareTo(e),this.reduce(e)}function W(t,e,n){t.multiplyTo(e,n),this.reduce(n)}function J(){return 0==(this.t>0?1&this[0]:this.s)}function z(t,e){if(t>4294967295||t<1)return o.ONE;var n=a(),r=a(),i=e.convert(this),s=E(t)-1;for(i.copyTo(n);--s>=0;)if(e.sqrTo(n,r),(t&1<<s)>0)e.mulTo(r,i,n);else{var u=n;n=r,r=u}return e.revert(n)}function Y(t,e){var n;return n=t<256||e.isEven()?new H(e):new M(e),this.exp(t,n)}/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
function G(){var t=a();return this.copyTo(t),t}function X(){if(this.s<0){if(1==this.t)return this[0]-this.DV;if(0==this.t)return-1}else{if(1==this.t)return this[0];if(0==this.t)return 0}return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function $(){return 0==this.t?this.s:this[0]<<24>>24}function Z(){return 0==this.t?this.s:this[0]<<16>>16}function Q(t){return Math.floor(Math.LN2*this.DB/Math.log(t))}function tt(){return this.s<0?-1:this.t<=0||1==this.t&&this[0]<=0?0:1}function et(t){if(null==t&&(t=10),0==this.signum()||t<2||t>36)return"0";var e=this.chunkSize(t),n=Math.pow(t,e),r=p(n),i=a(),s=a(),o="";for(this.divRemTo(r,i,s);i.signum()>0;)o=(n+s.intValue()).toString(t).substr(1)+o,i.divRemTo(r,i,s);return s.intValue().toString(t)+o}function nt(t,e){this.fromInt(0),null==e&&(e=10);for(var n=this.chunkSize(e),r=Math.pow(e,n),i=!1,s=0,a=0,u=0;u<t.length;++u){var h=l(t,u);h<0?"-"==t.charAt(u)&&0==this.signum()&&(i=!0):(a=e*a+h,++s>=n&&(this.dMultiply(r),this.dAddOffset(a,0),s=0,a=0))}s>0&&(this.dMultiply(Math.pow(e,s)),this.dAddOffset(a,0)),i&&o.ZERO.subTo(this,this)}function rt(t,e,n){if("number"==typeof e)if(t<2)this.fromInt(1);else for(this.fromNumber(t,n),this.testBit(t-1)||this.bitwiseTo(o.ONE.shiftLeft(t-1),ft,this),this.isEven()&&this.dAddOffset(1,0);!this.isProbablePrime(e);)this.dAddOffset(2,0),this.bitLength()>t&&this.subTo(o.ONE.shiftLeft(t-1),this);else{var r=new Array,i=7&t;r.length=(t>>3)+1,e.nextBytes(r),i>0?r[0]&=(1<<i)-1:r[0]=0,this.fromString(r,256)}}function it(){var t=this.t,e=new Array;e[0]=this.s;var n,r=this.DB-t*this.DB%8,i=0;if(t-- >0)for(r<this.DB&&(n=this[t]>>r)!=(this.s&this.DM)>>r&&(e[i++]=n|this.s<<this.DB-r);t>=0;)r<8?(n=(this[t]&(1<<r)-1)<<8-r,n|=this[--t]>>(r+=this.DB-8)):(n=this[t]>>(r-=8)&255,r<=0&&(r+=this.DB,--t)),0!=(128&n)&&(n|=-256),0==i&&(128&this.s)!=(128&n)&&++i,(i>0||n!=this.s)&&(e[i++]=n);return e}function st(t){return 0==this.compareTo(t)}function ot(t){return this.compareTo(t)<0?this:t}function at(t){return this.compareTo(t)>0?this:t}function ut(t,e,n){var r,i,s=Math.min(t.t,this.t);for(r=0;r<s;++r)n[r]=e(this[r],t[r]);if(t.t<this.t){for(i=t.s&this.DM,r=s;r<this.t;++r)n[r]=e(this[r],i);n.t=this.t}else{for(i=this.s&this.DM,r=s;r<t.t;++r)n[r]=e(i,t[r]);n.t=t.t}n.s=e(this.s,t.s),n.clamp()}function ht(t,e){return t&e}function ct(t){var e=a();return this.bitwiseTo(t,ht,e),e}function ft(t,e){return t|e}function lt(t){var e=a();return this.bitwiseTo(t,ft,e),e}function dt(t,e){return t^e}function gt(t){var e=a();return this.bitwiseTo(t,dt,e),e}function pt(t,e){return t&~e}function yt(t){var e=a();return this.bitwiseTo(t,pt,e),e}function vt(){for(var t=a(),e=0;e<this.t;++e)t[e]=this.DM&~this[e];return t.t=this.t,t.s=~this.s,t}function mt(t){var e=a();return t<0?this.rShiftTo(-t,e):this.lShiftTo(t,e),e}function St(t){var e=a();return t<0?this.lShiftTo(-t,e):this.rShiftTo(t,e),e}function bt(t){if(0==t)return-1;var e=0;return 0==(65535&t)&&(t>>=16,e+=16),0==(255&t)&&(t>>=8,e+=8),0==(15&t)&&(t>>=4,e+=4),0==(3&t)&&(t>>=2,e+=2),0==(1&t)&&++e,e}function wt(){for(var t=0;t<this.t;++t)if(0!=this[t])return t*this.DB+bt(this[t]);return this.s<0?this.t*this.DB:-1}function Et(t){for(var e=0;0!=t;)t&=t-1,++e;return e}function xt(){for(var t=0,e=this.s&this.DM,n=0;n<this.t;++n)t+=Et(this[n]^e);return t}function _t(t){var e=Math.floor(t/this.DB);return e>=this.t?0!=this.s:0!=(this[e]&1<<t%this.DB)}function At(t,e){var n=o.ONE.shiftLeft(t);return this.bitwiseTo(n,e,n),n}function Ft(t){return this.changeBit(t,ft)}function Pt(t){return this.changeBit(t,pt)}function Ot(t){return this.changeBit(t,dt)}function Ct(t,e){for(var n=0,r=0,i=Math.min(t.t,this.t);n<i;)r+=this[n]+t[n],e[n++]=r&this.DM,r>>=this.DB;if(t.t<this.t){for(r+=t.s;n<this.t;)r+=this[n],e[n++]=r&this.DM,r>>=this.DB;r+=this.s}else{for(r+=this.s;n<t.t;)r+=t[n],e[n++]=r&this.DM,r>>=this.DB;r+=t.s}e.s=r<0?-1:0,r>0?e[n++]=r:r<-1&&(e[n++]=this.DV+r),e.t=n,e.clamp()}function Tt(t){var e=a();return this.addTo(t,e),e}function Dt(t){var e=a();return this.subTo(t,e),e}function jt(t){var e=a();return this.multiplyTo(t,e),e}function Ht(){var t=a();return this.squareTo(t),t}function Rt(t){var e=a();return this.divRemTo(t,e,null),e}function It(t){var e=a();return this.divRemTo(t,null,e),e}function kt(t){var e=a(),n=a();return this.divRemTo(t,e,n),new Array(e,n)}function Bt(t){this[this.t]=this.am(0,t-1,this,0,0,this.t),++this.t,this.clamp()}function Nt(t,e){if(0!=t){for(;this.t<=e;)this[this.t++]=0;for(this[e]+=t;this[e]>=this.DV;)this[e]-=this.DV,++e>=this.t&&(this[this.t++]=0),++this[e]}}function Vt(){}function Mt(t){return t}function Kt(t,e,n){t.multiplyTo(e,n)}function Lt(t,e){t.squareTo(e)}function Ut(t){return this.exp(t,new Vt)}function qt(t,e,n){var r=Math.min(this.t+t.t,e);for(n.s=0,n.t=r;r>0;)n[--r]=0;var i;for(i=n.t-this.t;r<i;++r)n[r+this.t]=this.am(0,t[r],n,r,0,this.t);for(i=Math.min(t.t,e);r<i;++r)this.am(0,t[r],n,r,0,e-r);n.clamp()}function Wt(t,e,n){--e;var r=n.t=this.t+t.t-e;for(n.s=0;--r>=0;)n[r]=0;for(r=Math.max(e-this.t,0);r<t.t;++r)n[this.t+r-e]=this.am(e-r,t[r],n,0,0,this.t+r-e);n.clamp(),n.drShiftTo(1,n)}function Jt(t){this.r2=a(),this.q3=a(),o.ONE.dlShiftTo(2*t.t,this.r2),this.mu=this.r2.divide(t),this.m=t}function zt(t){if(t.s<0||t.t>2*this.m.t)return t.mod(this.m);if(t.compareTo(this.m)<0)return t;var e=a();return t.copyTo(e),this.reduce(e),e}function Yt(t){return t}function Gt(t){for(t.drShiftTo(this.m.t-1,this.r2),t.t>this.m.t+1&&(t.t=this.m.t+1,t.clamp()),this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3),this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);t.compareTo(this.r2)<0;)t.dAddOffset(1,this.m.t+1);for(t.subTo(this.r2,t);t.compareTo(this.m)>=0;)t.subTo(this.m,t)}function Xt(t,e){t.squareTo(e),this.reduce(e)}function $t(t,e,n){t.multiplyTo(e,n),this.reduce(n)}function Zt(t,e){var n,r,i=t.bitLength(),s=p(1);if(i<=0)return s;n=i<18?1:i<48?3:i<144?4:i<768?5:6,r=i<8?new H(e):e.isEven()?new Jt(e):new M(e);var o=new Array,u=3,h=n-1,c=(1<<n)-1;if(o[1]=r.convert(this),n>1){var f=a();for(r.sqrTo(o[1],f);u<=c;)o[u]=a(),r.mulTo(f,o[u-2],o[u]),u+=2}var l,d,g=t.t-1,y=!0,v=a();for(i=E(t[g])-1;g>=0;){for(i>=h?l=t[g]>>i-h&c:(l=(t[g]&(1<<i+1)-1)<<h-i,g>0&&(l|=t[g-1]>>this.DB+i-h)),u=n;0==(1&l);)l>>=1,--u;if((i-=u)<0&&(i+=this.DB,--g),y)o[l].copyTo(s),y=!1;else{for(;u>1;)r.sqrTo(s,v),r.sqrTo(v,s),u-=2;u>0?r.sqrTo(s,v):(d=s,s=v,v=d),r.mulTo(v,o[l],s)}for(;g>=0&&0==(t[g]&1<<i);)r.sqrTo(s,v),d=s,s=v,v=d,--i<0&&(i=this.DB-1,--g)}return r.revert(s)}function Qt(t){var e=this.s<0?this.negate():this.clone(),n=t.s<0?t.negate():t.clone();if(e.compareTo(n)<0){var r=e;e=n,n=r}var i=e.getLowestSetBit(),s=n.getLowestSetBit();if(s<0)return e;for(i<s&&(s=i),s>0&&(e.rShiftTo(s,e),n.rShiftTo(s,n));e.signum()>0;)(i=e.getLowestSetBit())>0&&e.rShiftTo(i,e),(i=n.getLowestSetBit())>0&&n.rShiftTo(i,n),e.compareTo(n)>=0?(e.subTo(n,e),e.rShiftTo(1,e)):(n.subTo(e,n),n.rShiftTo(1,n));return s>0&&n.lShiftTo(s,n),n}function te(t){if(t<=0)return 0;var e=this.DV%t,n=this.s<0?t-1:0;if(this.t>0)if(0==e)n=this[0]%t;else for(var r=this.t-1;r>=0;--r)n=(e*n+this[r])%t;return n}function ee(t){var e=t.isEven();if(this.isEven()&&e||0==t.signum())return o.ZERO;for(var n=t.clone(),r=this.clone(),i=p(1),s=p(0),a=p(0),u=p(1);0!=n.signum();){for(;n.isEven();)n.rShiftTo(1,n),e?(i.isEven()&&s.isEven()||(i.addTo(this,i),s.subTo(t,s)),i.rShiftTo(1,i)):s.isEven()||s.subTo(t,s),s.rShiftTo(1,s);for(;r.isEven();)r.rShiftTo(1,r),e?(a.isEven()&&u.isEven()||(a.addTo(this,a),u.subTo(t,u)),a.rShiftTo(1,a)):u.isEven()||u.subTo(t,u),u.rShiftTo(1,u);n.compareTo(r)>=0?(n.subTo(r,n),e&&i.subTo(a,i),s.subTo(u,s)):(r.subTo(n,r),e&&a.subTo(i,a),u.subTo(s,u))}return 0!=r.compareTo(o.ONE)?o.ZERO:u.compareTo(t)>=0?u.subtract(t):u.signum()<0?(u.addTo(t,u),u.signum()<0?u.add(t):u):u}function ne(t){var e,n=this.abs();if(1==n.t&&n[0]<=vr[vr.length-1]){for(e=0;e<vr.length;++e)if(n[0]==vr[e])return!0;return!1}if(n.isEven())return!1;for(e=1;e<vr.length;){for(var r=vr[e],i=e+1;i<vr.length&&r<mr;)r*=vr[i++];for(r=n.modInt(r);e<i;)if(r%vr[e++]==0)return!1}return n.millerRabin(t)}function re(t){var e=this.subtract(o.ONE),n=e.getLowestSetBit();if(n<=0)return!1;var r=e.shiftRight(n);t=t+1>>1,t>vr.length&&(t=vr.length);for(var i=a(),s=0;s<t;++s){i.fromInt(vr[Math.floor(Math.random()*vr.length)]);var u=i.modPow(r,this);if(0!=u.compareTo(o.ONE)&&0!=u.compareTo(e)){for(var h=1;h++<n&&0!=u.compareTo(e);)if(u=u.modPowInt(2,this),0==u.compareTo(o.ONE))return!1;if(0!=u.compareTo(e))return!1}}return!0}/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
function ie(){this.i=0,this.j=0,this.S=new Array}function se(t){var e,n,r;for(e=0;e<256;++e)this.S[e]=e;for(n=0,e=0;e<256;++e)n=n+this.S[e]+t[e%t.length]&255,r=this.S[e],this.S[e]=this.S[n],this.S[n]=r;this.i=0,this.j=0}function oe(){var t;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,t=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=t,this.S[t+this.S[this.i]&255]}function ae(){return new ie}function ue(t){br[wr++]^=255&t,br[wr++]^=t>>8&255,br[wr++]^=t>>16&255,br[wr++]^=t>>24&255,wr>=Er&&(wr-=Er)}function he(){ue((new Date).getTime())}function ce(){if(null==Sr){for(he(),Sr=ae(),Sr.init(br),wr=0;wr<br.length;++wr)br[wr]=0;wr=0}return Sr.next()}function fe(t){var e;for(e=0;e<t.length;++e)t[e]=ce()}function le(){}/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
function de(t,e){return new o(t,e)}function ge(t,e){if(e<t.length+11)return alert("Message too long for RSA"),null;for(var n=new Array,r=t.length-1;r>=0&&e>0;){var i=t.charCodeAt(r--);i<128?n[--e]=i:i>127&&i<2048?(n[--e]=63&i|128,n[--e]=i>>6|192):(n[--e]=63&i|128,n[--e]=i>>6&63|128,n[--e]=i>>12|224)}n[--e]=0;for(var s=new le,a=new Array;e>2;){for(a[0]=0;0==a[0];)s.nextBytes(a);n[--e]=a[0]}return n[--e]=2,n[--e]=0,new o(n)}function pe(t,e,n){for(var r="",i=0;r.length<e;)r+=n(String.fromCharCode.apply(String,t.concat([(4278190080&i)>>24,(16711680&i)>>16,(65280&i)>>8,255&i]))),i+=1;return r}function ye(t,e,n){if(t.length+2*Fr+2>e)throw"Message too long for RSA";var r,i="";for(r=0;r<e-t.length-2*Fr-2;r+=1)i+="\0";var s=rstr_sha1("")+i+""+t,a=new Array(Fr);(new le).nextBytes(a);var u=pe(a,s.length,n||rstr_sha1),h=[];for(r=0;r<s.length;r+=1)h[r]=s.charCodeAt(r)^u.charCodeAt(r);var c=pe(h,a.length,rstr_sha1),f=[0];for(r=0;r<a.length;r+=1)f[r+1]=a[r]^c.charCodeAt(r);return new o(f.concat(h))}function ve(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}function me(t,e){this.isPublic=!0,"string"!=typeof t?(this.n=t,this.e=e):null!=t&&null!=e&&t.length>0&&e.length>0?(this.n=de(t,16),this.e=parseInt(e,16)):alert("Invalid RSA public key")}function Se(t){return t.modPowInt(this.e,this.n)}function be(t){var e=ge(t,this.n.bitLength()+7>>3);if(null==e)return null;var n=this.doPublic(e);if(null==n)return null;var r=n.toString(16);return 0==(1&r.length)?r:"0"+r}function we(t,e){var n=ye(t,this.n.bitLength()+7>>3,e);if(null==n)return null;var r=this.doPublic(n);if(null==r)return null;var i=r.toString(16);return 0==(1&i.length)?i:"0"+i}/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
function Ee(t,e){for(var n=t.toByteArray(),r=0;r<n.length&&0==n[r];)++r;if(n.length-r!=e-1||2!=n[r])return null;for(++r;0!=n[r];)if(++r>=n.length)return null;for(var i="";++r<n.length;){var s=255&n[r];s<128?i+=String.fromCharCode(s):s>191&&s<224?(i+=String.fromCharCode((31&s)<<6|63&n[r+1]),++r):(i+=String.fromCharCode((15&s)<<12|(63&n[r+1])<<6|63&n[r+2]),r+=2)}return i}function xe(t,e,n){for(var r="",i=0;r.length<e;)r+=n(t+String.fromCharCode.apply(String,[(4278190080&i)>>24,(16711680&i)>>16,(65280&i)>>8,255&i])),i+=1;return r}function _e(t,e,n){t=t.toByteArray();var r;for(r=0;r<t.length;r+=1)t[r]&=255;for(;t.length<e;)t.unshift(0);if(t=String.fromCharCode.apply(String,t),t.length<2*Fr+2)throw"Cipher too short";var r,i=t.substr(1,Fr),s=t.substr(Fr+1),o=xe(s,Fr,n||rstr_sha1),a=[];for(r=0;r<i.length;r+=1)a[r]=i.charCodeAt(r)^o.charCodeAt(r);var u=xe(String.fromCharCode.apply(String,a),t.length-Fr,rstr_sha1),h=[];for(r=0;r<s.length;r+=1)h[r]=s.charCodeAt(r)^u.charCodeAt(r);if(h=String.fromCharCode.apply(String,h),h.substr(0,Fr)!==rstr_sha1(""))throw"Hash mismatch";h=h.substr(Fr);var c=h.indexOf(""),f=c!=-1?h.substr(0,c).lastIndexOf("\0"):-1;if(f+1!=c)throw"Malformed data";return h.substr(c+1)}function Ae(t,e,n){this.isPrivate=!0,"string"!=typeof t?(this.n=t,this.e=e,this.d=n):null!=t&&null!=e&&t.length>0&&e.length>0?(this.n=de(t,16),this.e=parseInt(e,16),this.d=de(n,16)):alert("Invalid RSA private key")}function Fe(t,e,n,r,i,s,o,a){if(this.isPrivate=!0,null==t)throw"RSASetPrivateEx N == null";if(null==e)throw"RSASetPrivateEx E == null";if(0==t.length)throw"RSASetPrivateEx N.length == 0";if(0==e.length)throw"RSASetPrivateEx E.length == 0";null!=t&&null!=e&&t.length>0&&e.length>0?(this.n=de(t,16),this.e=parseInt(e,16),this.d=de(n,16),this.p=de(r,16),this.q=de(i,16),this.dmp1=de(s,16),this.dmq1=de(o,16),this.coeff=de(a,16)):alert("Invalid RSA private key in RSASetPrivateEx")}function Pe(t,e){var n=new le,r=t>>1;this.e=parseInt(e,16);for(var i=new o(e,16);;){for(;this.p=new o(t-r,1,n),0!=this.p.subtract(o.ONE).gcd(i).compareTo(o.ONE)||!this.p.isProbablePrime(10););for(;this.q=new o(r,1,n),0!=this.q.subtract(o.ONE).gcd(i).compareTo(o.ONE)||!this.q.isProbablePrime(10););if(this.p.compareTo(this.q)<=0){var s=this.p;this.p=this.q,this.q=s}var a=this.p.subtract(o.ONE),u=this.q.subtract(o.ONE),h=a.multiply(u);if(0==h.gcd(i).compareTo(o.ONE)){this.n=this.p.multiply(this.q),this.d=i.modInverse(h),this.dmp1=this.d.mod(a),this.dmq1=this.d.mod(u),this.coeff=this.q.modInverse(this.p);break}}}function Oe(t){if(null==this.p||null==this.q)return t.modPow(this.d,this.n);for(var e=t.mod(this.p).modPow(this.dmp1,this.p),n=t.mod(this.q).modPow(this.dmq1,this.q);e.compareTo(n)<0;)e=e.add(this.p);return e.subtract(n).multiply(this.coeff).mod(this.p).multiply(this.q).add(n)}function Ce(t){var e=de(t,16),n=this.doPrivate(e);return null==n?null:Ee(n,this.n.bitLength()+7>>3)}function Te(t,e){var n=de(t,16),r=this.doPrivate(n);return null==r?null:_e(r,this.n.bitLength()+7>>3,e)}/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
function De(t,e){this.x=e,this.q=t}function je(t){return t==this||this.q.equals(t.q)&&this.x.equals(t.x)}function He(){return this.x}function Re(){return new De(this.q,this.x.negate().mod(this.q))}function Ie(t){return new De(this.q,this.x.add(t.toBigInteger()).mod(this.q))}function ke(t){return new De(this.q,this.x.subtract(t.toBigInteger()).mod(this.q))}function Be(t){return new De(this.q,this.x.multiply(t.toBigInteger()).mod(this.q))}function Ne(){return new De(this.q,this.x.square().mod(this.q))}function Ve(t){return new De(this.q,this.x.multiply(t.toBigInteger().modInverse(this.q)).mod(this.q))}function Me(t,e,n,r){this.curve=t,this.x=e,this.y=n,null==r?this.z=o.ONE:this.z=r,this.zinv=null}function Ke(){return null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)),this.curve.fromBigInteger(this.x.toBigInteger().multiply(this.zinv).mod(this.curve.q))}function Le(){return null==this.zinv&&(this.zinv=this.z.modInverse(this.curve.q)),this.curve.fromBigInteger(this.y.toBigInteger().multiply(this.zinv).mod(this.curve.q))}function Ue(t){if(t==this)return!0;if(this.isInfinity())return t.isInfinity();if(t.isInfinity())return this.isInfinity();var e,n;return e=t.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t.z)).mod(this.curve.q),!!e.equals(o.ZERO)&&(n=t.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t.z)).mod(this.curve.q),n.equals(o.ZERO))}function qe(){return null==this.x&&null==this.y||this.z.equals(o.ZERO)&&!this.y.toBigInteger().equals(o.ZERO)}function We(){return new Me(this.curve,this.x,this.y.negate(),this.z)}function Je(t){if(this.isInfinity())return t;if(t.isInfinity())return this;var e=t.y.toBigInteger().multiply(this.z).subtract(this.y.toBigInteger().multiply(t.z)).mod(this.curve.q),n=t.x.toBigInteger().multiply(this.z).subtract(this.x.toBigInteger().multiply(t.z)).mod(this.curve.q);if(o.ZERO.equals(n))return o.ZERO.equals(e)?this.twice():this.curve.getInfinity();var r=new o("3"),i=this.x.toBigInteger(),s=this.y.toBigInteger(),a=(t.x.toBigInteger(),t.y.toBigInteger(),n.square()),u=a.multiply(n),h=i.multiply(a),c=e.square().multiply(this.z),f=c.subtract(h.shiftLeft(1)).multiply(t.z).subtract(u).multiply(n).mod(this.curve.q),l=h.multiply(r).multiply(e).subtract(s.multiply(u)).subtract(c.multiply(e)).multiply(t.z).add(e.multiply(u)).mod(this.curve.q),d=u.multiply(this.z).multiply(t.z).mod(this.curve.q);return new Me(this.curve,this.curve.fromBigInteger(f),this.curve.fromBigInteger(l),d)}function ze(){if(this.isInfinity())return this;if(0==this.y.toBigInteger().signum())return this.curve.getInfinity();var t=new o("3"),e=this.x.toBigInteger(),n=this.y.toBigInteger(),r=n.multiply(this.z),i=r.multiply(n).mod(this.curve.q),s=this.curve.a.toBigInteger(),a=e.square().multiply(t);o.ZERO.equals(s)||(a=a.add(this.z.square().multiply(s))),a=a.mod(this.curve.q);var u=a.square().subtract(e.shiftLeft(3).multiply(i)).shiftLeft(1).multiply(r).mod(this.curve.q),h=a.multiply(t).multiply(e).subtract(i.shiftLeft(1)).shiftLeft(2).multiply(i).subtract(a.square().multiply(a)).mod(this.curve.q),c=r.square().multiply(r).shiftLeft(3).mod(this.curve.q);return new Me(this.curve,this.curve.fromBigInteger(u),this.curve.fromBigInteger(h),c)}function Ye(t){if(this.isInfinity())return this;if(0==t.signum())return this.curve.getInfinity();var e,n=t,r=n.multiply(new o("3")),i=this.negate(),s=this;for(e=r.bitLength()-2;e>0;--e){s=s.twice();var a=r.testBit(e),u=n.testBit(e);a!=u&&(s=s.add(a?this:i))}return s}function Ge(t,e,n){var r;r=t.bitLength()>n.bitLength()?t.bitLength()-1:n.bitLength()-1;for(var i=this.curve.getInfinity(),s=this.add(e);r>=0;)i=i.twice(),t.testBit(r)?i=n.testBit(r)?i.add(s):i.add(this):n.testBit(r)&&(i=i.add(e)),--r;return i}function Xe(t,e,n){this.q=t,this.a=this.fromBigInteger(e),this.b=this.fromBigInteger(n),this.infinity=new Me(this,null,null)}function $e(){return this.q}function Ze(){return this.a}function Qe(){return this.b}function tn(t){return t==this||this.q.equals(t.q)&&this.a.equals(t.a)&&this.b.equals(t.b)}function en(){return this.infinity}function nn(t){return new De(this.q,t)}function rn(t){switch(parseInt(t.substr(0,2),16)){case 0:return this.infinity;case 2:case 3:return null;case 4:case 6:case 7:var e=(t.length-2)/2,n=t.substr(2,e),r=t.substr(e+2,e);return new Me(this,this.fromBigInteger(new o(n,16)),this.fromBigInteger(new o(r,16)));default:return null}}function sn(t){for(var e=new Array,n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}function on(t){for(var e="",n=0;n<t.length;n++)e+=String.fromCharCode(t[n]);return e}function an(t){for(var e="",n=0;n<t.length;n++){var r=t[n].toString(16);1==r.length&&(r="0"+r),e+=r}return e}function un(t){return an(sn(t))}function hn(t){return r(un(t))}function cn(t){return ln(r(un(t)))}function fn(t){return on(s(dn(t)))}function ln(t){return t=t.replace(/\=/g,""),t=t.replace(/\+/g,"-"),t=t.replace(/\//g,"_")}function dn(t){return t.length%4==2?t+="==":t.length%4==3&&(t+="="),t=t.replace(/-/g,"+"),t=t.replace(/_/g,"/")}function gn(t){return t.length%2==1&&(t="0"+t),ln(r(t))}function pn(t){return i(dn(t))}function yn(t){return r(xn(An(t)))}function vn(t){return decodeURIComponent(_n(i(t)))}function mn(t){return xn(An(t))}function Sn(t){return decodeURIComponent(_n(t))}function bn(t){for(var e="",n=0;n<t.length-1;n+=2)e+=String.fromCharCode(parseInt(t.substr(n,2),16));return e}function wn(t){for(var e="",n=0;n<t.length;n++)e+=("0"+t.charCodeAt(n).toString(16)).slice(-2);return e}function En(t){return r(t)}function xn(t){return t.replace(/%/g,"")}function _n(t){return t.replace(/(..)/g,"%$1")}function An(t){for(var e=encodeURIComponent(t),n="",r=0;r<e.length;r++)"%"==e[r]?(n+=e.substr(r,3),r+=2):n=n+"%"+un(e[r]);return n}function Fn(t){return t=t.replace(/\r\n/gm,"\n")}function Pn(t){return t=t.replace(/\r\n/gm,"\n"),t=t.replace(/\n/gm,"\r\n")}function On(t){t=t.replace(/^\s*\[\s*/,""),t=t.replace(/\s*\]\s*$/,""),t=t.replace(/\s*/g,"");try{var e=t.split(/,/).map(function(t,e,n){var r=parseInt(t);if(r<0||255<r)throw"integer not in range 0-255";var i=("00"+r.toString(16)).slice(-2);return i}).join("");return e}catch(t){throw"malformed integer array string: "+t}}/*! rsapem-1.1.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
function Cn(t){var e=t;return e=e.replace("-----BEGIN RSA PRIVATE KEY-----",""),e=e.replace("-----END RSA PRIVATE KEY-----",""),e=e.replace(/[ \n]+/g,"")}function Tn(t){var e=new Array,n=Or.getStartPosOfV_AtObj(t,0),r=Or.getPosOfNextSibling_AtObj(t,n),i=Or.getPosOfNextSibling_AtObj(t,r),s=Or.getPosOfNextSibling_AtObj(t,i),o=Or.getPosOfNextSibling_AtObj(t,s),a=Or.getPosOfNextSibling_AtObj(t,o),u=Or.getPosOfNextSibling_AtObj(t,a),h=Or.getPosOfNextSibling_AtObj(t,u),c=Or.getPosOfNextSibling_AtObj(t,h);return e.push(n,r,i,s,o,a,u,h,c),e}function Dn(t){var e=Tn(t),n=Or.getHexOfV_AtObj(t,e[0]),r=Or.getHexOfV_AtObj(t,e[1]),i=Or.getHexOfV_AtObj(t,e[2]),s=Or.getHexOfV_AtObj(t,e[3]),o=Or.getHexOfV_AtObj(t,e[4]),a=Or.getHexOfV_AtObj(t,e[5]),u=Or.getHexOfV_AtObj(t,e[6]),h=Or.getHexOfV_AtObj(t,e[7]),c=Or.getHexOfV_AtObj(t,e[8]),f=new Array;return f.push(n,r,i,s,o,a,u,h,c),f}function jn(t){var e=Dn(t);this.setPrivateEx(e[1],e[2],e[3],e[4],e[5],e[6],e[7],e[8])}function Hn(t){var e=Cn(t),n=i(e),r=Dn(n);this.setPrivateEx(r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8])}function Rn(t,e){for(var n="",r=e/4-t.length,i=0;i<r;i++)n+="0";return n+t}function In(t,e){var n=function(t){return Cr.crypto.Util.hashString(t,e)},r=n(t);return this.signWithMessageHash(r,e)}function kn(t,e){var n=Cr.crypto.Util.getPaddedDigestInfoHex(t,e,this.n.bitLength()),r=de(n,16),i=this.doPrivate(r),s=i.toString(16);return Rn(s,this.n.bitLength())}function Bn(t){return In.call(this,t,"sha1")}function Nn(t){return In.call(this,t,"sha256")}function Vn(t,e,n){for(var r="",i=0;r.length<e;)r+=bn(n(wn(t+String.fromCharCode.apply(String,[(4278190080&i)>>24,(16711680&i)>>16,(65280&i)>>8,255&i])))),i+=1;return r}function Mn(t,e,n){var r=function(t){return Cr.crypto.Util.hashHex(t,e)},i=r(wn(t));return void 0===n&&(n=-1),this.signWithMessageHashPSS(i,e,n)}function Kn(t,e,n){var r,i=bn(t),s=i.length,a=this.n.bitLength()-1,u=Math.ceil(a/8),h=function(t){return Cr.crypto.Util.hashHex(t,e)};if(n===-1||void 0===n)n=s;else if(n===-2)n=u-s-2;else if(n<-2)throw"invalid salt length";if(u<s+n+2)throw"data too long";var c="";n>0&&(c=new Array(n),(new le).nextBytes(c),c=String.fromCharCode.apply(String,c));var f=bn(h(wn("\0\0\0\0\0\0\0\0"+i+c))),l=[];for(r=0;r<u-n-s-2;r+=1)l[r]=0;var d=String.fromCharCode.apply(String,l)+""+c,g=Vn(f,d.length,h),p=[];for(r=0;r<d.length;r+=1)p[r]=d.charCodeAt(r)^g.charCodeAt(r);var y=65280>>8*u-a&255;for(p[0]&=~y,r=0;r<s;r++)p.push(f.charCodeAt(r));return p.push(188),Rn(this.doPrivate(new o(p)).toString(16),this.n.bitLength())}function Ln(t,e,n){var r=new ve;r.setPublic(e,n);var i=r.doPublic(t);return i}function Un(t,e,n){var r=Ln(t,e,n),i=r.toString(16).replace(/^1f+00/,"");return i}function qn(t){for(var e in Cr.crypto.Util.DIGESTINFOHEAD){var n=Cr.crypto.Util.DIGESTINFOHEAD[e],r=n.length;if(t.substring(0,r)==n){var i=[e,t.substring(r)];return i}}return[]}function Wn(t,e,n,r){var i=Un(e,n,r),s=qn(i);if(0==s.length)return!1;var o=s[0],a=s[1],u=function(t){return Cr.crypto.Util.hashString(t,o)},h=u(t);return a==h}function Jn(t,e){var n=de(t,16),r=Wn(e,n,this.n.toString(16),this.e.toString(16));return r}function zn(t,e){e=e.replace(Ir,""),e=e.replace(/[ \n]+/g,"");var n=de(e,16);if(n.bitLength()>this.n.bitLength())return 0;var r=this.doPublic(n),i=r.toString(16).replace(/^1f+00/,""),s=qn(i);if(0==s.length)return!1;var o=s[0],a=s[1],u=function(t){return Cr.crypto.Util.hashString(t,o)},h=u(t);return a==h}function Yn(t,e){e=e.replace(Ir,""),e=e.replace(/[ \n]+/g,"");var n=de(e,16);if(n.bitLength()>this.n.bitLength())return 0;var r=this.doPublic(n),i=r.toString(16).replace(/^1f+00/,""),s=qn(i);if(0==s.length)return!1;var o=(s[0],s[1]);return o==t}function Gn(t,e,n,r){var i=function(t){return Cr.crypto.Util.hashHex(t,n)},s=i(wn(t));return void 0===r&&(r=-1),this.verifyWithMessageHashPSS(s,e,n,r)}function Xn(t,e,n,r){var i=new o(e,16);if(i.bitLength()>this.n.bitLength())return!1;var s,a=function(t){return Cr.crypto.Util.hashHex(t,n)},u=bn(t),h=u.length,c=this.n.bitLength()-1,f=Math.ceil(c/8);if(r===-1||void 0===r)r=h;else if(r===-2)r=f-h-2;else if(r<-2)throw"invalid salt length";if(f<h+r+2)throw"data too long";var l=this.doPublic(i).toByteArray();for(s=0;s<l.length;s+=1)l[s]&=255;for(;l.length<f;)l.unshift(0);if(188!==l[f-1])throw"encoded message does not end in 0xbc";l=String.fromCharCode.apply(String,l);var d=l.substr(0,f-h-1),g=l.substr(d.length,h),p=65280>>8*f-c&255;if(0!==(d.charCodeAt(0)&p))throw"bits beyond keysize not zero";var y=Vn(g,d.length,a),v=[];for(s=0;s<d.length;s+=1)v[s]=d.charCodeAt(s)^y.charCodeAt(s);v[0]&=~p;var m=f-h-r-2;for(s=0;s<m;s+=1)if(0!==v[s])throw"leftmost octets not zero";if(1!==v[m])throw"0x01 marker not found";return g===bn(a(wn("\0\0\0\0\0\0\0\0"+u+String.fromCharCode.apply(String,v.slice(-r)))))}/*! x509-1.1.9.js (c) 2012-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
function $n(){this.subjectPublicKeyRSA=null,this.subjectPublicKeyRSA_hN=null,this.subjectPublicKeyRSA_hE=null,this.hex=null,this.getSerialNumberHex=function(){return Or.getDecendantHexVByNthList(this.hex,0,[0,1])},this.getSignatureAlgorithmField=function(){var t=Or.getDecendantHexVByNthList(this.hex,0,[0,2,0]),e=Cr.asn1.ASN1Util.oidHexToInt(t),n=Cr.asn1.x509.OID.oid2name(e);return n},this.getIssuerHex=function(){return Or.getDecendantHexTLVByNthList(this.hex,0,[0,3])},this.getIssuerString=function(){return $n.hex2dn(Or.getDecendantHexTLVByNthList(this.hex,0,[0,3]))},this.getSubjectHex=function(){return Or.getDecendantHexTLVByNthList(this.hex,0,[0,5])},this.getSubjectString=function(){return $n.hex2dn(Or.getDecendantHexTLVByNthList(this.hex,0,[0,5]))},this.getNotBefore=function(){var t=Or.getDecendantHexVByNthList(this.hex,0,[0,4,0]);return t=t.replace(/(..)/g,"%$1"),t=decodeURIComponent(t)},this.getNotAfter=function(){var t=Or.getDecendantHexVByNthList(this.hex,0,[0,4,1]);return t=t.replace(/(..)/g,"%$1"),t=decodeURIComponent(t)},this.readCertPEM=function(t){var e=$n.pemToHex(t),n=$n.getPublicKeyHexArrayFromCertHex(e),r=new ve;r.setPublic(n[0],n[1]),this.subjectPublicKeyRSA=r,this.subjectPublicKeyRSA_hN=n[0],this.subjectPublicKeyRSA_hE=n[1],this.hex=e},this.readCertPEMWithoutRSAInit=function(t){var e=$n.pemToHex(t),n=$n.getPublicKeyHexArrayFromCertHex(e);this.subjectPublicKeyRSA.setPublic(n[0],n[1]),this.subjectPublicKeyRSA_hN=n[0],this.subjectPublicKeyRSA_hE=n[1],this.hex=e},this.getInfo=function(){var t="Basic Fields\n";t+="  serial number: "+this.getSerialNumberHex()+"\n",t+="  signature algorithm: "+this.getSignatureAlgorithmField()+"\n",t+="  issuer: "+this.getIssuerString()+"\n",t+="  notBefore: "+this.getNotBefore()+"\n",t+="  notAfter: "+this.getNotAfter()+"\n",t+="  subject: "+this.getSubjectString()+"\n",t+="  subject public key info: \n";var e=$n.getSubjectPublicKeyInfoPosFromCertHex(this.hex),n=Or.getHexOfTLV_AtObj(this.hex,e),r=Rr.getKey(n,null,"pkcs8pub");r instanceof ve&&(t+="    key algorithm: RSA\n",t+="    n="+r.n.toString(16).substr(0,16)+"...\n",t+="    e="+r.e.toString(16)+"\n"),t+="X509v3 Extensions:\n";for(var i=$n.getV3ExtInfoListOfCertHex(this.hex),s=0;s<i.length;s++){var o=i[s],a=Cr.asn1.x509.OID.oid2name(o.oid);""===a&&(a=o.oid);var u="";if(o.critical===!0&&(u="CRITICAL"),t+="  "+a+" "+u+":\n","basicConstraints"===a){var h=$n.getExtBasicConstraints(this.hex);void 0===h.cA?t+="    {}\n":(t+="    cA=true",void 0!==h.pathLen&&(t+=", pathLen="+h.pathLen),t+="\n")}else if("keyUsage"===a)t+="    "+$n.getExtKeyUsageString(this.hex)+"\n";else if("subjectKeyIdentifier"===a)t+="    "+$n.getExtSubjectKeyIdentifier(this.hex)+"\n";else if("authorityKeyIdentifier"===a){var c=$n.getExtAuthorityKeyIdentifier(this.hex);void 0!==c.kid&&(t+="    kid="+c.kid+"\n")}else if("extKeyUsage"===a){var f=$n.getExtExtKeyUsageName(this.hex);t+="    "+f.join(", ")+"\n"}else if("subjectAltName"===a){var l=$n.getExtSubjectAltName(this.hex);t+="    "+l.join(", ")+"\n"}else if("cRLDistributionPoints"===a){var d=$n.getExtCRLDistributionPointsURI(this.hex);t+="    "+d+"\n"}else if("authorityInfoAccess"===a){var g=$n.getExtAIAInfo(this.hex);void 0!==g.ocsp&&(t+="    ocsp: "+g.ocsp.join(",")+"\n"),void 0!==g.caissuer&&(t+="    caissuer: "+g.caissuer.join(",")+"\n")}}return t+="signature algorithm: "+$n.getSignatureAlgorithmName(this.hex)+"\n",t+="signature: "+$n.getSignatureValueHex(this.hex).substr(0,16)+"...\n"}}/*! nodeutil-1.0.0 (c) 2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
function Zn(t){return n(17).readFileSync(t,"utf8")}function Qn(t){var e=n(12),r=n(17);return e.rstrtohex(r.readFileSync(t,"binary"))}function tr(t){var e=n(17);return e.readFileSync(t,"binary")}function er(t,e){var r=n(17);r.writeFileSync(t,e,"binary")}function nr(t,e){var r=n(17),i=n(12),s=i.hextorstr(e);r.writeFileSync(t,s,"binary")}var rr={};rr.userAgent=!1;var ir={};if("undefined"==typeof sr||!sr)var sr={};sr.namespace=function(){var t,e,n,r=arguments,i=null;for(t=0;t<r.length;t+=1)for(n=(""+r[t]).split("."),i=sr,e="YAHOO"==n[0]?1:0;e<n.length;e+=1)i[n[e]]=i[n[e]]||{},i=i[n[e]];return i},sr.log=function(t,e,n){var r=sr.widget.Logger;return!(!r||!r.log)&&r.log(t,e,n)},sr.register=function(t,e,n){var r,i,s,o,a,u=sr.env.modules;for(u[t]||(u[t]={versions:[],builds:[]}),r=u[t],i=n.version,s=n.build,o=sr.env.listeners,r.name=t,r.version=i,r.build=s,r.versions.push(i),r.builds.push(s),r.mainClass=e,a=0;a<o.length;a+=1)o[a](r);e?(e.VERSION=i,e.BUILD=s):sr.log("mainClass is undefined for module "+t,"warn")},sr.env=sr.env||{modules:[],listeners:[]},sr.env.getVersion=function(t){return sr.env.modules[t]||null},sr.env.parseUA=function(t){var e,n=function(t){var e=0;return parseFloat(t.replace(/\./g,function(){return 1==e++?"":"."}))},r=rr,i={ie:0,opera:0,gecko:0,webkit:0,chrome:0,mobile:null,air:0,ipad:0,iphone:0,ipod:0,ios:null,android:0,webos:0,caja:r&&r.cajaVersion,secure:!1,os:null},s=t||rr&&rr.userAgent,o=ir&&ir.location,a=o&&o.href;return i.secure=a&&0===a.toLowerCase().indexOf("https"),s&&(/windows|win32/i.test(s)?i.os="windows":/macintosh/i.test(s)?i.os="macintosh":/rhino/i.test(s)&&(i.os="rhino"),/KHTML/.test(s)&&(i.webkit=1),e=s.match(/AppleWebKit\/([^\s]*)/),e&&e[1]&&(i.webkit=n(e[1]),/ Mobile\//.test(s)?(i.mobile="Apple",e=s.match(/OS ([^\s]*)/),e&&e[1]&&(e=n(e[1].replace("_","."))),i.ios=e,i.ipad=i.ipod=i.iphone=0,e=s.match(/iPad|iPod|iPhone/),e&&e[0]&&(i[e[0].toLowerCase()]=i.ios)):(e=s.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/),e&&(i.mobile=e[0]),/webOS/.test(s)&&(i.mobile="WebOS",e=s.match(/webOS\/([^\s]*);/),e&&e[1]&&(i.webos=n(e[1]))),/ Android/.test(s)&&(i.mobile="Android",e=s.match(/Android ([^\s]*);/),e&&e[1]&&(i.android=n(e[1])))),e=s.match(/Chrome\/([^\s]*)/),e&&e[1]?i.chrome=n(e[1]):(e=s.match(/AdobeAIR\/([^\s]*)/),e&&(i.air=e[0]))),i.webkit||(e=s.match(/Opera[\s\/]([^\s]*)/),e&&e[1]?(i.opera=n(e[1]),e=s.match(/Version\/([^\s]*)/),e&&e[1]&&(i.opera=n(e[1])),e=s.match(/Opera Mini[^;]*/),e&&(i.mobile=e[0])):(e=s.match(/MSIE\s([^;]*)/),e&&e[1]?i.ie=n(e[1]):(e=s.match(/Gecko\/([^\s]*)/),e&&(i.gecko=1,e=s.match(/rv:([^\s\)]*)/),e&&e[1]&&(i.gecko=n(e[1]))))))),i},sr.env.ua=sr.env.parseUA(),function(){if(sr.namespace("util","widget","example"),"undefined"!=typeof YAHOO_config){var t,e=YAHOO_config.listener,n=sr.env.listeners,r=!0;if(e){for(t=0;t<n.length;t++)if(n[t]==e){r=!1;break}r&&n.push(e)}}}(),sr.lang=sr.lang||{},function(){var t=sr.lang,e=Object.prototype,n="[object Array]",r="[object Function]",i="[object Object]",s=[],o={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","/":"&#x2F;","`":"&#x60;"},a=["toString","valueOf"],u={isArray:function(t){return e.toString.apply(t)===n},isBoolean:function(t){return"boolean"==typeof t},isFunction:function(t){return"function"==typeof t||e.toString.apply(t)===r},isNull:function(t){return null===t},isNumber:function(t){return"number"==typeof t&&isFinite(t)},isObject:function(e){return e&&("object"==typeof e||t.isFunction(e))||!1},isString:function(t){return"string"==typeof t},isUndefined:function(t){return"undefined"==typeof t},_IEEnumFix:sr.env.ua.ie?function(n,r){var i,s,o;for(i=0;i<a.length;i+=1)s=a[i],o=r[s],t.isFunction(o)&&o!=e[s]&&(n[s]=o)}:function(){},escapeHTML:function(t){return t.replace(/[&<>"'\/`]/g,function(t){return o[t]})},extend:function(n,r,i){if(!r||!n)throw new Error("extend failed, please check that all dependencies are included.");var s,o=function(){};if(o.prototype=r.prototype,n.prototype=new o,n.prototype.constructor=n,n.superclass=r.prototype,r.prototype.constructor==e.constructor&&(r.prototype.constructor=r),i){for(s in i)t.hasOwnProperty(i,s)&&(n.prototype[s]=i[s]);t._IEEnumFix(n.prototype,i)}},augmentObject:function(e,n){if(!n||!e)throw new Error("Absorb failed, verify dependencies.");var r,i,s=arguments,o=s[2];if(o&&o!==!0)for(r=2;r<s.length;r+=1)e[s[r]]=n[s[r]];else{for(i in n)!o&&i in e||(e[i]=n[i]);t._IEEnumFix(e,n)}return e},augmentProto:function(e,n){if(!n||!e)throw new Error("Augment failed, verify dependencies.");var r,i=[e.prototype,n.prototype];for(r=2;r<arguments.length;r+=1)i.push(arguments[r]);return t.augmentObject.apply(this,i),e},dump:function(e,n){var r,i,s=[],o="{...}",a="f(){...}",u=", ",h=" => ";if(!t.isObject(e))return e+"";if(e instanceof Date||"nodeType"in e&&"tagName"in e)return e;if(t.isFunction(e))return a;if(n=t.isNumber(n)?n:3,t.isArray(e)){for(s.push("["),r=0,i=e.length;r<i;r+=1)t.isObject(e[r])?s.push(n>0?t.dump(e[r],n-1):o):s.push(e[r]),s.push(u);s.length>1&&s.pop(),s.push("]")}else{s.push("{");for(r in e)t.hasOwnProperty(e,r)&&(s.push(r+h),t.isObject(e[r])?s.push(n>0?t.dump(e[r],n-1):o):s.push(e[r]),s.push(u));s.length>1&&s.pop(),s.push("}")}return s.join("")},substitute:function(e,n,r,s){for(var o,a,u,h,c,f,l,d,g,p=[],y=e.length,v="dump",m=" ",S="{",b="}";(o=e.lastIndexOf(S,y),!(o<0))&&(a=e.indexOf(b,o),!(o+1>a));)l=e.substring(o+1,a),h=l,f=null,u=h.indexOf(m),u>-1&&(f=h.substring(u+1),h=h.substring(0,u)),c=n[h],r&&(c=r(h,c,f)),t.isObject(c)?t.isArray(c)?c=t.dump(c,parseInt(f,10)):(f=f||"",d=f.indexOf(v),d>-1&&(f=f.substring(4)),g=c.toString(),c=g===i||d>-1?t.dump(c,parseInt(f,10)):g):t.isString(c)||t.isNumber(c)||(c="~-"+p.length+"-~",p[p.length]=l),e=e.substring(0,o)+c+e.substring(a+1),s===!1&&(y=o-1);for(o=p.length-1;o>=0;o-=1)e=e.replace(new RegExp("~-"+o+"-~"),"{"+p[o]+"}","g");return e},trim:function(t){try{return t.replace(/^\s+|\s+$/g,"")}catch(e){return t}},merge:function(){var e,n={},r=arguments,i=r.length;for(e=0;e<i;e+=1)t.augmentObject(n,r[e],!0);return n},later:function(e,n,r,i,o){e=e||0,n=n||{};var a,u,h=r,c=i;if(t.isString(r)&&(h=n[r]),!h)throw new TypeError("method undefined");return t.isUndefined(i)||t.isArray(c)||(c=[i]),a=function(){h.apply(n,c||s)},u=o?setInterval(a,e):setTimeout(a,e),{interval:o,cancel:function(){this.interval?clearInterval(u):clearTimeout(u)}}},isValue:function(e){return t.isObject(e)||t.isString(e)||t.isNumber(e)||t.isBoolean(e)}};t.hasOwnProperty=e.hasOwnProperty?function(t,e){return t&&t.hasOwnProperty&&t.hasOwnProperty(e)}:function(e,n){return!t.isUndefined(e[n])&&e.constructor.prototype[n]!==e[n]},u.augmentObject(t,u,!0),sr.util.Lang=t,t.augment=t.augmentProto,sr.augment=t.augmentProto,sr.extend=t.extend}(),sr.register("yahoo",sr,{version:"2.9.0",build:"2800"});/*! CryptoJS v3.1.2 core-fix.js
	 * code.google.com/p/crypto-js
	 * (c) 2009-2013 by Jeff Mott. All rights reserved.
	 * code.google.com/p/crypto-js/wiki/License
	 * THIS IS FIX of 'core.js' to fix Hmac issue.
	 * https://code.google.com/p/crypto-js/issues/detail?id=84
	 * https://crypto-js.googlecode.com/svn-history/r667/branches/3.x/src/core.js
	 */
var or=or||function(t,e){var n={},r=n.lib={},i=r.Base=function(){function t(){}return{extend:function(e){t.prototype=this;var n=new t;return e&&n.mixIn(e),n.hasOwnProperty("init")||(n.init=function(){n.$super.init.apply(this,arguments)}),n.init.prototype=n,n.$super=this,n},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var e in t)t.hasOwnProperty(e)&&(this[e]=t[e]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}}}(),s=r.WordArray=i.extend({init:function(t,n){t=this.words=t||[],n!=e?this.sigBytes=n:this.sigBytes=4*t.length},toString:function(t){return(t||a).stringify(this)},concat:function(t){var e=this.words,n=t.words,r=this.sigBytes,i=t.sigBytes;if(this.clamp(),r%4)for(var s=0;s<i;s++){var o=n[s>>>2]>>>24-s%4*8&255;e[r+s>>>2]|=o<<24-(r+s)%4*8}else for(var s=0;s<i;s+=4)e[r+s>>>2]=n[s>>>2];return this.sigBytes+=i,this},clamp:function(){var e=this.words,n=this.sigBytes;e[n>>>2]&=4294967295<<32-n%4*8,e.length=t.ceil(n/4)},clone:function(){var t=i.clone.call(this);return t.words=this.words.slice(0),t},random:function(e){for(var n=[],r=0;r<e;r+=4)n.push(4294967296*t.random()|0);return new s.init(n,e)}}),o=n.enc={},a=o.Hex={stringify:function(t){for(var e=t.words,n=t.sigBytes,r=[],i=0;i<n;i++){var s=e[i>>>2]>>>24-i%4*8&255;r.push((s>>>4).toString(16)),r.push((15&s).toString(16))}return r.join("")},parse:function(t){for(var e=t.length,n=[],r=0;r<e;r+=2)n[r>>>3]|=parseInt(t.substr(r,2),16)<<24-r%8*4;return new s.init(n,e/2)}},u=o.Latin1={stringify:function(t){for(var e=t.words,n=t.sigBytes,r=[],i=0;i<n;i++){var s=e[i>>>2]>>>24-i%4*8&255;r.push(String.fromCharCode(s))}return r.join("")},parse:function(t){for(var e=t.length,n=[],r=0;r<e;r++)n[r>>>2]|=(255&t.charCodeAt(r))<<24-r%4*8;return new s.init(n,e)}},h=o.Utf8={stringify:function(t){try{return decodeURIComponent(escape(u.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return u.parse(unescape(encodeURIComponent(t)))}},c=r.BufferedBlockAlgorithm=i.extend({reset:function(){this._data=new s.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=h.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(e){var n=this._data,r=n.words,i=n.sigBytes,o=this.blockSize,a=4*o,u=i/a;u=e?t.ceil(u):t.max((0|u)-this._minBufferSize,0);var h=u*o,c=t.min(4*h,i);if(h){for(var f=0;f<h;f+=o)this._doProcessBlock(r,f);var l=r.splice(0,h);n.sigBytes-=c}return new s.init(l,c)},clone:function(){var t=i.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),f=(r.Hasher=c.extend({cfg:i.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){c.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){t&&this._append(t);var e=this._doFinalize();return e},blockSize:16,_createHelper:function(t){return function(e,n){return new t.init(n).finalize(e)}},_createHmacHelper:function(t){return function(e,n){return new f.HMAC.init(t,n).finalize(e)}}}),n.algo={});return n}(Math);!function(t){var e=or,n=e.lib,r=n.Base,i=n.WordArray,e=e.x64={};e.Word=r.extend({init:function(t,e){this.high=t,this.low=e}}),e.WordArray=r.extend({init:function(e,n){e=this.words=e||[],this.sigBytes=n!=t?n:8*e.length},toX32:function(){for(var t=this.words,e=t.length,n=[],r=0;r<e;r++){var s=t[r];n.push(s.high),n.push(s.low)}return i.create(n,this.sigBytes)},clone:function(){for(var t=r.clone.call(this),e=t.words=this.words.slice(0),n=e.length,i=0;i<n;i++)e[i]=e[i].clone();return t}})}(),or.lib.Cipher||function(t){var e=or,n=e.lib,r=n.Base,i=n.WordArray,s=n.BufferedBlockAlgorithm,o=e.enc.Base64,a=e.algo.EvpKDF,u=n.Cipher=s.extend({cfg:r.extend(),createEncryptor:function(t,e){return this.create(this._ENC_XFORM_MODE,t,e)},createDecryptor:function(t,e){return this.create(this._DEC_XFORM_MODE,t,e)},init:function(t,e,n){this.cfg=this.cfg.extend(n),this._xformMode=t,this._key=e,this.reset()},reset:function(){s.reset.call(this),this._doReset()},process:function(t){return this._append(t),this._process()},finalize:function(t){return t&&this._append(t),this._doFinalize()},keySize:4,ivSize:4,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:function(t){return{encrypt:function(e,n,r){return("string"==typeof n?g:d).encrypt(t,e,n,r)},decrypt:function(e,n,r){return("string"==typeof n?g:d).decrypt(t,e,n,r)}}}});n.StreamCipher=u.extend({_doFinalize:function(){return this._process(!0)},blockSize:1});var h=e.mode={},c=function(e,n,r){var i=this._iv;i?this._iv=t:i=this._prevBlock;for(var s=0;s<r;s++)e[n+s]^=i[s]},f=(n.BlockCipherMode=r.extend({createEncryptor:function(t,e){return this.Encryptor.create(t,e)},createDecryptor:function(t,e){return this.Decryptor.create(t,e)},init:function(t,e){this._cipher=t,this._iv=e}})).extend();f.Encryptor=f.extend({processBlock:function(t,e){var n=this._cipher,r=n.blockSize;c.call(this,t,e,r),n.encryptBlock(t,e),this._prevBlock=t.slice(e,e+r)}}),f.Decryptor=f.extend({processBlock:function(t,e){var n=this._cipher,r=n.blockSize,i=t.slice(e,e+r);n.decryptBlock(t,e),c.call(this,t,e,r),this._prevBlock=i}}),h=h.CBC=f,f=(e.pad={}).Pkcs7={pad:function(t,e){for(var n=4*e,n=n-t.sigBytes%n,r=n<<24|n<<16|n<<8|n,s=[],o=0;o<n;o+=4)s.push(r);n=i.create(s,n),t.concat(n)},unpad:function(t){t.sigBytes-=255&t.words[t.sigBytes-1>>>2]}},n.BlockCipher=u.extend({cfg:u.cfg.extend({mode:h,padding:f}),reset:function(){u.reset.call(this);var t=this.cfg,e=t.iv,t=t.mode;if(this._xformMode==this._ENC_XFORM_MODE)var n=t.createEncryptor;else n=t.createDecryptor,this._minBufferSize=1;this._mode=n.call(t,this,e&&e.words)},_doProcessBlock:function(t,e){this._mode.processBlock(t,e)},_doFinalize:function(){var t=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){t.pad(this._data,this.blockSize);var e=this._process(!0)}else e=this._process(!0),t.unpad(e);return e},blockSize:4});var l=n.CipherParams=r.extend({init:function(t){this.mixIn(t)},toString:function(t){return(t||this.formatter).stringify(this)}}),h=(e.format={}).OpenSSL={stringify:function(t){var e=t.ciphertext;return t=t.salt,(t?i.create([1398893684,1701076831]).concat(t).concat(e):e).toString(o)},parse:function(t){t=o.parse(t);var e=t.words;if(1398893684==e[0]&&1701076831==e[1]){var n=i.create(e.slice(2,4));e.splice(0,4),t.sigBytes-=16}return l.create({ciphertext:t,salt:n})}},d=n.SerializableCipher=r.extend({cfg:r.extend({format:h}),encrypt:function(t,e,n,r){r=this.cfg.extend(r);var i=t.createEncryptor(n,r);return e=i.finalize(e),i=i.cfg,l.create({ciphertext:e,key:n,iv:i.iv,algorithm:t,mode:i.mode,padding:i.padding,blockSize:t.blockSize,formatter:r.format})},decrypt:function(t,e,n,r){return r=this.cfg.extend(r),e=this._parse(e,r.format),t.createDecryptor(n,r).finalize(e.ciphertext)},_parse:function(t,e){return"string"==typeof t?e.parse(t,this):t}}),e=(e.kdf={}).OpenSSL={execute:function(t,e,n,r){return r||(r=i.random(8)),t=a.create({keySize:e+n}).compute(t,r),n=i.create(t.words.slice(e),4*n),t.sigBytes=4*e,l.create({key:t,iv:n,salt:r})}},g=n.PasswordBasedCipher=d.extend({cfg:d.cfg.extend({kdf:e}),encrypt:function(t,e,n,r){return r=this.cfg.extend(r),n=r.kdf.execute(n,t.keySize,t.ivSize),r.iv=n.iv,t=d.encrypt.call(this,t,e,n.key,r),t.mixIn(n),t},decrypt:function(t,e,n,r){return r=this.cfg.extend(r),e=this._parse(e,r.format),n=r.kdf.execute(n,t.keySize,t.ivSize,e.salt),r.iv=n.iv,d.decrypt.call(this,t,e,n.key,r)}})}(),function(){for(var t=or,e=t.lib.BlockCipher,n=t.algo,r=[],i=[],s=[],o=[],a=[],u=[],h=[],c=[],f=[],l=[],d=[],g=0;256>g;g++)d[g]=128>g?g<<1:g<<1^283;for(var p=0,y=0,g=0;256>g;g++){var v=y^y<<1^y<<2^y<<3^y<<4,v=v>>>8^255&v^99;r[p]=v,i[v]=p;var m=d[p],S=d[m],b=d[S],w=257*d[v]^16843008*v;s[p]=w<<24|w>>>8,o[p]=w<<16|w>>>16,a[p]=w<<8|w>>>24,u[p]=w,w=16843009*b^65537*S^257*m^16843008*p,h[v]=w<<24|w>>>8,c[v]=w<<16|w>>>16,f[v]=w<<8|w>>>24,l[v]=w,p?(p=m^d[d[d[b^m]]],y^=d[d[y]]):p=y=1}var E=[0,1,2,4,8,16,32,64,128,27,54],n=n.AES=e.extend({_doReset:function(){for(var t=this._key,e=t.words,n=t.sigBytes/4,t=4*((this._nRounds=n+6)+1),i=this._keySchedule=[],s=0;s<t;s++)if(s<n)i[s]=e[s];else{var o=i[s-1];s%n?6<n&&4==s%n&&(o=r[o>>>24]<<24|r[o>>>16&255]<<16|r[o>>>8&255]<<8|r[255&o]):(o=o<<8|o>>>24,o=r[o>>>24]<<24|r[o>>>16&255]<<16|r[o>>>8&255]<<8|r[255&o],o^=E[s/n|0]<<24),i[s]=i[s-n]^o}for(e=this._invKeySchedule=[],n=0;n<t;n++)s=t-n,o=n%4?i[s]:i[s-4],e[n]=4>n||4>=s?o:h[r[o>>>24]]^c[r[o>>>16&255]]^f[r[o>>>8&255]]^l[r[255&o]]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._keySchedule,s,o,a,u,r)},decryptBlock:function(t,e){var n=t[e+1];t[e+1]=t[e+3],t[e+3]=n,this._doCryptBlock(t,e,this._invKeySchedule,h,c,f,l,i),n=t[e+1],t[e+1]=t[e+3],t[e+3]=n},_doCryptBlock:function(t,e,n,r,i,s,o,a){for(var u=this._nRounds,h=t[e]^n[0],c=t[e+1]^n[1],f=t[e+2]^n[2],l=t[e+3]^n[3],d=4,g=1;g<u;g++)var p=r[h>>>24]^i[c>>>16&255]^s[f>>>8&255]^o[255&l]^n[d++],y=r[c>>>24]^i[f>>>16&255]^s[l>>>8&255]^o[255&h]^n[d++],v=r[f>>>24]^i[l>>>16&255]^s[h>>>8&255]^o[255&c]^n[d++],l=r[l>>>24]^i[h>>>16&255]^s[c>>>8&255]^o[255&f]^n[d++],h=p,c=y,f=v;p=(a[h>>>24]<<24|a[c>>>16&255]<<16|a[f>>>8&255]<<8|a[255&l])^n[d++],y=(a[c>>>24]<<24|a[f>>>16&255]<<16|a[l>>>8&255]<<8|a[255&h])^n[d++],v=(a[f>>>24]<<24|a[l>>>16&255]<<16|a[h>>>8&255]<<8|a[255&c])^n[d++],l=(a[l>>>24]<<24|a[h>>>16&255]<<16|a[c>>>8&255]<<8|a[255&f])^n[d++],t[e]=p,t[e+1]=y,t[e+2]=v,t[e+3]=l},keySize:8});t.AES=e._createHelper(n)}(),function(){function t(t,e){var n=(this._lBlock>>>t^this._rBlock)&e;this._rBlock^=n,this._lBlock^=n<<t}function e(t,e){var n=(this._rBlock>>>t^this._lBlock)&e;this._lBlock^=n,this._rBlock^=n<<t}var n=or,r=n.lib,i=r.WordArray,r=r.BlockCipher,s=n.algo,o=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4],a=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32],u=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28],h=[{0:8421888,268435456:32768,536870912:8421378,805306368:2,1073741824:512,1342177280:8421890,1610612736:8389122,1879048192:8388608,2147483648:514,2415919104:8389120,2684354560:33280,2952790016:8421376,3221225472:32770,3489660928:8388610,3758096384:0,4026531840:33282,134217728:0,402653184:8421890,671088640:33282,939524096:32768,1207959552:8421888,1476395008:512,1744830464:8421378,2013265920:2,2281701376:8389120,2550136832:33280,2818572288:8421376,3087007744:8389122,3355443200:8388610,3623878656:32770,3892314112:514,4160749568:8388608,1:32768,268435457:2,536870913:8421888,805306369:8388608,1073741825:8421378,1342177281:33280,1610612737:512,1879048193:8389122,2147483649:8421890,2415919105:8421376,2684354561:8388610,2952790017:33282,3221225473:514,3489660929:8389120,3758096385:32770,4026531841:0,134217729:8421890,402653185:8421376,671088641:8388608,939524097:512,1207959553:32768,1476395009:8388610,1744830465:2,2013265921:33282,2281701377:32770,2550136833:8389122,2818572289:514,3087007745:8421888,3355443201:8389120,3623878657:0,3892314113:33280,4160749569:8421378},{0:1074282512,16777216:16384,33554432:524288,50331648:1074266128,67108864:1073741840,83886080:1074282496,100663296:1073758208,117440512:16,134217728:540672,150994944:1073758224,167772160:1073741824,184549376:540688,201326592:524304,218103808:0,234881024:16400,251658240:1074266112,8388608:1073758208,25165824:540688,41943040:16,58720256:1073758224,75497472:1074282512,92274688:1073741824,109051904:524288,125829120:1074266128,142606336:524304,159383552:0,176160768:16384,192937984:1074266112,209715200:1073741840,226492416:540672,243269632:1074282496,260046848:16400,268435456:0,285212672:1074266128,301989888:1073758224,318767104:1074282496,335544320:1074266112,352321536:16,369098752:540688,385875968:16384,402653184:16400,419430400:524288,436207616:524304,452984832:1073741840,469762048:540672,486539264:1073758208,503316480:1073741824,520093696:1074282512,276824064:540688,293601280:524288,310378496:1074266112,327155712:16384,343932928:1073758208,360710144:1074282512,377487360:16,394264576:1073741824,411041792:1074282496,427819008:1073741840,444596224:1073758224,461373440:524304,478150656:0,494927872:16400,511705088:1074266128,528482304:540672},{0:260,1048576:0,2097152:67109120,3145728:65796,4194304:65540,5242880:67108868,6291456:67174660,7340032:67174400,8388608:67108864,9437184:67174656,10485760:65792,11534336:67174404,12582912:67109124,13631488:65536,14680064:4,15728640:256,524288:67174656,1572864:67174404,2621440:0,3670016:67109120,4718592:67108868,5767168:65536,6815744:65540,7864320:260,8912896:4,9961472:256,11010048:67174400,12058624:65796,13107200:65792,14155776:67109124,15204352:67174660,16252928:67108864,16777216:67174656,17825792:65540,18874368:65536,19922944:67109120,20971520:256,22020096:67174660,23068672:67108868,24117248:0,25165824:67109124,26214400:67108864,27262976:4,28311552:65792,29360128:67174400,30408704:260,31457280:65796,32505856:67174404,17301504:67108864,18350080:260,19398656:67174656,20447232:0,21495808:65540,22544384:67109120,23592960:256,24641536:67174404,25690112:65536,26738688:67174660,27787264:65796,28835840:67108868,29884416:67109124,30932992:67174400,31981568:4,33030144:65792},{0:2151682048,65536:2147487808,131072:4198464,196608:2151677952,262144:0,327680:4198400,393216:2147483712,458752:4194368,524288:2147483648,589824:4194304,655360:64,720896:2147487744,786432:2151678016,851968:4160,917504:4096,983040:2151682112,32768:2147487808,98304:64,163840:2151678016,229376:2147487744,294912:4198400,360448:2151682112,425984:0,491520:2151677952,557056:4096,622592:2151682048,688128:4194304,753664:4160,819200:2147483648,884736:4194368,950272:4198464,1015808:2147483712,1048576:4194368,1114112:4198400,1179648:2147483712,1245184:0,1310720:4160,1376256:2151678016,1441792:2151682048,1507328:2147487808,1572864:2151682112,1638400:2147483648,1703936:2151677952,1769472:4198464,1835008:2147487744,1900544:4194304,1966080:64,2031616:4096,1081344:2151677952,1146880:2151682112,1212416:0,1277952:4198400,1343488:4194368,1409024:2147483648,1474560:2147487808,1540096:64,1605632:2147483712,1671168:4096,1736704:2147487744,1802240:2151678016,1867776:4160,1933312:2151682048,1998848:4194304,2064384:4198464},{0:128,4096:17039360,8192:262144,12288:536870912,16384:537133184,20480:16777344,24576:553648256,28672:262272,32768:16777216,36864:537133056,40960:536871040,45056:553910400,49152:553910272,53248:0,57344:17039488,61440:553648128,2048:17039488,6144:553648256,10240:128,14336:17039360,18432:262144,22528:537133184,26624:553910272,30720:536870912,34816:537133056,38912:0,43008:553910400,47104:16777344,51200:536871040,55296:553648128,59392:16777216,63488:262272,65536:262144,69632:128,73728:536870912,77824:553648256,81920:16777344,86016:553910272,90112:537133184,94208:16777216,98304:553910400,102400:553648128,106496:17039360,110592:537133056,114688:262272,118784:536871040,122880:0,126976:17039488,67584:553648256,71680:16777216,75776:17039360,79872:537133184,83968:536870912,88064:17039488,92160:128,96256:553910272,100352:262272,104448:553910400,108544:0,112640:553648128,116736:16777344,120832:262144,124928:537133056,129024:536871040},{0:268435464,256:8192,512:270532608,768:270540808,1024:268443648,1280:2097152,1536:2097160,1792:268435456,2048:0,2304:268443656,2560:2105344,2816:8,3072:270532616,3328:2105352,3584:8200,3840:270540800,128:270532608,384:270540808,640:8,896:2097152,1152:2105352,1408:268435464,1664:268443648,1920:8200,2176:2097160,2432:8192,2688:268443656,2944:270532616,3200:0,3456:270540800,3712:2105344,3968:268435456,4096:268443648,4352:270532616,4608:270540808,4864:8200,5120:2097152,5376:268435456,5632:268435464,5888:2105344,6144:2105352,6400:0,6656:8,6912:270532608,7168:8192,7424:268443656,7680:270540800,7936:2097160,4224:8,4480:2105344,4736:2097152,4992:268435464,5248:268443648,5504:8200,5760:270540808,6016:270532608,6272:270540800,6528:270532616,6784:8192,7040:2105352,7296:2097160,7552:0,7808:268435456,8064:268443656},{0:1048576,16:33555457,32:1024,48:1049601,64:34604033,80:0,96:1,112:34603009,128:33555456,144:1048577,160:33554433,176:34604032,192:34603008,208:1025,224:1049600,240:33554432,8:34603009,24:0,40:33555457,56:34604032,72:1048576,88:33554433,104:33554432,120:1025,136:1049601,152:33555456,168:34603008,184:1048577,200:1024,216:34604033,232:1,248:1049600,256:33554432,272:1048576,288:33555457,304:34603009,320:1048577,336:33555456,352:34604032,368:1049601,384:1025,400:34604033,416:1049600,432:1,448:0,464:34603008,480:33554433,496:1024,264:1049600,280:33555457,296:34603009,312:1,328:33554432,344:1048576,360:1025,376:34604032,392:33554433,408:34603008,424:0,440:34604033,456:1049601,472:1024,488:33555456,504:1048577},{0:134219808,1:131072,2:134217728,3:32,4:131104,5:134350880,6:134350848,7:2048,8:134348800,9:134219776,10:133120,11:134348832,12:2080,13:0,14:134217760,15:133152,2147483648:2048,2147483649:134350880,2147483650:134219808,2147483651:134217728,2147483652:134348800,2147483653:133120,2147483654:133152,2147483655:32,2147483656:134217760,2147483657:2080,2147483658:131104,2147483659:134350848,2147483660:0,2147483661:134348832,2147483662:134219776,2147483663:131072,16:133152,17:134350848,18:32,19:2048,20:134219776,21:134217760,22:134348832,23:131072,24:0,25:131104,26:134348800,27:134219808,28:134350880,29:133120,30:2080,31:134217728,2147483664:131072,2147483665:2048,2147483666:134348832,2147483667:133152,2147483668:32,2147483669:134348800,2147483670:134217728,2147483671:134219808,2147483672:134350880,2147483673:134217760,2147483674:134219776,2147483675:0,2147483676:133120,2147483677:2080,2147483678:131104,2147483679:134350848}],c=[4160749569,528482304,33030144,2064384,129024,8064,504,2147483679],f=s.DES=r.extend({_doReset:function(){for(var t=this._key.words,e=[],n=0;56>n;n++){var r=o[n]-1;e[n]=t[r>>>5]>>>31-r%32&1}for(t=this._subKeys=[],r=0;16>r;r++){for(var i=t[r]=[],s=u[r],n=0;24>n;n++)i[n/6|0]|=e[(a[n]-1+s)%28]<<31-n%6,i[4+(n/6|0)]|=e[28+(a[n+24]-1+s)%28]<<31-n%6;for(i[0]=i[0]<<1|i[0]>>>31,n=1;7>n;n++)i[n]>>>=4*(n-1)+3;i[7]=i[7]<<5|i[7]>>>27}for(e=this._invSubKeys=[],n=0;16>n;n++)e[n]=t[15-n]},encryptBlock:function(t,e){this._doCryptBlock(t,e,this._subKeys)},decryptBlock:function(t,e){this._doCryptBlock(t,e,this._invSubKeys)},_doCryptBlock:function(n,r,i){this._lBlock=n[r],this._rBlock=n[r+1],t.call(this,4,252645135),t.call(this,16,65535),e.call(this,2,858993459),e.call(this,8,16711935),t.call(this,1,1431655765);for(var s=0;16>s;s++){for(var o=i[s],a=this._lBlock,u=this._rBlock,f=0,l=0;8>l;l++)f|=h[l][((u^o[l])&c[l])>>>0];this._lBlock=u,this._rBlock=a^f}i=this._lBlock,this._lBlock=this._rBlock,this._rBlock=i,t.call(this,1,1431655765),e.call(this,8,16711935),e.call(this,2,858993459),t.call(this,16,65535),t.call(this,4,252645135),n[r]=this._lBlock,n[r+1]=this._rBlock},keySize:2,ivSize:2,blockSize:2});n.DES=r._createHelper(f),s=s.TripleDES=r.extend({_doReset:function(){var t=this._key.words;this._des1=f.createEncryptor(i.create(t.slice(0,2))),this._des2=f.createEncryptor(i.create(t.slice(2,4))),this._des3=f.createEncryptor(i.create(t.slice(4,6)))},encryptBlock:function(t,e){this._des1.encryptBlock(t,e),this._des2.decryptBlock(t,e),this._des3.encryptBlock(t,e)},decryptBlock:function(t,e){this._des3.decryptBlock(t,e),this._des2.encryptBlock(t,e),this._des1.decryptBlock(t,e)},keySize:6,ivSize:2,blockSize:2}),n.TripleDES=r._createHelper(s)}(),function(){var t=or,e=t.lib.WordArray;t.enc.Base64={stringify:function(t){var e=t.words,n=t.sigBytes,r=this._map;t.clamp(),t=[];for(var i=0;i<n;i+=3)for(var s=(e[i>>>2]>>>24-8*(i%4)&255)<<16|(e[i+1>>>2]>>>24-8*((i+1)%4)&255)<<8|e[i+2>>>2]>>>24-8*((i+2)%4)&255,o=0;4>o&&i+.75*o<n;o++)t.push(r.charAt(s>>>6*(3-o)&63));if(e=r.charAt(64))for(;t.length%4;)t.push(e);return t.join("")},parse:function(t){var n=t.length,r=this._map,i=r.charAt(64);i&&(i=t.indexOf(i),-1!=i&&(n=i));for(var i=[],s=0,o=0;o<n;o++)if(o%4){var a=r.indexOf(t.charAt(o-1))<<2*(o%4),u=r.indexOf(t.charAt(o))>>>6-2*(o%4);i[s>>>2]|=(a|u)<<24-8*(s%4),s++}return e.create(i,s)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}}(),function(t){function e(t,e,n,r,i,s,o){return t=t+(e&n|~e&r)+i+o,(t<<s|t>>>32-s)+e}function n(t,e,n,r,i,s,o){return t=t+(e&r|n&~r)+i+o,(t<<s|t>>>32-s)+e}function r(t,e,n,r,i,s,o){return t=t+(e^n^r)+i+o,(t<<s|t>>>32-s)+e}function i(t,e,n,r,i,s,o){return t=t+(n^(e|~r))+i+o,(t<<s|t>>>32-s)+e}for(var s=or,o=s.lib,a=o.WordArray,u=o.Hasher,o=s.algo,h=[],c=0;64>c;c++)h[c]=4294967296*t.abs(t.sin(c+1))|0;o=o.MD5=u.extend({_doReset:function(){this._hash=new a.init([1732584193,4023233417,2562383102,271733878])},_doProcessBlock:function(t,s){for(var o=0;16>o;o++){var a=s+o,u=t[a];t[a]=16711935&(u<<8|u>>>24)|4278255360&(u<<24|u>>>8)}var o=this._hash.words,a=t[s+0],u=t[s+1],c=t[s+2],f=t[s+3],l=t[s+4],d=t[s+5],g=t[s+6],p=t[s+7],y=t[s+8],v=t[s+9],m=t[s+10],S=t[s+11],b=t[s+12],w=t[s+13],E=t[s+14],x=t[s+15],_=o[0],A=o[1],F=o[2],P=o[3],_=e(_,A,F,P,a,7,h[0]),P=e(P,_,A,F,u,12,h[1]),F=e(F,P,_,A,c,17,h[2]),A=e(A,F,P,_,f,22,h[3]),_=e(_,A,F,P,l,7,h[4]),P=e(P,_,A,F,d,12,h[5]),F=e(F,P,_,A,g,17,h[6]),A=e(A,F,P,_,p,22,h[7]),_=e(_,A,F,P,y,7,h[8]),P=e(P,_,A,F,v,12,h[9]),F=e(F,P,_,A,m,17,h[10]),A=e(A,F,P,_,S,22,h[11]),_=e(_,A,F,P,b,7,h[12]),P=e(P,_,A,F,w,12,h[13]),F=e(F,P,_,A,E,17,h[14]),A=e(A,F,P,_,x,22,h[15]),_=n(_,A,F,P,u,5,h[16]),P=n(P,_,A,F,g,9,h[17]),F=n(F,P,_,A,S,14,h[18]),A=n(A,F,P,_,a,20,h[19]),_=n(_,A,F,P,d,5,h[20]),P=n(P,_,A,F,m,9,h[21]),F=n(F,P,_,A,x,14,h[22]),A=n(A,F,P,_,l,20,h[23]),_=n(_,A,F,P,v,5,h[24]),P=n(P,_,A,F,E,9,h[25]),F=n(F,P,_,A,f,14,h[26]),A=n(A,F,P,_,y,20,h[27]),_=n(_,A,F,P,w,5,h[28]),P=n(P,_,A,F,c,9,h[29]),F=n(F,P,_,A,p,14,h[30]),A=n(A,F,P,_,b,20,h[31]),_=r(_,A,F,P,d,4,h[32]),P=r(P,_,A,F,y,11,h[33]),F=r(F,P,_,A,S,16,h[34]),A=r(A,F,P,_,E,23,h[35]),_=r(_,A,F,P,u,4,h[36]),P=r(P,_,A,F,l,11,h[37]),F=r(F,P,_,A,p,16,h[38]),A=r(A,F,P,_,m,23,h[39]),_=r(_,A,F,P,w,4,h[40]),P=r(P,_,A,F,a,11,h[41]),F=r(F,P,_,A,f,16,h[42]),A=r(A,F,P,_,g,23,h[43]),_=r(_,A,F,P,v,4,h[44]),P=r(P,_,A,F,b,11,h[45]),F=r(F,P,_,A,x,16,h[46]),A=r(A,F,P,_,c,23,h[47]),_=i(_,A,F,P,a,6,h[48]),P=i(P,_,A,F,p,10,h[49]),F=i(F,P,_,A,E,15,h[50]),A=i(A,F,P,_,d,21,h[51]),_=i(_,A,F,P,b,6,h[52]),P=i(P,_,A,F,f,10,h[53]),F=i(F,P,_,A,m,15,h[54]),A=i(A,F,P,_,u,21,h[55]),_=i(_,A,F,P,y,6,h[56]),P=i(P,_,A,F,x,10,h[57]),F=i(F,P,_,A,g,15,h[58]),A=i(A,F,P,_,w,21,h[59]),_=i(_,A,F,P,l,6,h[60]),P=i(P,_,A,F,S,10,h[61]),F=i(F,P,_,A,c,15,h[62]),A=i(A,F,P,_,v,21,h[63]);o[0]=o[0]+_|0,o[1]=o[1]+A|0,o[2]=o[2]+F|0,o[3]=o[3]+P|0},_doFinalize:function(){var e=this._data,n=e.words,r=8*this._nDataBytes,i=8*e.sigBytes;n[i>>>5]|=128<<24-i%32;var s=t.floor(r/4294967296);for(n[(i+64>>>9<<4)+15]=16711935&(s<<8|s>>>24)|4278255360&(s<<24|s>>>8),n[(i+64>>>9<<4)+14]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8),e.sigBytes=4*(n.length+1),this._process(),e=this._hash,n=e.words,r=0;4>r;r++)i=n[r],n[r]=16711935&(i<<8|i>>>24)|4278255360&(i<<24|i>>>8);return e},clone:function(){var t=u.clone.call(this);return t._hash=this._hash.clone(),t}}),s.MD5=u._createHelper(o),s.HmacMD5=u._createHmacHelper(o)}(Math),function(){var t=or,e=t.lib,n=e.WordArray,r=e.Hasher,i=[],e=t.algo.SHA1=r.extend({_doReset:function(){this._hash=new n.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var n=this._hash.words,r=n[0],s=n[1],o=n[2],a=n[3],u=n[4],h=0;80>h;h++){if(16>h)i[h]=0|t[e+h];else{var c=i[h-3]^i[h-8]^i[h-14]^i[h-16];i[h]=c<<1|c>>>31}c=(r<<5|r>>>27)+u+i[h],c=20>h?c+((s&o|~s&a)+1518500249):40>h?c+((s^o^a)+1859775393):60>h?c+((s&o|s&a|o&a)-1894007588):c+((s^o^a)-899497514),u=a,a=o,o=s<<30|s>>>2,s=r,r=c}n[0]=n[0]+r|0,n[1]=n[1]+s|0,n[2]=n[2]+o|0,n[3]=n[3]+a|0,n[4]=n[4]+u|0},_doFinalize:function(){var t=this._data,e=t.words,n=8*this._nDataBytes,r=8*t.sigBytes;return e[r>>>5]|=128<<24-r%32,e[(r+64>>>9<<4)+14]=Math.floor(n/4294967296),e[(r+64>>>9<<4)+15]=n,t.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=r.clone.call(this);return t._hash=this._hash.clone(),t}});t.SHA1=r._createHelper(e),t.HmacSHA1=r._createHmacHelper(e)}(),function(t){for(var e=or,n=e.lib,r=n.WordArray,i=n.Hasher,n=e.algo,s=[],o=[],a=function(t){return 4294967296*(t-(0|t))|0},u=2,h=0;64>h;){var c;t:{c=u;for(var f=t.sqrt(c),l=2;l<=f;l++)if(!(c%l)){c=!1;break t}c=!0}c&&(8>h&&(s[h]=a(t.pow(u,.5))),o[h]=a(t.pow(u,1/3)),h++),u++}var d=[],n=n.SHA256=i.extend({_doReset:function(){this._hash=new r.init(s.slice(0))},_doProcessBlock:function(t,e){for(var n=this._hash.words,r=n[0],i=n[1],s=n[2],a=n[3],u=n[4],h=n[5],c=n[6],f=n[7],l=0;64>l;l++){if(16>l)d[l]=0|t[e+l];else{var g=d[l-15],p=d[l-2];d[l]=((g<<25|g>>>7)^(g<<14|g>>>18)^g>>>3)+d[l-7]+((p<<15|p>>>17)^(p<<13|p>>>19)^p>>>10)+d[l-16]}g=f+((u<<26|u>>>6)^(u<<21|u>>>11)^(u<<7|u>>>25))+(u&h^~u&c)+o[l]+d[l],p=((r<<30|r>>>2)^(r<<19|r>>>13)^(r<<10|r>>>22))+(r&i^r&s^i&s),f=c,c=h,h=u,u=a+g|0,a=s,s=i,i=r,r=g+p|0}n[0]=n[0]+r|0,n[1]=n[1]+i|0,n[2]=n[2]+s|0,n[3]=n[3]+a|0,n[4]=n[4]+u|0,n[5]=n[5]+h|0,n[6]=n[6]+c|0,n[7]=n[7]+f|0},_doFinalize:function(){var e=this._data,n=e.words,r=8*this._nDataBytes,i=8*e.sigBytes;return n[i>>>5]|=128<<24-i%32,n[(i+64>>>9<<4)+14]=t.floor(r/4294967296),n[(i+64>>>9<<4)+15]=r,e.sigBytes=4*n.length,this._process(),this._hash},clone:function(){var t=i.clone.call(this);return t._hash=this._hash.clone(),t}});e.SHA256=i._createHelper(n),e.HmacSHA256=i._createHmacHelper(n)}(Math),function(){var t=or,e=t.lib.WordArray,n=t.algo,r=n.SHA256,n=n.SHA224=r.extend({_doReset:function(){this._hash=new e.init([3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428])},_doFinalize:function(){var t=r._doFinalize.call(this);return t.sigBytes-=4,t}});t.SHA224=r._createHelper(n),t.HmacSHA224=r._createHmacHelper(n)}(),function(){function t(){return i.create.apply(i,arguments)}for(var e=or,n=e.lib.Hasher,r=e.x64,i=r.Word,s=r.WordArray,r=e.algo,o=[t(1116352408,3609767458),t(1899447441,602891725),t(3049323471,3964484399),t(3921009573,2173295548),t(961987163,4081628472),t(1508970993,3053834265),t(2453635748,2937671579),t(2870763221,3664609560),t(3624381080,2734883394),t(310598401,1164996542),t(607225278,1323610764),t(1426881987,3590304994),t(1925078388,4068182383),t(2162078206,991336113),t(2614888103,633803317),t(3248222580,3479774868),t(3835390401,2666613458),t(4022224774,944711139),t(264347078,2341262773),t(604807628,2007800933),t(770255983,1495990901),t(1249150122,1856431235),t(1555081692,3175218132),t(1996064986,2198950837),t(2554220882,3999719339),t(2821834349,766784016),t(2952996808,2566594879),t(3210313671,3203337956),t(3336571891,1034457026),t(3584528711,2466948901),t(113926993,3758326383),t(338241895,168717936),t(666307205,1188179964),t(773529912,1546045734),t(1294757372,1522805485),t(1396182291,2643833823),t(1695183700,2343527390),t(1986661051,1014477480),t(2177026350,1206759142),t(2456956037,344077627),t(2730485921,1290863460),t(2820302411,3158454273),t(3259730800,3505952657),t(3345764771,106217008),t(3516065817,3606008344),t(3600352804,1432725776),t(4094571909,1467031594),t(275423344,851169720),t(430227734,3100823752),t(506948616,1363258195),t(659060556,3750685593),t(883997877,3785050280),t(958139571,3318307427),t(1322822218,3812723403),t(1537002063,2003034995),t(1747873779,3602036899),t(1955562222,1575990012),t(2024104815,1125592928),t(2227730452,2716904306),t(2361852424,442776044),t(2428436474,593698344),t(2756734187,3733110249),t(3204031479,2999351573),t(3329325298,3815920427),t(3391569614,3928383900),t(3515267271,566280711),t(3940187606,3454069534),t(4118630271,4000239992),t(116418474,1914138554),t(174292421,2731055270),t(289380356,3203993006),t(460393269,320620315),t(685471733,587496836),t(852142971,1086792851),t(1017036298,365543100),t(1126000580,2618297676),t(1288033470,3409855158),t(1501505948,4234509866),t(1607167915,987167468),t(1816402316,1246189591)],a=[],u=0;80>u;u++)a[u]=t();r=r.SHA512=n.extend({_doReset:function(){this._hash=new s.init([new i.init(1779033703,4089235720),new i.init(3144134277,2227873595),new i.init(1013904242,4271175723),new i.init(2773480762,1595750129),new i.init(1359893119,2917565137),new i.init(2600822924,725511199),new i.init(528734635,4215389547),new i.init(1541459225,327033209)])},_doProcessBlock:function(t,e){for(var n=this._hash.words,r=n[0],i=n[1],s=n[2],u=n[3],h=n[4],c=n[5],f=n[6],n=n[7],l=r.high,d=r.low,g=i.high,p=i.low,y=s.high,v=s.low,m=u.high,S=u.low,b=h.high,w=h.low,E=c.high,x=c.low,_=f.high,A=f.low,F=n.high,P=n.low,O=l,C=d,T=g,D=p,j=y,H=v,R=m,I=S,k=b,B=w,N=E,V=x,M=_,K=A,L=F,U=P,q=0;80>q;q++){var W=a[q];if(16>q)var J=W.high=0|t[e+2*q],z=W.low=0|t[e+2*q+1];else{var J=a[q-15],z=J.high,Y=J.low,J=(z>>>1|Y<<31)^(z>>>8|Y<<24)^z>>>7,Y=(Y>>>1|z<<31)^(Y>>>8|z<<24)^(Y>>>7|z<<25),G=a[q-2],z=G.high,X=G.low,G=(z>>>19|X<<13)^(z<<3|X>>>29)^z>>>6,X=(X>>>19|z<<13)^(X<<3|z>>>29)^(X>>>6|z<<26),z=a[q-7],$=z.high,Z=a[q-16],Q=Z.high,Z=Z.low,z=Y+z.low,J=J+$+(z>>>0<Y>>>0?1:0),z=z+X,J=J+G+(z>>>0<X>>>0?1:0),z=z+Z,J=J+Q+(z>>>0<Z>>>0?1:0);W.high=J,W.low=z}var $=k&N^~k&M,Z=B&V^~B&K,W=O&T^O&j^T&j,tt=C&D^C&H^D&H,Y=(O>>>28|C<<4)^(O<<30|C>>>2)^(O<<25|C>>>7),G=(C>>>28|O<<4)^(C<<30|O>>>2)^(C<<25|O>>>7),X=o[q],et=X.high,nt=X.low,X=U+((B>>>14|k<<18)^(B>>>18|k<<14)^(B<<23|k>>>9)),Q=L+((k>>>14|B<<18)^(k>>>18|B<<14)^(k<<23|B>>>9))+(X>>>0<U>>>0?1:0),X=X+Z,Q=Q+$+(X>>>0<Z>>>0?1:0),X=X+nt,Q=Q+et+(X>>>0<nt>>>0?1:0),X=X+z,Q=Q+J+(X>>>0<z>>>0?1:0),z=G+tt,W=Y+W+(z>>>0<G>>>0?1:0),L=M,U=K,M=N,K=V,N=k,V=B,B=I+X|0,k=R+Q+(B>>>0<I>>>0?1:0)|0,R=j,I=H,j=T,H=D,T=O,D=C,C=X+z|0,O=Q+W+(C>>>0<X>>>0?1:0)|0}d=r.low=d+C,r.high=l+O+(d>>>0<C>>>0?1:0),p=i.low=p+D,i.high=g+T+(p>>>0<D>>>0?1:0),v=s.low=v+H,s.high=y+j+(v>>>0<H>>>0?1:0),S=u.low=S+I,u.high=m+R+(S>>>0<I>>>0?1:0),w=h.low=w+B,h.high=b+k+(w>>>0<B>>>0?1:0),x=c.low=x+V,c.high=E+N+(x>>>0<V>>>0?1:0),A=f.low=A+K,f.high=_+M+(A>>>0<K>>>0?1:0),P=n.low=P+U,n.high=F+L+(P>>>0<U>>>0?1:0)},_doFinalize:function(){var t=this._data,e=t.words,n=8*this._nDataBytes,r=8*t.sigBytes;return e[r>>>5]|=128<<24-r%32,e[(r+128>>>10<<5)+30]=Math.floor(n/4294967296),e[(r+128>>>10<<5)+31]=n,t.sigBytes=4*e.length,this._process(),this._hash.toX32()},clone:function(){var t=n.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:32}),e.SHA512=n._createHelper(r),e.HmacSHA512=n._createHmacHelper(r)}(),function(){var t=or,e=t.x64,n=e.Word,r=e.WordArray,e=t.algo,i=e.SHA512,e=e.SHA384=i.extend({_doReset:function(){this._hash=new r.init([new n.init(3418070365,3238371032),new n.init(1654270250,914150663),new n.init(2438529370,812702999),new n.init(355462360,4144912697),new n.init(1731405415,4290775857),new n.init(2394180231,1750603025),new n.init(3675008525,1694076839),new n.init(1203062813,3204075428)])},_doFinalize:function(){var t=i._doFinalize.call(this);return t.sigBytes-=16,t}});t.SHA384=i._createHelper(e),t.HmacSHA384=i._createHmacHelper(e)}(),function(){var t=or,e=t.lib,n=e.WordArray,r=e.Hasher,e=t.algo,i=n.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]),s=n.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]),o=n.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]),a=n.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]),u=n.create([0,1518500249,1859775393,2400959708,2840853838]),h=n.create([1352829926,1548603684,1836072691,2053994217,0]),e=e.RIPEMD160=r.extend({_doReset:function(){this._hash=n.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(t,e){for(var n=0;16>n;n++){var r=e+n,c=t[r];
t[r]=16711935&(c<<8|c>>>24)|4278255360&(c<<24|c>>>8)}var f,l,d,g,p,y,v,m,S,b,r=this._hash.words,c=u.words,w=h.words,E=i.words,x=s.words,_=o.words,A=a.words;y=f=r[0],v=l=r[1],m=d=r[2],S=g=r[3],b=p=r[4];for(var F,n=0;80>n;n+=1)F=f+t[e+E[n]]|0,F=16>n?F+((l^d^g)+c[0]):32>n?F+((l&d|~l&g)+c[1]):48>n?F+(((l|~d)^g)+c[2]):64>n?F+((l&g|d&~g)+c[3]):F+((l^(d|~g))+c[4]),F|=0,F=F<<_[n]|F>>>32-_[n],F=F+p|0,f=p,p=g,g=d<<10|d>>>22,d=l,l=F,F=y+t[e+x[n]]|0,F=16>n?F+((v^(m|~S))+w[0]):32>n?F+((v&S|m&~S)+w[1]):48>n?F+(((v|~m)^S)+w[2]):64>n?F+((v&m|~v&S)+w[3]):F+((v^m^S)+w[4]),F|=0,F=F<<A[n]|F>>>32-A[n],F=F+b|0,y=b,b=S,S=m<<10|m>>>22,m=v,v=F;F=r[1]+d+S|0,r[1]=r[2]+g+b|0,r[2]=r[3]+p+y|0,r[3]=r[4]+f+v|0,r[4]=r[0]+l+m|0,r[0]=F},_doFinalize:function(){var t=this._data,e=t.words,n=8*this._nDataBytes,r=8*t.sigBytes;for(e[r>>>5]|=128<<24-r%32,e[(r+64>>>9<<4)+14]=16711935&(n<<8|n>>>24)|4278255360&(n<<24|n>>>8),t.sigBytes=4*(e.length+1),this._process(),t=this._hash,e=t.words,n=0;5>n;n++)r=e[n],e[n]=16711935&(r<<8|r>>>24)|4278255360&(r<<24|r>>>8);return t},clone:function(){var t=r.clone.call(this);return t._hash=this._hash.clone(),t}});t.RIPEMD160=r._createHelper(e),t.HmacRIPEMD160=r._createHmacHelper(e)}(Math),function(){var t=or,e=t.enc.Utf8;t.algo.HMAC=t.lib.Base.extend({init:function(t,n){t=this._hasher=new t.init,"string"==typeof n&&(n=e.parse(n));var r=t.blockSize,i=4*r;n.sigBytes>i&&(n=t.finalize(n)),n.clamp();for(var s=this._oKey=n.clone(),o=this._iKey=n.clone(),a=s.words,u=o.words,h=0;h<r;h++)a[h]^=1549556828,u[h]^=909522486;s.sigBytes=o.sigBytes=i,this.reset()},reset:function(){var t=this._hasher;t.reset(),t.update(this._iKey)},update:function(t){return this._hasher.update(t),this},finalize:function(t){var e=this._hasher;return t=e.finalize(t),e.reset(),e.finalize(this._oKey.clone().concat(t))}})}(),function(){var t=or,e=t.lib,n=e.Base,r=e.WordArray,e=t.algo,i=e.HMAC,s=e.PBKDF2=n.extend({cfg:n.extend({keySize:4,hasher:e.SHA1,iterations:1}),init:function(t){this.cfg=this.cfg.extend(t)},compute:function(t,e){for(var n=this.cfg,s=i.create(n.hasher,t),o=r.create(),a=r.create([1]),u=o.words,h=a.words,c=n.keySize,n=n.iterations;u.length<c;){var f=s.update(e).finalize(a);s.reset();for(var l=f.words,d=l.length,g=f,p=1;p<n;p++){g=s.finalize(g),s.reset();for(var y=g.words,v=0;v<d;v++)l[v]^=y[v]}o.concat(f),h[0]++}return o.sigBytes=4*c,o}});t.PBKDF2=function(t,e,n){return s.create(n).compute(t,e)}}();/*! (c) Tom Wu | http://www-cs-students.stanford.edu/~tjw/jsbn/
	 */
var ar,ur="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",hr="=",cr=0xdeadbeefcafe,fr=15715070==(16777215&cr);fr&&"Microsoft Internet Explorer"==rr.appName?(o.prototype.am=h,ar=30):fr&&"Netscape"!=rr.appName?(o.prototype.am=u,ar=26):(o.prototype.am=c,ar=28),o.prototype.DB=ar,o.prototype.DM=(1<<ar)-1,o.prototype.DV=1<<ar;var lr=52;o.prototype.FV=Math.pow(2,lr),o.prototype.F1=lr-ar,o.prototype.F2=2*ar-lr;var dr,gr,pr="0123456789abcdefghijklmnopqrstuvwxyz",yr=new Array;for(dr="0".charCodeAt(0),gr=0;gr<=9;++gr)yr[dr++]=gr;for(dr="a".charCodeAt(0),gr=10;gr<36;++gr)yr[dr++]=gr;for(dr="A".charCodeAt(0),gr=10;gr<36;++gr)yr[dr++]=gr;H.prototype.convert=R,H.prototype.revert=I,H.prototype.reduce=k,H.prototype.mulTo=B,H.prototype.sqrTo=N,M.prototype.convert=K,M.prototype.revert=L,M.prototype.reduce=U,M.prototype.mulTo=W,M.prototype.sqrTo=q,o.prototype.copyTo=d,o.prototype.fromInt=g,o.prototype.fromString=y,o.prototype.clamp=v,o.prototype.dlShiftTo=_,o.prototype.drShiftTo=A,o.prototype.lShiftTo=F,o.prototype.rShiftTo=P,o.prototype.subTo=O,o.prototype.multiplyTo=C,o.prototype.squareTo=T,o.prototype.divRemTo=D,o.prototype.invDigit=V,o.prototype.isEven=J,o.prototype.exp=z,o.prototype.toString=m,o.prototype.negate=S,o.prototype.abs=b,o.prototype.compareTo=w,o.prototype.bitLength=x,o.prototype.mod=j,o.prototype.modPowInt=Y,o.ZERO=p(0),o.ONE=p(1),Vt.prototype.convert=Mt,Vt.prototype.revert=Mt,Vt.prototype.mulTo=Kt,Vt.prototype.sqrTo=Lt,Jt.prototype.convert=zt,Jt.prototype.revert=Yt,Jt.prototype.reduce=Gt,Jt.prototype.mulTo=$t,Jt.prototype.sqrTo=Xt;var vr=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997],mr=(1<<26)/vr[vr.length-1];o.prototype.chunkSize=Q,o.prototype.toRadix=et,o.prototype.fromRadix=nt,o.prototype.fromNumber=rt,o.prototype.bitwiseTo=ut,o.prototype.changeBit=At,o.prototype.addTo=Ct,o.prototype.dMultiply=Bt,o.prototype.dAddOffset=Nt,o.prototype.multiplyLowerTo=qt,o.prototype.multiplyUpperTo=Wt,o.prototype.modInt=te,o.prototype.millerRabin=re,o.prototype.clone=G,o.prototype.intValue=X,o.prototype.byteValue=$,o.prototype.shortValue=Z,o.prototype.signum=tt,o.prototype.toByteArray=it,o.prototype.equals=st,o.prototype.min=ot,o.prototype.max=at,o.prototype.and=ct,o.prototype.or=lt,o.prototype.xor=gt,o.prototype.andNot=yt,o.prototype.not=vt,o.prototype.shiftLeft=mt,o.prototype.shiftRight=St,o.prototype.getLowestSetBit=wt,o.prototype.bitCount=xt,o.prototype.testBit=_t,o.prototype.setBit=Ft,o.prototype.clearBit=Pt,o.prototype.flipBit=Ot,o.prototype.add=Tt,o.prototype.subtract=Dt,o.prototype.multiply=jt,o.prototype.divide=Rt,o.prototype.remainder=It,o.prototype.divideAndRemainder=kt,o.prototype.modPow=Zt,o.prototype.modInverse=ee,o.prototype.pow=Ut,o.prototype.gcd=Qt,o.prototype.isProbablePrime=ne,o.prototype.square=Ht,ie.prototype.init=se,ie.prototype.next=oe;var Sr,br,wr,Er=256;if(null==br){br=new Array,wr=0;var xr;if(ir.crypto&&ir.crypto.getRandomValues){var _r=new Uint8Array(32);for(ir.crypto.getRandomValues(_r),xr=0;xr<32;++xr)br[wr++]=_r[xr]}if("Netscape"==rr.appName&&rr.appVersion<"5"&&ir.crypto){var Ar=ir.crypto.random(32);for(xr=0;xr<Ar.length;++xr)br[wr++]=255&Ar.charCodeAt(xr)}for(;wr<Er;)xr=Math.floor(65536*Math.random()),br[wr++]=xr>>>8,br[wr++]=255&xr;wr=0,he()}le.prototype.nextBytes=fe;var Fr=20;ve.prototype.doPublic=Se,ve.prototype.setPublic=me,ve.prototype.encrypt=be,ve.prototype.encryptOAEP=we,ve.prototype.type="RSA";var Fr=20;ve.prototype.doPrivate=Oe,ve.prototype.setPrivate=Ae,ve.prototype.setPrivateEx=Fe,ve.prototype.generate=Pe,ve.prototype.decrypt=Ce,ve.prototype.decryptOAEP=Te,De.prototype.equals=je,De.prototype.toBigInteger=He,De.prototype.negate=Re,De.prototype.add=Ie,De.prototype.subtract=ke,De.prototype.multiply=Be,De.prototype.square=Ne,De.prototype.divide=Ve,Me.prototype.getX=Ke,Me.prototype.getY=Le,Me.prototype.equals=Ue,Me.prototype.isInfinity=qe,Me.prototype.negate=We,Me.prototype.add=Je,Me.prototype.twice=ze,Me.prototype.multiply=Ye,Me.prototype.multiplyTwo=Ge,Xe.prototype.getQ=$e,Xe.prototype.getA=Ze,Xe.prototype.getB=Qe,Xe.prototype.equals=tn,Xe.prototype.getInfinity=en,Xe.prototype.fromBigInteger=nn,Xe.prototype.decodePointHex=rn,/*! (c) Stefan Thomas | https://github.com/bitcoinjs/bitcoinjs-lib
	 */
De.prototype.getByteLength=function(){return Math.floor((this.toBigInteger().bitLength()+7)/8)},Me.prototype.getEncoded=function(t){var e=function(t,e){var n=t.toByteArrayUnsigned();if(e<n.length)n=n.slice(n.length-e);else for(;e>n.length;)n.unshift(0);return n},n=this.getX().toBigInteger(),r=this.getY().toBigInteger(),i=e(n,32);return t?r.isEven()?i.unshift(2):i.unshift(3):(i.unshift(4),i=i.concat(e(r,32))),i},Me.decodeFrom=function(t,e){var n=(e[0],e.length-1),r=e.slice(1,1+n/2),i=e.slice(1+n/2,1+n);r.unshift(0),i.unshift(0);var s=new o(r),a=new o(i);return new Me(t,t.fromBigInteger(s),t.fromBigInteger(a))},Me.decodeFromHex=function(t,e){var n=(e.substr(0,2),e.length-2),r=e.substr(2,n/2),i=e.substr(2+n/2,n/2),s=new o(r,16),a=new o(i,16);return new Me(t,t.fromBigInteger(s),t.fromBigInteger(a))},Me.prototype.add2D=function(t){if(this.isInfinity())return t;if(t.isInfinity())return this;if(this.x.equals(t.x))return this.y.equals(t.y)?this.twice():this.curve.getInfinity();var e=t.x.subtract(this.x),n=t.y.subtract(this.y),r=n.divide(e),i=r.square().subtract(this.x).subtract(t.x),s=r.multiply(this.x.subtract(i)).subtract(this.y);return new Me(this.curve,i,s)},Me.prototype.twice2D=function(){if(this.isInfinity())return this;if(0==this.y.toBigInteger().signum())return this.curve.getInfinity();var t=this.curve.fromBigInteger(o.valueOf(2)),e=this.curve.fromBigInteger(o.valueOf(3)),n=this.x.square().multiply(e).add(this.curve.a).divide(this.y.multiply(t)),r=n.square().subtract(this.x.multiply(t)),i=n.multiply(this.x.subtract(r)).subtract(this.y);return new Me(this.curve,r,i)},Me.prototype.multiply2D=function(t){if(this.isInfinity())return this;if(0==t.signum())return this.curve.getInfinity();var e,n=t,r=n.multiply(new o("3")),i=this.negate(),s=this;for(e=r.bitLength()-2;e>0;--e){s=s.twice();var a=r.testBit(e),u=n.testBit(e);a!=u&&(s=s.add2D(a?this:i))}return s},Me.prototype.isOnCurve=function(){var t=this.getX().toBigInteger(),e=this.getY().toBigInteger(),n=this.curve.getA().toBigInteger(),r=this.curve.getB().toBigInteger(),i=this.curve.getQ(),s=e.multiply(e).mod(i),o=t.multiply(t).multiply(t).add(n.multiply(t)).add(r).mod(i);return s.equals(o)},Me.prototype.toString=function(){return"("+this.getX().toBigInteger().toString()+","+this.getY().toBigInteger().toString()+")"},Me.prototype.validate=function(){var t=this.curve.getQ();if(this.isInfinity())throw new Error("Point is at infinity.");var e=this.getX().toBigInteger(),n=this.getY().toBigInteger();if(e.compareTo(o.ONE)<0||e.compareTo(t.subtract(o.ONE))>0)throw new Error("x coordinate out of bounds");if(n.compareTo(o.ONE)<0||n.compareTo(t.subtract(o.ONE))>0)throw new Error("y coordinate out of bounds");if(!this.isOnCurve())throw new Error("Point is not on the curve.");if(this.multiply(t).isInfinity())throw new Error("Point is not a scalar multiple of G.");return!0};/*! Mike Samuel (c) 2009 | code.google.com/p/json-sans-eval
	 */
var Pr=function(){function t(t,e,n){return e?o[e]:String.fromCharCode(parseInt(n,16))}var e="(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)",n='(?:[^\\0-\\x08\\x0a-\\x1f"\\\\]|\\\\(?:["/\\\\bfnrt]|u[0-9A-Fa-f]{4}))',r='(?:"'+n+'*")',i=new RegExp("(?:false|true|null|[\\{\\}\\[\\]]|"+e+"|"+r+")","g"),s=new RegExp("\\\\(?:([^u])|u(.{4}))","g"),o={'"':'"',"/":"/","\\":"\\",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},a=new String(""),u="\\",h=({"{":Object,"[":Array},Object.hasOwnProperty);return function(e,n){var r,o=e.match(i),c=o[0],f=!1;"{"===c?r={}:"["===c?r=[]:(r=[],f=!0);for(var l,d=[r],g=1-f,p=o.length;g<p;++g){c=o[g];var y;switch(c.charCodeAt(0)){default:y=d[0],y[l||y.length]=+c,l=void 0;break;case 34:if(c=c.substring(1,c.length-1),c.indexOf(u)!==-1&&(c=c.replace(s,t)),y=d[0],!l){if(!(y instanceof Array)){l=c||a;break}l=y.length}y[l]=c,l=void 0;break;case 91:y=d[0],d.unshift(y[l||y.length]=[]),l=void 0;break;case 93:d.shift();break;case 102:y=d[0],y[l||y.length]=!1,l=void 0;break;case 110:y=d[0],y[l||y.length]=null,l=void 0;break;case 116:y=d[0],y[l||y.length]=!0,l=void 0;break;case 123:y=d[0],d.unshift(y[l||y.length]={}),l=void 0;break;case 125:d.shift()}}if(f){if(1!==d.length)throw new Error;r=r[0]}else if(d.length)throw new Error;if(n){var v=function(t,e){var r=t[e];if(r&&"object"==typeof r){var i=null;for(var s in r)if(h.call(r,s)&&r!==t){var o=v(r,s);void 0!==o?r[s]=o:(i||(i=[]),i.push(s))}if(i)for(var a=i.length;--a>=0;)delete r[i[a]]}return n.call(t,e,r)};r=v({"":r},"")}return r}}();/*! asn1-1.0.10.js (c) 2013-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.asn1&&Cr.asn1||(Cr.asn1={}),Cr.asn1.ASN1Util=new function(){this.integerToByteHex=function(t){var e=t.toString(16);return e.length%2==1&&(e="0"+e),e},this.bigIntToMinTwosComplementsHex=function(t){var e=t.toString(16);if("-"!=e.substr(0,1))e.length%2==1?e="0"+e:e.match(/^[0-7]/)||(e="00"+e);else{var n=e.substr(1),r=n.length;r%2==1?r+=1:e.match(/^[0-7]/)||(r+=2);for(var i="",s=0;s<r;s++)i+="f";var a=new o(i,16),u=a.xor(t).add(o.ONE);e=u.toString(16).replace(/^-/,"")}return e},this.getPEMStringFromHex=function(t,e){var n=En(t),r=n.replace(/(.{64})/g,"$1\r\n");return r=r.replace(/\r\n$/,""),"-----BEGIN "+e+"-----\r\n"+r+"\r\n-----END "+e+"-----\r\n"},this.newObject=function(t){var e=Cr.asn1,n=Object.keys(t);if(1!=n.length)throw"key of param shall be only one.";var r=n[0];if(":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(":"+r+":")==-1)throw"undefined key: "+r;if("bool"==r)return new e.DERBoolean(t[r]);if("int"==r)return new e.DERInteger(t[r]);if("bitstr"==r)return new e.DERBitString(t[r]);if("octstr"==r)return new e.DEROctetString(t[r]);if("null"==r)return new e.DERNull(t[r]);if("oid"==r)return new e.DERObjectIdentifier(t[r]);if("enum"==r)return new e.DEREnumerated(t[r]);if("utf8str"==r)return new e.DERUTF8String(t[r]);if("numstr"==r)return new e.DERNumericString(t[r]);if("prnstr"==r)return new e.DERPrintableString(t[r]);if("telstr"==r)return new e.DERTeletexString(t[r]);if("ia5str"==r)return new e.DERIA5String(t[r]);if("utctime"==r)return new e.DERUTCTime(t[r]);if("gentime"==r)return new e.DERGeneralizedTime(t[r]);if("seq"==r){for(var i=t[r],s=[],o=0;o<i.length;o++){var a=e.ASN1Util.newObject(i[o]);s.push(a)}return new e.DERSequence({array:s})}if("set"==r){for(var i=t[r],s=[],o=0;o<i.length;o++){var a=e.ASN1Util.newObject(i[o]);s.push(a)}return new e.DERSet({array:s})}if("tag"==r){var u=t[r];if("[object Array]"===Object.prototype.toString.call(u)&&3==u.length){var h=e.ASN1Util.newObject(u[2]);return new e.DERTaggedObject({tag:u[0],explicit:u[1],obj:h})}var c={};if(void 0!==u.explicit&&(c.explicit=u.explicit),void 0!==u.tag&&(c.tag=u.tag),void 0===u.obj)throw"obj shall be specified for 'tag'.";return c.obj=e.ASN1Util.newObject(u.obj),new e.DERTaggedObject(c)}},this.jsonToASN1HEX=function(t){var e=this.newObject(t);return e.getEncodedHex()}},Cr.asn1.ASN1Util.oidHexToInt=function(t){for(var e="",n=parseInt(t.substr(0,2),16),r=Math.floor(n/40),i=n%40,e=r+"."+i,s="",a=2;a<t.length;a+=2){var u=parseInt(t.substr(a,2),16),h=("00000000"+u.toString(2)).slice(-8);if(s+=h.substr(1,7),"0"==h.substr(0,1)){var c=new o(s,2);e=e+"."+c.toString(10),s=""}}return e},Cr.asn1.ASN1Util.oidIntToHex=function(t){var e=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},n=function(t){var n="",r=new o(t,10),i=r.toString(2),s=7-i.length%7;7==s&&(s=0);for(var a="",u=0;u<s;u++)a+="0";i=a+i;for(var u=0;u<i.length-1;u+=7){var h=i.substr(u,7);u!=i.length-7&&(h="1"+h),n+=e(parseInt(h,2))}return n};if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var r="",i=t.split("."),s=40*parseInt(i[0])+parseInt(i[1]);r+=e(s),i.splice(0,2);for(var a=0;a<i.length;a++)r+=n(i[a]);return r},Cr.asn1.ASN1Object=function(){var t="";this.getLengthHexFromValue=function(){if("undefined"==typeof this.hV||null==this.hV)throw"this.hV is null or undefined.";if(this.hV.length%2==1)throw"value hex must be even length: n="+t.length+",v="+this.hV;var e=this.hV.length/2,n=e.toString(16);if(n.length%2==1&&(n="0"+n),e<128)return n;var r=n.length/2;if(r>15)throw"ASN.1 length too long to represent by 8x: n = "+e.toString(16);var i=128+r;return i.toString(16)+n},this.getEncodedHex=function(){return(null==this.hTLV||this.isModified)&&(this.hV=this.getFreshValueHex(),this.hL=this.getLengthHexFromValue(),this.hTLV=this.hT+this.hL+this.hV,this.isModified=!1),this.hTLV},this.getValueHex=function(){return this.getEncodedHex(),this.hV},this.getFreshValueHex=function(){return""}},Cr.asn1.DERAbstractString=function(t){Cr.asn1.DERAbstractString.superclass.constructor.call(this);this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=un(this.s)},this.setStringHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.getFreshValueHex=function(){return this.hV},"undefined"!=typeof t&&("string"==typeof t?this.setString(t):"undefined"!=typeof t.str?this.setString(t.str):"undefined"!=typeof t.hex&&this.setStringHex(t.hex))},sr.lang.extend(Cr.asn1.DERAbstractString,Cr.asn1.ASN1Object),Cr.asn1.DERAbstractTime=function(t){Cr.asn1.DERAbstractTime.superclass.constructor.call(this);this.localDateToUTC=function(t){utc=t.getTime()+6e4*t.getTimezoneOffset();var e=new Date(utc);return e},this.formatDate=function(t,e,n){var r=this.zeroPadding,i=this.localDateToUTC(t),s=String(i.getFullYear());"utc"==e&&(s=s.substr(2,2));var o=r(String(i.getMonth()+1),2),a=r(String(i.getDate()),2),u=r(String(i.getHours()),2),h=r(String(i.getMinutes()),2),c=r(String(i.getSeconds()),2),f=s+o+a+u+h+c;if(n===!0){var l=i.getMilliseconds();if(0!=l){var d=r(String(l),3);d=d.replace(/[0]+$/,""),f=f+"."+d}}return f+"Z"},this.zeroPadding=function(t,e){return t.length>=e?t:new Array(e-t.length+1).join("0")+t},this.getString=function(){return this.s},this.setString=function(t){this.hTLV=null,this.isModified=!0,this.s=t,this.hV=un(t)},this.setByDateValue=function(t,e,n,r,i,s){var o=new Date(Date.UTC(t,e-1,n,r,i,s,0));this.setByDate(o)},this.getFreshValueHex=function(){return this.hV}},sr.lang.extend(Cr.asn1.DERAbstractTime,Cr.asn1.ASN1Object),Cr.asn1.DERAbstractStructured=function(t){Cr.asn1.DERAbstractString.superclass.constructor.call(this);this.setByASN1ObjectArray=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array=t},this.appendASN1Object=function(t){this.hTLV=null,this.isModified=!0,this.asn1Array.push(t)},this.asn1Array=new Array,"undefined"!=typeof t&&"undefined"!=typeof t.array&&(this.asn1Array=t.array)},sr.lang.extend(Cr.asn1.DERAbstractStructured,Cr.asn1.ASN1Object),Cr.asn1.DERBoolean=function(){Cr.asn1.DERBoolean.superclass.constructor.call(this),this.hT="01",this.hTLV="0101ff"},sr.lang.extend(Cr.asn1.DERBoolean,Cr.asn1.ASN1Object),Cr.asn1.DERInteger=function(t){Cr.asn1.DERInteger.superclass.constructor.call(this),this.hT="02",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=Cr.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new o(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},"undefined"!=typeof t&&("undefined"!=typeof t.bigint?this.setByBigInteger(t.bigint):"undefined"!=typeof t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):"undefined"!=typeof t.hex&&this.setValueHex(t.hex))},sr.lang.extend(Cr.asn1.DERInteger,Cr.asn1.ASN1Object),Cr.asn1.DERBitString=function(t){Cr.asn1.DERBitString.superclass.constructor.call(this),this.hT="03",this.setHexValueIncludingUnusedBits=function(t){this.hTLV=null,this.isModified=!0,this.hV=t},this.setUnusedBitsAndHexValue=function(t,e){if(t<0||7<t)throw"unused bits shall be from 0 to 7: u = "+t;var n="0"+t;this.hTLV=null,this.isModified=!0,this.hV=n+e},this.setByBinaryString=function(t){t=t.replace(/0+$/,"");var e=8-t.length%8;8==e&&(e=0);for(var n=0;n<=e;n++)t+="0";for(var r="",n=0;n<t.length-1;n+=8){var i=t.substr(n,8),s=parseInt(i,2).toString(16);1==s.length&&(s="0"+s),r+=s}this.hTLV=null,this.isModified=!0,this.hV="0"+e+r},this.setByBooleanArray=function(t){for(var e="",n=0;n<t.length;n++)e+=1==t[n]?"1":"0";this.setByBinaryString(e)},this.newFalseArray=function(t){for(var e=new Array(t),n=0;n<t;n++)e[n]=!1;return e},this.getFreshValueHex=function(){return this.hV},"undefined"!=typeof t&&("string"==typeof t&&t.toLowerCase().match(/^[0-9a-f]+$/)?this.setHexValueIncludingUnusedBits(t):"undefined"!=typeof t.hex?this.setHexValueIncludingUnusedBits(t.hex):"undefined"!=typeof t.bin?this.setByBinaryString(t.bin):"undefined"!=typeof t.array&&this.setByBooleanArray(t.array))},sr.lang.extend(Cr.asn1.DERBitString,Cr.asn1.ASN1Object),Cr.asn1.DEROctetString=function(t){Cr.asn1.DEROctetString.superclass.constructor.call(this,t),this.hT="04"},sr.lang.extend(Cr.asn1.DEROctetString,Cr.asn1.DERAbstractString),Cr.asn1.DERNull=function(){Cr.asn1.DERNull.superclass.constructor.call(this),this.hT="05",this.hTLV="0500"},sr.lang.extend(Cr.asn1.DERNull,Cr.asn1.ASN1Object),Cr.asn1.DERObjectIdentifier=function(t){var e=function(t){var e=t.toString(16);return 1==e.length&&(e="0"+e),e},n=function(t){var n="",r=new o(t,10),i=r.toString(2),s=7-i.length%7;7==s&&(s=0);for(var a="",u=0;u<s;u++)a+="0";i=a+i;for(var u=0;u<i.length-1;u+=7){var h=i.substr(u,7);u!=i.length-7&&(h="1"+h),n+=e(parseInt(h,2))}return n};Cr.asn1.DERObjectIdentifier.superclass.constructor.call(this),this.hT="06",this.setValueHex=function(t){this.hTLV=null,this.isModified=!0,this.s=null,this.hV=t},this.setValueOidString=function(t){if(!t.match(/^[0-9.]+$/))throw"malformed oid string: "+t;var r="",i=t.split("."),s=40*parseInt(i[0])+parseInt(i[1]);r+=e(s),i.splice(0,2);for(var o=0;o<i.length;o++)r+=n(i[o]);this.hTLV=null,this.isModified=!0,this.s=null,this.hV=r},this.setValueName=function(t){if("undefined"==typeof Cr.asn1.x509.OID.name2oidList[t])throw"DERObjectIdentifier oidName undefined: "+t;var e=Cr.asn1.x509.OID.name2oidList[t];this.setValueOidString(e)},this.getFreshValueHex=function(){return this.hV},"undefined"!=typeof t&&("string"==typeof t&&t.match(/^[0-2].[0-9.]+$/)?this.setValueOidString(t):void 0!==Cr.asn1.x509.OID.name2oidList[t]?this.setValueOidString(Cr.asn1.x509.OID.name2oidList[t]):"undefined"!=typeof t.oid?this.setValueOidString(t.oid):"undefined"!=typeof t.hex?this.setValueHex(t.hex):"undefined"!=typeof t.name&&this.setValueName(t.name))},sr.lang.extend(Cr.asn1.DERObjectIdentifier,Cr.asn1.ASN1Object),Cr.asn1.DEREnumerated=function(t){Cr.asn1.DEREnumerated.superclass.constructor.call(this),this.hT="0a",this.setByBigInteger=function(t){this.hTLV=null,this.isModified=!0,this.hV=Cr.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t)},this.setByInteger=function(t){var e=new o(String(t),10);this.setByBigInteger(e)},this.setValueHex=function(t){this.hV=t},this.getFreshValueHex=function(){return this.hV},"undefined"!=typeof t&&("undefined"!=typeof t.int?this.setByInteger(t.int):"number"==typeof t?this.setByInteger(t):"undefined"!=typeof t.hex&&this.setValueHex(t.hex))},sr.lang.extend(Cr.asn1.DEREnumerated,Cr.asn1.ASN1Object),Cr.asn1.DERUTF8String=function(t){Cr.asn1.DERUTF8String.superclass.constructor.call(this,t),this.hT="0c"},sr.lang.extend(Cr.asn1.DERUTF8String,Cr.asn1.DERAbstractString),Cr.asn1.DERNumericString=function(t){Cr.asn1.DERNumericString.superclass.constructor.call(this,t),this.hT="12"},sr.lang.extend(Cr.asn1.DERNumericString,Cr.asn1.DERAbstractString),Cr.asn1.DERPrintableString=function(t){Cr.asn1.DERPrintableString.superclass.constructor.call(this,t),this.hT="13"},sr.lang.extend(Cr.asn1.DERPrintableString,Cr.asn1.DERAbstractString),Cr.asn1.DERTeletexString=function(t){Cr.asn1.DERTeletexString.superclass.constructor.call(this,t),this.hT="14"},sr.lang.extend(Cr.asn1.DERTeletexString,Cr.asn1.DERAbstractString),Cr.asn1.DERIA5String=function(t){Cr.asn1.DERIA5String.superclass.constructor.call(this,t),this.hT="16"},sr.lang.extend(Cr.asn1.DERIA5String,Cr.asn1.DERAbstractString),Cr.asn1.DERUTCTime=function(t){Cr.asn1.DERUTCTime.superclass.constructor.call(this,t),this.hT="17",this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"utc"),this.hV=un(this.s)},this.getFreshValueHex=function(){return"undefined"==typeof this.date&&"undefined"==typeof this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"utc"),this.hV=un(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{12}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date))},sr.lang.extend(Cr.asn1.DERUTCTime,Cr.asn1.DERAbstractTime),Cr.asn1.DERGeneralizedTime=function(t){Cr.asn1.DERGeneralizedTime.superclass.constructor.call(this,t),this.hT="18",this.withMillis=!1,this.setByDate=function(t){this.hTLV=null,this.isModified=!0,this.date=t,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=un(this.s)},this.getFreshValueHex=function(){return void 0===this.date&&void 0===this.s&&(this.date=new Date,this.s=this.formatDate(this.date,"gen",this.withMillis),this.hV=un(this.s)),this.hV},void 0!==t&&(void 0!==t.str?this.setString(t.str):"string"==typeof t&&t.match(/^[0-9]{14}Z$/)?this.setString(t):void 0!==t.hex?this.setStringHex(t.hex):void 0!==t.date&&this.setByDate(t.date),t.millis===!0&&(this.withMillis=!0))},sr.lang.extend(Cr.asn1.DERGeneralizedTime,Cr.asn1.DERAbstractTime),Cr.asn1.DERSequence=function(t){Cr.asn1.DERSequence.superclass.constructor.call(this,t),this.hT="30",this.getFreshValueHex=function(){for(var t="",e=0;e<this.asn1Array.length;e++){var n=this.asn1Array[e];t+=n.getEncodedHex()}return this.hV=t,this.hV}},sr.lang.extend(Cr.asn1.DERSequence,Cr.asn1.DERAbstractStructured),Cr.asn1.DERSet=function(t){Cr.asn1.DERSet.superclass.constructor.call(this,t),this.hT="31",this.sortFlag=!0,this.getFreshValueHex=function(){for(var t=new Array,e=0;e<this.asn1Array.length;e++){var n=this.asn1Array[e];t.push(n.getEncodedHex())}return 1==this.sortFlag&&t.sort(),this.hV=t.join(""),this.hV},"undefined"!=typeof t&&"undefined"!=typeof t.sortflag&&0==t.sortflag&&(this.sortFlag=!1)},sr.lang.extend(Cr.asn1.DERSet,Cr.asn1.DERAbstractStructured),Cr.asn1.DERTaggedObject=function(t){Cr.asn1.DERTaggedObject.superclass.constructor.call(this),this.hT="a0",this.hV="",this.isExplicit=!0,this.asn1Object=null,this.setASN1Object=function(t,e,n){this.hT=e,this.isExplicit=t,this.asn1Object=n,this.isExplicit?(this.hV=this.asn1Object.getEncodedHex(),this.hTLV=null,this.isModified=!0):(this.hV=null,this.hTLV=n.getEncodedHex(),this.hTLV=this.hTLV.replace(/^../,e),this.isModified=!1)},this.getFreshValueHex=function(){return this.hV},"undefined"!=typeof t&&("undefined"!=typeof t.tag&&(this.hT=t.tag),"undefined"!=typeof t.explicit&&(this.isExplicit=t.explicit),"undefined"!=typeof t.obj&&(this.asn1Object=t.obj,this.setASN1Object(this.isExplicit,this.hT,this.asn1Object)))},sr.lang.extend(Cr.asn1.DERTaggedObject,Cr.asn1.ASN1Object);/*! asn1hex-1.1.6.js (c) 2012-2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
var Or=new function(){this.getByteLengthOfL_AtObj=function(t,e){if("8"!=t.substring(e+2,e+3))return 1;var n=parseInt(t.substring(e+3,e+4));return 0==n?-1:0<n&&n<10?n+1:-2},this.getHexOfL_AtObj=function(t,e){var n=this.getByteLengthOfL_AtObj(t,e);return n<1?"":t.substring(e+2,e+2+2*n)},this.getIntOfL_AtObj=function(t,e){var n=this.getHexOfL_AtObj(t,e);if(""==n)return-1;var r;return r=parseInt(n.substring(0,1))<8?new o(n,16):new o(n.substring(2),16),r.intValue()},this.getStartPosOfV_AtObj=function(t,e){var n=this.getByteLengthOfL_AtObj(t,e);return n<0?n:e+2*(n+1)},this.getHexOfV_AtObj=function(t,e){var n=this.getStartPosOfV_AtObj(t,e),r=this.getIntOfL_AtObj(t,e);return t.substring(n,n+2*r)},this.getHexOfTLV_AtObj=function(t,e){var n=t.substr(e,2),r=this.getHexOfL_AtObj(t,e),i=this.getHexOfV_AtObj(t,e);return n+r+i},this.getPosOfNextSibling_AtObj=function(t,e){var n=this.getStartPosOfV_AtObj(t,e),r=this.getIntOfL_AtObj(t,e);return n+2*r},this.getPosArrayOfChildren_AtObj=function(t,e){var n=new Array,r=this.getStartPosOfV_AtObj(t,e);n.push(r);for(var i=this.getIntOfL_AtObj(t,e),s=r,o=0;;){var a=this.getPosOfNextSibling_AtObj(t,s);if(null==a||a-r>=2*i)break;if(o>=200)break;n.push(a),s=a,o++}return n},this.getNthChildIndex_AtObj=function(t,e,n){var r=this.getPosArrayOfChildren_AtObj(t,e);return r[n]},this.getDecendantIndexByNthList=function(t,e,n){if(0==n.length)return e;var r=n.shift(),i=this.getPosArrayOfChildren_AtObj(t,e);return this.getDecendantIndexByNthList(t,i[r],n)},this.getDecendantHexTLVByNthList=function(t,e,n){var r=this.getDecendantIndexByNthList(t,e,n);return this.getHexOfTLV_AtObj(t,r)},this.getDecendantHexVByNthList=function(t,e,n){var r=this.getDecendantIndexByNthList(t,e,n);return this.getHexOfV_AtObj(t,r)}};Or.getVbyList=function(t,e,n,r){var i=this.getDecendantIndexByNthList(t,e,n);if(void 0===i)throw"can't find nthList object";if(void 0!==r&&t.substr(i,2)!=r)throw"checking tag doesn't match: "+t.substr(i,2)+"!="+r;return this.getHexOfV_AtObj(t,i)},Or.hextooidstr=function(t){var e=function(t,e){return t.length>=e?t:new Array(e-t.length+1).join("0")+t},n=[],r=t.substr(0,2),i=parseInt(r,16);n[0]=new String(Math.floor(i/40)),n[1]=new String(i%40);for(var s=t.substr(2),o=[],a=0;a<s.length/2;a++)o.push(parseInt(s.substr(2*a,2),16));for(var u=[],h="",a=0;a<o.length;a++)128&o[a]?h+=e((127&o[a]).toString(2),7):(h+=e((127&o[a]).toString(2),7),u.push(new String(parseInt(h,2))),h="");var c=n.join(".");return u.length>0&&(c=c+"."+u.join(".")),c},Or.dump=function(t,e,n,r){var i=function(t,e){if(t.length<=2*e)return t;var n=t.substr(0,e)+"..(total "+t.length/2+"bytes).."+t.substr(t.length-e,e);return n};void 0===e&&(e={ommit_long_octet:32}),void 0===n&&(n=0),void 0===r&&(r="");var s=e.ommit_long_octet;if("01"==t.substr(n,2)){var o=Or.getHexOfV_AtObj(t,n);return"00"==o?r+"BOOLEAN FALSE\n":r+"BOOLEAN TRUE\n"}if("02"==t.substr(n,2)){var o=Or.getHexOfV_AtObj(t,n);return r+"INTEGER "+i(o,s)+"\n"}if("03"==t.substr(n,2)){var o=Or.getHexOfV_AtObj(t,n);return r+"BITSTRING "+i(o,s)+"\n"}if("04"==t.substr(n,2)){var o=Or.getHexOfV_AtObj(t,n);if(Or.isASN1HEX(o)){var a=r+"OCTETSTRING, encapsulates\n";return a+=Or.dump(o,e,0,r+"  ")}return r+"OCTETSTRING "+i(o,s)+"\n"}if("05"==t.substr(n,2))return r+"NULL\n";if("06"==t.substr(n,2)){var u=Or.getHexOfV_AtObj(t,n),h=Cr.asn1.ASN1Util.oidHexToInt(u),c=Cr.asn1.x509.OID.oid2name(h),f=h.replace(/\./g," ");return""!=c?r+"ObjectIdentifier "+c+" ("+f+")\n":r+"ObjectIdentifier ("+f+")\n"}if("0c"==t.substr(n,2))return r+"UTF8String '"+Sn(Or.getHexOfV_AtObj(t,n))+"'\n";if("13"==t.substr(n,2))return r+"PrintableString '"+Sn(Or.getHexOfV_AtObj(t,n))+"'\n";if("14"==t.substr(n,2))return r+"TeletexString '"+Sn(Or.getHexOfV_AtObj(t,n))+"'\n";if("16"==t.substr(n,2))return r+"IA5String '"+Sn(Or.getHexOfV_AtObj(t,n))+"'\n";if("17"==t.substr(n,2))return r+"UTCTime "+Sn(Or.getHexOfV_AtObj(t,n))+"\n";if("18"==t.substr(n,2))return r+"GeneralizedTime "+Sn(Or.getHexOfV_AtObj(t,n))+"\n";if("30"==t.substr(n,2)){if("3000"==t.substr(n,4))return r+"SEQUENCE {}\n";var a=r+"SEQUENCE\n",l=Or.getPosArrayOfChildren_AtObj(t,n),d=e;if((2==l.length||3==l.length)&&"06"==t.substr(l[0],2)&&"04"==t.substr(l[l.length-1],2)){var g=Or.getHexOfV_AtObj(t,l[0]),h=Cr.asn1.ASN1Util.oidHexToInt(g),c=Cr.asn1.x509.OID.oid2name(h),p=JSON.parse(JSON.stringify(e));p.x509ExtName=c,d=p}for(var y=0;y<l.length;y++)a+=Or.dump(t,d,l[y],r+"  ");return a}if("31"==t.substr(n,2)){for(var a=r+"SET\n",l=Or.getPosArrayOfChildren_AtObj(t,n),y=0;y<l.length;y++)a+=Or.dump(t,e,l[y],r+"  ");return a}var v=parseInt(t.substr(n,2),16);if(0!=(128&v)){var m=31&v;if(0!=(32&v)){for(var a=r+"["+m+"]\n",l=Or.getPosArrayOfChildren_AtObj(t,n),y=0;y<l.length;y++)a+=Or.dump(t,e,l[y],r+"  ");return a}var o=Or.getHexOfV_AtObj(t,n);"68747470"==o.substr(0,8)&&(o=Sn(o)),"subjectAltName"===e.x509ExtName&&2==m&&(o=Sn(o));var a=r+"["+m+"] "+o+"\n";return a}return r+"UNKNOWN("+t.substr(n,2)+") "+Or.getHexOfV_AtObj(t,n)+"\n"},Or.isASN1HEX=function(t){if(t.length%2==1)return!1;var e=Or.getIntOfL_AtObj(t,0),n=t.substr(0,2),r=Or.getHexOfL_AtObj(t,0),i=t.length-n.length-r.length;return i==2*e},/*! asn1x509-1.0.14.js (c) 2013-2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.asn1&&Cr.asn1||(Cr.asn1={}),"undefined"!=typeof Cr.asn1.x509&&Cr.asn1.x509||(Cr.asn1.x509={}),Cr.asn1.x509.Certificate=function(t){Cr.asn1.x509.Certificate.superclass.constructor.call(this);this.setRsaPrvKeyByPEMandPass=function(t,e){var n=Hr.getDecryptedKeyHex(t,e),r=new ve;r.readPrivateKeyFromASN1HexString(n),this.prvKey=r},this.sign=function(){this.asn1SignatureAlg=this.asn1TBSCert.asn1SignatureAlg,sig=new Cr.crypto.Signature({alg:"SHA1withRSA"}),sig.init(this.prvKey),sig.updateHex(this.asn1TBSCert.getEncodedHex()),this.hexSig=sig.sign(),this.asn1Sig=new Cr.asn1.DERBitString({hex:"00"+this.hexSig});var t=new Cr.asn1.DERSequence({array:[this.asn1TBSCert,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=t.getEncodedHex(),this.isModified=!1},this.setSignatureHex=function(t){this.asn1SignatureAlg=this.asn1TBSCert.asn1SignatureAlg,this.hexSig=t,this.asn1Sig=new Cr.asn1.DERBitString({hex:"00"+this.hexSig});var e=new Cr.asn1.DERSequence({array:[this.asn1TBSCert,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=e.getEncodedHex(),this.isModified=!1},this.getEncodedHex=function(){if(0==this.isModified&&null!=this.hTLV)return this.hTLV;throw"not signed yet"},this.getPEMString=function(){var t=this.getEncodedHex(),e=or.enc.Hex.parse(t),n=or.enc.Base64.stringify(e),r=n.replace(/(.{64})/g,"$1\r\n");return"-----BEGIN CERTIFICATE-----\r\n"+r+"\r\n-----END CERTIFICATE-----\r\n"},"undefined"!=typeof t&&("undefined"!=typeof t.tbscertobj&&(this.asn1TBSCert=t.tbscertobj),"undefined"!=typeof t.prvkeyobj?this.prvKey=t.prvkeyobj:"undefined"!=typeof t.rsaprvkey?this.prvKey=t.rsaprvkey:"undefined"!=typeof t.rsaprvpem&&"undefined"!=typeof t.rsaprvpas&&this.setRsaPrvKeyByPEMandPass(t.rsaprvpem,t.rsaprvpas))},sr.lang.extend(Cr.asn1.x509.Certificate,Cr.asn1.ASN1Object),Cr.asn1.x509.TBSCertificate=function(t){Cr.asn1.x509.TBSCertificate.superclass.constructor.call(this),this._initialize=function(){this.asn1Array=new Array,this.asn1Version=new Cr.asn1.DERTaggedObject({obj:new Cr.asn1.DERInteger({int:2})}),this.asn1SerialNumber=null,this.asn1SignatureAlg=null,this.asn1Issuer=null,this.asn1NotBefore=null,this.asn1NotAfter=null,this.asn1Subject=null,this.asn1SubjPKey=null,this.extensionsArray=new Array},this.setSerialNumberByParam=function(t){this.asn1SerialNumber=new Cr.asn1.DERInteger(t)},this.setSignatureAlgByParam=function(t){this.asn1SignatureAlg=new Cr.asn1.x509.AlgorithmIdentifier(t)},this.setIssuerByParam=function(t){this.asn1Issuer=new Cr.asn1.x509.X500Name(t)},this.setNotBeforeByParam=function(t){this.asn1NotBefore=new Cr.asn1.x509.Time(t)},this.setNotAfterByParam=function(t){this.asn1NotAfter=new Cr.asn1.x509.Time(t)},this.setSubjectByParam=function(t){this.asn1Subject=new Cr.asn1.x509.X500Name(t)},this.setSubjectPublicKeyByParam=function(t){this.asn1SubjPKey=new Cr.asn1.x509.SubjectPublicKeyInfo(t)},this.setSubjectPublicKeyByGetKey=function(t){var e=Rr.getKey(t);this.asn1SubjPKey=new Cr.asn1.x509.SubjectPublicKeyInfo(e)},this.appendExtension=function(t){this.extensionsArray.push(t)},this.appendExtensionByName=function(t,e){if("basicconstraints"==t.toLowerCase()){var n=new Cr.asn1.x509.BasicConstraints(e);this.appendExtension(n)}else if("keyusage"==t.toLowerCase()){var n=new Cr.asn1.x509.KeyUsage(e);this.appendExtension(n)}else if("crldistributionpoints"==t.toLowerCase()){var n=new Cr.asn1.x509.CRLDistributionPoints(e);this.appendExtension(n)}else if("extkeyusage"==t.toLowerCase()){var n=new Cr.asn1.x509.ExtKeyUsage(e);this.appendExtension(n)}else{if("authoritykeyidentifier"!=t.toLowerCase())throw"unsupported extension name: "+t;var n=new Cr.asn1.x509.AuthorityKeyIdentifier(e);this.appendExtension(n)}},this.getEncodedHex=function(){if(null==this.asn1NotBefore||null==this.asn1NotAfter)throw"notBefore and/or notAfter not set";var t=new Cr.asn1.DERSequence({array:[this.asn1NotBefore,this.asn1NotAfter]});if(this.asn1Array=new Array,this.asn1Array.push(this.asn1Version),this.asn1Array.push(this.asn1SerialNumber),this.asn1Array.push(this.asn1SignatureAlg),this.asn1Array.push(this.asn1Issuer),this.asn1Array.push(t),this.asn1Array.push(this.asn1Subject),this.asn1Array.push(this.asn1SubjPKey),this.extensionsArray.length>0){var e=new Cr.asn1.DERSequence({array:this.extensionsArray}),n=new Cr.asn1.DERTaggedObject({explicit:!0,tag:"a3",obj:e});this.asn1Array.push(n)}var r=new Cr.asn1.DERSequence({array:this.asn1Array});return this.hTLV=r.getEncodedHex(),this.isModified=!1,this.hTLV},this._initialize()},sr.lang.extend(Cr.asn1.x509.TBSCertificate,Cr.asn1.ASN1Object),Cr.asn1.x509.Extension=function(t){Cr.asn1.x509.Extension.superclass.constructor.call(this);this.getEncodedHex=function(){var t=new Cr.asn1.DERObjectIdentifier({oid:this.oid}),e=new Cr.asn1.DEROctetString({hex:this.getExtnValueHex()}),n=new Array;n.push(t),this.critical&&n.push(new Cr.asn1.DERBoolean),n.push(e);var r=new Cr.asn1.DERSequence({array:n});return r.getEncodedHex()},this.critical=!1,"undefined"!=typeof t&&"undefined"!=typeof t.critical&&(this.critical=t.critical)},sr.lang.extend(Cr.asn1.x509.Extension,Cr.asn1.ASN1Object),Cr.asn1.x509.KeyUsage=function(t){Cr.asn1.x509.KeyUsage.superclass.constructor.call(this,t),this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.15","undefined"!=typeof t&&"undefined"!=typeof t.bin&&(this.asn1ExtnValue=new Cr.asn1.DERBitString(t))},sr.lang.extend(Cr.asn1.x509.KeyUsage,Cr.asn1.x509.Extension),Cr.asn1.x509.BasicConstraints=function(t){Cr.asn1.x509.BasicConstraints.superclass.constructor.call(this,t);this.getExtnValueHex=function(){var t=new Array;this.cA&&t.push(new Cr.asn1.DERBoolean),this.pathLen>-1&&t.push(new Cr.asn1.DERInteger({int:this.pathLen}));var e=new Cr.asn1.DERSequence({array:t});return this.asn1ExtnValue=e,this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.19",this.cA=!1,this.pathLen=-1,"undefined"!=typeof t&&("undefined"!=typeof t.cA&&(this.cA=t.cA),"undefined"!=typeof t.pathLen&&(this.pathLen=t.pathLen))},sr.lang.extend(Cr.asn1.x509.BasicConstraints,Cr.asn1.x509.Extension),Cr.asn1.x509.CRLDistributionPoints=function(t){Cr.asn1.x509.CRLDistributionPoints.superclass.constructor.call(this,t),this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.setByDPArray=function(t){this.asn1ExtnValue=new Cr.asn1.DERSequence({array:t})},this.setByOneURI=function(t){var e=new Cr.asn1.x509.GeneralNames([{uri:t}]),n=new Cr.asn1.x509.DistributionPointName(e),r=new Cr.asn1.x509.DistributionPoint({dpobj:n});this.setByDPArray([r])},this.oid="2.5.29.31","undefined"!=typeof t&&("undefined"!=typeof t.array?this.setByDPArray(t.array):"undefined"!=typeof t.uri&&this.setByOneURI(t.uri))},sr.lang.extend(Cr.asn1.x509.CRLDistributionPoints,Cr.asn1.x509.Extension),Cr.asn1.x509.ExtKeyUsage=function(t){Cr.asn1.x509.ExtKeyUsage.superclass.constructor.call(this,t),this.setPurposeArray=function(t){this.asn1ExtnValue=new Cr.asn1.DERSequence;for(var e=0;e<t.length;e++){var n=new Cr.asn1.DERObjectIdentifier(t[e]);this.asn1ExtnValue.appendASN1Object(n)}},this.getExtnValueHex=function(){return this.asn1ExtnValue.getEncodedHex()},this.oid="2.5.29.37","undefined"!=typeof t&&"undefined"!=typeof t.array&&this.setPurposeArray(t.array)},sr.lang.extend(Cr.asn1.x509.ExtKeyUsage,Cr.asn1.x509.Extension),Cr.asn1.x509.AuthorityKeyIdentifier=function(t){Cr.asn1.x509.AuthorityKeyIdentifier.superclass.constructor.call(this,t),this.asn1KID=null,this.asn1CertIssuer=null,this.asn1CertSN=null,this.getExtnValueHex=function(){var t=new Array;this.asn1KID&&t.push(new Cr.asn1.DERTaggedObject({explicit:!1,tag:"80",obj:this.asn1KID})),this.asn1CertIssuer&&t.push(new Cr.asn1.DERTaggedObject({explicit:!1,tag:"a1",obj:this.asn1CertIssuer})),this.asn1CertSN&&t.push(new Cr.asn1.DERTaggedObject({explicit:!1,tag:"82",obj:this.asn1CertSN}));var e=new Cr.asn1.DERSequence({array:t});return this.asn1ExtnValue=e,this.asn1ExtnValue.getEncodedHex()},this.setKIDByParam=function(t){this.asn1KID=new Cr.asn1.DEROctetString(t)},this.setCertIssuerByParam=function(t){this.asn1CertIssuer=new Cr.asn1.x509.X500Name(t)},this.setCertSNByParam=function(t){this.asn1CertSN=new Cr.asn1.DERInteger(t)},this.oid="2.5.29.35","undefined"!=typeof t&&("undefined"!=typeof t.kid&&this.setKIDByParam(t.kid),"undefined"!=typeof t.issuer&&this.setCertIssuerByParam(t.issuer),"undefined"!=typeof t.sn&&this.setCertSNByParam(t.sn))},sr.lang.extend(Cr.asn1.x509.AuthorityKeyIdentifier,Cr.asn1.x509.Extension),Cr.asn1.x509.CRL=function(t){Cr.asn1.x509.CRL.superclass.constructor.call(this);this.setRsaPrvKeyByPEMandPass=function(t,e){var n=Hr.getDecryptedKeyHex(t,e),r=new ve;r.readPrivateKeyFromASN1HexString(n),this.rsaPrvKey=r},this.sign=function(){this.asn1SignatureAlg=this.asn1TBSCertList.asn1SignatureAlg,sig=new Cr.crypto.Signature({alg:"SHA1withRSA",prov:"cryptojs/jsrsa"}),sig.initSign(this.rsaPrvKey),sig.updateHex(this.asn1TBSCertList.getEncodedHex()),this.hexSig=sig.sign(),this.asn1Sig=new Cr.asn1.DERBitString({hex:"00"+this.hexSig});var t=new Cr.asn1.DERSequence({array:[this.asn1TBSCertList,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=t.getEncodedHex(),this.isModified=!1},this.getEncodedHex=function(){if(0==this.isModified&&null!=this.hTLV)return this.hTLV;throw"not signed yet"},this.getPEMString=function(){var t=this.getEncodedHex(),e=or.enc.Hex.parse(t),n=or.enc.Base64.stringify(e),r=n.replace(/(.{64})/g,"$1\r\n");return"-----BEGIN X509 CRL-----\r\n"+r+"\r\n-----END X509 CRL-----\r\n"},"undefined"!=typeof t&&("undefined"!=typeof t.tbsobj&&(this.asn1TBSCertList=t.tbsobj),"undefined"!=typeof t.rsaprvkey&&(this.rsaPrvKey=t.rsaprvkey),"undefined"!=typeof t.rsaprvpem&&"undefined"!=typeof t.rsaprvpas&&this.setRsaPrvKeyByPEMandPass(t.rsaprvpem,t.rsaprvpas))},sr.lang.extend(Cr.asn1.x509.CRL,Cr.asn1.ASN1Object),Cr.asn1.x509.TBSCertList=function(t){Cr.asn1.x509.TBSCertList.superclass.constructor.call(this);this.setSignatureAlgByParam=function(t){this.asn1SignatureAlg=new Cr.asn1.x509.AlgorithmIdentifier(t)},this.setIssuerByParam=function(t){this.asn1Issuer=new Cr.asn1.x509.X500Name(t)},this.setThisUpdateByParam=function(t){this.asn1ThisUpdate=new Cr.asn1.x509.Time(t)},this.setNextUpdateByParam=function(t){this.asn1NextUpdate=new Cr.asn1.x509.Time(t)},this.addRevokedCert=function(t,e){var n={};void 0!=t&&null!=t&&(n.sn=t),void 0!=e&&null!=e&&(n.time=e);var r=new Cr.asn1.x509.CRLEntry(n);this.aRevokedCert.push(r)},this.getEncodedHex=function(){if(this.asn1Array=new Array,null!=this.asn1Version&&this.asn1Array.push(this.asn1Version),this.asn1Array.push(this.asn1SignatureAlg),this.asn1Array.push(this.asn1Issuer),this.asn1Array.push(this.asn1ThisUpdate),null!=this.asn1NextUpdate&&this.asn1Array.push(this.asn1NextUpdate),this.aRevokedCert.length>0){var t=new Cr.asn1.DERSequence({array:this.aRevokedCert});this.asn1Array.push(t)}var e=new Cr.asn1.DERSequence({array:this.asn1Array});return this.hTLV=e.getEncodedHex(),this.isModified=!1,this.hTLV},this._initialize=function(){this.asn1Version=null,this.asn1SignatureAlg=null,this.asn1Issuer=null,this.asn1ThisUpdate=null,this.asn1NextUpdate=null,this.aRevokedCert=new Array},this._initialize()},sr.lang.extend(Cr.asn1.x509.TBSCertList,Cr.asn1.ASN1Object),Cr.asn1.x509.CRLEntry=function(t){Cr.asn1.x509.CRLEntry.superclass.constructor.call(this);this.setCertSerial=function(t){this.sn=new Cr.asn1.DERInteger(t)},this.setRevocationDate=function(t){this.time=new Cr.asn1.x509.Time(t)},this.getEncodedHex=function(){var t=new Cr.asn1.DERSequence({array:[this.sn,this.time]});return this.TLV=t.getEncodedHex(),this.TLV},"undefined"!=typeof t&&("undefined"!=typeof t.time&&this.setRevocationDate(t.time),"undefined"!=typeof t.sn&&this.setCertSerial(t.sn))},sr.lang.extend(Cr.asn1.x509.CRLEntry,Cr.asn1.ASN1Object),Cr.asn1.x509.X500Name=function(t){if(Cr.asn1.x509.X500Name.superclass.constructor.call(this),this.asn1Array=new Array,this.setByString=function(t){var e=t.split("/");e.shift();for(var n=0;n<e.length;n++)this.asn1Array.push(new Cr.asn1.x509.RDN({str:e[n]}))},this.setByObject=function(t){for(var e in t)if(t.hasOwnProperty(e)){var n=new Cr.asn1.x509.RDN({str:e+"="+t[e]});this.asn1Array?this.asn1Array.push(n):this.asn1Array=[n]}},this.getEncodedHex=function(){if("string"==typeof this.hTLV)return this.hTLV;var t=new Cr.asn1.DERSequence({array:this.asn1Array});return this.hTLV=t.getEncodedHex(),this.hTLV},"undefined"!=typeof t){if("undefined"!=typeof t.str?this.setByString(t.str):"object"==typeof t&&this.setByObject(t),"undefined"!=typeof t.certissuer){var e=new $n;e.hex=$n.pemToHex(t.certissuer),this.hTLV=e.getIssuerHex()}if("undefined"!=typeof t.certsubject){var e=new $n;e.hex=$n.pemToHex(t.certsubject),this.hTLV=e.getSubjectHex()}}},sr.lang.extend(Cr.asn1.x509.X500Name,Cr.asn1.ASN1Object),Cr.asn1.x509.RDN=function(t){Cr.asn1.x509.RDN.superclass.constructor.call(this),this.asn1Array=new Array,this.addByString=function(t){this.asn1Array.push(new Cr.asn1.x509.AttributeTypeAndValue({str:t}))},this.getEncodedHex=function(){var t=new Cr.asn1.DERSet({array:this.asn1Array});return this.TLV=t.getEncodedHex(),this.TLV},"undefined"!=typeof t&&"undefined"!=typeof t.str&&this.addByString(t.str)},sr.lang.extend(Cr.asn1.x509.RDN,Cr.asn1.ASN1Object),Cr.asn1.x509.AttributeTypeAndValue=function(t){Cr.asn1.x509.AttributeTypeAndValue.superclass.constructor.call(this);var e="utf8";this.setByString=function(t){if(!t.match(/^([^=]+)=(.+)$/))throw"malformed attrTypeAndValueStr: "+t;this.setByAttrTypeAndValueStr(RegExp.$1,RegExp.$2)},this.setByAttrTypeAndValueStr=function(t,n){this.typeObj=Cr.asn1.x509.OID.atype2obj(t);var r=e;"C"==t&&(r="prn"),this.valueObj=this.getValueObj(r,n)},this.getValueObj=function(t,e){if("utf8"==t)return new Cr.asn1.DERUTF8String({str:e});if("prn"==t)return new Cr.asn1.DERPrintableString({str:e});if("tel"==t)return new Cr.asn1.DERTeletexString({str:e});if("ia5"==t)return new Cr.asn1.DERIA5String({str:e});throw"unsupported directory string type: type="+t+" value="+e},this.getEncodedHex=function(){var t=new Cr.asn1.DERSequence({array:[this.typeObj,this.valueObj]});return this.TLV=t.getEncodedHex(),this.TLV},"undefined"!=typeof t&&"undefined"!=typeof t.str&&this.setByString(t.str)},sr.lang.extend(Cr.asn1.x509.AttributeTypeAndValue,Cr.asn1.ASN1Object),Cr.asn1.x509.SubjectPublicKeyInfo=function(t){Cr.asn1.x509.SubjectPublicKeyInfo.superclass.constructor.call(this);this.setRSAKey=function(t){if(!ve.prototype.isPrototypeOf(t))throw"argument is not RSAKey instance";this.rsaKey=t;var e=new Cr.asn1.DERInteger({bigint:t.n}),n=new Cr.asn1.DERInteger({int:t.e}),r=new Cr.asn1.DERSequence({array:[e,n]}),i=r.getEncodedHex();this.asn1AlgId=new Cr.asn1.x509.AlgorithmIdentifier({name:"rsaEncryption"}),this.asn1SubjPKey=new Cr.asn1.DERBitString({hex:"00"+i})},this.setRSAPEM=function(t){if(!t.match(/-----BEGIN PUBLIC KEY-----/))throw"key not supported";var e=t;e=e.replace(/^-----[^-]+-----/,""),e=e.replace(/-----[^-]+-----\s*$/,"");var n=e.replace(/\s+/g,""),r=or.enc.Base64.parse(n),i=or.enc.Hex.stringify(r),s=Dn(i),o=s[1],a=o.substr(2),u=Dn(a),h=new ve;h.setPublic(u[0],u[1]),this.setRSAKey(h)},this.getASN1Object=function(){if(null==this.asn1AlgId||null==this.asn1SubjPKey)throw"algId and/or subjPubKey not set";var t=new Cr.asn1.DERSequence({array:[this.asn1AlgId,this.asn1SubjPKey]});return t},this.getEncodedHex=function(){var t=this.getASN1Object();return this.hTLV=t.getEncodedHex(),this.hTLV},this._setRSAKey=function(t){var e=Cr.asn1.ASN1Util.newObject({seq:[{int:{bigint:t.n}},{int:{int:t.e}}]}),n=e.getEncodedHex();this.asn1AlgId=new Cr.asn1.x509.AlgorithmIdentifier({name:"rsaEncryption"}),this.asn1SubjPKey=new Cr.asn1.DERBitString({hex:"00"+n})},this._setEC=function(t){var e=new Cr.asn1.DERObjectIdentifier({name:t.curveName});this.asn1AlgId=new Cr.asn1.x509.AlgorithmIdentifier({name:"ecPublicKey",asn1params:e}),this.asn1SubjPKey=new Cr.asn1.DERBitString({hex:"00"+t.pubKeyHex})},this._setDSA=function(t){var e=new Cr.asn1.ASN1Util.newObject({seq:[{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.g}}]});this.asn1AlgId=new Cr.asn1.x509.AlgorithmIdentifier({name:"dsa",asn1params:e});var n=new Cr.asn1.DERInteger({bigint:t.y});this.asn1SubjPKey=new Cr.asn1.DERBitString({hex:"00"+n.getEncodedHex()})},"undefined"!=typeof t&&("undefined"!=typeof ve&&t instanceof ve?this._setRSAKey(t):"undefined"!=typeof Cr.crypto.ECDSA&&t instanceof Cr.crypto.ECDSA?this._setEC(t):"undefined"!=typeof Cr.crypto.DSA&&t instanceof Cr.crypto.DSA?this._setDSA(t):"undefined"!=typeof t.rsakey?this.setRSAKey(t.rsakey):"undefined"!=typeof t.rsapem&&this.setRSAPEM(t.rsapem))},sr.lang.extend(Cr.asn1.x509.SubjectPublicKeyInfo,Cr.asn1.ASN1Object),Cr.asn1.x509.Time=function(t){Cr.asn1.x509.Time.superclass.constructor.call(this);this.setTimeParams=function(t){this.timeParams=t},this.getEncodedHex=function(){var t=null;return t=null!=this.timeParams?"utc"==this.type?new Cr.asn1.DERUTCTime(this.timeParams):new Cr.asn1.DERGeneralizedTime(this.timeParams):"utc"==this.type?new Cr.asn1.DERUTCTime:new Cr.asn1.DERGeneralizedTime,this.TLV=t.getEncodedHex(),this.TLV},this.type="utc","undefined"!=typeof t&&("undefined"!=typeof t.type?this.type=t.type:"undefined"!=typeof t.str&&(t.str.match(/^[0-9]{12}Z$/)&&(this.type="utc"),t.str.match(/^[0-9]{14}Z$/)&&(this.type="gen")),this.timeParams=t)},sr.lang.extend(Cr.asn1.x509.Time,Cr.asn1.ASN1Object),Cr.asn1.x509.AlgorithmIdentifier=function(t){Cr.asn1.x509.AlgorithmIdentifier.superclass.constructor.call(this);this.getEncodedHex=function(){if(null==this.nameAlg&&null==this.asn1Alg)throw"algorithm not specified";null!=this.nameAlg&&null==this.asn1Alg&&(this.asn1Alg=Cr.asn1.x509.OID.name2obj(this.nameAlg));var t=[this.asn1Alg];this.paramEmpty||t.push(this.asn1Params);var e=new Cr.asn1.DERSequence({array:t});return this.hTLV=e.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&("undefined"!=typeof t.name&&(this.nameAlg=t.name),"undefined"!=typeof t.asn1params&&(this.asn1Params=t.asn1params),"undefined"!=typeof t.paramempty&&(this.paramEmpty=t.paramempty)),null==this.asn1Params&&(this.asn1Params=new Cr.asn1.DERNull)},sr.lang.extend(Cr.asn1.x509.AlgorithmIdentifier,Cr.asn1.ASN1Object),Cr.asn1.x509.GeneralName=function(t){Cr.asn1.x509.GeneralName.superclass.constructor.call(this);var e={rfc822:"81",dns:"82",dn:"a4",uri:"86"};this.explicit=!1,this.setByParam=function(t){var n=null;if("undefined"!=typeof t){if("undefined"!=typeof t.rfc822&&(this.type="rfc822",n=new Cr.asn1.DERIA5String({str:t[this.type]})),"undefined"!=typeof t.dns&&(this.type="dns",n=new Cr.asn1.DERIA5String({str:t[this.type]})),"undefined"!=typeof t.uri&&(this.type="uri",n=new Cr.asn1.DERIA5String({str:t[this.type]})),"undefined"!=typeof t.certissuer){this.type="dn",this.explicit=!0;var r=t.certissuer,i=null;if(r.match(/^[0-9A-Fa-f]+$/),r.indexOf("-----BEGIN ")!=-1&&(i=$n.pemToHex(r)),null==i)throw"certissuer param not cert";var s=new $n;s.hex=i;var o=s.getIssuerHex();n=new Cr.asn1.ASN1Object,n.hTLV=o}if("undefined"!=typeof t.certsubj){this.type="dn",this.explicit=!0;var r=t.certsubj,i=null;if(r.match(/^[0-9A-Fa-f]+$/),r.indexOf("-----BEGIN ")!=-1&&(i=$n.pemToHex(r)),null==i)throw"certsubj param not cert";var s=new $n;s.hex=i;var o=s.getSubjectHex();n=new Cr.asn1.ASN1Object,n.hTLV=o}if(null==this.type)throw"unsupported type in params="+t;this.asn1Obj=new Cr.asn1.DERTaggedObject({explicit:this.explicit,tag:e[this.type],obj:n})}},this.getEncodedHex=function(){return this.asn1Obj.getEncodedHex()},"undefined"!=typeof t&&this.setByParam(t)},sr.lang.extend(Cr.asn1.x509.GeneralName,Cr.asn1.ASN1Object),Cr.asn1.x509.GeneralNames=function(t){Cr.asn1.x509.GeneralNames.superclass.constructor.call(this);this.setByParamArray=function(t){for(var e=0;e<t.length;e++){var n=new Cr.asn1.x509.GeneralName(t[e]);this.asn1Array.push(n)}},this.getEncodedHex=function(){var t=new Cr.asn1.DERSequence({array:this.asn1Array});return t.getEncodedHex()},this.asn1Array=new Array,"undefined"!=typeof t&&this.setByParamArray(t)},sr.lang.extend(Cr.asn1.x509.GeneralNames,Cr.asn1.ASN1Object),Cr.asn1.x509.DistributionPointName=function(t){Cr.asn1.x509.DistributionPointName.superclass.constructor.call(this);if(this.getEncodedHex=function(){if("full"!=this.type)throw"currently type shall be 'full': "+this.type;return this.asn1Obj=new Cr.asn1.DERTaggedObject({explicit:!1,tag:this.tag,obj:this.asn1V}),this.hTLV=this.asn1Obj.getEncodedHex(),this.hTLV},"undefined"!=typeof t){if(!Cr.asn1.x509.GeneralNames.prototype.isPrototypeOf(t))throw"This class supports GeneralNames only as argument";this.type="full",this.tag="a0",this.asn1V=t}},sr.lang.extend(Cr.asn1.x509.DistributionPointName,Cr.asn1.ASN1Object),Cr.asn1.x509.DistributionPoint=function(t){Cr.asn1.x509.DistributionPoint.superclass.constructor.call(this);this.getEncodedHex=function(){var t=new Cr.asn1.DERSequence;if(null!=this.asn1DP){var e=new Cr.asn1.DERTaggedObject({explicit:!0,tag:"a0",obj:this.asn1DP});t.appendASN1Object(e)}return this.hTLV=t.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&"undefined"!=typeof t.dpobj&&(this.asn1DP=t.dpobj)},sr.lang.extend(Cr.asn1.x509.DistributionPoint,Cr.asn1.ASN1Object),Cr.asn1.x509.OID=new function(t){this.atype2oidList={C:"2.5.4.6",O:"2.5.4.10",OU:"2.5.4.11",ST:"2.5.4.8",L:"2.5.4.7",CN:"2.5.4.3",SN:"2.5.4.4",DN:"2.5.4.49",DC:"0.9.2342.19200300.100.1.25"},this.name2oidList={sha1:"1.3.14.3.2.26",sha256:"2.16.840.1.101.3.4.2.1",sha384:"2.16.840.1.101.3.4.2.2",sha512:"2.16.840.1.101.3.4.2.3",sha224:"2.16.840.1.101.3.4.2.4",md5:"1.2.840.113549.2.5",md2:"1.3.14.7.2.2.1",ripemd160:"1.3.36.3.2.1",MD2withRSA:"1.2.840.113549.1.1.2",MD4withRSA:"1.2.840.113549.1.1.3",MD5withRSA:"1.2.840.113549.1.1.4",SHA1withRSA:"1.2.840.113549.1.1.5",SHA224withRSA:"1.2.840.113549.1.1.14",SHA256withRSA:"1.2.840.113549.1.1.11",SHA384withRSA:"1.2.840.113549.1.1.12",SHA512withRSA:"1.2.840.113549.1.1.13",SHA1withECDSA:"1.2.840.10045.4.1",SHA224withECDSA:"1.2.840.10045.4.3.1",SHA256withECDSA:"1.2.840.10045.4.3.2",SHA384withECDSA:"1.2.840.10045.4.3.3",SHA512withECDSA:"1.2.840.10045.4.3.4",dsa:"1.2.840.10040.4.1",SHA1withDSA:"1.2.840.10040.4.3",SHA224withDSA:"2.16.840.1.101.3.4.3.1",SHA256withDSA:"2.16.840.1.101.3.4.3.2",rsaEncryption:"1.2.840.113549.1.1.1",countryName:"2.5.4.6",organization:"2.5.4.10",organizationalUnit:"2.5.4.11",stateOrProvinceName:"2.5.4.8",locality:"2.5.4.7",commonName:"2.5.4.3",subjectKeyIdentifier:"2.5.29.14",keyUsage:"2.5.29.15",subjectAltName:"2.5.29.17",basicConstraints:"2.5.29.19",nameConstraints:"2.5.29.30",cRLDistributionPoints:"2.5.29.31",certificatePolicies:"2.5.29.32",authorityKeyIdentifier:"2.5.29.35",policyConstraints:"2.5.29.36",extKeyUsage:"2.5.29.37",authorityInfoAccess:"1.3.6.1.5.5.7.1.1",anyExtendedKeyUsage:"2.5.29.37.0",serverAuth:"1.3.6.1.5.5.7.3.1",clientAuth:"1.3.6.1.5.5.7.3.2",codeSigning:"1.3.6.1.5.5.7.3.3",emailProtection:"1.3.6.1.5.5.7.3.4",timeStamping:"1.3.6.1.5.5.7.3.8",ocspSigning:"1.3.6.1.5.5.7.3.9",ecPublicKey:"1.2.840.10045.2.1",secp256r1:"1.2.840.10045.3.1.7",secp256k1:"1.3.132.0.10",secp384r1:"1.3.132.0.34",pkcs5PBES2:"1.2.840.113549.1.5.13",pkcs5PBKDF2:"1.2.840.113549.1.5.12","des-EDE3-CBC":"1.2.840.113549.3.7",data:"1.2.840.113549.1.7.1","signed-data":"1.2.840.113549.1.7.2","enveloped-data":"1.2.840.113549.1.7.3","digested-data":"1.2.840.113549.1.7.5","encrypted-data":"1.2.840.113549.1.7.6","authenticated-data":"1.2.840.113549.1.9.16.1.2",tstinfo:"1.2.840.113549.1.9.16.1.4"},this.objCache={},this.name2obj=function(t){if("undefined"!=typeof this.objCache[t])return this.objCache[t];if("undefined"==typeof this.name2oidList[t])throw"Name of ObjectIdentifier not defined: "+t;var e=this.name2oidList[t],n=new Cr.asn1.DERObjectIdentifier({oid:e});return this.objCache[t]=n,n},this.atype2obj=function(t){if("undefined"!=typeof this.objCache[t])return this.objCache[t];if("undefined"==typeof this.atype2oidList[t])throw"AttributeType name undefined: "+t;var e=this.atype2oidList[t],n=new Cr.asn1.DERObjectIdentifier({oid:e});return this.objCache[t]=n,n}},Cr.asn1.x509.OID.oid2name=function(t){var e=Cr.asn1.x509.OID.name2oidList;for(var n in e)if(e[n]==t)return n;return""},Cr.asn1.x509.OID.name2oid=function(t){var e=Cr.asn1.x509.OID.name2oidList;return void 0===e[t]?"":e[t]},Cr.asn1.x509.X509Util=new function(){this.getPKCS8PubKeyPEMfromRSAKey=function(t){var e=null,n=Cr.asn1.ASN1Util.bigIntToMinTwosComplementsHex(t.n),r=Cr.asn1.ASN1Util.integerToByteHex(t.e),i=new Cr.asn1.DERInteger({hex:n}),s=new Cr.asn1.DERInteger({hex:r}),o=new Cr.asn1.DERSequence({array:[i,s]}),a=o.getEncodedHex(),u=new Cr.asn1.x509.AlgorithmIdentifier({name:"rsaEncryption"}),h=new Cr.asn1.DERBitString({hex:"00"+a}),c=new Cr.asn1.DERSequence({array:[u,h]}),f=c.getEncodedHex(),e=Cr.asn1.ASN1Util.getPEMStringFromHex(f,"PUBLIC KEY");return e}},Cr.asn1.x509.X509Util.newCertPEM=function(t){var e=Cr.asn1.x509,n=new e.TBSCertificate;if(void 0===t.serial)throw"serial number undefined.";if(n.setSerialNumberByParam(t.serial),"string"!=typeof t.sigalg.name)throw"unproper signature algorithm name";if(n.setSignatureAlgByParam(t.sigalg),void 0===t.issuer)throw"issuer name undefined.";if(n.setIssuerByParam(t.issuer),void 0===t.notbefore)throw"notbefore undefined.";if(n.setNotBeforeByParam(t.notbefore),void 0===t.notafter)throw"notafter undefined.";if(n.setNotAfterByParam(t.notafter),void 0===t.subject)throw"subject name undefined.";if(n.setSubjectByParam(t.subject),void 0===t.sbjpubkey)throw"subject public key undefined.";if(n.setSubjectPublicKeyByGetKey(t.sbjpubkey),void 0!==t.ext&&void 0!==t.ext.length)for(var r=0;r<t.ext.length;r++)for(key in t.ext[r])n.appendExtensionByName(key,t.ext[r][key]);if(void 0===t.cakey&&void 0===t.sighex)throw"param cakey and sighex undefined.";var i=null,s=null;return t.cakey&&(i=Rr.getKey.apply(null,t.cakey),s=new e.Certificate({tbscertobj:n,prvkeyobj:i}),s.sign()),t.sighex&&(s=new e.Certificate({tbscertobj:n}),s.setSignatureHex(t.sighex)),s.getPEMString()},/*! asn1cms-1.0.2.js (c) 2013-2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.asn1&&Cr.asn1||(Cr.asn1={}),"undefined"!=typeof Cr.asn1.cms&&Cr.asn1.cms||(Cr.asn1.cms={}),Cr.asn1.cms.Attribute=function(t){Cr.asn1.cms.Attribute.superclass.constructor.call(this);this.getEncodedHex=function(){var t,e,n;t=new Cr.asn1.DERObjectIdentifier({oid:this.attrTypeOid}),e=new Cr.asn1.DERSet({array:this.valueList});try{e.getEncodedHex()}catch(t){throw"fail valueSet.getEncodedHex in Attribute(1)/"+t}n=new Cr.asn1.DERSequence({array:[t,e]});try{this.hTLV=n.getEncodedHex()}catch(t){throw"failed seq.getEncodedHex in Attribute(2)/"+t}return this.hTLV}},sr.lang.extend(Cr.asn1.cms.Attribute,Cr.asn1.ASN1Object),Cr.asn1.cms.ContentType=function(t){Cr.asn1.cms.ContentType.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.3";var e=null;if("undefined"!=typeof t){var e=new Cr.asn1.DERObjectIdentifier(t);this.valueList=[e]}},sr.lang.extend(Cr.asn1.cms.ContentType,Cr.asn1.cms.Attribute),Cr.asn1.cms.MessageDigest=function(t){if(Cr.asn1.cms.MessageDigest.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.4","undefined"!=typeof t)if(t.eciObj instanceof Cr.asn1.cms.EncapsulatedContentInfo&&"string"==typeof t.hashAlg){var e=t.eciObj.eContentValueHex,n=t.hashAlg,r=Cr.crypto.Util.hashHex(e,n),i=new Cr.asn1.DEROctetString({hex:r});i.getEncodedHex(),this.valueList=[i]}else{var i=new Cr.asn1.DEROctetString(t);i.getEncodedHex(),this.valueList=[i]}},sr.lang.extend(Cr.asn1.cms.MessageDigest,Cr.asn1.cms.Attribute),Cr.asn1.cms.SigningTime=function(t){if(Cr.asn1.cms.SigningTime.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.5","undefined"!=typeof t){var e=new Cr.asn1.x509.Time(t);try{e.getEncodedHex()}catch(t){throw"SigningTime.getEncodedHex() failed/"+t}this.valueList=[e]}},sr.lang.extend(Cr.asn1.cms.SigningTime,Cr.asn1.cms.Attribute),Cr.asn1.cms.SigningCertificate=function(t){Cr.asn1.cms.SigningCertificate.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.16.2.12";var e=Cr.asn1,n=Cr.asn1.cms,r=Cr.crypto;this.setCerts=function(t){for(var i=[],s=0;s<t.length;s++){var o=Rr.getHexFromPEM(t[s]),a=r.Util.hashHex(o,"sha1"),u=new e.DEROctetString({hex:a});u.getEncodedHex();var h=new n.IssuerAndSerialNumber({cert:t[s]});h.getEncodedHex();var c=new e.DERSequence({array:[u,h]});c.getEncodedHex(),i.push(c)}var f=new e.DERSequence({array:i});f.getEncodedHex(),this.valueList=[f]},"undefined"!=typeof t&&"object"==typeof t.array&&this.setCerts(t.array)},sr.lang.extend(Cr.asn1.cms.SigningCertificate,Cr.asn1.cms.Attribute),Cr.asn1.cms.SigningCertificateV2=function(t){Cr.asn1.cms.SigningCertificateV2.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.16.2.47";var e=Cr.asn1,n=Cr.asn1.x509,r=Cr.asn1.cms,i=Cr.crypto;if(this.setCerts=function(t,s){for(var o=[],a=0;a<t.length;a++){var u=Rr.getHexFromPEM(t[a]),h=[];"sha256"!=s&&h.push(new n.AlgorithmIdentifier({name:s}));var c=i.Util.hashHex(u,s),f=new e.DEROctetString({hex:c});f.getEncodedHex(),h.push(f);var l=new r.IssuerAndSerialNumber({cert:t[a]});l.getEncodedHex(),h.push(l);var d=new e.DERSequence({array:h});d.getEncodedHex(),o.push(d)}var g=new e.DERSequence({array:o});g.getEncodedHex(),this.valueList=[g]},"undefined"!=typeof t&&"object"==typeof t.array){var s="sha256";"string"==typeof t.hashAlg&&(s=t.hashAlg),this.setCerts(t.array,s)}},sr.lang.extend(Cr.asn1.cms.SigningCertificateV2,Cr.asn1.cms.Attribute),Cr.asn1.cms.IssuerAndSerialNumber=function(t){Cr.asn1.cms.IssuerAndSerialNumber.superclass.constructor.call(this);var e=Cr.asn1,n=e.x509;this.setByCertPEM=function(t){var r=Rr.getHexFromPEM(t),i=new $n;i.hex=r;var s=i.getIssuerHex();this.dIssuer=new n.X500Name,this.dIssuer.hTLV=s;var o=i.getSerialNumberHex();this.dSerial=new e.DERInteger({hex:o})},this.getEncodedHex=function(){var t=new Cr.asn1.DERSequence({array:[this.dIssuer,this.dSerial]});return this.hTLV=t.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&("string"==typeof t&&t.indexOf("-----BEGIN ")!=-1&&this.setByCertPEM(t),t.issuer&&t.serial&&(t.issuer instanceof Cr.asn1.x509.X500Name?this.dIssuer=t.issuer:this.dIssuer=new Cr.asn1.x509.X500Name(t.issuer),t.serial instanceof Cr.asn1.DERInteger?this.dSerial=t.serial:this.dSerial=new Cr.asn1.DERInteger(t.serial)),"string"==typeof t.cert&&this.setByCertPEM(t.cert))},sr.lang.extend(Cr.asn1.cms.IssuerAndSerialNumber,Cr.asn1.ASN1Object),Cr.asn1.cms.AttributeList=function(t){Cr.asn1.cms.AttributeList.superclass.constructor.call(this),this.list=new Array,this.sortFlag=!0,this.add=function(t){t instanceof Cr.asn1.cms.Attribute&&this.list.push(t)},this.length=function(){return this.list.length},this.clear=function(){this.list=new Array,this.hTLV=null,this.hV=null},this.getEncodedHex=function(){if("string"==typeof this.hTLV)return this.hTLV;var t=new Cr.asn1.DERSet({array:this.list,sortflag:this.sortFlag});return this.hTLV=t.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&"undefined"!=typeof t.sortflag&&0==t.sortflag&&(this.sortFlag=!1)},sr.lang.extend(Cr.asn1.cms.AttributeList,Cr.asn1.ASN1Object),Cr.asn1.cms.SignerInfo=function(t){Cr.asn1.cms.SignerInfo.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.cms,r=Cr.asn1.x509;this.dCMSVersion=new e.DERInteger({int:1}),this.dSignerIdentifier=null,this.dDigestAlgorithm=null,this.dSignedAttrs=new n.AttributeList,this.dSigAlg=null,this.dSig=null,this.dUnsignedAttrs=new n.AttributeList,this.setSignerIdentifier=function(t){if("string"==typeof t&&t.indexOf("CERTIFICATE")!=-1&&t.indexOf("BEGIN")!=-1&&t.indexOf("END")!=-1){this.dSignerIdentifier=new n.IssuerAndSerialNumber({cert:t})}},this.setForContentAndHash=function(t){"undefined"!=typeof t&&(t.eciObj instanceof Cr.asn1.cms.EncapsulatedContentInfo&&(this.dSignedAttrs.add(new n.ContentType({oid:"1.2.840.113549.1.7.1"})),this.dSignedAttrs.add(new n.MessageDigest({eciObj:t.eciObj,hashAlg:t.hashAlg}))),"undefined"!=typeof t.sdObj&&t.sdObj instanceof Cr.asn1.cms.SignedData&&t.sdObj.digestAlgNameList.join(":").indexOf(t.hashAlg)==-1&&t.sdObj.digestAlgNameList.push(t.hashAlg),"string"==typeof t.hashAlg&&(this.dDigestAlgorithm=new r.AlgorithmIdentifier({name:t.hashAlg})))},this.sign=function(t,n){this.dSigAlg=new r.AlgorithmIdentifier({name:n});var i=this.dSignedAttrs.getEncodedHex(),s=Rr.getKey(t),o=new Cr.crypto.Signature({alg:n});o.init(s),o.updateHex(i);var a=o.sign();this.dSig=new e.DEROctetString({hex:a})},this.addUnsigned=function(t){this.hTLV=null,this.dUnsignedAttrs.hTLV=null,this.dUnsignedAttrs.add(t)},this.getEncodedHex=function(){if(this.dSignedAttrs instanceof Cr.asn1.cms.AttributeList&&0==this.dSignedAttrs.length())throw"SignedAttrs length = 0 (empty)";var t=new e.DERTaggedObject({obj:this.dSignedAttrs,tag:"a0",explicit:!1}),n=null;this.dUnsignedAttrs.length()>0&&(n=new e.DERTaggedObject({obj:this.dUnsignedAttrs,tag:"a1",explicit:!1}));var r=[this.dCMSVersion,this.dSignerIdentifier,this.dDigestAlgorithm,t,this.dSigAlg,this.dSig];null!=n&&r.push(n);var i=new e.DERSequence({array:r});return this.hTLV=i.getEncodedHex(),this.hTLV}},sr.lang.extend(Cr.asn1.cms.SignerInfo,Cr.asn1.ASN1Object),Cr.asn1.cms.EncapsulatedContentInfo=function(t){Cr.asn1.cms.EncapsulatedContentInfo.superclass.constructor.call(this);var e=Cr.asn1;Cr.asn1.cms,Cr.asn1.x509;this.dEContentType=new e.DERObjectIdentifier({name:"data"}),this.dEContent=null,this.isDetached=!1,this.eContentValueHex=null,this.setContentType=function(t){t.match(/^[0-2][.][0-9.]+$/)?this.dEContentType=new e.DERObjectIdentifier({oid:t}):this.dEContentType=new e.DERObjectIdentifier({name:t})},this.setContentValue=function(t){"undefined"!=typeof t&&("string"==typeof t.hex?this.eContentValueHex=t.hex:"string"==typeof t.str&&(this.eContentValueHex=mn(t.str)))},this.setContentValueHex=function(t){this.eContentValueHex=t},this.setContentValueStr=function(t){this.eContentValueHex=mn(t)},this.getEncodedHex=function(){if("string"!=typeof this.eContentValueHex)throw"eContentValue not yet set";var t=new e.DEROctetString({hex:this.eContentValueHex});this.dEContent=new e.DERTaggedObject({obj:t,tag:"a0",explicit:!0});var n=[this.dEContentType];this.isDetached||n.push(this.dEContent);var r=new e.DERSequence({array:n});return this.hTLV=r.getEncodedHex(),this.hTLV}},sr.lang.extend(Cr.asn1.cms.EncapsulatedContentInfo,Cr.asn1.ASN1Object),Cr.asn1.cms.ContentInfo=function(t){Cr.asn1.cms.ContentInfo.superclass.constructor.call(this);var e=Cr.asn1,n=(Cr.asn1.cms,Cr.asn1.x509);this.dContentType=null,this.dContent=null,this.setContentType=function(t){"string"==typeof t&&(this.dContentType=n.OID.name2obj(t))},this.getEncodedHex=function(){var t=new e.DERTaggedObject({obj:this.dContent,tag:"a0",explicit:!0}),n=new e.DERSequence({array:[this.dContentType,t]});return this.hTLV=n.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&(t.type&&this.setContentType(t.type),t.obj&&t.obj instanceof e.ASN1Object&&(this.dContent=t.obj))},sr.lang.extend(Cr.asn1.cms.ContentInfo,Cr.asn1.ASN1Object),Cr.asn1.cms.SignedData=function(t){Cr.asn1.cms.SignedData.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.cms,r=Cr.asn1.x509;this.dCMSVersion=new e.DERInteger({int:1}),this.dDigestAlgs=null,this.digestAlgNameList=[],this.dEncapContentInfo=new n.EncapsulatedContentInfo,this.dCerts=null,this.certificateList=[],this.crlList=[],this.signerInfoList=[new n.SignerInfo],this.addCertificatesByPEM=function(t){var n=Rr.getHexFromPEM(t),r=new e.ASN1Object;r.hTLV=n,this.certificateList.push(r)},this.getEncodedHex=function(){if("string"==typeof this.hTLV)return this.hTLV;if(null==this.dDigestAlgs){for(var t=[],n=0;n<this.digestAlgNameList.length;n++){var i=this.digestAlgNameList[n],s=new r.AlgorithmIdentifier({name:i});t.push(s)}this.dDigestAlgs=new e.DERSet({array:t})}var o=[this.dCMSVersion,this.dDigestAlgs,this.dEncapContentInfo];if(null==this.dCerts&&this.certificateList.length>0){var a=new e.DERSet({array:this.certificateList});this.dCerts=new e.DERTaggedObject({obj:a,tag:"a0",explicit:!1})}null!=this.dCerts&&o.push(this.dCerts);var u=new e.DERSet({array:this.signerInfoList});o.push(u);var h=new e.DERSequence({array:o});return this.hTLV=h.getEncodedHex(),this.hTLV},this.getContentInfo=function(){this.getEncodedHex();var t=new n.ContentInfo({type:"signed-data",obj:this});return t},this.getContentInfoEncodedHex=function(){var t=this.getContentInfo(),e=t.getEncodedHex();return e},this.getPEM=function(){var t=this.getContentInfoEncodedHex(),n=e.ASN1Util.getPEMStringFromHex(t,"CMS");return n}},sr.lang.extend(Cr.asn1.cms.SignedData,Cr.asn1.ASN1Object),Cr.asn1.cms.CMSUtil=new function(){},Cr.asn1.cms.CMSUtil.newSignedData=function(t){var e=Cr.asn1.cms,n=Cr.asn1.cades,r=new e.SignedData;if(r.dEncapContentInfo.setContentValue(t.content),"object"==typeof t.certs)for(var i=0;i<t.certs.length;i++)r.addCertificatesByPEM(t.certs[i]);r.signerInfoList=[];for(var i=0;i<t.signerInfos.length;i++){var s=t.signerInfos[i],o=new e.SignerInfo;o.setSignerIdentifier(s.signerCert),o.setForContentAndHash({sdObj:r,eciObj:r.dEncapContentInfo,hashAlg:s.hashAlg});for(attrName in s.sAttr){var a=s.sAttr[attrName];if("SigningTime"==attrName){var u=new e.SigningTime(a);o.dSignedAttrs.add(u)}if("SigningCertificate"==attrName){var u=new e.SigningCertificate(a);o.dSignedAttrs.add(u)}if("SigningCertificateV2"==attrName){var u=new e.SigningCertificateV2(a);o.dSignedAttrs.add(u)}if("SignaturePolicyIdentifier"==attrName){var u=new n.SignaturePolicyIdentifier(a);o.dSignedAttrs.add(u)}}o.sign(s.signerPrvKey,s.sigAlg),r.signerInfoList.push(o)}return r},/*! asn1tsp-1.0.1.js (c) 2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.asn1&&Cr.asn1||(Cr.asn1={}),"undefined"!=typeof Cr.asn1.tsp&&Cr.asn1.tsp||(Cr.asn1.tsp={}),Cr.asn1.tsp.Accuracy=function(t){Cr.asn1.tsp.Accuracy.superclass.constructor.call(this);var e=Cr.asn1;this.seconds=null,this.millis=null,this.micros=null,this.getEncodedHex=function(){var t=null,n=null,r=null,i=[];if(null!=this.seconds&&(t=new e.DERInteger({int:this.seconds}),i.push(t)),null!=this.millis){var s=new e.DERInteger({int:this.millis});n=new e.DERTaggedObject({obj:s,tag:"80",explicit:!1}),i.push(n)}if(null!=this.micros){var o=new e.DERInteger({int:this.micros});r=new e.DERTaggedObject({obj:o,tag:"81",explicit:!1}),i.push(r)}var a=new e.DERSequence({array:i});return this.hTLV=a.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&("number"==typeof t.seconds&&(this.seconds=t.seconds),"number"==typeof t.millis&&(this.millis=t.millis),"number"==typeof t.micros&&(this.micros=t.micros))},sr.lang.extend(Cr.asn1.tsp.Accuracy,Cr.asn1.ASN1Object),Cr.asn1.tsp.MessageImprint=function(t){Cr.asn1.tsp.MessageImprint.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.x509;this.dHashAlg=null,this.dHashValue=null,this.getEncodedHex=function(){if("string"==typeof this.hTLV)return this.hTLV;var t=new e.DERSequence({array:[this.dHashAlg,this.dHashValue]});return t.getEncodedHex()},"undefined"!=typeof t&&("string"==typeof t.hashAlg&&(this.dHashAlg=new n.AlgorithmIdentifier({name:t.hashAlg})),"string"==typeof t.hashValue&&(this.dHashValue=new e.DEROctetString({hex:t.hashValue})))},sr.lang.extend(Cr.asn1.tsp.MessageImprint,Cr.asn1.ASN1Object),Cr.asn1.tsp.TimeStampReq=function(t){Cr.asn1.tsp.TimeStampReq.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.tsp;this.dVersion=new e.DERInteger({int:1}),this.dMessageImprint=null,this.dPolicy=null,this.dNonce=null,this.certReq=!0,this.setMessageImprint=function(t){return t instanceof Cr.asn1.tsp.MessageImprint?void(this.dMessageImprint=t):void("object"==typeof t&&(this.dMessageImprint=new n.MessageImprint(t)))},this.getEncodedHex=function(){if(null==this.dMessageImprint)throw"messageImprint shall be specified";var t=[this.dVersion,this.dMessageImprint];null!=this.dPolicy&&t.push(this.dPolicy),null!=this.dNonce&&t.push(this.dNonce),this.certReq&&t.push(new e.DERBoolean);var n=new e.DERSequence({array:t});return this.hTLV=n.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&("object"==typeof t.mi&&this.setMessageImprint(t.mi),"object"==typeof t.policy&&(this.dPolicy=new e.DERObjectIdentifier(t.policy)),"object"==typeof t.nonce&&(this.dNonce=new e.DERInteger(t.nonce)),"boolean"==typeof t.certreq&&(this.certReq=t.certreq))},sr.lang.extend(Cr.asn1.tsp.TimeStampReq,Cr.asn1.ASN1Object),Cr.asn1.tsp.TSTInfo=function(t){Cr.asn1.tsp.TSTInfo.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.x509,r=Cr.asn1.tsp;if(this.dVersion=new e.DERInteger({int:1}),this.dPolicy=null,this.dMessageImprint=null,this.dSerialNumber=null,this.dGenTime=null,this.dAccuracy=null,this.dOrdering=null,this.dNonce=null,this.dTsa=null,this.getEncodedHex=function(){var t=[this.dVersion];if(null==this.dPolicy)throw"policy shall be specified.";if(t.push(this.dPolicy),null==this.dMessageImprint)throw"messageImprint shall be specified.";if(t.push(this.dMessageImprint),null==this.dSerialNumber)throw"serialNumber shall be specified.";if(t.push(this.dSerialNumber),null==this.dGenTime)throw"genTime shall be specified.";t.push(this.dGenTime),null!=this.dAccuracy&&t.push(this.dAccuracy),null!=this.dOrdering&&t.push(this.dOrdering),null!=this.dNonce&&t.push(this.dNonce),null!=this.dTsa&&t.push(this.dTsa);var n=new e.DERSequence({array:t});return this.hTLV=n.getEncodedHex(),this.hTLV},"undefined"!=typeof t){if("string"==typeof t.policy){if(!t.policy.match(/^[0-9.]+$/))throw"policy shall be oid like 0.1.4.134";this.dPolicy=new e.DERObjectIdentifier({oid:t.policy})}"undefined"!=typeof t.messageImprint&&(this.dMessageImprint=new r.MessageImprint(t.messageImprint)),"undefined"!=typeof t.serialNumber&&(this.dSerialNumber=new e.DERInteger(t.serialNumber)),"undefined"!=typeof t.genTime&&(this.dGenTime=new e.DERGeneralizedTime(t.genTime)),"undefind"!=typeof t.accuracy&&(this.dAccuracy=new r.Accuracy(t.accuracy)),"undefined"!=typeof t.ordering&&1==t.ordering&&(this.dOrdering=new e.DERBoolean),"undefined"!=typeof t.nonce&&(this.dNonce=new e.DERInteger(t.nonce)),"undefined"!=typeof t.tsa&&(this.dTsa=new n.X500Name(t.tsa))}},sr.lang.extend(Cr.asn1.tsp.TSTInfo,Cr.asn1.ASN1Object),Cr.asn1.tsp.TimeStampResp=function(t){Cr.asn1.tsp.TimeStampResp.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.tsp;this.dStatus=null,this.dTST=null,this.getEncodedHex=function(){if(null==this.dStatus)throw"status shall be specified";var t=[this.dStatus];null!=this.dTST&&t.push(this.dTST);var n=new e.DERSequence({array:t});return this.hTLV=n.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&("object"==typeof t.status&&(this.dStatus=new n.PKIStatusInfo(t.status)),"undefined"!=typeof t.tst&&t.tst instanceof Cr.asn1.ASN1Object&&(this.dTST=t.tst.getContentInfo()))},sr.lang.extend(Cr.asn1.tsp.TimeStampResp,Cr.asn1.ASN1Object),Cr.asn1.tsp.PKIStatusInfo=function(t){Cr.asn1.tsp.PKIStatusInfo.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.tsp;this.dStatus=null,this.dStatusString=null,this.dFailureInfo=null,this.getEncodedHex=function(){if(null==this.dStatus)throw"status shall be specified";var t=[this.dStatus];null!=this.dStatusString&&t.push(this.dStatusString),null!=this.dFailureInfo&&t.push(this.dFailureInfo);var n=new e.DERSequence({array:t});return this.hTLV=n.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&("object"==typeof t.status&&(this.dStatus=new n.PKIStatus(t.status)),"object"==typeof t.statstr&&(this.dStatusString=new n.PKIFreeText({array:t.statstr})),"object"==typeof t.failinfo&&(this.dFailureInfo=new n.PKIFailureInfo(t.failinfo)))},sr.lang.extend(Cr.asn1.tsp.PKIStatusInfo,Cr.asn1.ASN1Object),Cr.asn1.tsp.PKIStatus=function(t){Cr.asn1.tsp.PKIStatus.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.tsp;if(this.getEncodedHex=function(){return this.hTLV=this.dStatus.getEncodedHex(),this.hTLV},"undefined"!=typeof t)if("undefined"!=typeof t.name){var r=n.PKIStatus.valueList;if("undefined"==typeof r[t.name])throw"name undefined: "+t.name;this.dStatus=new e.DERInteger({int:r[t.name]})}else this.dStatus=new e.DERInteger(t)},sr.lang.extend(Cr.asn1.tsp.PKIStatus,Cr.asn1.ASN1Object),Cr.asn1.tsp.PKIStatus.valueList={granted:0,grantedWithMods:1,rejection:2,waiting:3,revocationWarning:4,revocationNotification:5},Cr.asn1.tsp.PKIFreeText=function(t){Cr.asn1.tsp.PKIFreeText.superclass.constructor.call(this);var e=Cr.asn1;this.textList=[],this.getEncodedHex=function(){for(var t=[],n=0;n<this.textList.length;n++)t.push(new e.DERUTF8String({str:this.textList[n]}));var r=new e.DERSequence({array:t});return this.hTLV=r.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&"object"==typeof t.array&&(this.textList=t.array)},sr.lang.extend(Cr.asn1.tsp.PKIFreeText,Cr.asn1.ASN1Object),Cr.asn1.tsp.PKIFailureInfo=function(t){Cr.asn1.tsp.PKIFailureInfo.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.tsp;if(this.value=null,this.getEncodedHex=function(){if(null==this.value)throw"value shall be specified";var t=new Number(this.value).toString(2),n=new e.DERBitString;return n.setByBinaryString(t),this.hTLV=n.getEncodedHex(),this.hTLV},"undefined"!=typeof t)if("string"==typeof t.name){var r=n.PKIFailureInfo.valueList;if("undefined"==typeof r[t.name])throw"name undefined: "+t.name;this.value=r[t.name]}else"number"==typeof t.int&&(this.value=t.int)},sr.lang.extend(Cr.asn1.tsp.PKIFailureInfo,Cr.asn1.ASN1Object),Cr.asn1.tsp.PKIFailureInfo.valueList={badAlg:0,badRequest:2,badDataFormat:5,timeNotAvailable:14,unacceptedPolicy:15,unacceptedExtension:16,addInfoNotAvailable:17,systemFailure:25},Cr.asn1.tsp.AbstractTSAAdapter=function(t){this.getTSTHex=function(t,e){throw"not implemented yet"}},Cr.asn1.tsp.SimpleTSAAdapter=function(t){Cr.asn1.tsp.SimpleTSAAdapter.superclass.constructor.call(this),this.params=null,this.serial=0,this.getTSTHex=function(t,e){var n=Cr.crypto.Util.hashHex(t,e);this.params.tstInfo.messageImprint={hashAlg:e,hashValue:n},this.params.tstInfo.serialNumber={int:this.serial++};var r=Math.floor(1e9*Math.random());this.params.tstInfo.nonce={int:r};var i=Cr.asn1.tsp.TSPUtil.newTimeStampToken(this.params);return i.getContentInfoEncodedHex()},"undefined"!=typeof t&&(this.params=t)},sr.lang.extend(Cr.asn1.tsp.SimpleTSAAdapter,Cr.asn1.tsp.AbstractTSAAdapter),Cr.asn1.tsp.FixedTSAAdapter=function(t){Cr.asn1.tsp.FixedTSAAdapter.superclass.constructor.call(this),this.params=null,this.getTSTHex=function(t,e){var n=Cr.crypto.Util.hashHex(t,e);this.params.tstInfo.messageImprint={hashAlg:e,hashValue:n};var r=Cr.asn1.tsp.TSPUtil.newTimeStampToken(this.params);return r.getContentInfoEncodedHex()},"undefined"!=typeof t&&(this.params=t)},sr.lang.extend(Cr.asn1.tsp.FixedTSAAdapter,Cr.asn1.tsp.AbstractTSAAdapter),Cr.asn1.tsp.TSPUtil=new function(){},Cr.asn1.tsp.TSPUtil.newTimeStampToken=function(t){var e=Cr.asn1.cms,n=Cr.asn1.tsp,r=new e.SignedData,i=new n.TSTInfo(t.tstInfo),s=i.getEncodedHex();if(r.dEncapContentInfo.setContentValue({hex:s}),r.dEncapContentInfo.setContentType("tstinfo"),"object"==typeof t.certs)for(var o=0;o<t.certs.length;o++)r.addCertificatesByPEM(t.certs[o]);var a=r.signerInfoList[0];a.setSignerIdentifier(t.signerCert),a.setForContentAndHash({sdObj:r,eciObj:r.dEncapContentInfo,hashAlg:t.hashAlg});var u=new e.SigningCertificate({array:[t.signerCert]});return a.dSignedAttrs.add(u),a.sign(t.signerPrvKey,t.sigAlg),r},Cr.asn1.tsp.TSPUtil.parseTimeStampReq=function(t){var e={};e.certreq=!1;var n=Or.getPosArrayOfChildren_AtObj(t,0);if(n.length<2)throw"TimeStampReq must have at least 2 items";var r=Or.getHexOfTLV_AtObj(t,n[1]);e.mi=Cr.asn1.tsp.TSPUtil.parseMessageImprint(r);for(var i=2;i<n.length;i++){var s=n[i],o=t.substr(s,2);if("06"==o){var a=Or.getHexOfV_AtObj(t,s);e.policy=Or.hextooidstr(a)}"02"==o&&(e.nonce=Or.getHexOfV_AtObj(t,s)),"01"==o&&(e.certreq=!0)}return e},Cr.asn1.tsp.TSPUtil.parseMessageImprint=function(t){var e={};if("30"!=t.substr(0,2))throw"head of messageImprint hex shall be '30'";var n=(Or.getPosArrayOfChildren_AtObj(t,0),Or.getDecendantIndexByNthList(t,0,[0,0])),r=Or.getHexOfV_AtObj(t,n),i=Or.hextooidstr(r),s=Cr.asn1.x509.OID.oid2name(i);if(""==s)throw"hashAlg name undefined: "+i;var o=s,a=Or.getDecendantIndexByNthList(t,0,[1]);return e.hashAlg=o,e.hashValue=Or.getHexOfV_AtObj(t,a),e},/*! asn1cades-1.0.0.js (c) 2013-2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.asn1&&Cr.asn1||(Cr.asn1={}),"undefined"!=typeof Cr.asn1.cades&&Cr.asn1.cades||(Cr.asn1.cades={}),Cr.asn1.cades.SignaturePolicyIdentifier=function(t){Cr.asn1.cades.SignaturePolicyIdentifier.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.16.2.15";var e=Cr.asn1,n=Cr.asn1.cades;if("undefined"!=typeof t&&"string"==typeof t.oid&&"object"==typeof t.hash){var r=new e.DERObjectIdentifier({oid:t.oid}),i=new n.OtherHashAlgAndValue(t.hash),s=new e.DERSequence({array:[r,i]});this.valueList=[s]}},sr.lang.extend(Cr.asn1.cades.SignaturePolicyIdentifier,Cr.asn1.cms.Attribute),Cr.asn1.cades.OtherHashAlgAndValue=function(t){Cr.asn1.cades.OtherHashAlgAndValue.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.x509;this.dAlg=null,this.dHash=null,this.getEncodedHex=function(){var t=new e.DERSequence({array:[this.dAlg,this.dHash]});return this.hTLV=t.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&"string"==typeof t.alg&&"string"==typeof t.hash&&(this.dAlg=new n.AlgorithmIdentifier({name:t.alg}),this.dHash=new e.DEROctetString({hex:t.hash}))},sr.lang.extend(Cr.asn1.cades.OtherHashAlgAndValue,Cr.asn1.ASN1Object),Cr.asn1.cades.SignatureTimeStamp=function(t){Cr.asn1.cades.SignatureTimeStamp.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.16.2.14",this.tstHex=null;var e=Cr.asn1;if("undefined"!=typeof t){if("undefined"!=typeof t.res)if("string"==typeof t.res&&t.res.match(/^[0-9A-Fa-f]+$/));else if(!(t.res instanceof Cr.asn1.ASN1Object))throw"res param shall be ASN1Object or hex string";if("undefined"!=typeof t.tst)if("string"==typeof t.tst&&t.tst.match(/^[0-9A-Fa-f]+$/)){var n=new e.ASN1Object;this.tstHex=t.tst,n.hTLV=this.tstHex,n.getEncodedHex(),this.valueList=[n]}else if(!(t.tst instanceof Cr.asn1.ASN1Object))throw"tst param shall be ASN1Object or hex string"}},sr.lang.extend(Cr.asn1.cades.SignatureTimeStamp,Cr.asn1.cms.Attribute),Cr.asn1.cades.CompleteCertificateRefs=function(t){Cr.asn1.cades.CompleteCertificateRefs.superclass.constructor.call(this),this.attrTypeOid="1.2.840.113549.1.9.16.2.21";var e=(Cr.asn1,Cr.asn1.cades);this.setByArray=function(t){this.valueList=[];for(var n=0;n<t.length;n++){var r=new e.OtherCertID(t[n]);this.valueList.push(r)}},"undefined"!=typeof t&&"object"==typeof t&&"number"==typeof t.length&&this.setByArray(t)},sr.lang.extend(Cr.asn1.cades.CompleteCertificateRefs,Cr.asn1.cms.Attribute),Cr.asn1.cades.OtherCertID=function(t){Cr.asn1.cades.OtherCertID.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.cms,r=Cr.asn1.cades;this.hasIssuerSerial=!0,this.dOtherCertHash=null,this.dIssuerSerial=null,this.setByCertPEM=function(t){this.dOtherCertHash=new r.OtherHash(t),this.hasIssuerSerial&&(this.dIssuerSerial=new n.IssuerAndSerialNumber(t))},this.getEncodedHex=function(){if(null!=this.hTLV)return this.hTLV;if(null==this.dOtherCertHash)throw"otherCertHash not set";var t=[this.dOtherCertHash];null!=this.dIssuerSerial&&t.push(this.dIssuerSerial);var n=new e.DERSequence({array:t});return this.hTLV=n.getEncodedHex(),this.hTLV},"undefined"!=typeof t&&("string"==typeof t&&t.indexOf("-----BEGIN ")!=-1&&this.setByCertPEM(t),"object"==typeof t&&(t.hasis===!1&&(this.hasIssuerSerial=!1),"string"==typeof t.cert&&this.setByCertPEM(t.cert)))},sr.lang.extend(Cr.asn1.cades.OtherCertID,Cr.asn1.ASN1Object),Cr.asn1.cades.OtherHash=function(t){Cr.asn1.cades.OtherHash.superclass.constructor.call(this);var e=Cr.asn1,n=Cr.asn1.cades;if(this.alg="sha256",this.dOtherHash=null,this.setByCertPEM=function(t){if(t.indexOf("-----BEGIN ")==-1)throw"certPEM not to seem PEM format";var e=$n.pemToHex(t),r=Cr.crypto.Util.hashHex(e,this.alg);this.dOtherHash=new n.OtherHashAlgAndValue({alg:this.alg,hash:r})},this.getEncodedHex=function(){if(null==this.dOtherHash)throw"OtherHash not set";return this.dOtherHash.getEncodedHex()},"undefined"!=typeof t)if("string"==typeof t)if(t.indexOf("-----BEGIN ")!=-1)this.setByCertPEM(t);else{if(!t.match(/^[0-9A-Fa-f]+$/))throw"unsupported string value for params";this.dOtherHash=new e.DEROctetString({hex:t})}else"object"==typeof t&&("string"==typeof t.cert?("string"==typeof t.alg&&(this.alg=t.alg),this.setByCertPEM(t.cert)):this.dOtherHash=new n.OtherHashAlgAndValue(t))},sr.lang.extend(Cr.asn1.cades.OtherHash,Cr.asn1.ASN1Object),Cr.asn1.cades.CAdESUtil=new function(){},Cr.asn1.cades.CAdESUtil.addSigTS=function(t,e,n){},Cr.asn1.cades.CAdESUtil.parseSignedDataForAddingUnsigned=function(t){var e=Cr.asn1,n=Cr.asn1.cms,r=Cr.asn1.cades.CAdESUtil,i={};if("06092a864886f70d010702"!=Or.getDecendantHexTLVByNthList(t,0,[0]))throw"hex is not CMS SignedData";var s=Or.getDecendantIndexByNthList(t,0,[1,0]),o=Or.getPosArrayOfChildren_AtObj(t,s);if(o.length<4)throw"num of SignedData elem shall be 4 at least";var a=o.shift();i.version=Or.getHexOfTLV_AtObj(t,a);var u=o.shift();i.algs=Or.getHexOfTLV_AtObj(t,u);var h=o.shift();i.encapcontent=Or.getHexOfTLV_AtObj(t,h),i.certs=null,i.revs=null,i.si=[];var c=o.shift();"a0"==t.substr(c,2)&&(i.certs=Or.getHexOfTLV_AtObj(t,c),c=o.shift()),"a1"==t.substr(c,2)&&(i.revs=Or.getHexOfTLV_AtObj(t,c),c=o.shift());var f=c;if("31"!=t.substr(f,2))throw"Can't find signerInfos";for(var l=Or.getPosArrayOfChildren_AtObj(t,f),d=0;d<l.length;d++){var g=l[d],p=r.parseSignerInfoForAddingUnsigned(t,g,d);i.si[d]=p}var y=null;i.obj=new n.SignedData,y=new e.ASN1Object,y.hTLV=i.version,i.obj.dCMSVersion=y,y=new e.ASN1Object,y.hTLV=i.algs,i.obj.dDigestAlgs=y,y=new e.ASN1Object,y.hTLV=i.encapcontent,i.obj.dEncapContentInfo=y,y=new e.ASN1Object,y.hTLV=i.certs,i.obj.dCerts=y,i.obj.signerInfoList=[];for(var d=0;d<i.si.length;d++)i.obj.signerInfoList.push(i.si[d].obj);return i},Cr.asn1.cades.CAdESUtil.parseSignerInfoForAddingUnsigned=function(t,e,n){var r=Cr.asn1,i=Cr.asn1.cms,s={},o=Or.getPosArrayOfChildren_AtObj(t,e);if(6!=o.length)throw"not supported items for SignerInfo (!=6)";var a=o.shift();s.version=Or.getHexOfTLV_AtObj(t,a);var u=o.shift();s.si=Or.getHexOfTLV_AtObj(t,u);var h=o.shift();s.digalg=Or.getHexOfTLV_AtObj(t,h);var c=o.shift();s.sattrs=Or.getHexOfTLV_AtObj(t,c);var f=o.shift();s.sigalg=Or.getHexOfTLV_AtObj(t,f);var l=o.shift();s.sig=Or.getHexOfTLV_AtObj(t,l),s.sigval=Or.getHexOfV_AtObj(t,l);var d=null;return s.obj=new i.SignerInfo,d=new r.ASN1Object,d.hTLV=s.version,s.obj.dCMSVersion=d,d=new r.ASN1Object,d.hTLV=s.si,s.obj.dSignerIdentifier=d,d=new r.ASN1Object,d.hTLV=s.digalg,s.obj.dDigestAlgorithm=d,d=new r.ASN1Object,d.hTLV=s.sattrs,s.obj.dSignedAttrs=d,d=new r.ASN1Object,d.hTLV=s.sigalg,s.obj.dSigAlg=d,d=new r.ASN1Object,d.hTLV=s.sig,s.obj.dSig=d,s.obj.dUnsignedAttrs=new i.AttributeList,s},/*! asn1csr-1.0.0.js (c) 2015 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr.asn1.csr&&Cr.asn1.csr||(Cr.asn1.csr={}),Cr.asn1.csr.CertificationRequest=function(t){Cr.asn1.csr.CertificationRequest.superclass.constructor.call(this);this.sign=function(t,e){null==this.prvKey&&(this.prvKey=e),this.asn1SignatureAlg=new Cr.asn1.x509.AlgorithmIdentifier({name:t}),sig=new Cr.crypto.Signature({alg:t}),sig.initSign(this.prvKey),sig.updateHex(this.asn1CSRInfo.getEncodedHex()),this.hexSig=sig.sign(),this.asn1Sig=new Cr.asn1.DERBitString({hex:"00"+this.hexSig});var n=new Cr.asn1.DERSequence({array:[this.asn1CSRInfo,this.asn1SignatureAlg,this.asn1Sig]});this.hTLV=n.getEncodedHex(),this.isModified=!1},this.getPEMString=function(){var t=Cr.asn1.ASN1Util.getPEMStringFromHex(this.getEncodedHex(),"CERTIFICATE REQUEST");return t},this.getEncodedHex=function(){if(0==this.isModified&&null!=this.hTLV)return this.hTLV;throw"not signed yet"},"undefined"!=typeof t&&"undefined"!=typeof t.csrinfo&&(this.asn1CSRInfo=t.csrinfo)},sr.lang.extend(Cr.asn1.csr.CertificationRequest,Cr.asn1.ASN1Object),Cr.asn1.csr.CertificationRequestInfo=function(t){Cr.asn1.csr.CertificationRequestInfo.superclass.constructor.call(this),this._initialize=function(){this.asn1Array=new Array,this.asn1Version=new Cr.asn1.DERInteger({int:0}),this.asn1Subject=null,this.asn1SubjPKey=null,this.extensionsArray=new Array},this.setSubjectByParam=function(t){this.asn1Subject=new Cr.asn1.x509.X500Name(t)},this.setSubjectPublicKeyByGetKey=function(t){var e=Rr.getKey(t);this.asn1SubjPKey=new Cr.asn1.x509.SubjectPublicKeyInfo(e)},this.getEncodedHex=function(){this.asn1Array=new Array,this.asn1Array.push(this.asn1Version),this.asn1Array.push(this.asn1Subject),this.asn1Array.push(this.asn1SubjPKey);var t=new Cr.asn1.DERSequence({array:this.extensionsArray}),e=new Cr.asn1.DERTaggedObject({explicit:!1,tag:"a0",obj:t});this.asn1Array.push(e);var n=new Cr.asn1.DERSequence({array:this.asn1Array});return this.hTLV=n.getEncodedHex(),this.isModified=!1,this.hTLV},this._initialize()},sr.lang.extend(Cr.asn1.csr.CertificationRequestInfo,Cr.asn1.ASN1Object),Cr.asn1.csr.CSRUtil=new function(){},Cr.asn1.csr.CSRUtil.newCSRPEM=function(t){var e=Cr.asn1.csr;if(void 0===t.subject)throw"parameter subject undefined";if(void 0===t.sbjpubkey)throw"parameter sbjpubkey undefined";if(void 0===t.sigalg)throw"parameter sigalg undefined";if(void 0===t.sbjprvkey)throw"parameter sbjpubkey undefined";var n=new e.CertificationRequestInfo;n.setSubjectByParam(t.subject),n.setSubjectPublicKeyByGetKey(t.sbjpubkey);var r=new e.CertificationRequest({csrinfo:n}),i=Rr.getKey(t.sbjprvkey);r.sign(t.sigalg,i);var s=r.getPEMString();return s};/*! base64x-1.1.7 (c) 2012-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
var Cr;"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.lang&&Cr.lang||(Cr.lang={}),Cr.lang.String=function(){};var Tr,Dr;"function"==typeof t?(Tr=function(e){return ln(new t(e,"utf8").toString("base64"))},Dr=function(e){return new t(dn(e),"base64").toString("utf8")}):(Tr=function(t){return gn(xn(An(t)))},Dr=function(t){return decodeURIComponent(_n(pn(t)))}),Cr.lang.String.isInteger=function(t){return!!t.match(/^[0-9]+$/)||!!t.match(/^-[0-9]+$/)},Cr.lang.String.isHex=function(t){return!(t.length%2!=0||!t.match(/^[0-9a-f]+$/)&&!t.match(/^[0-9A-F]+$/))},Cr.lang.String.isBase64=function(t){return t=t.replace(/\s+/g,""),!(!t.match(/^[0-9A-Za-z+\/]+={0,3}$/)||t.length%4!=0)},Cr.lang.String.isBase64URL=function(t){return!t.match(/[+\/=]/)&&(t=dn(t),Cr.lang.String.isBase64(t))},Cr.lang.String.isIntegerArray=function(t){return t=t.replace(/\s+/g,""),!!t.match(/^\[[0-9,]+\]$/)};var jr=function(t,e){var n=t.length;t.length>e.length&&(n=e.length);for(var r=0;r<n;r++)if(t.charCodeAt(r)!=e.charCodeAt(r))return r;return t.length!=e.length?n:-1};/*! crypto-1.1.8.js (c) 2013-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.crypto&&Cr.crypto||(Cr.crypto={}),Cr.crypto.Util=new function(){this.DIGESTINFOHEAD={sha1:"3021300906052b0e03021a05000414",sha224:"302d300d06096086480165030402040500041c",sha256:"3031300d060960864801650304020105000420",sha384:"3041300d060960864801650304020205000430",sha512:"3051300d060960864801650304020305000440",md2:"3020300c06082a864886f70d020205000410",md5:"3020300c06082a864886f70d020505000410",ripemd160:"3021300906052b2403020105000414"},this.DEFAULTPROVIDER={md5:"cryptojs",sha1:"cryptojs",sha224:"cryptojs",sha256:"cryptojs",sha384:"cryptojs",sha512:"cryptojs",ripemd160:"cryptojs",hmacmd5:"cryptojs",hmacsha1:"cryptojs",hmacsha224:"cryptojs",hmacsha256:"cryptojs",hmacsha384:"cryptojs",hmacsha512:"cryptojs",hmacripemd160:"cryptojs",MD5withRSA:"cryptojs/jsrsa",SHA1withRSA:"cryptojs/jsrsa",SHA224withRSA:"cryptojs/jsrsa",SHA256withRSA:"cryptojs/jsrsa",SHA384withRSA:"cryptojs/jsrsa",SHA512withRSA:"cryptojs/jsrsa",RIPEMD160withRSA:"cryptojs/jsrsa",MD5withECDSA:"cryptojs/jsrsa",SHA1withECDSA:"cryptojs/jsrsa",SHA224withECDSA:"cryptojs/jsrsa",SHA256withECDSA:"cryptojs/jsrsa",SHA384withECDSA:"cryptojs/jsrsa",SHA512withECDSA:"cryptojs/jsrsa",RIPEMD160withECDSA:"cryptojs/jsrsa",SHA1withDSA:"cryptojs/jsrsa",SHA224withDSA:"cryptojs/jsrsa",SHA256withDSA:"cryptojs/jsrsa",MD5withRSAandMGF1:"cryptojs/jsrsa",SHA1withRSAandMGF1:"cryptojs/jsrsa",SHA224withRSAandMGF1:"cryptojs/jsrsa",SHA256withRSAandMGF1:"cryptojs/jsrsa",SHA384withRSAandMGF1:"cryptojs/jsrsa",SHA512withRSAandMGF1:"cryptojs/jsrsa",RIPEMD160withRSAandMGF1:"cryptojs/jsrsa"},this.CRYPTOJSMESSAGEDIGESTNAME={md5:or.algo.MD5,sha1:or.algo.SHA1,sha224:or.algo.SHA224,sha256:or.algo.SHA256,sha384:or.algo.SHA384,sha512:or.algo.SHA512,ripemd160:or.algo.RIPEMD160},this.getDigestInfoHex=function(t,e){if("undefined"==typeof this.DIGESTINFOHEAD[e])throw"alg not supported in Util.DIGESTINFOHEAD: "+e;return this.DIGESTINFOHEAD[e]+t},this.getPaddedDigestInfoHex=function(t,e,n){var r=this.getDigestInfoHex(t,e),i=n/4;if(r.length+22>i)throw"key is too short for SigAlg: keylen="+n+","+e;for(var s="0001",o="00"+r,a="",u=i-s.length-o.length,h=0;h<u;h+=2)a+="ff";var c=s+a+o;return c},this.hashString=function(t,e){var n=new Cr.crypto.MessageDigest({alg:e});return n.digestString(t)},this.hashHex=function(t,e){var n=new Cr.crypto.MessageDigest({alg:e});return n.digestHex(t)},this.sha1=function(t){var e=new Cr.crypto.MessageDigest({alg:"sha1",prov:"cryptojs"});return e.digestString(t)},this.sha256=function(t){var e=new Cr.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"});return e.digestString(t)},this.sha256Hex=function(t){var e=new Cr.crypto.MessageDigest({alg:"sha256",prov:"cryptojs"});return e.digestHex(t)},this.sha512=function(t){var e=new Cr.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"});return e.digestString(t)},this.sha512Hex=function(t){var e=new Cr.crypto.MessageDigest({alg:"sha512",prov:"cryptojs"});return e.digestHex(t)},this.md5=function(t){var e=new Cr.crypto.MessageDigest({alg:"md5",prov:"cryptojs"});return e.digestString(t)},this.ripemd160=function(t){var e=new Cr.crypto.MessageDigest({alg:"ripemd160",prov:"cryptojs"});return e.digestString(t)},this.getCryptoJSMDByName=function(t){}},Cr.crypto.MessageDigest=function(t){this.setAlgAndProvider=function(t,e){if(null!=t&&void 0===e&&(e=Cr.crypto.Util.DEFAULTPROVIDER[t]),":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(t)!=-1&&"cryptojs"==e){try{this.md=Cr.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[t].create()}catch(e){throw"setAlgAndProvider hash alg set fail alg="+t+"/"+e}this.updateString=function(t){this.md.update(t)},this.updateHex=function(t){var e=or.enc.Hex.parse(t);this.md.update(e)},this.digest=function(){var t=this.md.finalize();return t.toString(or.enc.Hex)},this.digestString=function(t){return this.updateString(t),this.digest()},this.digestHex=function(t){return this.updateHex(t),this.digest()}}if(":sha256:".indexOf(t)!=-1&&"sjcl"==e){try{this.md=new sjcl.hash.sha256}catch(e){throw"setAlgAndProvider hash alg set fail alg="+t+"/"+e}this.updateString=function(t){this.md.update(t)},this.updateHex=function(t){var e=sjcl.codec.hex.toBits(t);this.md.update(e)},this.digest=function(){var t=this.md.finalize();return sjcl.codec.hex.fromBits(t)},this.digestString=function(t){return this.updateString(t),this.digest()},this.digestHex=function(t){return this.updateHex(t),this.digest()}}},this.updateString=function(t){throw"updateString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.updateHex=function(t){throw"updateHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digest=function(){throw"digest() not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digestString=function(t){throw"digestString(str) not supported for this alg/prov: "+this.algName+"/"+this.provName},this.digestHex=function(t){throw"digestHex(hex) not supported for this alg/prov: "+this.algName+"/"+this.provName},void 0!==t&&void 0!==t.alg&&(this.algName=t.alg,void 0===t.prov&&(this.provName=Cr.crypto.Util.DEFAULTPROVIDER[this.algName]),this.setAlgAndProvider(this.algName,this.provName))},Cr.crypto.Mac=function(t){this.setAlgAndProvider=function(t,e){if(t=t.toLowerCase(),null==t&&(t="hmacsha1"),t=t.toLowerCase(),"hmac"!=t.substr(0,4))throw"setAlgAndProvider unsupported HMAC alg: "+t;void 0===e&&(e=Cr.crypto.Util.DEFAULTPROVIDER[t]),this.algProv=t+"/"+e;var n=t.substr(4);if(":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(n)!=-1&&"cryptojs"==e){try{var r=Cr.crypto.Util.CRYPTOJSMESSAGEDIGESTNAME[n];this.mac=or.algo.HMAC.create(r,this.pass)}catch(t){throw"setAlgAndProvider hash alg set fail hashAlg="+n+"/"+t}this.updateString=function(t){this.mac.update(t)},this.updateHex=function(t){var e=or.enc.Hex.parse(t);this.mac.update(e)},this.doFinal=function(){var t=this.mac.finalize();return t.toString(or.enc.Hex)},this.doFinalString=function(t){return this.updateString(t),this.doFinal()},this.doFinalHex=function(t){return this.updateHex(t),this.doFinal()}}},this.updateString=function(t){throw"updateString(str) not supported for this alg/prov: "+this.algProv},this.updateHex=function(t){throw"updateHex(hex) not supported for this alg/prov: "+this.algProv},this.doFinal=function(){throw"digest() not supported for this alg/prov: "+this.algProv},this.doFinalString=function(t){throw"digestString(str) not supported for this alg/prov: "+this.algProv},this.doFinalHex=function(t){throw"digestHex(hex) not supported for this alg/prov: "+this.algProv},this.setPassword=function(t){if("string"==typeof t){var e=t;return t.length%2!=1&&t.match(/^[0-9A-Fa-f]+$/)||(e=wn(t)),void(this.pass=or.enc.Hex.parse(e))}if("object"!=typeof t)throw"KJUR.crypto.Mac unsupported password type: "+t;var e=null;if(void 0!==t.hex){if(t.hex.length%2!=0||!t.hex.match(/^[0-9A-Fa-f]+$/))throw"Mac: wrong hex password: "+t.hex;e=t.hex}if(void 0!==t.utf8&&(e=mn(t.utf8)),void 0!==t.rstr&&(e=wn(t.rstr)),void 0!==t.b64&&(e=i(t.b64)),void 0!==t.b64u&&(e=pn(t.b64u)),null==e)throw"KJUR.crypto.Mac unsupported password type: "+t;this.pass=or.enc.Hex.parse(e)},void 0!==t&&(void 0!==t.pass&&this.setPassword(t.pass),void 0!==t.alg&&(this.algName=t.alg,void 0===t.prov&&(this.provName=Cr.crypto.Util.DEFAULTPROVIDER[this.algName]),this.setAlgAndProvider(this.algName,this.provName)))},Cr.crypto.Signature=function(t){var e=null;if(this._setAlgNames=function(){this.algName.match(/^(.+)with(.+)$/)&&(this.mdAlgName=RegExp.$1.toLowerCase(),this.pubkeyAlgName=RegExp.$2.toLowerCase())},this._zeroPaddingOfSignature=function(t,e){for(var n="",r=e/4-t.length,i=0;i<r;i++)n+="0";return n+t},this.setAlgAndProvider=function(t,e){if(this._setAlgNames(),"cryptojs/jsrsa"!=e)throw"provider not supported: "+e;if(":md5:sha1:sha224:sha256:sha384:sha512:ripemd160:".indexOf(this.mdAlgName)!=-1){try{this.md=new Cr.crypto.MessageDigest({alg:this.mdAlgName})}catch(t){throw"setAlgAndProvider hash alg set fail alg="+this.mdAlgName+"/"+t}this.init=function(t,e){var n=null;try{n=void 0===e?Rr.getKey(t):Rr.getKey(t,e)}catch(t){throw"init failed:"+t}if(n.isPrivate===!0)this.prvKey=n,this.state="SIGN";else{if(n.isPublic!==!0)throw"init failed.:"+n;this.pubKey=n,this.state="VERIFY"}},this.initSign=function(t){"string"==typeof t.ecprvhex&&"string"==typeof t.eccurvename?(this.ecprvhex=t.ecprvhex,this.eccurvename=t.eccurvename):this.prvKey=t,this.state="SIGN"},this.initVerifyByPublicKey=function(t){"string"==typeof t.ecpubhex&&"string"==typeof t.eccurvename?(this.ecpubhex=t.ecpubhex,this.eccurvename=t.eccurvename):t instanceof Cr.crypto.ECDSA?this.pubKey=t:t instanceof ve&&(this.pubKey=t),this.state="VERIFY"},this.initVerifyByCertificatePEM=function(t){var e=new $n;e.readCertPEM(t),this.pubKey=e.subjectPublicKeyRSA,this.state="VERIFY"},this.updateString=function(t){this.md.updateString(t)},this.updateHex=function(t){this.md.updateHex(t)},this.sign=function(){if(this.sHashHex=this.md.digest(),"undefined"!=typeof this.ecprvhex&&"undefined"!=typeof this.eccurvename){var t=new Cr.crypto.ECDSA({curve:this.eccurvename});this.hSign=t.signHex(this.sHashHex,this.ecprvhex)}else if(this.prvKey instanceof ve&&"rsaandmgf1"==this.pubkeyAlgName)this.hSign=this.prvKey.signWithMessageHashPSS(this.sHashHex,this.mdAlgName,this.pssSaltLen);else if(this.prvKey instanceof ve&&"rsa"==this.pubkeyAlgName)this.hSign=this.prvKey.signWithMessageHash(this.sHashHex,this.mdAlgName);else if(this.prvKey instanceof Cr.crypto.ECDSA)this.hSign=this.prvKey.signWithMessageHash(this.sHashHex);else{if(!(this.prvKey instanceof Cr.crypto.DSA))throw"Signature: unsupported public key alg: "+this.pubkeyAlgName;this.hSign=this.prvKey.signWithMessageHash(this.sHashHex)}return this.hSign},this.signString=function(t){return this.updateString(t),this.sign()},this.signHex=function(t){return this.updateHex(t),this.sign()},this.verify=function(t){if(this.sHashHex=this.md.digest(),"undefined"!=typeof this.ecpubhex&&"undefined"!=typeof this.eccurvename){var e=new Cr.crypto.ECDSA({curve:this.eccurvename});return e.verifyHex(this.sHashHex,t,this.ecpubhex)}if(this.pubKey instanceof ve&&"rsaandmgf1"==this.pubkeyAlgName)return this.pubKey.verifyWithMessageHashPSS(this.sHashHex,t,this.mdAlgName,this.pssSaltLen);if(this.pubKey instanceof ve&&"rsa"==this.pubkeyAlgName)return this.pubKey.verifyWithMessageHash(this.sHashHex,t);if(this.pubKey instanceof Cr.crypto.ECDSA)return this.pubKey.verifyWithMessageHash(this.sHashHex,t);if(this.pubKey instanceof Cr.crypto.DSA)return this.pubKey.verifyWithMessageHash(this.sHashHex,t);throw"Signature: unsupported public key alg: "+this.pubkeyAlgName}}},this.init=function(t,e){throw"init(key, pass) not supported for this alg:prov="+this.algProvName},this.initVerifyByPublicKey=function(t){throw"initVerifyByPublicKey(rsaPubKeyy) not supported for this alg:prov="+this.algProvName},this.initVerifyByCertificatePEM=function(t){throw"initVerifyByCertificatePEM(certPEM) not supported for this alg:prov="+this.algProvName},this.initSign=function(t){throw"initSign(prvKey) not supported for this alg:prov="+this.algProvName},this.updateString=function(t){throw"updateString(str) not supported for this alg:prov="+this.algProvName},this.updateHex=function(t){throw"updateHex(hex) not supported for this alg:prov="+this.algProvName},this.sign=function(){throw"sign() not supported for this alg:prov="+this.algProvName},this.signString=function(t){throw"digestString(str) not supported for this alg:prov="+this.algProvName},this.signHex=function(t){throw"digestHex(hex) not supported for this alg:prov="+this.algProvName},this.verify=function(t){throw"verify(hSigVal) not supported for this alg:prov="+this.algProvName},this.initParams=t,void 0!==t&&(void 0!==t.alg&&(this.algName=t.alg,void 0===t.prov?this.provName=Cr.crypto.Util.DEFAULTPROVIDER[this.algName]:this.provName=t.prov,this.algProvName=this.algName+":"+this.provName,this.setAlgAndProvider(this.algName,this.provName),this._setAlgNames()),void 0!==t.psssaltlen&&(this.pssSaltLen=t.psssaltlen),void 0!==t.prvkeypem)){if(void 0!==t.prvkeypas)throw"both prvkeypem and prvkeypas parameters not supported";try{var e=new ve;e.readPrivateKeyFromPEMString(t.prvkeypem),this.initSign(e)}catch(t){throw"fatal error to load pem private key: "+t}}},Cr.crypto.OID=new function(){this.oidhex2name={"2a864886f70d010101":"rsaEncryption","2a8648ce3d0201":"ecPublicKey","2a8648ce380401":"dsa","2a8648ce3d030107":"secp256r1","2b8104001f":"secp192k1","2b81040021":"secp224r1","2b8104000a":"secp256k1","2b81040023":"secp521r1","2b81040022":"secp384r1","2a8648ce380403":"SHA1withDSA","608648016503040301":"SHA224withDSA","608648016503040302":"SHA256withDSA"}},/*! ecdsa-modified-1.0.5.js (c) Stephan Thomas, Kenji Urushima | github.com/bitcoinjs/bitcoinjs-lib/blob/master/LICENSE
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.crypto&&Cr.crypto||(Cr.crypto={}),Cr.crypto.ECDSA=function(t){var e="secp256r1",n=new le;this.type="EC",this.getBigRandom=function(t){return new o(t.bitLength(),n).mod(t.subtract(o.ONE)).add(o.ONE)},this.setNamedCurve=function(t){this.ecparams=Cr.crypto.ECParameterDB.getByName(t),this.prvKeyHex=null,this.pubKeyHex=null,this.curveName=t},this.setPrivateKeyHex=function(t){this.isPrivate=!0,this.prvKeyHex=t},this.setPublicKeyHex=function(t){this.isPublic=!0,this.pubKeyHex=t},this.getPublicKeyXYHex=function(){var t=this.pubKeyHex;if("04"!==t.substr(0,2))throw"this method supports uncompressed format(04) only";var e=this.ecparams.keylen/4;if(t.length!==2+2*e)throw"malformed public key hex length";var n={};return n.x=t.substr(2,e),n.y=t.substr(2+e),n},this.getShortNISTPCurveName=function(){var t=this.curveName;return"secp256r1"===t||"NIST P-256"===t||"P-256"===t||"prime256v1"===t?"P-256":"secp384r1"===t||"NIST P-384"===t||"P-384"===t?"P-384":null},this.generateKeyPairHex=function(){var t=this.ecparams.n,e=this.getBigRandom(t),n=this.ecparams.G.multiply(e),r=n.getX().toBigInteger(),i=n.getY().toBigInteger(),s=this.ecparams.keylen/4,o=("0000000000"+e.toString(16)).slice(-s),a=("0000000000"+r.toString(16)).slice(-s),u=("0000000000"+i.toString(16)).slice(-s),h="04"+a+u;return this.setPrivateKeyHex(o),this.setPublicKeyHex(h),{ecprvhex:o,ecpubhex:h}},this.signWithMessageHash=function(t){return this.signHex(t,this.prvKeyHex)},this.signHex=function(t,e){var n=new o(e,16),r=this.ecparams.n,i=new o(t,16);do var s=this.getBigRandom(r),a=this.ecparams.G,u=a.multiply(s),h=u.getX().toBigInteger().mod(r);while(h.compareTo(o.ZERO)<=0);var c=s.modInverse(r).multiply(i.add(n.multiply(h))).mod(r);return Cr.crypto.ECDSA.biRSSigToASN1Sig(h,c)},this.sign=function(t,e){var n=e,r=this.ecparams.n,i=o.fromByteArrayUnsigned(t);do var s=this.getBigRandom(r),a=this.ecparams.G,u=a.multiply(s),h=u.getX().toBigInteger().mod(r);while(h.compareTo(o.ZERO)<=0);var c=s.modInverse(r).multiply(i.add(n.multiply(h))).mod(r);return this.serializeSig(h,c)},this.verifyWithMessageHash=function(t,e){return this.verifyHex(t,e,this.pubKeyHex)},this.verifyHex=function(t,e,n){var r,i,s=Cr.crypto.ECDSA.parseSigHex(e);r=s.r,i=s.s;var a;a=Me.decodeFromHex(this.ecparams.curve,n);var u=new o(t,16);return this.verifyRaw(u,r,i,a)},this.verify=function(t,e,n){var r,i;if(Bitcoin.Util.isArray(e)){var s=this.parseSig(e);r=s.r,i=s.s}else{if("object"!=typeof e||!e.r||!e.s)throw"Invalid value for signature";r=e.r,i=e.s}var a;if(n instanceof Me)a=n;else{if(!Bitcoin.Util.isArray(n))throw"Invalid format for pubkey value, must be byte array or ECPointFp";a=Me.decodeFrom(this.ecparams.curve,n)}var u=o.fromByteArrayUnsigned(t);return this.verifyRaw(u,r,i,a)},this.verifyRaw=function(t,e,n,r){var i=this.ecparams.n,s=this.ecparams.G;if(e.compareTo(o.ONE)<0||e.compareTo(i)>=0)return!1;if(n.compareTo(o.ONE)<0||n.compareTo(i)>=0)return!1;var a=n.modInverse(i),u=t.multiply(a).mod(i),h=e.multiply(a).mod(i),c=s.multiply(u).add(r.multiply(h)),f=c.getX().toBigInteger().mod(i);return f.equals(e)},this.serializeSig=function(t,e){var n=t.toByteArraySigned(),r=e.toByteArraySigned(),i=[];return i.push(2),i.push(n.length),i=i.concat(n),i.push(2),i.push(r.length),i=i.concat(r),i.unshift(i.length),i.unshift(48),i},this.parseSig=function(t){var e;if(48!=t[0])throw new Error("Signature not a valid DERSequence");if(e=2,2!=t[e])throw new Error("First element in signature must be a DERInteger");var n=t.slice(e+2,e+2+t[e+1]);if(e+=2+t[e+1],2!=t[e])throw new Error("Second element in signature must be a DERInteger");var r=t.slice(e+2,e+2+t[e+1]);e+=2+t[e+1];var i=o.fromByteArrayUnsigned(n),s=o.fromByteArrayUnsigned(r);return{r:i,s:s}},this.parseSigCompact=function(t){if(65!==t.length)throw"Signature has the wrong length";var e=t[0]-27;if(e<0||e>7)throw"Invalid signature type";var n=this.ecparams.n,r=o.fromByteArrayUnsigned(t.slice(1,33)).mod(n),i=o.fromByteArrayUnsigned(t.slice(33,65)).mod(n);return{r:r,s:i,i:e}},void 0!==t&&void 0!==t.curve&&(this.curveName=t.curve),void 0===this.curveName&&(this.curveName=e),this.setNamedCurve(this.curveName),void 0!==t&&(void 0!==t.prv&&this.setPrivateKeyHex(t.prv),void 0!==t.pub&&this.setPublicKeyHex(t.pub))},Cr.crypto.ECDSA.parseSigHex=function(t){var e=Cr.crypto.ECDSA.parseSigHexInHexRS(t),n=new o(e.r,16),r=new o(e.s,16);return{r:n,s:r}},Cr.crypto.ECDSA.parseSigHexInHexRS=function(t){if("30"!=t.substr(0,2))throw"signature is not a ASN.1 sequence";var e=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=e.length)throw"number of signature ASN.1 sequence elements seem wrong";var n=e[0],r=e[1];if("02"!=t.substr(n,2))throw"1st item of sequene of signature is not ASN.1 integer";if("02"!=t.substr(r,2))throw"2nd item of sequene of signature is not ASN.1 integer";var i=Or.getHexOfV_AtObj(t,n),s=Or.getHexOfV_AtObj(t,r);return{r:i,s:s}},Cr.crypto.ECDSA.asn1SigToConcatSig=function(t){var e=Cr.crypto.ECDSA.parseSigHexInHexRS(t),n=e.r,r=e.s;if("00"==n.substr(0,2)&&n.length/2*8%128==8&&(n=n.substr(2)),"00"==r.substr(0,2)&&r.length/2*8%128==8&&(r=r.substr(2)),n.length/2*8%128!=0)throw"unknown ECDSA sig r length error";if(r.length/2*8%128!=0)throw"unknown ECDSA sig s length error";return n+r},Cr.crypto.ECDSA.concatSigToASN1Sig=function(t){if(t.length/2*8%128!=0)throw"unknown ECDSA concatinated r-s sig  length error";var e=t.substr(0,t.length/2),n=t.substr(t.length/2);return Cr.crypto.ECDSA.hexRSSigToASN1Sig(e,n)},Cr.crypto.ECDSA.hexRSSigToASN1Sig=function(t,e){var n=new o(t,16),r=new o(e,16);return Cr.crypto.ECDSA.biRSSigToASN1Sig(n,r)},Cr.crypto.ECDSA.biRSSigToASN1Sig=function(t,e){var n=new Cr.asn1.DERInteger({bigint:t}),r=new Cr.asn1.DERInteger({bigint:e}),i=new Cr.asn1.DERSequence({array:[n,r]});return i.getEncodedHex()},/*! ecparam-1.0.0.js (c) 2013 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.crypto&&Cr.crypto||(Cr.crypto={}),Cr.crypto.ECParameterDB=new function(){function t(t){return new o(t,16)}var e={},n={};this.getByName=function(t){var r=t;if("undefined"!=typeof n[r]&&(r=n[t]),"undefined"!=typeof e[r])return e[r];throw"unregistered EC curve name: "+r},this.regist=function(r,i,s,o,a,u,h,c,f,l,d,g){e[r]={};var p=t(s),y=t(o),v=t(a),m=t(u),S=t(h),b=new Xe(p,y,v),w=b.decodePointHex("04"+c+f);e[r].name=r,e[r].keylen=i,e[r].curve=b,e[r].G=w,e[r].n=m,e[r].h=S,e[r].oid=d,e[r].info=g;for(var E=0;E<l.length;E++)n[l[E]]=r}},Cr.crypto.ECParameterDB.regist("secp128r1",128,"FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFC","E87579C11079F43DD824993C2CEE5ED3","FFFFFFFE0000000075A30D1B9038A115","1","161FF7528B899B2D0C28607CA52C5B86","CF5AC8395BAFEB13C02DA292DDED7A83",[],"","secp128r1 : SECG curve over a 128 bit prime field"),Cr.crypto.ECParameterDB.regist("secp160k1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFAC73","0","7","0100000000000000000001B8FA16DFAB9ACA16B6B3","1","3B4C382CE37AA192A4019E763036F4F5DD4D7EBB","938CF935318FDCED6BC28286531733C3F03C4FEE",[],"","secp160k1 : SECG curve over a 160 bit prime field"),Cr.crypto.ECParameterDB.regist("secp160r1",160,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC","1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45","0100000000000000000001F4C8F927AED3CA752257","1","4A96B5688EF573284664698968C38BB913CBFC82","23A628553168947D59DCC912042351377AC5FB32",[],"","secp160r1 : SECG curve over a 160 bit prime field"),Cr.crypto.ECParameterDB.regist("secp192k1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFEE37","0","3","FFFFFFFFFFFFFFFFFFFFFFFE26F2FC170F69466A74DEFD8D","1","DB4FF10EC057E9AE26B07D0280B7F4341DA5D1B1EAE06C7D","9B2F2F6D9C5628A7844163D015BE86344082AA88D95E2F9D",[]),Cr.crypto.ECParameterDB.regist("secp192r1",192,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC","64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1","FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831","1","188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012","07192B95FFC8DA78631011ED6B24CDD573F977A11E794811",[]),Cr.crypto.ECParameterDB.regist("secp224r1",224,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE","B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4","FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D","1","B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21","BD376388B5F723FB4C22DFE6CD4375A05A07476444D5819985007E34",[]),Cr.crypto.ECParameterDB.regist("secp256k1",256,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F","0","7","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141","1","79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798","483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8",[]),Cr.crypto.ECParameterDB.regist("secp256r1",256,"FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF","FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC","5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B","FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551","1","6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296","4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5",["NIST P-256","P-256","prime256v1"]),Cr.crypto.ECParameterDB.regist("secp384r1",384,"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC","B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF","FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973","1","AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7","3617de4a96262c6f5d9e98bf9292dc29f8f41dbd289a147ce9da3113b5f0b8c00a60b1ce1d7e819d7a431d7c90ea0e5f",["NIST P-384","P-384"]),Cr.crypto.ECParameterDB.regist("secp521r1",521,"1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC","051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00","1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409","1","C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66","011839296a789a3bc0045c8a5fb42c7d1bd998f54449579b446817afbd17273e662c97ee72995ef42640c550b9013fad0761353c7086a272c24088be94769fd16650",["NIST P-521","P-521"]),/*! dsa-modified-1.0.1.js (c) Recurity Labs GmbH, Kenji Urushimma | github.com/openpgpjs/openpgpjs/blob/master/LICENSE
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.crypto&&Cr.crypto||(Cr.crypto={}),Cr.crypto.DSA=function(){function t(t,e,n,i,s,a){var u=Cr.crypto.Util.hashString(e,t.toLowerCase()),u=u.substr(0,s.bitLength()/4),h=new o(u,16),c=r(o.ONE.add(o.ONE),s.subtract(o.ONE)),f=n.modPow(c,i).mod(s),l=c.modInverse(s).multiply(h.add(a.multiply(f))).mod(s),d=new Array;return d[0]=f,d[1]=l,d}function e(t){var e=openpgp.config.config.prefer_hash_algorithm;switch(Math.round(t.bitLength()/8)){case 20:return 2!=e&&e>11&&10!=e&&e<8?2:e;case 28:return e>11&&e<8?11:e;case 32:return e>10&&e<8?8:e;default:return util.print_debug("DSA select hash algorithm: returning null for an unknown length of q"),null}}function n(t,e,n,r,i,s,a,u){var h=Cr.crypto.Util.hashString(r,t.toLowerCase()),h=h.substr(0,s.bitLength()/4),c=new o(h,16);if(o.ZERO.compareTo(e)>0||e.compareTo(s)>0||o.ZERO.compareTo(n)>0||n.compareTo(s)>0)return util.print_error("invalid DSA Signature"),null;var f=n.modInverse(s),l=c.multiply(f).mod(s),d=e.multiply(f).mod(s),g=a.modPow(l,i).multiply(u.modPow(d,i)).mod(i).mod(s);return 0==g.compareTo(e)}function r(t,e){if(!(e.compareTo(t)<=0)){for(var n=e.subtract(t),r=i(n.bitLength());r>n;)r=i(n.bitLength());return t.add(r)}}function i(t){if(t<0)return null;var e=Math.floor((t+7)/8),n=s(e);return t%8>0&&(n=String.fromCharCode(Math.pow(2,t%8)-1&n.charCodeAt(0))+n.substring(1)),new o(u(n),16)}function s(t){for(var e="",n=0;n<t;n++)e+=String.fromCharCode(a());return e}function a(){var t=new Uint32Array(1);return ir.crypto.getRandomValues(t),255&t[0]}function u(t){if(null==t)return"";for(var e,n=[],r=t.length,i=0;i<r;){for(e=t[i++].charCodeAt().toString(16);e.length<2;)e="0"+e;n.push(""+e)}return n.join("")}this.p=null,this.q=null,this.g=null,this.y=null,this.x=null,this.type="DSA",this.setPrivate=function(t,e,n,r,i){this.isPrivate=!0,this.p=t,this.q=e,this.g=n,this.y=r,this.x=i},this.setPublic=function(t,e,n,r){this.isPublic=!0,this.p=t,this.q=e,this.g=n,this.y=r,this.x=null},this.signWithMessageHash=function(t){var e=this.p,n=this.q,i=this.g,s=(this.y,this.x),a=(t.substr(0,n.bitLength()/4),new o(t,16)),u=r(o.ONE.add(o.ONE),n.subtract(o.ONE)),h=i.modPow(u,e).mod(n),c=u.modInverse(n).multiply(a.add(s.multiply(h))).mod(n),f=Cr.asn1.ASN1Util.jsonToASN1HEX({seq:[{int:{bigint:h}},{int:{bigint:c}}]});return f},this.verifyWithMessageHash=function(t,e){var n=this.p,r=this.q,i=this.g,s=this.y,a=this.parseASN1Signature(e),u=a[0],h=a[1],t=t.substr(0,r.bitLength()/4),c=new o(t,16);if(o.ZERO.compareTo(u)>0||u.compareTo(r)>0||o.ZERO.compareTo(h)>0||h.compareTo(r)>0)throw"invalid DSA signature";var f=h.modInverse(r),l=c.multiply(f).mod(r),d=u.multiply(f).mod(r),g=i.modPow(l,n).multiply(s.modPow(d,n)).mod(n).mod(r);return 0==g.compareTo(u)},this.parseASN1Signature=function(t){try{var e=new o(Or.getVbyList(t,0,[0],"02"),16),n=new o(Or.getVbyList(t,0,[1],"02"),16);return[e,n]}catch(t){throw"malformed DSA signature"}},this.select_hash_algorithm=e,this.sign=t,this.verify=n,this.getRandomBigIntegerInRange=r,this.getRandomBigInteger=i,this.getRandomBytes=s};/*! pkcs5pkey-1.0.6.js (c) 2013-2014 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
var Hr=function(){var t=function(t,e,r){return n(or.AES,t,e,r)},e=function(t,e,r){return n(or.TripleDES,t,e,r)},n=function(t,e,n,r){var i=or.enc.Hex.parse(e),s=or.enc.Hex.parse(n),o=or.enc.Hex.parse(r),a={};a.key=s,a.iv=o,a.ciphertext=i;var u=t.decrypt(a,s,{iv:o});return or.enc.Hex.stringify(u)},r=function(t,e,n){return o(or.AES,t,e,n)},s=function(t,e,n){return o(or.TripleDES,t,e,n)},o=function(t,e,n,r){var i=or.enc.Hex.parse(e),s=or.enc.Hex.parse(n),o=or.enc.Hex.parse(r),a=t.encrypt(i,s,{iv:o}),u=or.enc.Hex.parse(a.toString()),h=or.enc.Base64.stringify(u);return h},a={"AES-256-CBC":{proc:t,eproc:r,keylen:32,ivlen:16},"AES-192-CBC":{proc:t,eproc:r,keylen:24,ivlen:16},"AES-128-CBC":{proc:t,eproc:r,keylen:16,ivlen:16},"DES-EDE3-CBC":{proc:e,eproc:s,keylen:24,ivlen:8}},u=function(t){return a[t].proc},h=function(t){var e=or.lib.WordArray.random(t),n=or.enc.Hex.stringify(e);return n},c=function(t){var e={};t.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)","m"))&&(e.cipher=RegExp.$1,e.ivsalt=RegExp.$2),t.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"))&&(e.type=RegExp.$1);var n=-1,r=0;t.indexOf("\r\n\r\n")!=-1&&(n=t.indexOf("\r\n\r\n"),r=2),t.indexOf("\n\n")!=-1&&(n=t.indexOf("\n\n"),r=1);var i=t.indexOf("-----END");if(n!=-1&&i!=-1){var s=t.substring(n+2*r,i-r);s=s.replace(/\s+/g,""),e.data=s}return e},f=function(t,e,n){for(var r=n.substring(0,16),i=or.enc.Hex.parse(r),s=or.enc.Utf8.parse(e),o=a[t].keylen+a[t].ivlen,u="",h=null;;){var c=or.algo.MD5.create();if(null!=h&&c.update(h),c.update(s),c.update(i),h=c.finalize(),u+=or.enc.Hex.stringify(h),u.length>=2*o)break}var f={};return f.keyhex=u.substr(0,2*a[t].keylen),f.ivhex=u.substr(2*a[t].keylen,2*a[t].ivlen),f},l=function(t,e,n,r){var i=or.enc.Base64.parse(t),s=or.enc.Hex.stringify(i),o=a[e].proc,u=o(s,n,r);return u},d=function(t,e,n,r){var i=a[e].eproc,s=i(t,n,r);return s};return{version:"1.0.5",getHexFromPEM:function(t,e){var n=t;if(n.indexOf("BEGIN "+e)==-1)throw"can't find PEM header: "+e;n=n.replace("-----BEGIN "+e+"-----",""),n=n.replace("-----END "+e+"-----","");var r=n.replace(/\s+/g,""),s=i(r);return s},getDecryptedKeyHexByKeyIV:function(t,e,n,r){var i=u(e);return i(t,n,r)},parsePKCS5PEM:function(t){return c(t)},getKeyAndUnusedIvByPasscodeAndIvsalt:function(t,e,n){return f(t,e,n)},decryptKeyB64:function(t,e,n,r){return l(t,e,n,r)},getDecryptedKeyHex:function(t,e){var n=c(t),r=(n.type,n.cipher),i=n.ivsalt,s=n.data,o=f(r,e,i),a=o.keyhex,u=l(s,r,a,i);return u},getRSAKeyFromEncryptedPKCS5PEM:function(t,e){var n=this.getDecryptedKeyHex(t,e),r=new ve;return r.readPrivateKeyFromASN1HexString(n),r},getEryptedPKCS5PEMFromPrvKeyHex:function(t,e,n,r){var i="";if("undefined"!=typeof n&&null!=n||(n="AES-256-CBC"),"undefined"==typeof a[n])throw"PKCS5PKEY unsupported algorithm: "+n;if("undefined"==typeof r||null==r){var s=a[n].ivlen,o=h(s);r=o.toUpperCase()}var u=f(n,e,r),c=u.keyhex,l=d(t,n,c,r),g=l.replace(/(.{64})/g,"$1\r\n"),i="-----BEGIN RSA PRIVATE KEY-----\r\n";return i+="Proc-Type: 4,ENCRYPTED\r\n",i+="DEK-Info: "+n+","+r+"\r\n",i+="\r\n",i+=g,i+="\r\n-----END RSA PRIVATE KEY-----\r\n"},getEryptedPKCS5PEMFromRSAKey:function(t,e,n,r){var i=new Cr.asn1.DERInteger({int:0}),s=new Cr.asn1.DERInteger({bigint:t.n}),o=new Cr.asn1.DERInteger({int:t.e}),a=new Cr.asn1.DERInteger({bigint:t.d}),u=new Cr.asn1.DERInteger({bigint:t.p}),h=new Cr.asn1.DERInteger({bigint:t.q}),c=new Cr.asn1.DERInteger({bigint:t.dmp1}),f=new Cr.asn1.DERInteger({bigint:t.dmq1}),l=new Cr.asn1.DERInteger({bigint:t.coeff}),d=new Cr.asn1.DERSequence({array:[i,s,o,a,u,h,c,f,l]}),g=d.getEncodedHex();return this.getEryptedPKCS5PEMFromPrvKeyHex(g,e,n,r)},newEncryptedPKCS5PEM:function(t,e,n,r){"undefined"!=typeof e&&null!=e||(e=1024),"undefined"!=typeof n&&null!=n||(n="10001");var i=new ve;i.generate(e,n);var s=null;return s="undefined"==typeof r||null==r?this.getEncryptedPKCS5PEMFromRSAKey(pkey,t):this.getEncryptedPKCS5PEMFromRSAKey(pkey,t,r)},getRSAKeyFromPlainPKCS8PEM:function(t){if(t.match(/ENCRYPTED/))throw"pem shall be not ENCRYPTED";var e=this.getHexFromPEM(t,"PRIVATE KEY"),n=this.getRSAKeyFromPlainPKCS8Hex(e);return n},getRSAKeyFromPlainPKCS8Hex:function(t){var e=Or.getPosArrayOfChildren_AtObj(t,0);if(3!=e.length)throw"outer DERSequence shall have 3 elements: "+e.length;var n=Or.getHexOfTLV_AtObj(t,e[1]);if("300d06092a864886f70d0101010500"!=n)throw"PKCS8 AlgorithmIdentifier is not rsaEnc: "+n;var n=Or.getHexOfTLV_AtObj(t,e[1]),r=Or.getHexOfTLV_AtObj(t,e[2]),i=Or.getHexOfV_AtObj(r,0),s=new ve;return s.readPrivateKeyFromASN1HexString(i),s},parseHexOfEncryptedPKCS8:function(t){var e={},n=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=n.length)throw"malformed format: SEQUENCE(0).items != 2: "+n.length;e.ciphertext=Or.getHexOfV_AtObj(t,n[1]);var r=Or.getPosArrayOfChildren_AtObj(t,n[0]);if(2!=r.length)throw"malformed format: SEQUENCE(0.0).items != 2: "+r.length;if("2a864886f70d01050d"!=Or.getHexOfV_AtObj(t,r[0]))throw"this only supports pkcs5PBES2";var i=Or.getPosArrayOfChildren_AtObj(t,r[1]);if(2!=r.length)throw"malformed format: SEQUENCE(0.0.1).items != 2: "+i.length;var s=Or.getPosArrayOfChildren_AtObj(t,i[1]);if(2!=s.length)throw"malformed format: SEQUENCE(0.0.1.1).items != 2: "+s.length;if("2a864886f70d0307"!=Or.getHexOfV_AtObj(t,s[0]))throw"this only supports TripleDES";e.encryptionSchemeAlg="TripleDES",e.encryptionSchemeIV=Or.getHexOfV_AtObj(t,s[1]);var o=Or.getPosArrayOfChildren_AtObj(t,i[0]);if(2!=o.length)throw"malformed format: SEQUENCE(0.0.1.0).items != 2: "+o.length;if("2a864886f70d01050c"!=Or.getHexOfV_AtObj(t,o[0]))throw"this only supports pkcs5PBKDF2";var a=Or.getPosArrayOfChildren_AtObj(t,o[1]);if(a.length<2)throw"malformed format: SEQUENCE(0.0.1.0.1).items < 2: "+a.length;e.pbkdf2Salt=Or.getHexOfV_AtObj(t,a[0]);var u=Or.getHexOfV_AtObj(t,a[1]);try{e.pbkdf2Iter=parseInt(u,16)}catch(t){throw"malformed format pbkdf2Iter: "+u}return e},getPBKDF2KeyHexFromParam:function(t,e){var n=or.enc.Hex.parse(t.pbkdf2Salt),r=t.pbkdf2Iter,i=or.PBKDF2(e,n,{keySize:6,iterations:r}),s=or.enc.Hex.stringify(i);return s},getPlainPKCS8HexFromEncryptedPKCS8PEM:function(t,e){var n=this.getHexFromPEM(t,"ENCRYPTED PRIVATE KEY"),r=this.parseHexOfEncryptedPKCS8(n),i=Hr.getPBKDF2KeyHexFromParam(r,e),s={};s.ciphertext=or.enc.Hex.parse(r.ciphertext);var o=or.enc.Hex.parse(i),a=or.enc.Hex.parse(r.encryptionSchemeIV),u=or.TripleDES.decrypt(s,o,{iv:a}),h=or.enc.Hex.stringify(u);return h},getRSAKeyFromEncryptedPKCS8PEM:function(t,e){var n=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(t,e),r=this.getRSAKeyFromPlainPKCS8Hex(n);return r},getKeyFromEncryptedPKCS8PEM:function(t,e){var n=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(t,e),r=this.getKeyFromPlainPrivatePKCS8Hex(n);return r},parsePlainPrivatePKCS8Hex:function(t){var e={};if(e.algparam=null,"30"!=t.substr(0,2))throw"malformed plain PKCS8 private key(code:001)";var n=Or.getPosArrayOfChildren_AtObj(t,0);if(3!=n.length)throw"malformed plain PKCS8 private key(code:002)";if("30"!=t.substr(n[1],2))throw"malformed PKCS8 private key(code:003)";var r=Or.getPosArrayOfChildren_AtObj(t,n[1]);if(2!=r.length)throw"malformed PKCS8 private key(code:004)";if("06"!=t.substr(r[0],2))throw"malformed PKCS8 private key(code:005)";if(e.algoid=Or.getHexOfV_AtObj(t,r[0]),"06"==t.substr(r[1],2)&&(e.algparam=Or.getHexOfV_AtObj(t,r[1])),"04"!=t.substr(n[2],2))throw"malformed PKCS8 private key(code:006)";return e.keyidx=Or.getStartPosOfV_AtObj(t,n[2]),e},getKeyFromPlainPrivatePKCS8PEM:function(t){var e=this.getHexFromPEM(t,"PRIVATE KEY"),n=this.getKeyFromPlainPrivatePKCS8Hex(e);return n},getKeyFromPlainPrivatePKCS8Hex:function(t){var e=this.parsePlainPrivatePKCS8Hex(t);if("2a864886f70d010101"==e.algoid){this.parsePrivateRawRSAKeyHexAtObj(t,e);var n=e.key,r=new ve;return r.setPrivateEx(n.n,n.e,n.d,n.p,n.q,n.dp,n.dq,n.co),r}if("2a8648ce3d0201"==e.algoid){if(this.parsePrivateRawECKeyHexAtObj(t,e),void 0===Cr.crypto.OID.oidhex2name[e.algparam])throw"KJUR.crypto.OID.oidhex2name undefined: "+e.algparam;var i=Cr.crypto.OID.oidhex2name[e.algparam],r=new Cr.crypto.ECDSA({curve:i,prv:e.key});return r}throw"unsupported private key algorithm"},getRSAKeyFromPublicPKCS8PEM:function(t){var e=this.getHexFromPEM(t,"PUBLIC KEY"),n=this.getRSAKeyFromPublicPKCS8Hex(e);return n},getKeyFromPublicPKCS8PEM:function(t){var e=this.getHexFromPEM(t,"PUBLIC KEY"),n=this.getKeyFromPublicPKCS8Hex(e);return n},getKeyFromPublicPKCS8Hex:function(t){var e=this.parsePublicPKCS8Hex(t);if("2a864886f70d010101"==e.algoid){var n=this.parsePublicRawRSAKeyHex(e.key),r=new ve;return r.setPublic(n.n,n.e),r}if("2a8648ce3d0201"==e.algoid){if(void 0===Cr.crypto.OID.oidhex2name[e.algparam])throw"KJUR.crypto.OID.oidhex2name undefined: "+e.algparam;var i=Cr.crypto.OID.oidhex2name[e.algparam],r=new Cr.crypto.ECDSA({curve:i,pub:e.key});return r}throw"unsupported public key algorithm"},parsePublicRawRSAKeyHex:function(t){var e={};if("30"!=t.substr(0,2))throw"malformed RSA key(code:001)";var n=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=n.length)throw"malformed RSA key(code:002)";if("02"!=t.substr(n[0],2))throw"malformed RSA key(code:003)";if(e.n=Or.getHexOfV_AtObj(t,n[0]),"02"!=t.substr(n[1],2))throw"malformed RSA key(code:004)";return e.e=Or.getHexOfV_AtObj(t,n[1]),e},parsePrivateRawRSAKeyHexAtObj:function(t,e){var n=e.keyidx;if("30"!=t.substr(n,2))throw"malformed RSA private key(code:001)";var r=Or.getPosArrayOfChildren_AtObj(t,n);if(9!=r.length)throw"malformed RSA private key(code:002)";e.key={},e.key.n=Or.getHexOfV_AtObj(t,r[1]),e.key.e=Or.getHexOfV_AtObj(t,r[2]),e.key.d=Or.getHexOfV_AtObj(t,r[3]),e.key.p=Or.getHexOfV_AtObj(t,r[4]),e.key.q=Or.getHexOfV_AtObj(t,r[5]),e.key.dp=Or.getHexOfV_AtObj(t,r[6]),e.key.dq=Or.getHexOfV_AtObj(t,r[7]),e.key.co=Or.getHexOfV_AtObj(t,r[8])},parsePrivateRawECKeyHexAtObj:function(t,e){var n=e.keyidx;if("30"!=t.substr(n,2))throw"malformed ECC private key(code:001)";var r=Or.getPosArrayOfChildren_AtObj(t,n);if(3!=r.length)throw"malformed ECC private key(code:002)";if("04"!=t.substr(r[1],2))throw"malformed ECC private key(code:003)";e.key=Or.getHexOfV_AtObj(t,r[1])},parsePublicPKCS8Hex:function(t){var e={};e.algparam=null;var n=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=n.length)throw"outer DERSequence shall have 2 elements: "+n.length;var r=n[0];if("30"!=t.substr(r,2))throw"malformed PKCS8 public key(code:001)";var i=Or.getPosArrayOfChildren_AtObj(t,r);if(2!=i.length)throw"malformed PKCS8 public key(code:002)";if("06"!=t.substr(i[0],2))throw"malformed PKCS8 public key(code:003)";if(e.algoid=Or.getHexOfV_AtObj(t,i[0]),"06"==t.substr(i[1],2)&&(e.algparam=Or.getHexOfV_AtObj(t,i[1])),"03"!=t.substr(n[1],2))throw"malformed PKCS8 public key(code:004)";return e.key=Or.getHexOfV_AtObj(t,n[1]).substr(2),e},getRSAKeyFromPublicPKCS8Hex:function(t){var e=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=e.length)throw"outer DERSequence shall have 2 elements: "+e.length;var n=Or.getHexOfTLV_AtObj(t,e[0]);if("300d06092a864886f70d0101010500"!=n)throw"PKCS8 AlgorithmId is not rsaEncryption";if("03"!=t.substr(e[1],2))throw"PKCS8 Public Key is not BITSTRING encapslated.";var r=Or.getStartPosOfV_AtObj(t,e[1])+2;if("30"!=t.substr(r,2))throw"PKCS8 Public Key is not SEQUENCE.";var i=Or.getPosArrayOfChildren_AtObj(t,r);if(2!=i.length)throw"inner DERSequence shall have 2 elements: "+i.length;if("02"!=t.substr(i[0],2))throw"N is not ASN.1 INTEGER";if("02"!=t.substr(i[1],2))throw"E is not ASN.1 INTEGER";var s=Or.getHexOfV_AtObj(t,i[0]),o=Or.getHexOfV_AtObj(t,i[1]),a=new ve;return a.setPublic(s,o),a}}}(),Rr=function(){var t=function(t,e,n){return r(or.AES,t,e,n)},e=function(t,e,n){return r(or.TripleDES,t,e,n)},n=function(t,e,n){return r(or.DES,t,e,n)},r=function(t,e,n,r){var i=or.enc.Hex.parse(e),s=or.enc.Hex.parse(n),o=or.enc.Hex.parse(r),a={};a.key=s,a.iv=o,a.ciphertext=i;var u=t.decrypt(a,s,{iv:o});return or.enc.Hex.stringify(u)},s=function(t,e,n){return h(or.AES,t,e,n)},a=function(t,e,n){return h(or.TripleDES,t,e,n)},u=function(t,e,n){return h(or.DES,t,e,n)},h=function(t,e,n,r){var i=or.enc.Hex.parse(e),s=or.enc.Hex.parse(n),o=or.enc.Hex.parse(r),a=t.encrypt(i,s,{iv:o}),u=or.enc.Hex.parse(a.toString()),h=or.enc.Base64.stringify(u);return h},c={"AES-256-CBC":{proc:t,eproc:s,keylen:32,ivlen:16},"AES-192-CBC":{proc:t,eproc:s,keylen:24,ivlen:16},"AES-128-CBC":{proc:t,eproc:s,keylen:16,ivlen:16},"DES-EDE3-CBC":{proc:e,eproc:a,keylen:24,ivlen:8},"DES-CBC":{proc:n,eproc:u,keylen:8,ivlen:8}},f=function(t){return c[t].proc},l=function(t){var e=or.lib.WordArray.random(t),n=or.enc.Hex.stringify(e);return n},d=function(t){var e={};t.match(new RegExp("DEK-Info: ([^,]+),([0-9A-Fa-f]+)","m"))&&(e.cipher=RegExp.$1,e.ivsalt=RegExp.$2),t.match(new RegExp("-----BEGIN ([A-Z]+) PRIVATE KEY-----"))&&(e.type=RegExp.$1);var n=-1,r=0;t.indexOf("\r\n\r\n")!=-1&&(n=t.indexOf("\r\n\r\n"),r=2),t.indexOf("\n\n")!=-1&&(n=t.indexOf("\n\n"),r=1);var i=t.indexOf("-----END");if(n!=-1&&i!=-1){var s=t.substring(n+2*r,i-r);s=s.replace(/\s+/g,""),e.data=s}return e},g=function(t,e,n){for(var r=n.substring(0,16),i=or.enc.Hex.parse(r),s=or.enc.Utf8.parse(e),o=c[t].keylen+c[t].ivlen,a="",u=null;;){var h=or.algo.MD5.create();if(null!=u&&h.update(u),h.update(s),h.update(i),u=h.finalize(),a+=or.enc.Hex.stringify(u),a.length>=2*o)break}var f={};return f.keyhex=a.substr(0,2*c[t].keylen),f.ivhex=a.substr(2*c[t].keylen,2*c[t].ivlen),f},p=function(t,e,n,r){var i=or.enc.Base64.parse(t),s=or.enc.Hex.stringify(i),o=c[e].proc,a=o(s,n,r);return a},y=function(t,e,n,r){var i=c[e].eproc,s=i(t,n,r);return s};return{version:"1.0.0",getHexFromPEM:function(t,e){var n=t;if(n.indexOf("-----BEGIN ")==-1)throw"can't find PEM header: "+e;"string"==typeof e&&""!=e?(n=n.replace("-----BEGIN "+e+"-----",""),n=n.replace("-----END "+e+"-----","")):(n=n.replace(/-----BEGIN [^-]+-----/,""),n=n.replace(/-----END [^-]+-----/,""));var r=n.replace(/\s+/g,""),s=i(r);return s},getDecryptedKeyHexByKeyIV:function(t,e,n,r){var i=f(e);return i(t,n,r)},parsePKCS5PEM:function(t){return d(t)},getKeyAndUnusedIvByPasscodeAndIvsalt:function(t,e,n){return g(t,e,n)},decryptKeyB64:function(t,e,n,r){return p(t,e,n,r)},getDecryptedKeyHex:function(t,e){var n=d(t),r=(n.type,n.cipher),i=n.ivsalt,s=n.data,o=g(r,e,i),a=o.keyhex,u=p(s,r,a,i);return u},getRSAKeyFromEncryptedPKCS5PEM:function(t,e){var n=this.getDecryptedKeyHex(t,e),r=new ve;return r.readPrivateKeyFromASN1HexString(n),r},getEncryptedPKCS5PEMFromPrvKeyHex:function(t,e,n,r,i){var s="";if("undefined"!=typeof r&&null!=r||(r="AES-256-CBC"),"undefined"==typeof c[r])throw"KEYUTIL unsupported algorithm: "+r;if("undefined"==typeof i||null==i){var o=c[r].ivlen,a=l(o);i=a.toUpperCase()}var u=g(r,n,i),h=u.keyhex,f=y(e,r,h,i),d=f.replace(/(.{64})/g,"$1\r\n"),s="-----BEGIN "+t+" PRIVATE KEY-----\r\n";return s+="Proc-Type: 4,ENCRYPTED\r\n",s+="DEK-Info: "+r+","+i+"\r\n",s+="\r\n",s+=d,s+="\r\n-----END "+t+" PRIVATE KEY-----\r\n"},getEncryptedPKCS5PEMFromRSAKey:function(t,e,n,r){var i=new Cr.asn1.DERInteger({int:0}),s=new Cr.asn1.DERInteger({bigint:t.n}),o=new Cr.asn1.DERInteger({int:t.e}),a=new Cr.asn1.DERInteger({bigint:t.d}),u=new Cr.asn1.DERInteger({bigint:t.p}),h=new Cr.asn1.DERInteger({bigint:t.q}),c=new Cr.asn1.DERInteger({bigint:t.dmp1}),f=new Cr.asn1.DERInteger({bigint:t.dmq1}),l=new Cr.asn1.DERInteger({bigint:t.coeff}),d=new Cr.asn1.DERSequence({array:[i,s,o,a,u,h,c,f,l]}),g=d.getEncodedHex();return this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA",g,e,n,r)},newEncryptedPKCS5PEM:function(t,e,n,r){"undefined"!=typeof e&&null!=e||(e=1024),"undefined"!=typeof n&&null!=n||(n="10001");var i=new ve;i.generate(e,n);var s=null;return s="undefined"==typeof r||null==r?this.getEncryptedPKCS5PEMFromRSAKey(i,t):this.getEncryptedPKCS5PEMFromRSAKey(i,t,r)},getRSAKeyFromPlainPKCS8PEM:function(t){if(t.match(/ENCRYPTED/))throw"pem shall be not ENCRYPTED";var e=this.getHexFromPEM(t,"PRIVATE KEY"),n=this.getRSAKeyFromPlainPKCS8Hex(e);return n},getRSAKeyFromPlainPKCS8Hex:function(t){var e=Or.getPosArrayOfChildren_AtObj(t,0);if(3!=e.length)throw"outer DERSequence shall have 3 elements: "+e.length;var n=Or.getHexOfTLV_AtObj(t,e[1]);if("300d06092a864886f70d0101010500"!=n)throw"PKCS8 AlgorithmIdentifier is not rsaEnc: "+n;var n=Or.getHexOfTLV_AtObj(t,e[1]),r=Or.getHexOfTLV_AtObj(t,e[2]),i=Or.getHexOfV_AtObj(r,0),s=new ve;return s.readPrivateKeyFromASN1HexString(i),s},parseHexOfEncryptedPKCS8:function(t){var e={},n=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=n.length)throw"malformed format: SEQUENCE(0).items != 2: "+n.length;e.ciphertext=Or.getHexOfV_AtObj(t,n[1]);var r=Or.getPosArrayOfChildren_AtObj(t,n[0]);if(2!=r.length)throw"malformed format: SEQUENCE(0.0).items != 2: "+r.length;if("2a864886f70d01050d"!=Or.getHexOfV_AtObj(t,r[0]))throw"this only supports pkcs5PBES2";var i=Or.getPosArrayOfChildren_AtObj(t,r[1]);if(2!=r.length)throw"malformed format: SEQUENCE(0.0.1).items != 2: "+i.length;var s=Or.getPosArrayOfChildren_AtObj(t,i[1]);if(2!=s.length)throw"malformed format: SEQUENCE(0.0.1.1).items != 2: "+s.length;if("2a864886f70d0307"!=Or.getHexOfV_AtObj(t,s[0]))throw"this only supports TripleDES";e.encryptionSchemeAlg="TripleDES",e.encryptionSchemeIV=Or.getHexOfV_AtObj(t,s[1]);var o=Or.getPosArrayOfChildren_AtObj(t,i[0]);if(2!=o.length)throw"malformed format: SEQUENCE(0.0.1.0).items != 2: "+o.length;if("2a864886f70d01050c"!=Or.getHexOfV_AtObj(t,o[0]))throw"this only supports pkcs5PBKDF2";var a=Or.getPosArrayOfChildren_AtObj(t,o[1]);if(a.length<2)throw"malformed format: SEQUENCE(0.0.1.0.1).items < 2: "+a.length;e.pbkdf2Salt=Or.getHexOfV_AtObj(t,a[0]);var u=Or.getHexOfV_AtObj(t,a[1]);try{e.pbkdf2Iter=parseInt(u,16)}catch(t){throw"malformed format pbkdf2Iter: "+u}return e},getPBKDF2KeyHexFromParam:function(t,e){var n=or.enc.Hex.parse(t.pbkdf2Salt),r=t.pbkdf2Iter,i=or.PBKDF2(e,n,{keySize:6,iterations:r}),s=or.enc.Hex.stringify(i);return s},getPlainPKCS8HexFromEncryptedPKCS8PEM:function(t,e){var n=this.getHexFromPEM(t,"ENCRYPTED PRIVATE KEY"),r=this.parseHexOfEncryptedPKCS8(n),i=Rr.getPBKDF2KeyHexFromParam(r,e),s={};s.ciphertext=or.enc.Hex.parse(r.ciphertext);var o=or.enc.Hex.parse(i),a=or.enc.Hex.parse(r.encryptionSchemeIV),u=or.TripleDES.decrypt(s,o,{iv:a}),h=or.enc.Hex.stringify(u);return h},getRSAKeyFromEncryptedPKCS8PEM:function(t,e){var n=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(t,e),r=this.getRSAKeyFromPlainPKCS8Hex(n);return r},getKeyFromEncryptedPKCS8PEM:function(t,e){var n=this.getPlainPKCS8HexFromEncryptedPKCS8PEM(t,e),r=this.getKeyFromPlainPrivatePKCS8Hex(n);return r},parsePlainPrivatePKCS8Hex:function(t){var e={};if(e.algparam=null,"30"!=t.substr(0,2))throw"malformed plain PKCS8 private key(code:001)";var n=Or.getPosArrayOfChildren_AtObj(t,0);if(3!=n.length)throw"malformed plain PKCS8 private key(code:002)";if("30"!=t.substr(n[1],2))throw"malformed PKCS8 private key(code:003)";var r=Or.getPosArrayOfChildren_AtObj(t,n[1]);if(2!=r.length)throw"malformed PKCS8 private key(code:004)";if("06"!=t.substr(r[0],2))throw"malformed PKCS8 private key(code:005)";if(e.algoid=Or.getHexOfV_AtObj(t,r[0]),"06"==t.substr(r[1],2)&&(e.algparam=Or.getHexOfV_AtObj(t,r[1])),"04"!=t.substr(n[2],2))throw"malformed PKCS8 private key(code:006)";return e.keyidx=Or.getStartPosOfV_AtObj(t,n[2]),e},getKeyFromPlainPrivatePKCS8PEM:function(t){var e=this.getHexFromPEM(t,"PRIVATE KEY"),n=this.getKeyFromPlainPrivatePKCS8Hex(e);return n},getKeyFromPlainPrivatePKCS8Hex:function(t){var e=this.parsePlainPrivatePKCS8Hex(t);if("2a864886f70d010101"==e.algoid){this.parsePrivateRawRSAKeyHexAtObj(t,e);var n=e.key,r=new ve;return r.setPrivateEx(n.n,n.e,n.d,n.p,n.q,n.dp,n.dq,n.co),r}if("2a8648ce3d0201"==e.algoid){if(this.parsePrivateRawECKeyHexAtObj(t,e),void 0===Cr.crypto.OID.oidhex2name[e.algparam])throw"KJUR.crypto.OID.oidhex2name undefined: "+e.algparam;var i=Cr.crypto.OID.oidhex2name[e.algparam],r=new Cr.crypto.ECDSA({curve:i});return r.setPublicKeyHex(e.pubkey),r.setPrivateKeyHex(e.key),r.isPublic=!1,r}if("2a8648ce380401"==e.algoid){var s=Or.getVbyList(t,0,[1,1,0],"02"),a=Or.getVbyList(t,0,[1,1,1],"02"),u=Or.getVbyList(t,0,[1,1,2],"02"),h=Or.getVbyList(t,0,[2,0],"02"),c=new o(s,16),f=new o(a,16),l=new o(u,16),d=new o(h,16),r=new Cr.crypto.DSA;return r.setPrivate(c,f,l,null,d),r}throw"unsupported private key algorithm"},getRSAKeyFromPublicPKCS8PEM:function(t){var e=this.getHexFromPEM(t,"PUBLIC KEY"),n=this.getRSAKeyFromPublicPKCS8Hex(e);return n},getKeyFromPublicPKCS8PEM:function(t){var e=this.getHexFromPEM(t,"PUBLIC KEY"),n=this.getKeyFromPublicPKCS8Hex(e);return n},getKeyFromPublicPKCS8Hex:function(t){var e=this.parsePublicPKCS8Hex(t);if("2a864886f70d010101"==e.algoid){var n=this.parsePublicRawRSAKeyHex(e.key),r=new ve;return r.setPublic(n.n,n.e),r}if("2a8648ce3d0201"==e.algoid){if(void 0===Cr.crypto.OID.oidhex2name[e.algparam])throw"KJUR.crypto.OID.oidhex2name undefined: "+e.algparam;var i=Cr.crypto.OID.oidhex2name[e.algparam],r=new Cr.crypto.ECDSA({curve:i,pub:e.key});return r}if("2a8648ce380401"==e.algoid){var s=e.algparam,a=Or.getHexOfV_AtObj(e.key,0),r=new Cr.crypto.DSA;return r.setPublic(new o(s.p,16),new o(s.q,16),new o(s.g,16),new o(a,16)),r}throw"unsupported public key algorithm"},parsePublicRawRSAKeyHex:function(t){var e={};if("30"!=t.substr(0,2))throw"malformed RSA key(code:001)";var n=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=n.length)throw"malformed RSA key(code:002)";if("02"!=t.substr(n[0],2))throw"malformed RSA key(code:003)";if(e.n=Or.getHexOfV_AtObj(t,n[0]),"02"!=t.substr(n[1],2))throw"malformed RSA key(code:004)";return e.e=Or.getHexOfV_AtObj(t,n[1]),e},parsePrivateRawRSAKeyHexAtObj:function(t,e){var n=e.keyidx;if("30"!=t.substr(n,2))throw"malformed RSA private key(code:001)";var r=Or.getPosArrayOfChildren_AtObj(t,n);if(9!=r.length)throw"malformed RSA private key(code:002)";e.key={},e.key.n=Or.getHexOfV_AtObj(t,r[1]),e.key.e=Or.getHexOfV_AtObj(t,r[2]),e.key.d=Or.getHexOfV_AtObj(t,r[3]),e.key.p=Or.getHexOfV_AtObj(t,r[4]),e.key.q=Or.getHexOfV_AtObj(t,r[5]),e.key.dp=Or.getHexOfV_AtObj(t,r[6]),e.key.dq=Or.getHexOfV_AtObj(t,r[7]),e.key.co=Or.getHexOfV_AtObj(t,r[8])},parsePrivateRawECKeyHexAtObj:function(t,e){var n=e.keyidx,r=Or.getVbyList(t,n,[1],"04"),i=Or.getVbyList(t,n,[2,0],"03").substr(2);e.key=r,e.pubkey=i},parsePublicPKCS8Hex:function(t){var e={};e.algparam=null;var n=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=n.length)throw"outer DERSequence shall have 2 elements: "+n.length;var r=n[0];if("30"!=t.substr(r,2))throw"malformed PKCS8 public key(code:001)";var i=Or.getPosArrayOfChildren_AtObj(t,r);if(2!=i.length)throw"malformed PKCS8 public key(code:002)";if("06"!=t.substr(i[0],2))throw"malformed PKCS8 public key(code:003)";if(e.algoid=Or.getHexOfV_AtObj(t,i[0]),"06"==t.substr(i[1],2)?e.algparam=Or.getHexOfV_AtObj(t,i[1]):"30"==t.substr(i[1],2)&&(e.algparam={},e.algparam.p=Or.getVbyList(t,i[1],[0],"02"),e.algparam.q=Or.getVbyList(t,i[1],[1],"02"),e.algparam.g=Or.getVbyList(t,i[1],[2],"02")),"03"!=t.substr(n[1],2))throw"malformed PKCS8 public key(code:004)";return e.key=Or.getHexOfV_AtObj(t,n[1]).substr(2),e},getRSAKeyFromPublicPKCS8Hex:function(t){var e=Or.getPosArrayOfChildren_AtObj(t,0);if(2!=e.length)throw"outer DERSequence shall have 2 elements: "+e.length;var n=Or.getHexOfTLV_AtObj(t,e[0]);if("300d06092a864886f70d0101010500"!=n)throw"PKCS8 AlgorithmId is not rsaEncryption";if("03"!=t.substr(e[1],2))throw"PKCS8 Public Key is not BITSTRING encapslated.";var r=Or.getStartPosOfV_AtObj(t,e[1])+2;if("30"!=t.substr(r,2))throw"PKCS8 Public Key is not SEQUENCE.";var i=Or.getPosArrayOfChildren_AtObj(t,r);if(2!=i.length)throw"inner DERSequence shall have 2 elements: "+i.length;if("02"!=t.substr(i[0],2))throw"N is not ASN.1 INTEGER";if("02"!=t.substr(i[1],2))throw"E is not ASN.1 INTEGER";var s=Or.getHexOfV_AtObj(t,i[0]),o=Or.getHexOfV_AtObj(t,i[1]),a=new ve;return a.setPublic(s,o),a}}}();Rr.getKey=function(t,e,n){if("undefined"!=typeof ve&&t instanceof ve)return t;if("undefined"!=typeof Cr.crypto.ECDSA&&t instanceof Cr.crypto.ECDSA)return t;if("undefined"!=typeof Cr.crypto.DSA&&t instanceof Cr.crypto.DSA)return t;if(void 0!==t.curve&&void 0!==t.xy&&void 0===t.d)return new Cr.crypto.ECDSA({pub:t.xy,curve:t.curve});if(void 0!==t.curve&&void 0!==t.d)return new Cr.crypto.ECDSA({prv:t.d,curve:t.curve});if(void 0===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0===t.d){var r=new ve;return r.setPublic(t.n,t.e),r}if(void 0===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d&&void 0!==t.p&&void 0!==t.q&&void 0!==t.dp&&void 0!==t.dq&&void 0!==t.co&&void 0===t.qi){var r=new ve;return r.setPrivateEx(t.n,t.e,t.d,t.p,t.q,t.dp,t.dq,t.co),r}if(void 0===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d&&void 0===t.p){var r=new ve;return r.setPrivate(t.n,t.e,t.d),r}if(void 0!==t.p&&void 0!==t.q&&void 0!==t.g&&void 0!==t.y&&void 0===t.x){var r=new Cr.crypto.DSA;return r.setPublic(t.p,t.q,t.g,t.y),r}if(void 0!==t.p&&void 0!==t.q&&void 0!==t.g&&void 0!==t.y&&void 0!==t.x){var r=new Cr.crypto.DSA;return r.setPrivate(t.p,t.q,t.g,t.y,t.x),r}if("RSA"===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0===t.d){var r=new ve;return r.setPublic(pn(t.n),pn(t.e)),r}if("RSA"===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d&&void 0!==t.p&&void 0!==t.q&&void 0!==t.dp&&void 0!==t.dq&&void 0!==t.qi){var r=new ve;return r.setPrivateEx(pn(t.n),pn(t.e),pn(t.d),pn(t.p),pn(t.q),pn(t.dp),pn(t.dq),pn(t.qi)),r}if("RSA"===t.kty&&void 0!==t.n&&void 0!==t.e&&void 0!==t.d){var r=new ve;return r.setPrivate(pn(t.n),pn(t.e),pn(t.d)),r}if("EC"===t.kty&&void 0!==t.crv&&void 0!==t.x&&void 0!==t.y&&void 0===t.d){var i=new Cr.crypto.ECDSA({curve:t.crv}),s=i.ecparams.keylen/4,a=("0000000000"+pn(t.x)).slice(-s),u=("0000000000"+pn(t.y)).slice(-s),h="04"+a+u;return i.setPublicKeyHex(h),i}if("EC"===t.kty&&void 0!==t.crv&&void 0!==t.x&&void 0!==t.y&&void 0!==t.d){var i=new Cr.crypto.ECDSA({curve:t.crv}),s=i.ecparams.keylen/4,a=("0000000000"+pn(t.x)).slice(-s),u=("0000000000"+pn(t.y)).slice(-s),h="04"+a+u,c=("0000000000"+pn(t.d)).slice(-s);return i.setPublicKeyHex(h),i.setPrivateKeyHex(c),i}if(t.indexOf("-END CERTIFICATE-",0)!=-1||t.indexOf("-END X509 CERTIFICATE-",0)!=-1||t.indexOf("-END TRUSTED CERTIFICATE-",0)!=-1)return $n.getPublicKeyFromCertPEM(t);if("pkcs8pub"===n)return Rr.getKeyFromPublicPKCS8Hex(t);if(t.indexOf("-END PUBLIC KEY-")!=-1)return Rr.getKeyFromPublicPKCS8PEM(t);if("pkcs5prv"===n){var r=new ve;return r.readPrivateKeyFromASN1HexString(t),r}if("pkcs5prv"===n){var r=new ve;return r.readPrivateKeyFromASN1HexString(t),r}if(t.indexOf("-END RSA PRIVATE KEY-")!=-1&&t.indexOf("4,ENCRYPTED")==-1){var f=Rr.getHexFromPEM(t,"RSA PRIVATE KEY");return Rr.getKey(f,null,"pkcs5prv")}if(t.indexOf("-END DSA PRIVATE KEY-")!=-1&&t.indexOf("4,ENCRYPTED")==-1){var l=this.getHexFromPEM(t,"DSA PRIVATE KEY"),d=Or.getVbyList(l,0,[1],"02"),g=Or.getVbyList(l,0,[2],"02"),p=Or.getVbyList(l,0,[3],"02"),y=Or.getVbyList(l,0,[4],"02"),v=Or.getVbyList(l,0,[5],"02"),r=new Cr.crypto.DSA;return r.setPrivate(new o(d,16),new o(g,16),new o(p,16),new o(y,16),new o(v,16)),r}if(t.indexOf("-END PRIVATE KEY-")!=-1)return Rr.getKeyFromPlainPrivatePKCS8PEM(t);if(t.indexOf("-END RSA PRIVATE KEY-")!=-1&&t.indexOf("4,ENCRYPTED")!=-1)return Rr.getRSAKeyFromEncryptedPKCS5PEM(t,e);if(t.indexOf("-END EC PRIVATE KEY-")!=-1&&t.indexOf("4,ENCRYPTED")!=-1){var l=Rr.getDecryptedKeyHex(t,e),r=Or.getVbyList(l,0,[1],"04"),m=Or.getVbyList(l,0,[2,0],"06"),S=Or.getVbyList(l,0,[3,0],"03").substr(2),b="";if(void 0===Cr.crypto.OID.oidhex2name[m])throw"undefined OID(hex) in KJUR.crypto.OID: "+m;b=Cr.crypto.OID.oidhex2name[m];var i=new Cr.crypto.ECDSA({name:b});return i.setPublicKeyHex(S),i.setPrivateKeyHex(r),i.isPublic=!1,i}if(t.indexOf("-END DSA PRIVATE KEY-")!=-1&&t.indexOf("4,ENCRYPTED")!=-1){var l=Rr.getDecryptedKeyHex(t,e),d=Or.getVbyList(l,0,[1],"02"),g=Or.getVbyList(l,0,[2],"02"),p=Or.getVbyList(l,0,[3],"02"),y=Or.getVbyList(l,0,[4],"02"),v=Or.getVbyList(l,0,[5],"02"),r=new Cr.crypto.DSA;return r.setPrivate(new o(d,16),new o(g,16),new o(p,16),new o(y,16),new o(v,16)),r}if(t.indexOf("-END ENCRYPTED PRIVATE KEY-")!=-1)return Rr.getKeyFromEncryptedPKCS8PEM(t,e);throw"not supported argument"},Rr.generateKeypair=function(t,e){if("RSA"==t){var n=e,r=new ve;r.generate(n,"10001"),r.isPrivate=!0,r.isPublic=!0;var i=new ve,s=r.n.toString(16),o=r.e.toString(16);i.setPublic(s,o),i.isPrivate=!1,i.isPublic=!0;var a={};return a.prvKeyObj=r,a.pubKeyObj=i,a}if("EC"==t){var u=e,h=new Cr.crypto.ECDSA({curve:u}),c=h.generateKeyPairHex(),r=new Cr.crypto.ECDSA({curve:u});r.setPublicKeyHex(c.ecpubhex),r.setPrivateKeyHex(c.ecprvhex),r.isPrivate=!0,r.isPublic=!1;var i=new Cr.crypto.ECDSA({curve:u});i.setPublicKeyHex(c.ecpubhex),i.isPrivate=!1,i.isPublic=!0;var a={};return a.prvKeyObj=r,a.pubKeyObj=i,a}throw"unknown algorithm: "+t},Rr.getPEM=function(t,e,n,r,i){function s(t){var e=Cr.asn1.ASN1Util.newObject({seq:[{int:0},{int:{bigint:t.n}},{int:t.e},{int:{bigint:t.d}},{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.dmp1}},{int:{bigint:t.dmq1}},{int:{bigint:t.coeff}}]});return e}function o(t){var e=Cr.asn1.ASN1Util.newObject({seq:[{int:1},{octstr:{hex:t.prvKeyHex}},{tag:["a0",!0,{oid:{name:t.curveName}}]},{tag:["a1",!0,{bitstr:{hex:"00"+t.pubKeyHex}}]}]});return e}function a(t){var e=Cr.asn1.ASN1Util.newObject({seq:[{int:0},{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.g}},{int:{bigint:t.y}},{int:{bigint:t.x}}]});return e}var u=Cr.asn1,h=Cr.crypto;if(("undefined"!=typeof ve&&t instanceof ve||"undefined"!=typeof h.DSA&&t instanceof h.DSA||"undefined"!=typeof h.ECDSA&&t instanceof h.ECDSA)&&1==t.isPublic&&(void 0===e||"PKCS8PUB"==e)){var c=new Cr.asn1.x509.SubjectPublicKeyInfo(t),f=c.getEncodedHex();return u.ASN1Util.getPEMStringFromHex(f,"PUBLIC KEY")}if("PKCS1PRV"==e&&"undefined"!=typeof ve&&t instanceof ve&&(void 0===n||null==n)&&1==t.isPrivate){var c=s(t),f=c.getEncodedHex();return u.ASN1Util.getPEMStringFromHex(f,"RSA PRIVATE KEY")}if("PKCS1PRV"==e&&"undefined"!=typeof ve&&t instanceof Cr.crypto.ECDSA&&(void 0===n||null==n)&&1==t.isPrivate){var l=new Cr.asn1.DERObjectIdentifier({name:t.curveName}),d=l.getEncodedHex(),g=o(t),p=g.getEncodedHex(),y="";return y+=u.ASN1Util.getPEMStringFromHex(d,"EC PARAMETERS"),y+=u.ASN1Util.getPEMStringFromHex(p,"EC PRIVATE KEY")}if("PKCS1PRV"==e&&"undefined"!=typeof Cr.crypto.DSA&&t instanceof Cr.crypto.DSA&&(void 0===n||null==n)&&1==t.isPrivate){var c=a(t),f=c.getEncodedHex();return u.ASN1Util.getPEMStringFromHex(f,"DSA PRIVATE KEY")}if("PKCS5PRV"==e&&"undefined"!=typeof ve&&t instanceof ve&&void 0!==n&&null!=n&&1==t.isPrivate){var c=s(t),f=c.getEncodedHex();return void 0===r&&(r="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("RSA",f,n,r)}if("PKCS5PRV"==e&&"undefined"!=typeof Cr.crypto.ECDSA&&t instanceof Cr.crypto.ECDSA&&void 0!==n&&null!=n&&1==t.isPrivate){var c=o(t),f=c.getEncodedHex();return void 0===r&&(r="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("EC",f,n,r)}if("PKCS5PRV"==e&&"undefined"!=typeof Cr.crypto.DSA&&t instanceof Cr.crypto.DSA&&void 0!==n&&null!=n&&1==t.isPrivate){var c=a(t),f=c.getEncodedHex();return void 0===r&&(r="DES-EDE3-CBC"),this.getEncryptedPKCS5PEMFromPrvKeyHex("DSA",f,n,r)}var v=function(t,e){var n=m(t,e),r=new Cr.asn1.ASN1Util.newObject({seq:[{seq:[{oid:{name:"pkcs5PBES2"}},{seq:[{seq:[{oid:{name:"pkcs5PBKDF2"}},{seq:[{octstr:{hex:n.pbkdf2Salt}},{int:n.pbkdf2Iter}]}]},{seq:[{oid:{name:"des-EDE3-CBC"}},{octstr:{hex:n.encryptionSchemeIV}}]}]}]},{octstr:{hex:n.ciphertext}}]});return r.getEncodedHex()},m=function(t,e){var n=100,r=or.lib.WordArray.random(8),i="DES-EDE3-CBC",s=or.lib.WordArray.random(8),o=or.PBKDF2(e,r,{keySize:6,iterations:n}),a=or.enc.Hex.parse(t),u=or.TripleDES.encrypt(a,o,{iv:s})+"",h={};return h.ciphertext=u,h.pbkdf2Salt=or.enc.Hex.stringify(r),h.pbkdf2Iter=n,h.encryptionSchemeAlg=i,h.encryptionSchemeIV=or.enc.Hex.stringify(s),h};if("PKCS8PRV"==e&&"undefined"!=typeof ve&&t instanceof ve&&1==t.isPrivate){var S=s(t),b=S.getEncodedHex(),c=Cr.asn1.ASN1Util.newObject({seq:[{int:0},{seq:[{oid:{name:"rsaEncryption"}},{null:!0}]},{octstr:{hex:b}}]}),f=c.getEncodedHex();if(void 0===n||null==n)return u.ASN1Util.getPEMStringFromHex(f,"PRIVATE KEY");var p=v(f,n);return u.ASN1Util.getPEMStringFromHex(p,"ENCRYPTED PRIVATE KEY");
}if("PKCS8PRV"==e&&"undefined"!=typeof Cr.crypto.ECDSA&&t instanceof Cr.crypto.ECDSA&&1==t.isPrivate){var S=new Cr.asn1.ASN1Util.newObject({seq:[{int:1},{octstr:{hex:t.prvKeyHex}},{tag:["a1",!0,{bitstr:{hex:"00"+t.pubKeyHex}}]}]}),b=S.getEncodedHex(),c=Cr.asn1.ASN1Util.newObject({seq:[{int:0},{seq:[{oid:{name:"ecPublicKey"}},{oid:{name:t.curveName}}]},{octstr:{hex:b}}]}),f=c.getEncodedHex();if(void 0===n||null==n)return u.ASN1Util.getPEMStringFromHex(f,"PRIVATE KEY");var p=v(f,n);return u.ASN1Util.getPEMStringFromHex(p,"ENCRYPTED PRIVATE KEY")}if("PKCS8PRV"==e&&"undefined"!=typeof Cr.crypto.DSA&&t instanceof Cr.crypto.DSA&&1==t.isPrivate){var S=new Cr.asn1.DERInteger({bigint:t.x}),b=S.getEncodedHex(),c=Cr.asn1.ASN1Util.newObject({seq:[{int:0},{seq:[{oid:{name:"dsa"}},{seq:[{int:{bigint:t.p}},{int:{bigint:t.q}},{int:{bigint:t.g}}]}]},{octstr:{hex:b}}]}),f=c.getEncodedHex();if(void 0===n||null==n)return u.ASN1Util.getPEMStringFromHex(f,"PRIVATE KEY");var p=v(f,n);return u.ASN1Util.getPEMStringFromHex(p,"ENCRYPTED PRIVATE KEY")}throw"unsupported object nor format"},Rr.getKeyFromCSRPEM=function(t){var e=Rr.getHexFromPEM(t,"CERTIFICATE REQUEST"),n=Rr.getKeyFromCSRHex(e);return n},Rr.getKeyFromCSRHex=function(t){var e=Rr.parseCSRHex(t),n=Rr.getKey(e.p8pubkeyhex,null,"pkcs8pub");return n},Rr.parseCSRHex=function(t){var e={},n=t;if("30"!=n.substr(0,2))throw"malformed CSR(code:001)";var r=Or.getPosArrayOfChildren_AtObj(n,0);if(r.length<1)throw"malformed CSR(code:002)";if("30"!=n.substr(r[0],2))throw"malformed CSR(code:003)";var i=Or.getPosArrayOfChildren_AtObj(n,r[0]);if(i.length<3)throw"malformed CSR(code:004)";return e.p8pubkeyhex=Or.getHexOfTLV_AtObj(n,i[2]),e},Rr.getJWKFromKey=function(t){var e={};if(t instanceof ve&&t.isPrivate)return e.kty="RSA",e.n=gn(t.n.toString(16)),e.e=gn(t.e.toString(16)),e.d=gn(t.d.toString(16)),e.p=gn(t.p.toString(16)),e.q=gn(t.q.toString(16)),e.dp=gn(t.dmp1.toString(16)),e.dq=gn(t.dmq1.toString(16)),e.qi=gn(t.coeff.toString(16)),e;if(t instanceof ve&&t.isPublic)return e.kty="RSA",e.n=gn(t.n.toString(16)),e.e=gn(t.e.toString(16)),e;if(t instanceof Cr.crypto.ECDSA&&t.isPrivate){var n=t.getShortNISTPCurveName();if("P-256"!==n&&"P-384"!==n)throw"unsupported curve name for JWT: "+n;var r=t.getPublicKeyXYHex();return e.kty="EC",e.crv=n,e.x=gn(r.x),e.y=gn(r.y),e.d=gn(t.prvKeyHex),e}if(t instanceof Cr.crypto.ECDSA&&t.isPublic){var n=t.getShortNISTPCurveName();if("P-256"!==n&&"P-384"!==n)throw"unsupported curve name for JWT: "+n;var r=t.getPublicKeyXYHex();return e.kty="EC",e.crv=n,e.x=gn(r.x),e.y=gn(r.y),e}throw"not supported key object"},ve.prototype.readPrivateKeyFromPEMString=Hn,ve.prototype.readPrivateKeyFromASN1HexString=jn;/*! rsasign-1.2.7.js (c) 2012 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
var Ir=new RegExp("");Ir.compile("[^0-9a-f]","gi"),ve.prototype.signWithMessageHash=kn,ve.prototype.signString=In,ve.prototype.signStringWithSHA1=Bn,ve.prototype.signStringWithSHA256=Nn,ve.prototype.sign=In,ve.prototype.signWithSHA1=Bn,ve.prototype.signWithSHA256=Nn,ve.prototype.signWithMessageHashPSS=Kn,ve.prototype.signStringPSS=Mn,ve.prototype.signPSS=Mn,ve.SALT_LEN_HLEN=-1,ve.SALT_LEN_MAX=-2,ve.prototype.verifyWithMessageHash=Yn,ve.prototype.verifyString=zn,ve.prototype.verifyHexSignatureForMessage=Jn,ve.prototype.verify=zn,ve.prototype.verifyHexSignatureForByteArrayMessage=Jn,ve.prototype.verifyWithMessageHashPSS=Xn,ve.prototype.verifyStringPSS=Gn,ve.prototype.verifyPSS=Gn,ve.SALT_LEN_RECOVER=-2,$n.pemToBase64=function(t){var e=t;return e=e.replace("-----BEGIN CERTIFICATE-----",""),e=e.replace("-----END CERTIFICATE-----",""),e=e.replace(/[ \n]+/g,"")},$n.pemToHex=function(t){var e=$n.pemToBase64(t),n=i(e);return n},$n.getSubjectPublicKeyPosFromCertHex=function(t){var e=$n.getSubjectPublicKeyInfoPosFromCertHex(t);if(e==-1)return-1;var n=Or.getPosArrayOfChildren_AtObj(t,e);if(2!=n.length)return-1;var r=n[1];if("03"!=t.substring(r,r+2))return-1;var i=Or.getStartPosOfV_AtObj(t,r);return"00"!=t.substring(i,i+2)?-1:i+2},$n.getSubjectPublicKeyInfoPosFromCertHex=function(t){var e=Or.getStartPosOfV_AtObj(t,0),n=Or.getPosArrayOfChildren_AtObj(t,e);return n.length<1?-1:"a003020102"==t.substring(n[0],n[0]+10)?n.length<6?-1:n[6]:n.length<5?-1:n[5]},$n.getPublicKeyHexArrayFromCertHex=function(t){var e=$n.getSubjectPublicKeyPosFromCertHex(t),n=Or.getPosArrayOfChildren_AtObj(t,e);if(2!=n.length)return[];var r=Or.getHexOfV_AtObj(t,n[0]),i=Or.getHexOfV_AtObj(t,n[1]);return null!=r&&null!=i?[r,i]:[]},$n.getHexTbsCertificateFromCert=function(t){var e=Or.getStartPosOfV_AtObj(t,0);return e},$n.getPublicKeyHexArrayFromCertPEM=function(t){var e=$n.pemToHex(t),n=$n.getPublicKeyHexArrayFromCertHex(e);return n},$n.hex2dn=function(t){for(var e="",n=Or.getPosArrayOfChildren_AtObj(t,0),r=0;r<n.length;r++){var i=Or.getHexOfTLV_AtObj(t,n[r]);e=e+"/"+$n.hex2rdn(i)}return e},$n.hex2rdn=function(t){var e=Or.getDecendantHexTLVByNthList(t,0,[0,0]),n=Or.getDecendantHexVByNthList(t,0,[0,1]),r="";try{r=$n.DN_ATTRHEX[e]}catch(t){r=e}n=n.replace(/(..)/g,"%$1");var i=decodeURIComponent(n);return r+"="+i},$n.DN_ATTRHEX={"0603550406":"C","060355040a":"O","060355040b":"OU","0603550403":"CN","0603550405":"SN","0603550408":"ST","0603550407":"L","0603550409":"streetAddress","060355040f":"businessCategory","0603550411":"postalCode","060b2b0601040182373c020102":"jurisdictionOfIncorporationSP","060b2b0601040182373c020103":"jurisdictionOfIncorporationC"},$n.getPublicKeyFromCertPEM=function(t){var e=$n.getPublicKeyInfoPropOfCertPEM(t);if("2a864886f70d010101"==e.algoid){var n=Rr.parsePublicRawRSAKeyHex(e.keyhex),r=new ve;return r.setPublic(n.n,n.e),r}if("2a8648ce3d0201"==e.algoid){var i=Cr.crypto.OID.oidhex2name[e.algparam],r=new Cr.crypto.ECDSA({curve:i,info:e.keyhex});return r.setPublicKeyHex(e.keyhex),r}if("2a8648ce380401"==e.algoid){var s=Or.getVbyList(e.algparam,0,[0],"02"),a=Or.getVbyList(e.algparam,0,[1],"02"),u=Or.getVbyList(e.algparam,0,[2],"02"),h=Or.getHexOfV_AtObj(e.keyhex,0);h=h.substr(2);var r=new Cr.crypto.DSA;return r.setPublic(new o(s,16),new o(a,16),new o(u,16),new o(h,16)),r}throw"unsupported key"},$n.getPublicKeyInfoPropOfCertPEM=function(t){var e={};e.algparam=null;var n=$n.pemToHex(t),r=Or.getPosArrayOfChildren_AtObj(n,0);if(3!=r.length)throw"malformed X.509 certificate PEM (code:001)";if("30"!=n.substr(r[0],2))throw"malformed X.509 certificate PEM (code:002)";var i=Or.getPosArrayOfChildren_AtObj(n,r[0]),s=6;if("a0"!==n.substr(i[0],2)&&(s=5),i.length<s+1)throw"malformed X.509 certificate PEM (code:003)";var o=Or.getPosArrayOfChildren_AtObj(n,i[s]);if(2!=o.length)throw"malformed X.509 certificate PEM (code:004)";var a=Or.getPosArrayOfChildren_AtObj(n,o[0]);if(2!=a.length)throw"malformed X.509 certificate PEM (code:005)";if(e.algoid=Or.getHexOfV_AtObj(n,a[0]),"06"==n.substr(a[1],2)?e.algparam=Or.getHexOfV_AtObj(n,a[1]):"30"==n.substr(a[1],2)&&(e.algparam=Or.getHexOfTLV_AtObj(n,a[1])),"03"!=n.substr(o[1],2))throw"malformed X.509 certificate PEM (code:006)";var u=Or.getHexOfV_AtObj(n,o[1]);return e.keyhex=u.substr(2),e},$n.getPublicKeyInfoPosOfCertHEX=function(t){var e=Or.getPosArrayOfChildren_AtObj(t,0);if(3!=e.length)throw"malformed X.509 certificate PEM (code:001)";if("30"!=t.substr(e[0],2))throw"malformed X.509 certificate PEM (code:002)";var n=Or.getPosArrayOfChildren_AtObj(t,e[0]);if(n.length<7)throw"malformed X.509 certificate PEM (code:003)";return n[6]},$n.getV3ExtInfoListOfCertHex=function(t){var e=Or.getPosArrayOfChildren_AtObj(t,0);if(3!=e.length)throw"malformed X.509 certificate PEM (code:001)";if("30"!=t.substr(e[0],2))throw"malformed X.509 certificate PEM (code:002)";var n=Or.getPosArrayOfChildren_AtObj(t,e[0]);if(n.length<8)throw"malformed X.509 certificate PEM (code:003)";if("a3"!=t.substr(n[7],2))throw"malformed X.509 certificate PEM (code:004)";var r=Or.getPosArrayOfChildren_AtObj(t,n[7]);if(1!=r.length)throw"malformed X.509 certificate PEM (code:005)";if("30"!=t.substr(r[0],2))throw"malformed X.509 certificate PEM (code:006)";for(var i=Or.getPosArrayOfChildren_AtObj(t,r[0]),s=i.length,o=new Array(s),a=0;a<s;a++)o[a]=$n.getV3ExtItemInfo_AtObj(t,i[a]);return o},$n.getV3ExtItemInfo_AtObj=function(t,e){var n={};n.posTLV=e;var r=Or.getPosArrayOfChildren_AtObj(t,e);if(2!=r.length&&3!=r.length)throw"malformed X.509v3 Ext (code:001)";if("06"!=t.substr(r[0],2))throw"malformed X.509v3 Ext (code:002)";var i=Or.getHexOfV_AtObj(t,r[0]);n.oid=Or.hextooidstr(i),n.critical=!1,3==r.length&&(n.critical=!0);var s=r[r.length-1];if("04"!=t.substr(s,2))throw"malformed X.509v3 Ext (code:003)";return n.posV=Or.getStartPosOfV_AtObj(t,s),n},$n.getHexOfTLV_V3ExtValue=function(t,e){var n=$n.getPosOfTLV_V3ExtValue(t,e);return n==-1?null:Or.getHexOfTLV_AtObj(t,n)},$n.getHexOfV_V3ExtValue=function(t,e){var n=$n.getPosOfTLV_V3ExtValue(t,e);return n==-1?null:Or.getHexOfV_AtObj(t,n)},$n.getPosOfTLV_V3ExtValue=function(t,e){var n=e;if(e.match(/^[0-9.]+$/)||(n=Cr.asn1.x509.OID.name2oid(e)),""==n)return-1;for(var r=$n.getV3ExtInfoListOfCertHex(t),i=0;i<r.length;i++){var s=r[i];if(s.oid==n)return s.posV}return-1},$n.getExtBasicConstraints=function(t){var e=$n.getHexOfV_V3ExtValue(t,"basicConstraints");if(null===e)return null;if(""===e)return{};if("0101ff"===e)return{cA:!0};if("0101ff02"===e.substr(0,8)){var n=Or.getHexOfV_AtObj(e,6),r=parseInt(n,16);return{cA:!0,pathLen:r}}throw"unknown error"},$n.KEYUSAGE_NAME=["digitalSignature","nonRepudiation","keyEncipherment","dataEncipherment","keyAgreement","keyCertSign","cRLSign","encipherOnly","decipherOnly"],$n.getExtKeyUsageBin=function(t){var e=$n.getHexOfV_V3ExtValue(t,"keyUsage");if(""==e)return"";if(e.length%2!=0||e.length<=2)throw"malformed key usage value";var n=parseInt(e.substr(0,2)),r=parseInt(e.substr(2),16).toString(2);return r.substr(0,r.length-n)},$n.getExtKeyUsageString=function(t){for(var e=$n.getExtKeyUsageBin(t),n=new Array,r=0;r<e.length;r++)"1"==e.substr(r,1)&&n.push($n.KEYUSAGE_NAME[r]);return n.join(",")},$n.getExtSubjectKeyIdentifier=function(t){var e=$n.getHexOfV_V3ExtValue(t,"subjectKeyIdentifier");return e},$n.getExtAuthorityKeyIdentifier=function(t){var e={},n=$n.getHexOfTLV_V3ExtValue(t,"authorityKeyIdentifier");if(null===n)return null;for(var r=Or.getPosArrayOfChildren_AtObj(n,0),i=0;i<r.length;i++)"80"===n.substr(r[i],2)&&(e.kid=Or.getHexOfV_AtObj(n,r[i]));return e},$n.getExtExtKeyUsageName=function(t){var e=new Array,n=$n.getHexOfTLV_V3ExtValue(t,"extKeyUsage");if(null===n)return null;for(var r=Or.getPosArrayOfChildren_AtObj(n,0),i=0;i<r.length;i++){var s=Or.getHexOfV_AtObj(n,r[i]),o=Cr.asn1.ASN1Util.oidHexToInt(s),a=Cr.asn1.x509.OID.oid2name(o);e.push(a)}return e},$n.getExtSubjectAltName=function(t){for(var e=new Array,n=$n.getHexOfTLV_V3ExtValue(t,"subjectAltName"),r=Or.getPosArrayOfChildren_AtObj(n,0),i=0;i<r.length;i++)if("82"===n.substr(r[i],2)){var s=Sn(Or.getHexOfV_AtObj(n,r[i]));e.push(s)}return e},$n.getExtCRLDistributionPointsURI=function(t){for(var e=new Array,n=$n.getHexOfTLV_V3ExtValue(t,"cRLDistributionPoints"),r=Or.getPosArrayOfChildren_AtObj(n,0),i=0;i<r.length;i++)for(var s=Or.getHexOfTLV_AtObj(n,r[i]),o=Or.getPosArrayOfChildren_AtObj(s,0),a=0;a<o.length;a++)if("a0"===s.substr(o[a],2)){var u=Or.getHexOfV_AtObj(s,o[a]);if("a0"===u.substr(0,2)){var h=Or.getHexOfV_AtObj(u,0);if("86"===h.substr(0,2)){var c=Or.getHexOfV_AtObj(h,0),f=Sn(c);e.push(f)}}}return e},$n.getExtAIAInfo=function(t){var e={};e.ocsp=[],e.caissuer=[];var n=$n.getPosOfTLV_V3ExtValue(t,"authorityInfoAccess");if(n==-1)return null;if("30"!=t.substr(n,2))throw"malformed AIA Extn Value";for(var r=Or.getPosArrayOfChildren_AtObj(t,n),i=0;i<r.length;i++){var s=r[i],o=Or.getPosArrayOfChildren_AtObj(t,s);if(2!=o.length)throw"malformed AccessDescription of AIA Extn";var a=o[0],u=o[1];"2b06010505073001"==Or.getHexOfV_AtObj(t,a)&&"86"==t.substr(u,2)&&e.ocsp.push(Sn(Or.getHexOfV_AtObj(t,u))),"2b06010505073002"==Or.getHexOfV_AtObj(t,a)&&"86"==t.substr(u,2)&&e.caissuer.push(Sn(Or.getHexOfV_AtObj(t,u)))}return e},$n.getSignatureAlgorithmName=function(t){var e=Or.getDecendantHexVByNthList(t,0,[1,0]),n=Cr.asn1.ASN1Util.oidHexToInt(e),r=Cr.asn1.x509.OID.oid2name(n);return r},$n.getSignatureValueHex=function(t){var e=Or.getDecendantHexVByNthList(t,0,[2]);if("00"!==e.substr(0,2))throw"can't get signature value";return e.substr(2)},$n.getSerialNumberHex=function(t){return Or.getDecendantHexVByNthList(t,0,[0,1])},/*! jws-3.3.4 (c) 2013-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.jws&&Cr.jws||(Cr.jws={}),Cr.jws.JWS=function(){var t=Cr.jws.JWS;this.parseJWS=function(e,n){if(void 0===this.parsedJWS||!n&&void 0===this.parsedJWS.sigvalH){if(null==e.match(/^([^.]+)\.([^.]+)\.([^.]+)$/))throw"JWS signature is not a form of 'Head.Payload.SigValue'.";var r=RegExp.$1,i=RegExp.$2,s=RegExp.$3,o=r+"."+i;if(this.parsedJWS={},this.parsedJWS.headB64U=r,this.parsedJWS.payloadB64U=i,this.parsedJWS.sigvalB64U=s,this.parsedJWS.si=o,!n){var a=pn(s),u=de(a,16);this.parsedJWS.sigvalH=a,this.parsedJWS.sigvalBI=u}var h=Dr(r),c=Dr(i);if(this.parsedJWS.headS=h,this.parsedJWS.payloadS=c,!t.isSafeJSONString(h,this.parsedJWS,"headP"))throw"malformed JSON string for JWS Head: "+h}}},Cr.jws.JWS.sign=function(t,e,n,r,i){var s,o,a,u=Cr.jws.JWS;if("string"!=typeof e&&"object"!=typeof e)throw"spHeader must be JSON string or object: "+e;if("object"==typeof e&&(o=e,s=JSON.stringify(o)),"string"==typeof e){if(s=e,!u.isSafeJSONString(s))throw"JWS Head is not safe JSON string: "+s;o=u.readSafeJSONString(s)}if(a=n,"object"==typeof n&&(a=JSON.stringify(n)),""!=t&&null!=t||void 0===o.alg||(t=o.alg),""!=t&&null!=t&&void 0===o.alg&&(o.alg=t,s=JSON.stringify(o)),t!==o.alg)throw"alg and sHeader.alg doesn't match: "+t+"!="+o.alg;var h=null;if(void 0===u.jwsalg2sigalg[t])throw"unsupported alg name: "+t;h=u.jwsalg2sigalg[t];var c=Tr(s),f=Tr(a),l=c+"."+f,d="";if("Hmac"==h.substr(0,4)){if(void 0===r)throw"mac key shall be specified for HS* alg";var g=new Cr.crypto.Mac({alg:h,prov:"cryptojs",pass:r});g.updateString(l),d=g.doFinal()}else if(h.indexOf("withECDSA")!=-1){var p=new Cr.crypto.Signature({alg:h});p.init(r,i),p.updateString(l),hASN1Sig=p.sign(),d=Cr.crypto.ECDSA.asn1SigToConcatSig(hASN1Sig)}else if("none"!=h){var p=new Cr.crypto.Signature({alg:h});p.init(r,i),p.updateString(l),d=p.sign()}var y=gn(d);return l+"."+y},Cr.jws.JWS.verify=function(t,e,n){var r=Cr.jws.JWS,i=t.split("."),s=i[0],o=i[1],a=s+"."+o,u=pn(i[2]),h=r.readSafeJSONString(Dr(i[0])),c=null,f=null;if(void 0===h.alg)throw"algorithm not specified in header";if(c=h.alg,f=c.substr(0,2),null!=n&&"[object Array]"===Object.prototype.toString.call(n)&&n.length>0){var l=":"+n.join(":")+":";if(l.indexOf(":"+c+":")==-1)throw"algorithm '"+c+"' not accepted in the list"}if("none"!=c&&null===e)throw"key shall be specified to verify.";if("string"==typeof e&&e.indexOf("-----BEGIN ")!=-1&&(e=Rr.getKey(e)),!("RS"!=f&&"PS"!=f||e instanceof ve))throw"key shall be a RSAKey obj for RS* and PS* algs";if("ES"==f&&!(e instanceof Cr.crypto.ECDSA))throw"key shall be a ECDSA obj for ES* algs";var d=null;if(void 0===r.jwsalg2sigalg[h.alg])throw"unsupported alg name: "+c;if(d=r.jwsalg2sigalg[c],"none"==d)throw"not supported";if("Hmac"==d.substr(0,4)){var g=null;if(void 0===e)throw"hexadecimal key shall be specified for HMAC";var p=new Cr.crypto.Mac({alg:d,pass:e});return p.updateString(a),g=p.doFinal(),u==g}if(d.indexOf("withECDSA")!=-1){var y=null;try{y=Cr.crypto.ECDSA.concatSigToASN1Sig(u)}catch(t){return!1}var v=new Cr.crypto.Signature({alg:d});return v.init(e),v.updateString(a),v.verify(y)}var v=new Cr.crypto.Signature({alg:d});return v.init(e),v.updateString(a),v.verify(u)},Cr.jws.JWS.parse=function(t){var e,n,r,i=t.split("."),s={};if(2!=i.length&&3!=i.length)throw"malformed sJWS: wrong number of '.' splitted elements";return e=i[0],n=i[1],3==i.length&&(r=i[2]),s.headerObj=Cr.jws.JWS.readSafeJSONString(Dr(e)),s.payloadObj=Cr.jws.JWS.readSafeJSONString(Dr(n)),s.headerPP=JSON.stringify(s.headerObj,null,"  "),null==s.payloadObj?s.payloadPP=Dr(n):s.payloadPP=JSON.stringify(s.payloadObj,null,"  "),void 0!==r&&(s.sigHex=pn(r)),s},Cr.jws.JWS.verifyJWT=function(t,e,n){var r=Cr.jws.JWS,i=t.split("."),s=i[0],o=i[1],a=(pn(i[2]),r.readSafeJSONString(Dr(s))),u=r.readSafeJSONString(Dr(o));if(void 0===a.alg)return!1;if(void 0===n.alg)throw"acceptField.alg shall be specified";if(!r.inArray(a.alg,n.alg))return!1;if(void 0!==u.iss&&"object"==typeof n.iss&&!r.inArray(u.iss,n.iss))return!1;if(void 0!==u.sub&&"object"==typeof n.sub&&!r.inArray(u.sub,n.sub))return!1;if(void 0!==u.aud&&"object"==typeof n.aud)if("string"==typeof u.aud){if(!r.inArray(u.aud,n.aud))return!1}else if("object"==typeof u.aud&&!r.includedArray(u.aud,n.aud))return!1;var h=Cr.jws.IntDate.getNow();return void 0!==n.verifyAt&&"number"==typeof n.verifyAt&&(h=n.verifyAt),void 0!==n.gracePeriod&&"number"==typeof n.gracePeriod||(n.gracePeriod=0),!(void 0!==u.exp&&"number"==typeof u.exp&&u.exp+n.gracePeriod<h)&&(!(void 0!==u.nbf&&"number"==typeof u.nbf&&h<u.nbf-n.gracePeriod)&&(!(void 0!==u.iat&&"number"==typeof u.iat&&h<u.iat-n.gracePeriod)&&((void 0===u.jti||void 0===n.jti||u.jti===n.jti)&&!!Cr.jws.JWS.verify(t,e,n.alg))))},Cr.jws.JWS.includedArray=function(t,e){var n=Cr.jws.JWS.inArray;if(null===t)return!1;if("object"!=typeof t)return!1;if("number"!=typeof t.length)return!1;for(var r=0;r<t.length;r++)if(!n(t[r],e))return!1;return!0},Cr.jws.JWS.inArray=function(t,e){if(null===e)return!1;if("object"!=typeof e)return!1;if("number"!=typeof e.length)return!1;for(var n=0;n<e.length;n++)if(e[n]==t)return!0;return!1},Cr.jws.JWS.jwsalg2sigalg={HS256:"HmacSHA256",HS384:"HmacSHA384",HS512:"HmacSHA512",RS256:"SHA256withRSA",RS384:"SHA384withRSA",RS512:"SHA512withRSA",ES256:"SHA256withECDSA",ES384:"SHA384withECDSA",PS256:"SHA256withRSAandMGF1",PS384:"SHA384withRSAandMGF1",PS512:"SHA512withRSAandMGF1",none:"none"},Cr.jws.JWS.isSafeJSONString=function(t,e,n){var r=null;try{return r=Pr(t),"object"!=typeof r?0:r.constructor===Array?0:(e&&(e[n]=r),1)}catch(t){return 0}},Cr.jws.JWS.readSafeJSONString=function(t){var e=null;try{return e=Pr(t),"object"!=typeof e?null:e.constructor===Array?null:e}catch(t){return null}},Cr.jws.JWS.getEncodedSignatureValueFromJWS=function(t){if(null==t.match(/^[^.]+\.[^.]+\.([^.]+)$/))throw"JWS signature is not a form of 'Head.Payload.SigValue'.";return RegExp.$1},Cr.jws.JWS.getJWKthumbprint=function(t){if("RSA"!==t.kty&&"EC"!==t.kty&&"oct"!==t.kty)throw"unsupported algorithm for JWK Thumprint";var e="{";if("RSA"===t.kty){if("string"!=typeof t.n||"string"!=typeof t.e)throw"wrong n and e value for RSA key";e+='"e":"'+t.e+'",',e+='"kty":"'+t.kty+'",',e+='"n":"'+t.n+'"}'}else if("EC"===t.kty){if("string"!=typeof t.crv||"string"!=typeof t.x||"string"!=typeof t.y)throw"wrong crv, x and y value for EC key";e+='"crv":"'+t.crv+'",',e+='"kty":"'+t.kty+'",',e+='"x":"'+t.x+'",',e+='"y":"'+t.y+'"}'}else if("oct"===t.kty){if("string"!=typeof t.k)throw"wrong k value for oct(symmetric) key";e+='"kty":"'+t.kty+'",',e+='"k":"'+t.k+'"}'}var n=wn(e),r=Cr.crypto.Util.hashHex(n,"sha256"),i=gn(r);return i},Cr.jws.IntDate={},Cr.jws.IntDate.get=function(t){if("now"==t)return Cr.jws.IntDate.getNow();if("now + 1hour"==t)return Cr.jws.IntDate.getNow()+3600;if("now + 1day"==t)return Cr.jws.IntDate.getNow()+86400;if("now + 1month"==t)return Cr.jws.IntDate.getNow()+2592e3;if("now + 1year"==t)return Cr.jws.IntDate.getNow()+31536e3;if(t.match(/Z$/))return Cr.jws.IntDate.getZulu(t);if(t.match(/^[0-9]+$/))return parseInt(t);throw"unsupported format: "+t},Cr.jws.IntDate.getZulu=function(t){var e;if(e=t.match(/(\d+)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)Z/)){var n=RegExp.$1,r=parseInt(n);if(4==n.length);else{if(2!=n.length)throw"malformed year string";if(50<=r&&r<100)r=1900+r;else{if(!(0<=r&&r<50))throw"malformed year string for UTCTime";r=2e3+r}}var i=parseInt(RegExp.$2)-1,s=parseInt(RegExp.$3),o=parseInt(RegExp.$4),a=parseInt(RegExp.$5),u=parseInt(RegExp.$6),h=new Date(Date.UTC(r,i,s,o,a,u));return~~(h/1e3)}throw"unsupported format: "+t},Cr.jws.IntDate.getNow=function(){var t=~~(new Date/1e3);return t},Cr.jws.IntDate.intDate2UTCString=function(t){var e=new Date(1e3*t);return e.toUTCString()},Cr.jws.IntDate.intDate2Zulu=function(t){var e=new Date(1e3*t),n=("0000"+e.getUTCFullYear()).slice(-4),r=("00"+(e.getUTCMonth()+1)).slice(-2),i=("00"+e.getUTCDate()).slice(-2),s=("00"+e.getUTCHours()).slice(-2),o=("00"+e.getUTCMinutes()).slice(-2),a=("00"+e.getUTCSeconds()).slice(-2);return n+r+i+s+o+a+"Z"},/*! jwsjs-2.1.0 (c) 2010-2016 Kenji Urushima | kjur.github.com/jsrsasign/license
	 */
"undefined"!=typeof Cr&&Cr||(Cr={}),"undefined"!=typeof Cr.jws&&Cr.jws||(Cr.jws={}),Cr.jws.JWSJS=function(){var t=Cr.jws.JWS,e=Cr.jws.JWS;this.aHeader=[],this.sPayload="",this.aSignature=[],this.init=function(){this.aHeader=[],this.sPayload=void 0,this.aSignature=[]},this.initWithJWS=function(t){this.init();var e=t.split(".");if(3!=e.length)throw"malformed input JWS";this.aHeader.push(e[0]),this.sPayload=e[1],this.aSignature.push(e[2])},this.addSignature=function(t,e,n,r){if(void 0===this.sPayload||null===this.sPayload)throw"there's no JSON-JS signature to add.";var i=this.aHeader.length;if(this.aHeader.length!=this.aSignature.length)throw"aHeader.length != aSignature.length";try{var s=Cr.jws.JWS.sign(t,e,this.sPayload,n,r),o=s.split(".");o[0],o[2];this.aHeader.push(o[0]),this.aSignature.push(o[2])}catch(t){throw this.aHeader.length>i&&this.aHeader.pop(),this.aSignature.length>i&&this.aSignature.pop(),"addSignature failed: "+t}},this.addSignatureByHeaderKey=function(t,e){var n=Dr(this.sPayload),r=new Cr.jws.JWS;r.generateJWSByP1PrvKey(t,n,e);this.aHeader.push(r.parsedJWS.headB64U),this.aSignature.push(r.parsedJWS.sigvalB64U)},this.addSignatureByHeaderPayloadKey=function(t,e,n){var r=new Cr.jws.JWS;r.generateJWSByP1PrvKey(t,e,n);this.aHeader.push(r.parsedJWS.headB64U),this.sPayload=r.parsedJWS.payloadB64U,this.aSignature.push(r.parsedJWS.sigvalB64U)},this.verifyAll=function(t){if(this.aHeader.length!==t.length||this.aSignature.length!==t.length)return!1;for(var e=0;e<t.length;e++){var n=t[e];if(2!==n.length)return!1;var r=this.verifyNth(e,n[0],n[1]);if(r===!1)return!1}return!0},this.verifyNth=function(t,n,r){if(this.aHeader.length<=t||this.aSignature.length<=t)return!1;var i=this.aHeader[t],s=this.aSignature[t],o=i+"."+this.sPayload+"."+s,a=!1;try{a=e.verify(o,n,r)}catch(t){return!1}return a},this.verifyWithCerts=function(t){if(this.aHeader.length!=t.length)throw"num headers does not match with num certs";if(this.aSignature.length!=t.length)throw"num signatures does not match with num certs";for(var e=this.sPayload,n="",r=0;r<t.length;r++){var i=t[r],s=this.aHeader[r],o=this.aSignature[r],a=s+"."+e+"."+o,u=new Cr.jws.JWS;try{var h=u.verifyJWSByPemX509Cert(a,i);1!=h&&(n+=r+1+"th signature unmatch. ")}catch(t){n+=r+1+"th signature fail("+t+"). "}}if(""==n)return 1;throw n},this.readJWSJS=function(e){if("string"==typeof e){var n=t.readSafeJSONString(e);if(null==n)throw"argument is not safe JSON object string";this.aHeader=n.headers,this.sPayload=n.payload,this.aSignature=n.signatures}else try{if(!(e.headers.length>0))throw"malformed header";if(this.aHeader=e.headers,"string"!=typeof e.payload)throw"malformed signatures";if(this.sPayload=e.payload,!(e.signatures.length>0))throw"malformed signatures";this.signatures=e.signatures}catch(t){throw"malformed JWS-JS JSON object: "+t}},this.getJSON=function(){return{headers:this.aHeader,payload:this.sPayload,signatures:this.aSignature}},this.isEmpty=function(){return 0==this.aHeader.length?1:0}},e.SecureRandom=le,e.rng_seed_time=he,e.BigInteger=o,e.RSAKey=ve,e.ECDSA=Cr.crypto.ECDSA,e.DSA=Cr.crypto.DSA,e.Signature=Cr.crypto.Signature,e.MessageDigest=Cr.crypto.MessageDigest,e.Mac=Cr.crypto.Mac,e.KEYUTIL=Rr,e.ASN1HEX=Or,e.X509=$n,e.CryptoJS=or,e.b64tohex=i,e.b64toBA=s,e.stoBA=sn,e.BAtos=on,e.BAtohex=an,e.stohex=un,e.stob64=hn,e.stob64u=cn,e.b64utos=fn,e.b64tob64u=ln,e.b64utob64=dn,e.hex2b64=r,e.hextob64u=gn,e.b64utohex=pn,e.b64tohex=i,e.utf8tob64u=Tr,e.b64utoutf8=Dr,e.utf8tob64=yn,e.b64toutf8=vn,e.utf8tohex=mn,e.hextoutf8=Sn,e.hextorstr=bn,e.rstrtohex=wn,e.newline_toUnix=Fn,e.newline_toDos=Pn,e.intarystrtohex=On,e.strdiffidx=jr,e.KJUR=Cr,e.crypto=Cr.crypto,e.asn1=Cr.asn1,e.jws=Cr.jws,e.lang=Cr.lang,e.readFileUTF8=Zn,e.readFileHexByBin=Qn,e.readFile=tr,e.saveFile=er,e.saveFileBinByHex=nr}).call(e,n(13).Buffer)},function(t,e,n){(function(t){/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
"use strict";function r(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}function i(){return o.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function s(t,e){if(i()<e)throw new RangeError("Invalid typed array length");return o.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e),t.__proto__=o.prototype):(null===t&&(t=new o(e)),t.length=e),t}function o(t,e,n){if(!(o.TYPED_ARRAY_SUPPORT||this instanceof o))return new o(t,e,n);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return c(this,t)}return a(this,t,e,n)}function a(t,e,n,r){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?d(t,e,n,r):"string"==typeof e?f(t,e,n):g(t,e)}function u(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function h(t,e,n,r){return u(e),e<=0?s(t,e):void 0!==n?"string"==typeof r?s(t,e).fill(n,r):s(t,e).fill(n):s(t,e)}function c(t,e){if(u(e),t=s(t,e<0?0:0|p(e)),!o.TYPED_ARRAY_SUPPORT)for(var n=0;n<e;++n)t[n]=0;return t}function f(t,e,n){if("string"==typeof n&&""!==n||(n="utf8"),!o.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|v(e,n);t=s(t,r);var i=t.write(e,n);return i!==r&&(t=t.slice(0,i)),t}function l(t,e){var n=e.length<0?0:0|p(e.length);t=s(t,n);for(var r=0;r<n;r+=1)t[r]=255&e[r];return t}function d(t,e,n,r){if(e.byteLength,n<0||e.byteLength<n)throw new RangeError("'offset' is out of bounds");if(e.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");return e=void 0===n&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,n):new Uint8Array(e,n,r),o.TYPED_ARRAY_SUPPORT?(t=e,t.__proto__=o.prototype):t=l(t,e),t}function g(t,e){if(o.isBuffer(e)){var n=0|p(e.length);return t=s(t,n),0===t.length?t:(e.copy(t,0,0,n),t)}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||X(e.length)?s(t,0):l(t,e);if("Buffer"===e.type&&Q(e.data))return l(t,e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function p(t){if(t>=i())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i().toString(16)+" bytes");return 0|t}function y(t){return+t!=t&&(t=0),o.alloc(+t)}function v(t,e){if(o.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var n=t.length;if(0===n)return 0;for(var r=!1;;)switch(e){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":case void 0:return W(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return Y(t).length;default:if(r)return W(t).length;e=(""+e).toLowerCase(),r=!0}}function m(t,e,n){var r=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if(n>>>=0,e>>>=0,n<=e)return"";for(t||(t="utf8");;)switch(t){case"hex":return H(this,e,n);case"utf8":case"utf-8":return C(this,e,n);case"ascii":return D(this,e,n);case"latin1":case"binary":return j(this,e,n);case"base64":return O(this,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return R(this,e,n);default:if(r)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),r=!0}}function S(t,e,n){var r=t[e];t[e]=t[n],t[n]=r}function b(t,e,n,r,i){if(0===t.length)return-1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),n=+n,isNaN(n)&&(n=i?0:t.length-1),n<0&&(n=t.length+n),n>=t.length){if(i)return-1;n=t.length-1}else if(n<0){if(!i)return-1;n=0}if("string"==typeof e&&(e=o.from(e,r)),o.isBuffer(e))return 0===e.length?-1:w(t,e,n,r,i);if("number"==typeof e)return e&=255,o.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(t,e,n):Uint8Array.prototype.lastIndexOf.call(t,e,n):w(t,[e],n,r,i);throw new TypeError("val must be string, number or Buffer")}function w(t,e,n,r,i){function s(t,e){return 1===o?t[e]:t.readUInt16BE(e*o)}var o=1,a=t.length,u=e.length;if(void 0!==r&&(r=String(r).toLowerCase(),"ucs2"===r||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(t.length<2||e.length<2)return-1;o=2,a/=2,u/=2,n/=2}var h;if(i){var c=-1;for(h=n;h<a;h++)if(s(t,h)===s(e,c===-1?0:h-c)){if(c===-1&&(c=h),h-c+1===u)return c*o}else c!==-1&&(h-=h-c),c=-1}else for(n+u>a&&(n=a-u),h=n;h>=0;h--){for(var f=!0,l=0;l<u;l++)if(s(t,h+l)!==s(e,l)){f=!1;break}if(f)return h}return-1}function E(t,e,n,r){n=Number(n)||0;var i=t.length-n;r?(r=Number(r),r>i&&(r=i)):r=i;var s=e.length;if(s%2!==0)throw new TypeError("Invalid hex string");r>s/2&&(r=s/2);for(var o=0;o<r;++o){var a=parseInt(e.substr(2*o,2),16);if(isNaN(a))return o;t[n+o]=a}return o}function x(t,e,n,r){return G(W(e,t.length-n),t,n,r)}function _(t,e,n,r){return G(J(e),t,n,r)}function A(t,e,n,r){return _(t,e,n,r)}function F(t,e,n,r){return G(Y(e),t,n,r)}function P(t,e,n,r){return G(z(e,t.length-n),t,n,r)}function O(t,e,n){return 0===e&&n===t.length?$.fromByteArray(t):$.fromByteArray(t.slice(e,n))}function C(t,e,n){n=Math.min(t.length,n);for(var r=[],i=e;i<n;){var s=t[i],o=null,a=s>239?4:s>223?3:s>191?2:1;if(i+a<=n){var u,h,c,f;switch(a){case 1:s<128&&(o=s);break;case 2:u=t[i+1],128===(192&u)&&(f=(31&s)<<6|63&u,f>127&&(o=f));break;case 3:u=t[i+1],h=t[i+2],128===(192&u)&&128===(192&h)&&(f=(15&s)<<12|(63&u)<<6|63&h,f>2047&&(f<55296||f>57343)&&(o=f));break;case 4:u=t[i+1],h=t[i+2],c=t[i+3],128===(192&u)&&128===(192&h)&&128===(192&c)&&(f=(15&s)<<18|(63&u)<<12|(63&h)<<6|63&c,f>65535&&f<1114112&&(o=f))}}null===o?(o=65533,a=1):o>65535&&(o-=65536,r.push(o>>>10&1023|55296),o=56320|1023&o),r.push(o),i+=a}return T(r)}function T(t){var e=t.length;if(e<=tt)return String.fromCharCode.apply(String,t);for(var n="",r=0;r<e;)n+=String.fromCharCode.apply(String,t.slice(r,r+=tt));return n}function D(t,e,n){var r="";n=Math.min(t.length,n);for(var i=e;i<n;++i)r+=String.fromCharCode(127&t[i]);return r}function j(t,e,n){var r="";n=Math.min(t.length,n);for(var i=e;i<n;++i)r+=String.fromCharCode(t[i]);return r}function H(t,e,n){var r=t.length;(!e||e<0)&&(e=0),(!n||n<0||n>r)&&(n=r);for(var i="",s=e;s<n;++s)i+=q(t[s]);return i}function R(t,e,n){for(var r=t.slice(e,n),i="",s=0;s<r.length;s+=2)i+=String.fromCharCode(r[s]+256*r[s+1]);return i}function I(t,e,n){if(t%1!==0||t<0)throw new RangeError("offset is not uint");if(t+e>n)throw new RangeError("Trying to access beyond buffer length")}function k(t,e,n,r,i,s){if(!o.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>i||e<s)throw new RangeError('"value" argument is out of bounds');if(n+r>t.length)throw new RangeError("Index out of range")}function B(t,e,n,r){e<0&&(e=65535+e+1);for(var i=0,s=Math.min(t.length-n,2);i<s;++i)t[n+i]=(e&255<<8*(r?i:1-i))>>>8*(r?i:1-i)}function N(t,e,n,r){e<0&&(e=4294967295+e+1);for(var i=0,s=Math.min(t.length-n,4);i<s;++i)t[n+i]=e>>>8*(r?i:3-i)&255}function V(t,e,n,r,i,s){if(n+r>t.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function M(t,e,n,r,i){return i||V(t,e,n,4,3.4028234663852886e38,-3.4028234663852886e38),Z.write(t,e,n,r,23,4),n+4}function K(t,e,n,r,i){return i||V(t,e,n,8,1.7976931348623157e308,-1.7976931348623157e308),Z.write(t,e,n,r,52,8),n+8}function L(t){if(t=U(t).replace(et,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function U(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function q(t){return t<16?"0"+t.toString(16):t.toString(16)}function W(t,e){e=e||1/0;for(var n,r=t.length,i=null,s=[],o=0;o<r;++o){if(n=t.charCodeAt(o),n>55295&&n<57344){if(!i){if(n>56319){(e-=3)>-1&&s.push(239,191,189);continue}if(o+1===r){(e-=3)>-1&&s.push(239,191,189);continue}i=n;continue}if(n<56320){(e-=3)>-1&&s.push(239,191,189),i=n;continue}n=(i-55296<<10|n-56320)+65536}else i&&(e-=3)>-1&&s.push(239,191,189);if(i=null,n<128){if((e-=1)<0)break;s.push(n)}else if(n<2048){if((e-=2)<0)break;s.push(n>>6|192,63&n|128)}else if(n<65536){if((e-=3)<0)break;s.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;s.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return s}function J(t){for(var e=[],n=0;n<t.length;++n)e.push(255&t.charCodeAt(n));return e}function z(t,e){for(var n,r,i,s=[],o=0;o<t.length&&!((e-=2)<0);++o)n=t.charCodeAt(o),r=n>>8,i=n%256,s.push(i),s.push(r);return s}function Y(t){return $.toByteArray(L(t))}function G(t,e,n,r){for(var i=0;i<r&&!(i+n>=e.length||i>=t.length);++i)e[i+n]=t[i];return i}function X(t){return t!==t}var $=n(14),Z=n(15),Q=n(16);e.Buffer=o,e.SlowBuffer=y,e.INSPECT_MAX_BYTES=50,o.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:r(),e.kMaxLength=i(),o.poolSize=8192,o._augment=function(t){return t.__proto__=o.prototype,t},o.from=function(t,e,n){return a(null,t,e,n)},o.TYPED_ARRAY_SUPPORT&&(o.prototype.__proto__=Uint8Array.prototype,o.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&o[Symbol.species]===o&&Object.defineProperty(o,Symbol.species,{value:null,configurable:!0})),o.alloc=function(t,e,n){return h(null,t,e,n)},o.allocUnsafe=function(t){return c(null,t)},o.allocUnsafeSlow=function(t){return c(null,t)},o.isBuffer=function(t){return!(null==t||!t._isBuffer)},o.compare=function(t,e){if(!o.isBuffer(t)||!o.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var n=t.length,r=e.length,i=0,s=Math.min(n,r);i<s;++i)if(t[i]!==e[i]){n=t[i],r=e[i];break}return n<r?-1:r<n?1:0},o.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},o.concat=function(t,e){if(!Q(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return o.alloc(0);var n;if(void 0===e)for(e=0,n=0;n<t.length;++n)e+=t[n].length;var r=o.allocUnsafe(e),i=0;for(n=0;n<t.length;++n){var s=t[n];if(!o.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(r,i),i+=s.length}return r},o.byteLength=v,o.prototype._isBuffer=!0,o.prototype.swap16=function(){var t=this.length;if(t%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)S(this,e,e+1);return this},o.prototype.swap32=function(){var t=this.length;if(t%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)S(this,e,e+3),S(this,e+1,e+2);return this},o.prototype.swap64=function(){var t=this.length;if(t%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)S(this,e,e+7),S(this,e+1,e+6),S(this,e+2,e+5),S(this,e+3,e+4);return this},o.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?C(this,0,t):m.apply(this,arguments)},o.prototype.equals=function(t){if(!o.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===o.compare(this,t)},o.prototype.inspect=function(){var t="",n=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,n).match(/.{2}/g).join(" "),this.length>n&&(t+=" ... ")),"<Buffer "+t+">"},o.prototype.compare=function(t,e,n,r,i){if(!o.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===n&&(n=t?t.length:0),void 0===r&&(r=0),void 0===i&&(i=this.length),e<0||n>t.length||r<0||i>this.length)throw new RangeError("out of range index");if(r>=i&&e>=n)return 0;if(r>=i)return-1;if(e>=n)return 1;if(e>>>=0,n>>>=0,r>>>=0,i>>>=0,this===t)return 0;for(var s=i-r,a=n-e,u=Math.min(s,a),h=this.slice(r,i),c=t.slice(e,n),f=0;f<u;++f)if(h[f]!==c[f]){s=h[f],a=c[f];break}return s<a?-1:a<s?1:0},o.prototype.includes=function(t,e,n){return this.indexOf(t,e,n)!==-1},o.prototype.indexOf=function(t,e,n){return b(this,t,e,n,!0)},o.prototype.lastIndexOf=function(t,e,n){return b(this,t,e,n,!1)},o.prototype.write=function(t,e,n,r){if(void 0===e)r="utf8",n=this.length,e=0;else if(void 0===n&&"string"==typeof e)r=e,n=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(n)?(n|=0,void 0===r&&(r="utf8")):(r=n,n=void 0)}var i=this.length-e;if((void 0===n||n>i)&&(n=i),t.length>0&&(n<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var s=!1;;)switch(r){case"hex":return E(this,t,e,n);case"utf8":case"utf-8":return x(this,t,e,n);case"ascii":return _(this,t,e,n);case"latin1":case"binary":return A(this,t,e,n);case"base64":return F(this,t,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return P(this,t,e,n);default:if(s)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),s=!0}},o.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var tt=4096;o.prototype.slice=function(t,e){var n=this.length;t=~~t,e=void 0===e?n:~~e,t<0?(t+=n,t<0&&(t=0)):t>n&&(t=n),e<0?(e+=n,e<0&&(e=0)):e>n&&(e=n),e<t&&(e=t);var r;if(o.TYPED_ARRAY_SUPPORT)r=this.subarray(t,e),r.__proto__=o.prototype;else{var i=e-t;r=new o(i,void 0);for(var s=0;s<i;++s)r[s]=this[s+t]}return r},o.prototype.readUIntLE=function(t,e,n){t|=0,e|=0,n||I(t,e,this.length);for(var r=this[t],i=1,s=0;++s<e&&(i*=256);)r+=this[t+s]*i;return r},o.prototype.readUIntBE=function(t,e,n){t|=0,e|=0,n||I(t,e,this.length);for(var r=this[t+--e],i=1;e>0&&(i*=256);)r+=this[t+--e]*i;return r},o.prototype.readUInt8=function(t,e){return e||I(t,1,this.length),this[t]},o.prototype.readUInt16LE=function(t,e){return e||I(t,2,this.length),this[t]|this[t+1]<<8},o.prototype.readUInt16BE=function(t,e){return e||I(t,2,this.length),this[t]<<8|this[t+1]},o.prototype.readUInt32LE=function(t,e){return e||I(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},o.prototype.readUInt32BE=function(t,e){return e||I(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},o.prototype.readIntLE=function(t,e,n){t|=0,e|=0,n||I(t,e,this.length);for(var r=this[t],i=1,s=0;++s<e&&(i*=256);)r+=this[t+s]*i;return i*=128,r>=i&&(r-=Math.pow(2,8*e)),r},o.prototype.readIntBE=function(t,e,n){t|=0,e|=0,n||I(t,e,this.length);for(var r=e,i=1,s=this[t+--r];r>0&&(i*=256);)s+=this[t+--r]*i;return i*=128,s>=i&&(s-=Math.pow(2,8*e)),s},o.prototype.readInt8=function(t,e){return e||I(t,1,this.length),128&this[t]?(255-this[t]+1)*-1:this[t]},o.prototype.readInt16LE=function(t,e){e||I(t,2,this.length);var n=this[t]|this[t+1]<<8;return 32768&n?4294901760|n:n},o.prototype.readInt16BE=function(t,e){e||I(t,2,this.length);var n=this[t+1]|this[t]<<8;return 32768&n?4294901760|n:n},o.prototype.readInt32LE=function(t,e){return e||I(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},o.prototype.readInt32BE=function(t,e){return e||I(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},o.prototype.readFloatLE=function(t,e){return e||I(t,4,this.length),Z.read(this,t,!0,23,4)},o.prototype.readFloatBE=function(t,e){return e||I(t,4,this.length),Z.read(this,t,!1,23,4)},o.prototype.readDoubleLE=function(t,e){return e||I(t,8,this.length),Z.read(this,t,!0,52,8)},o.prototype.readDoubleBE=function(t,e){return e||I(t,8,this.length),Z.read(this,t,!1,52,8)},o.prototype.writeUIntLE=function(t,e,n,r){if(t=+t,e|=0,n|=0,!r){var i=Math.pow(2,8*n)-1;k(this,t,e,n,i,0)}var s=1,o=0;for(this[e]=255&t;++o<n&&(s*=256);)this[e+o]=t/s&255;return e+n},o.prototype.writeUIntBE=function(t,e,n,r){if(t=+t,e|=0,n|=0,!r){var i=Math.pow(2,8*n)-1;k(this,t,e,n,i,0)}var s=n-1,o=1;for(this[e+s]=255&t;--s>=0&&(o*=256);)this[e+s]=t/o&255;return e+n},o.prototype.writeUInt8=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,1,255,0),o.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},o.prototype.writeUInt16LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,65535,0),o.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):B(this,t,e,!0),e+2},o.prototype.writeUInt16BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,65535,0),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):B(this,t,e,!1),e+2},o.prototype.writeUInt32LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,4294967295,0),o.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):N(this,t,e,!0),e+4},o.prototype.writeUInt32BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,4294967295,0),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):N(this,t,e,!1),e+4},o.prototype.writeIntLE=function(t,e,n,r){if(t=+t,e|=0,!r){var i=Math.pow(2,8*n-1);k(this,t,e,n,i-1,-i)}var s=0,o=1,a=0;for(this[e]=255&t;++s<n&&(o*=256);)t<0&&0===a&&0!==this[e+s-1]&&(a=1),this[e+s]=(t/o>>0)-a&255;return e+n},o.prototype.writeIntBE=function(t,e,n,r){if(t=+t,e|=0,!r){var i=Math.pow(2,8*n-1);k(this,t,e,n,i-1,-i)}var s=n-1,o=1,a=0;for(this[e+s]=255&t;--s>=0&&(o*=256);)t<0&&0===a&&0!==this[e+s+1]&&(a=1),this[e+s]=(t/o>>0)-a&255;return e+n},o.prototype.writeInt8=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,1,127,-128),o.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},o.prototype.writeInt16LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,32767,-32768),o.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):B(this,t,e,!0),e+2},o.prototype.writeInt16BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,2,32767,-32768),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):B(this,t,e,!1),e+2},o.prototype.writeInt32LE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,2147483647,-2147483648),o.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):N(this,t,e,!0),e+4},o.prototype.writeInt32BE=function(t,e,n){return t=+t,e|=0,n||k(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),o.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):N(this,t,e,!1),e+4},o.prototype.writeFloatLE=function(t,e,n){return M(this,t,e,!0,n)},o.prototype.writeFloatBE=function(t,e,n){return M(this,t,e,!1,n)},o.prototype.writeDoubleLE=function(t,e,n){return K(this,t,e,!0,n)},o.prototype.writeDoubleBE=function(t,e,n){return K(this,t,e,!1,n)},o.prototype.copy=function(t,e,n,r){if(n||(n=0),r||0===r||(r=this.length),e>=t.length&&(e=t.length),e||(e=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),t.length-e<r-n&&(r=t.length-e+n);var i,s=r-n;if(this===t&&n<e&&e<r)for(i=s-1;i>=0;--i)t[i+e]=this[i+n];else if(s<1e3||!o.TYPED_ARRAY_SUPPORT)for(i=0;i<s;++i)t[i+e]=this[i+n];else Uint8Array.prototype.set.call(t,this.subarray(n,n+s),e);return s},o.prototype.fill=function(t,e,n,r){if("string"==typeof t){if("string"==typeof e?(r=e,e=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===t.length){var i=t.charCodeAt(0);i<256&&(t=i)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!o.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<n)throw new RangeError("Out of range index");if(n<=e)return this;e>>>=0,n=void 0===n?this.length:n>>>0,t||(t=0);var s;if("number"==typeof t)for(s=e;s<n;++s)this[s]=t;else{var a=o.isBuffer(t)?t:W(new o(t,r).toString()),u=a.length;for(s=0;s<n-e;++s)this[s+e]=a[s%u]}return this};var et=/[^+\/0-9A-Za-z-_]/g}).call(e,function(){return this}())},function(t,e){"use strict";function n(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");return"="===t[e-2]?2:"="===t[e-1]?1:0}function r(t){return 3*t.length/4-n(t)}function i(t){var e,r,i,s,o,a,u=t.length;o=n(t),a=new c(3*u/4-o),i=o>0?u-4:u;var f=0;for(e=0,r=0;e<i;e+=4,r+=3)s=h[t.charCodeAt(e)]<<18|h[t.charCodeAt(e+1)]<<12|h[t.charCodeAt(e+2)]<<6|h[t.charCodeAt(e+3)],a[f++]=s>>16&255,a[f++]=s>>8&255,a[f++]=255&s;return 2===o?(s=h[t.charCodeAt(e)]<<2|h[t.charCodeAt(e+1)]>>4,a[f++]=255&s):1===o&&(s=h[t.charCodeAt(e)]<<10|h[t.charCodeAt(e+1)]<<4|h[t.charCodeAt(e+2)]>>2,a[f++]=s>>8&255,a[f++]=255&s),a}function s(t){return u[t>>18&63]+u[t>>12&63]+u[t>>6&63]+u[63&t]}function o(t,e,n){for(var r,i=[],o=e;o<n;o+=3)r=(t[o]<<16)+(t[o+1]<<8)+t[o+2],i.push(s(r));return i.join("")}function a(t){for(var e,n=t.length,r=n%3,i="",s=[],a=16383,h=0,c=n-r;h<c;h+=a)s.push(o(t,h,h+a>c?c:h+a));return 1===r?(e=t[n-1],i+=u[e>>2],i+=u[e<<4&63],i+="=="):2===r&&(e=(t[n-2]<<8)+t[n-1],i+=u[e>>10],i+=u[e>>4&63],i+=u[e<<2&63],i+="="),s.push(i),s.join("")}e.byteLength=r,e.toByteArray=i,e.fromByteArray=a;for(var u=[],h=[],c="undefined"!=typeof Uint8Array?Uint8Array:Array,f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",l=0,d=f.length;l<d;++l)u[l]=f[l],h[f.charCodeAt(l)]=l;h["-".charCodeAt(0)]=62,h["_".charCodeAt(0)]=63},function(t,e){e.read=function(t,e,n,r,i){var s,o,a=8*i-r-1,u=(1<<a)-1,h=u>>1,c=-7,f=n?i-1:0,l=n?-1:1,d=t[e+f];for(f+=l,s=d&(1<<-c)-1,d>>=-c,c+=a;c>0;s=256*s+t[e+f],f+=l,c-=8);for(o=s&(1<<-c)-1,s>>=-c,c+=r;c>0;o=256*o+t[e+f],f+=l,c-=8);if(0===s)s=1-h;else{if(s===u)return o?NaN:(d?-1:1)*(1/0);o+=Math.pow(2,r),s-=h}return(d?-1:1)*o*Math.pow(2,s-r)},e.write=function(t,e,n,r,i,s){var o,a,u,h=8*s-i-1,c=(1<<h)-1,f=c>>1,l=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,d=r?0:s-1,g=r?1:-1,p=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,o=c):(o=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-o))<1&&(o--,u*=2),e+=o+f>=1?l/u:l*Math.pow(2,1-f),e*u>=2&&(o++,u/=2),o+f>=c?(a=0,o=c):o+f>=1?(a=(e*u-1)*Math.pow(2,i),o+=f):(a=e*Math.pow(2,f-1)*Math.pow(2,i),o=0));i>=8;t[n+d]=255&a,d+=g,a/=256,i-=8);for(o=o<<i|a,h+=i;h>0;t[n+d]=255&o,d+=g,o/=256,h-=8);t[n+d-g]|=128*p}},function(t,e){var n={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},function(t,e){},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(19),u=r(a),h=n(20),c=r(h),f=function(){function t(e){var n=e.url,r=e.client_id,s=e.redirect_uri,a=e.response_type,h=e.scope,f=e.authority,l=e.data,d=e.prompt,g=e.display,p=e.max_age,y=e.ui_locales,v=e.id_token_hint,m=e.login_hint,S=e.acr_values,b=e.resource,w=e.request,E=e.request_uri;if(i(this,t),!n)throw o.default.error("No url passed to SigninRequest"),new Error("url");if(!r)throw o.default.error("No client_id passed to SigninRequest"),new Error("client_id");if(!s)throw o.default.error("No redirect_uri passed to SigninRequest"),new Error("redirect_uri");if(!a)throw o.default.error("No response_type passed to SigninRequest"),new Error("response_type");if(!h)throw o.default.error("No scope passed to SigninRequest"),new Error("scope");if(!f)throw o.default.error("No authority passed to SigninRequest"),new Error("authority");var x=t.isOidc(a);this.state=new c.default({nonce:x,data:l,client_id:r,authority:f}),n=u.default.addQueryParam(n,"client_id",r),n=u.default.addQueryParam(n,"redirect_uri",s),n=u.default.addQueryParam(n,"response_type",a),n=u.default.addQueryParam(n,"scope",h),n=u.default.addQueryParam(n,"state",this.state.id),x&&(n=u.default.addQueryParam(n,"nonce",this.state.nonce));var _={prompt:d,display:g,max_age:p,ui_locales:y,id_token_hint:v,login_hint:m,acr_values:S,resource:b,request:w,request_uri:E};for(var A in _)_[A]&&(n=u.default.addQueryParam(n,A,_[A]));this.url=n}return t.isOidc=function(t){var e=t.split(/\s+/g).filter(function(t){return"id_token"===t});return!!e[0]},t.isOAuth=function(t){var e=t.split(/\s+/g).filter(function(t){return"token"===t});return!!e[0]},t}();e.default=f,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(5),u=r(a),h=function(){function t(){i(this,t)}return t.addQueryParam=function(t,e,n){return t.indexOf("?")<0&&(t+="?"),"?"!==t[t.length-1]&&(t+="&"),t+=encodeURIComponent(e),t+="=",t+=encodeURIComponent(n)},t.parseUrlFragment=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"#",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:u.default;o.default.debug("UrlUtility.parseUrlFragment"),"string"!=typeof t&&(t=n.location.href);var r=t.lastIndexOf(e);r>=0&&(t=t.substr(r+1));for(var i,s={},a=/([^&=]+)=([^&]*)/g,h=0;i=a.exec(t);)if(s[decodeURIComponent(i[1])]=decodeURIComponent(i[2]),h++>50)return o.default.error("response exceeded expected number of parameters",t),{error:"Response exceeded expected number of parameters"};for(var c in s)return s;return{}},t}();e.default=h,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),u=n(1),h=r(u),c=n(21),f=r(c),l=n(22),d=r(l),g=function(t){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=n.nonce,o=n.authority,a=n.client_id;i(this,e);var u=s(this,t.call(this,arguments[0]));return r===!0?u._nonce=(0,d.default)():r&&(u._nonce=r),u._authority=o,u._client_id=a,u}return o(e,t),e.prototype.toStorageString=function(){return h.default.debug("SigninState.toStorageString"),JSON.stringify({id:this.id,data:this.data,created:this.created,nonce:this.nonce,authority:this.authority,client_id:this.client_id})},e.fromStorageString=function(t){h.default.debug("SigninState.fromStorageString");var n=JSON.parse(t);return new e(n)},a(e,[{key:"nonce",get:function(){return this._nonce}},{key:"authority",get:function(){return this._authority}},{key:"client_id",get:function(){return this._client_id}}]),e}(f.default);e.default=g,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=n(22),h=r(u),c=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.id,r=e.data,s=e.created;i(this,t),this._id=n||(0,h.default)(),this._data=r,"number"==typeof s&&s>0?this._created=s:this._created=parseInt(Date.now()/1e3)}return t.prototype.toStorageString=function(){return a.default.debug("State.toStorageString"),JSON.stringify({id:this.id,data:this.data,created:this.created})},t.fromStorageString=function(e){return a.default.debug("State.fromStorageString"),new t(JSON.parse(e))},t.clearStaleState=function(e,n){a.default.debug("State.clearStaleState");var r=Date.now()/1e3-n;return e.getAllKeys().then(function(n){a.default.debug("got keys",n);var i=[],s=!0,o=!1,u=void 0;try{for(var h,c=function(){var n=h.value;l=e.get(n).then(function(i){var s=!1;if(i)try{var o=t.fromStorageString(i);a.default.debug("got item from key: ",n,o.created),o.created<=r&&(s=!0)}catch(t){a.default.error("Error parsing state for key",n,t.message),s=!0}else a.default.debug("no item in storage for key: ",n),s=!0;if(s)return a.default.debug("removed item for key: ",n),e.remove(n)}),i.push(l)},f=n[Symbol.iterator]();!(s=(h=f.next()).done);s=!0){var l;c()}}catch(t){o=!0,u=t}finally{try{!s&&f.return&&f.return()}finally{if(o)throw u}}return a.default.debug("waiting on promise count:",i.length),Promise.all(i)})},s(t,[{key:"id",get:function(){return this._id}},{key:"data",get:function(){return this._data}},{key:"created",get:function(){return this._created}}]),t}();e.default=c,t.exports=e.default},function(t,e){"use strict";
// @preserve Copyright (c) Microsoft Open Technologies, Inc.
function n(){for(var t="xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx",e="0123456789abcdef",n=0,r="",i=0;i<t.length;i++)"-"!==t[i]&&"4"!==t[i]&&(n=16*Math.random()|0),"x"===t[i]?r+=e[n]:"y"===t[i]?(n&=3,n|=8,r+=e[n]):r+=t[i];return r}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(19),a=r(o),u="openid",h=function(){function t(e){i(this,t);var n=a.default.parseUrlFragment(e,"#");this.error=n.error,this.error_description=n.error_description,this.error_uri=n.error_uri,this.state=n.state,this.id_token=n.id_token,this.session_state=n.session_state,this.access_token=n.access_token,this.token_type=n.token_type,this.scope=n.scope,this.profile=void 0;var r=parseInt(n.expires_in);if("number"==typeof r&&r>0){var s=parseInt(Date.now()/1e3);this.expires_at=s+r}}return s(t,[{key:"expires_in",get:function(){if(this.expires_at){var t=parseInt(Date.now()/1e3);return this.expires_at-t}}},{key:"expired",get:function(){var t=this.expires_in;if(void 0!==t)return t<=0}},{key:"scopes",get:function(){return(this.scope||"").split(" ")}},{key:"isOpenIdConnect",get:function(){return this.scopes.indexOf(u)>=0||!!this.id_token}}]),t}();e.default=h,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(19),u=r(a),h=n(21),c=r(h),f=function t(e){var n=e.url,r=e.id_token_hint,s=e.post_logout_redirect_uri,a=e.data;if(i(this,t),!n)throw o.default.error("No url passed to SignoutRequest"),new Error("url");r&&(n=u.default.addQueryParam(n,"id_token_hint",r)),s&&(n=u.default.addQueryParam(n,"post_logout_redirect_uri",s),a&&(this.state=new c.default({data:a}),n=u.default.addQueryParam(n,"state",this.state.id))),this.url=n};e.default=f,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(19),o=r(s),a=function t(e){i(this,t);var n=o.default.parseUrlFragment(e,"?");this.error=n.error,this.error_description=n.error_description,this.error_uri=n.error_uri,this.state=n.state};e.default=a,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=function(){function t(){i(this,t),this._data={}}return t.prototype.getItem=function(t){return a.default.debug("InMemoryWebStorage.getItem",t),this._data[t]},t.prototype.setItem=function(t,e){a.default.debug("InMemoryWebStorage.setItem",t),this._data[t]=e},t.prototype.removeItem=function(t){a.default.debug("InMemoryWebStorage.removeItem",t),delete this._data[t]},t.prototype.key=function(t){return Object.getOwnPropertyNames(this._data)[t]},s(t,[{key:"length",get:function(){return Object.getOwnPropertyNames(this._data).length}}]),t}();e.default=u,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),u=n(1),h=r(u),c=n(2),f=r(c),l=n(28),d=r(l),g=n(34),p=r(g),y=n(35),v=r(y),m=n(39),S=r(m),b=n(40),w=r(b),E=n(42),x=r(E),_=function(t){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:S.default,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:w.default,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:x.default;i(this,e),n instanceof d.default||(n=new d.default(n));var u=s(this,t.call(this,n));return u._events=new v.default(n),u.settings.automaticSilentRenew&&(h.default.debug("automaticSilentRenew is configured, setting up silent renew"),u._silentRenewService=new r(u)),u.settings.monitorSession&&(h.default.debug("monitorSession is configured, setting up session monitor"),u._sessionMonitor=new o(u)),u._tokenRevocationClient=new a(u._settings),u}return o(e,t),e.prototype.getUser=function(){var t=this;return h.default.debug("UserManager.getUser"),this._loadUser().then(function(e){return e?(h.default.info("user loaded"),t._events.load(e,!1),e):(h.default.info("user not found in storage"),null)})},e.prototype.removeUser=function(){var t=this;return h.default.debug("UserManager.removeUser"),this._storeUser(null).then(function(){h.default.info("user removed from storage"),t._events.unload()})},e.prototype.signinPopup=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};h.default.debug("UserManager.signinPopup");var e=t.redirect_uri||this.settings.popup_redirect_uri||this.settings.redirect_uri;return e?(t.redirect_uri=e,t.display="popup",this._signin(t,this._popupNavigator,{startUrl:e,popupWindowFeatures:t.popupWindowFeatures||this.settings.popupWindowFeatures,popupWindowTarget:t.popupWindowTarget||this.settings.popupWindowTarget}).then(function(t){return t&&(t.profile&&t.profile.sub?h.default.info("signinPopup successful, signed in sub: ",t.profile.sub):h.default.info("signinPopup successful")),t})):(h.default.error("No popup_redirect_uri or redirect_uri configured"),Promise.reject(new Error("No popup_redirect_uri or redirect_uri configured")))},e.prototype.signinPopupCallback=function(t){return h.default.debug("UserManager.signinPopupCallback"),this._signinCallback(t,this._popupNavigator).then(function(t){return t&&(t.profile&&t.profile.sub?h.default.info("signinPopupCallback successful, signed in sub: ",t.profile.sub):h.default.info("signinPopupCallback successful")),t})},e.prototype.signinSilent=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};h.default.debug("UserManager.signinSilent");var n=e.redirect_uri||this.settings.silent_redirect_uri;if(!n)return h.default.error("No silent_redirect_uri configured"),Promise.reject(new Error("No silent_redirect_uri configured"));e.redirect_uri=n,e.prompt="none";var r=void 0;return r=e.id_token_hint?Promise.resolve():this._loadUser().then(function(t){e.id_token_hint=t&&t.id_token}),r.then(function(){return t._signin(e,t._iframeNavigator,{startUrl:n,silentRequestTimeout:e.silentRequestTimeout||t.settings.silentRequestTimeout})}).then(function(t){return t&&(t.profile&&t.profile.sub?h.default.info("signinSilent successful, signed in sub: ",t.profile.sub):h.default.info("signinSilent successful")),t})},e.prototype.signinSilentCallback=function(t){return h.default.debug("UserManager.signinSilentCallback"),this._signinCallback(t,this._iframeNavigator).then(function(t){return t&&(t.profile&&t.profile.sub?h.default.info("signinSilentCallback successful, signed in sub: ",t.profile.sub):h.default.info("signinSilentCallback successful")),t})},e.prototype.querySessionStatus=function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};h.default.debug("UserManager.querySessionStatus");var n=e.redirect_uri||this.settings.silent_redirect_uri;return n?(e.redirect_uri=n,e.prompt="none",e.response_type="id_token",e.scope="openid",this._signinStart(e,this._iframeNavigator,{startUrl:n,silentRequestTimeout:e.silentRequestTimeout||this.settings.silentRequestTimeout}).then(function(e){return t.processSigninResponse(e.url).then(function(t){return h.default.debug("got signin response"),t.session_state&&t.profile.sub&&t.profile.sid?(h.default.info("querySessionStatus success for sub: ",t.profile.sub),{session_state:t.session_state,sub:t.profile.sub,sid:t.profile.sid}):void h.default.info("querySessionStatus successful, user not authenticated")})})):(h.default.error("No silent_redirect_uri configured"),Promise.reject(new Error("No silent_redirect_uri configured")))},e.prototype._signin=function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return h.default.debug("_signin"),this._signinStart(t,e,r).then(function(t){return n._signinEnd(t.url)})},e.prototype._signinCallback=function(t,e){return h.default.debug("_signinCallback"),e.callback(t)},e.prototype._signout=function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return h.default.debug("_signout"),this._signoutStart(t,e,r).then(function(t){return n._signoutEnd(t.url)})},e.prototype.signinRedirect=function(t){return h.default.debug("UserManager.signinRedirect"),this._signinStart(t,this._redirectNavigator).then(function(){h.default.info("signinRedirect successful")})},e.prototype.signinRedirectCallback=function(t){return h.default.debug("UserManager.signinRedirectCallback"),this._signinEnd(t||this._redirectNavigator.url).then(function(t){return t&&(t.profile&&t.profile.sub?h.default.info("signinRedirectCallback successful, signed in sub: ",t.profile.sub):h.default.info("signinRedirectCallback successful")),t})},e.prototype.signoutRedirect=function(t){return h.default.debug("UserManager.signoutRedirect"),this._signoutStart(t,this._redirectNavigator).then(function(){h.default.info("signoutRedirect successful")})},e.prototype.signoutRedirectCallback=function(t){return h.default.debug("UserManager.signoutRedirectCallback"),this._signoutEnd(t||this._redirectNavigator.url).then(function(t){h.default.info("signoutRedirectCallback successful")})},e.prototype.signoutPopup=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};h.default.debug("UserManager.signinPopup");var e=t.post_logout_redirect_uri||this.settings.popup_post_logout_redirect_uri||this.settings.post_logout_redirect_uri;return t.post_logout_redirect_uri=e,t.display="popup",t.post_logout_redirect_uri&&(t.state=t.state||{}),this._signout(t,this._popupNavigator,{startUrl:e,popupWindowFeatures:t.popupWindowFeatures||this.settings.popupWindowFeatures,popupWindowTarget:t.popupWindowTarget||this.settings.popupWindowTarget}).then(function(){h.default.info("signoutPopup successful")})},e.prototype.signoutPopupCallback=function(t,e){"undefined"==typeof e&&"boolean"==typeof t&&(t=null,e=!0),h.default.debug("UserManager.signoutPopupCallback");var n="?";return this._popupNavigator.callback(t,e,n).then(function(){h.default.info("signoutPopupCallback successful")})},e.prototype._signinStart=function(t,e){var n=this,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return h.default.debug("_signinStart"),e.prepare(r).then(function(e){return h.default.debug("got navigator window handle"),n.createSigninRequest(t).then(function(t){return h.default.debug("got signin request"),r.url=t.url,r.id=t.state.id,e.navigate(r)})})},e.prototype._signinEnd=function(t){var e=this;return h.default.debug("_signinEnd"),this.processSigninResponse(t).then(function(t){h.default.debug("got signin response");var n=new p.default(t);return e._storeUser(n).then(function(){return h.default.debug("user stored"),e._events.load(n),n})})},e.prototype._signoutStart=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=this,n=arguments[1],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return h.default.debug("_signoutStart"),n.prepare(r).then(function(n){return h.default.debug("got navigator window handle"),e._loadUser().then(function(i){h.default.debug("loaded current user from storage");var s=e._settings.revokeAccessTokenOnSignout?e._revokeInternal(i):Promise.resolve();return s.then(function(){var s=t.id_token_hint||i&&i.id_token;return s&&(h.default.debug("Setting id_token into signout request"),t.id_token_hint=s),e.removeUser().then(function(){return h.default.debug("user removed, creating signout request"),e.createSignoutRequest(t).then(function(t){return h.default.debug("got signout request"),r.url=t.url,t.state&&(r.id=t.state.id),n.navigate(r)})})})})})},e.prototype._signoutEnd=function(t){return h.default.debug("_signoutEnd"),this.processSignoutResponse(t).then(function(t){return h.default.debug("got signout response"),t})},e.prototype.revokeAccessToken=function(){var t=this;return h.default.debug("UserManager.revokeAccessToken"),this._loadUser().then(function(e){return t._revokeInternal(e,!0).then(function(n){if(n)return h.default.debug("removing token properties from user and re-storing"),e.access_token=null,e.expires_at=null,e.token_type=null,t._storeUser(e).then(function(){h.default.debug("user stored"),t._events.load(e)})})}).then(function(){h.default.info("access token revoked successfully")})},e.prototype._revokeInternal=function(t,e){h.default.debug("checking if token revocation is necessary");var n=t&&t.access_token;return!n||n.indexOf(".")>=0?(h.default.debug("no need to revoke due to no user, token, or JWT format"),Promise.resolve(!1)):this._tokenRevocationClient.revoke(n,e).then(function(){return!0})},e.prototype._loadUser=function(){return h.default.debug("_loadUser"),this._userStore.get(this._userStoreKey).then(function(t){return t?(h.default.debug("user storageString loaded"),p.default.fromStorageString(t)):(h.default.debug("no user storageString"),null)})},e.prototype._storeUser=function(t){if(t){h.default.debug("_storeUser storing user");var e=t.toStorageString();return this._userStore.set(this._userStoreKey,e)}return h.default.debug("_storeUser removing user storage"),this._userStore.remove(this._userStoreKey)},a(e,[{key:"_redirectNavigator",get:function(){return this.settings.redirectNavigator}},{key:"_popupNavigator",get:function(){return this.settings.popupNavigator}},{key:"_iframeNavigator",get:function(){return this.settings.iframeNavigator}},{key:"_userStore",get:function(){return this.settings.userStore}},{key:"events",get:function(){return this._events}},{key:"_userStoreKey",get:function(){return"user:"+this.settings.authority+":"+this.settings.client_id}}]),e}(f.default);e.default=_,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),u=n(1),h=(r(u),n(3)),c=r(h),f=n(29),l=r(f),d=n(30),g=r(d),p=n(32),y=r(p),v=n(4),m=r(v),S=n(5),b=r(S),w=60,E=2e3,x=function(t){function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=n.popup_redirect_uri,o=n.popup_post_logout_redirect_uri,a=n.popupWindowFeatures,u=n.popupWindowTarget,h=n.silent_redirect_uri,c=n.silentRequestTimeout,f=n.automaticSilentRenew,d=void 0!==f&&f,p=n.monitorSession,v=void 0===p||p,S=n.checkSessionInterval,x=void 0===S?E:S,_=n.revokeAccessTokenOnSignout,A=void 0!==_&&_,F=n.accessTokenExpiringNotificationTime,P=void 0===F?w:F,O=n.redirectNavigator,C=void 0===O?new l.default:O,T=n.popupNavigator,D=void 0===T?new g.default:T,j=n.iframeNavigator,H=void 0===j?new y.default:j,R=n.userStore,I=void 0===R?new m.default({store:b.default.sessionStorage}):R;i(this,e);var k=s(this,t.call(this,arguments[0]));return k._popup_redirect_uri=r,k._popup_post_logout_redirect_uri=o,k._popupWindowFeatures=a,k._popupWindowTarget=u,k._silent_redirect_uri=h,k._silentRequestTimeout=c,k._automaticSilentRenew=!!d,k._accessTokenExpiringNotificationTime=P,k._monitorSession=v,k._checkSessionInterval=x,k._revokeAccessTokenOnSignout=A,k._redirectNavigator=C,k._popupNavigator=D,k._iframeNavigator=H,k._userStore=I,k}return o(e,t),a(e,[{key:"popup_redirect_uri",get:function(){return this._popup_redirect_uri}},{key:"popup_post_logout_redirect_uri",get:function(){return this._popup_post_logout_redirect_uri}},{key:"popupWindowFeatures",get:function(){return this._popupWindowFeatures}},{key:"popupWindowTarget",get:function(){return this._popupWindowTarget}},{key:"silent_redirect_uri",get:function(){return this._silent_redirect_uri}},{key:"silentRequestTimeout",get:function(){return this._silentRequestTimeout}},{key:"automaticSilentRenew",get:function(){return!(!this.silent_redirect_uri||!this._automaticSilentRenew)}},{key:"accessTokenExpiringNotificationTime",get:function(){return this._accessTokenExpiringNotificationTime}},{key:"monitorSession",get:function(){return this._monitorSession}},{key:"checkSessionInterval",get:function(){return this._checkSessionInterval}},{key:"revokeAccessTokenOnSignout",get:function(){return this._revokeAccessTokenOnSignout}},{key:"redirectNavigator",get:function(){return this._redirectNavigator}},{key:"popupNavigator",get:function(){return this._popupNavigator}},{key:"iframeNavigator",get:function(){return this._iframeNavigator}},{key:"userStore",get:function(){return this._userStore}}]),e}(c.default);e.default=x,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=function(){function t(){i(this,t)}return t.prototype.prepare=function(){return Promise.resolve(this)},t.prototype.navigate=function(t){return a.default.debug("RedirectNavigator.navigate"),t&&t.url?(window.location=t.url,Promise.resolve()):(a.default.error("No url provided"),Promise.reject(new Error("No url provided")))},s(t,[{key:"url",get:function(){return a.default.debug("RedirectNavigator.url"),window.location.href}}]),t}();e.default=u,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(31),u=r(a),h=function(){function t(){i(this,t)}return t.prototype.prepare=function(t){var e=new u.default(t);return Promise.resolve(e)},t.prototype.callback=function(t,e,n){o.default.debug("PopupNavigator.callback");try{return u.default.notifyOpener(t,e,n),Promise.resolve()}catch(t){return Promise.reject(t)}},t}();e.default=h,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=n(19),h=r(u),c=500,f="location=no,toolbar=no,width=500,height=500,left=100,top=100;",l="_blank",d=function(){function t(e){var n=this;i(this,t),a.default.debug("PopupWindow.ctor"),this._promise=new Promise(function(t,e){n._resolve=t,n._reject=e});var r=e.popupWindowTarget||l,s=e.popupWindowFeatures||f;this._popup=window.open("",r,s),this._popup&&(a.default.debug("popup successfully created"),this._checkForPopupClosedTimer=window.setInterval(this._checkForPopupClosed.bind(this),c))}return t.prototype.navigate=function(t){return a.default.debug("PopupWindow.navigate"),this._popup?t&&t.url?(a.default.debug("Setting URL in popup"),this._id=t.id,this._id&&(window["popupCallback_"+t.id]=this._callback.bind(this)),this._popup.focus(),this._popup.window.location=t.url):this._error("No url provided"):this._error("Error opening popup window"),this.promise},t.prototype._success=function(t){this._cleanup(),a.default.debug("Successful response from popup window"),this._resolve(t)},t.prototype._error=function(t){this._cleanup(),a.default.error(t),this._reject(new Error(t))},t.prototype._cleanup=function(t){a.default.debug("PopupWindow._cleanup"),window.clearInterval(this._checkForPopupClosedTimer),this._checkForPopupClosedTimer=null,delete window["popupCallback_"+this._id],this._popup&&!t&&this._popup.close(),this._popup=null},t.prototype._checkForPopupClosed=function(){a.default.debug("PopupWindow._checkForPopupClosed"),this._popup&&!this._popup.closed||this._error("Popup window closed")},t.prototype._callback=function(t,e){a.default.debug("PopupWindow._callback"),this._cleanup(e),t?this._success({url:t}):this._error("Invalid response from popup")},t.notifyOpener=function(t,e,n){if(a.default.debug("PopupWindow.notifyOpener"),window.opener&&(t=t||window.location.href)){var r=h.default.parseUrlFragment(t,n);if(r.state){var i="popupCallback_"+r.state,s=window.opener[i];s?(a.default.debug("passing url message to opener"),s(t,e)):a.default.warn("no matching callback found on opener")}else a.default.warn("no state found in response url")}},s(t,[{key:"promise",get:function(){return this._promise}}]),t}();e.default=d,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(33),u=r(a),h=function(){function t(){i(this,t)}return t.prototype.prepare=function(t){var e=new u.default(t);return Promise.resolve(e)},t.prototype.callback=function(t){o.default.debug("IFrameNavigator.callback");try{return u.default.notifyParent(t),Promise.resolve()}catch(t){return Promise.reject(t)}},t}();e.default=h,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=5e3,h=function(){function t(e){var n=this;i(this,t),a.default.debug("IFrameWindow.ctor"),this._promise=new Promise(function(t,e){n._resolve=t,n._reject=e}),this._boundMessageEvent=this._message.bind(this),window.addEventListener("message",this._boundMessageEvent,!1),this._frame=window.document.createElement("iframe"),this._frame.style.display="none",window.document.body.appendChild(this._frame)}return t.prototype.navigate=function(t){if(a.default.debug("IFrameWindow.navigate"),t&&t.url){var e=t.silentRequestTimeout||u;a.default.debug("Using timeout of:",e),this._timer=window.setTimeout(this._timeout.bind(this),e),this._frame.src=t.url}else this._error("No url provided");return this.promise},t.prototype._success=function(t){this._cleanup(),a.default.debug("Successful response from frame window"),this._resolve(t)},t.prototype._error=function(t){this._cleanup(),a.default.error(t),this._reject(new Error(t))},t.prototype._cleanup=function(){a.default.debug("IFrameWindow._cleanup"),window.removeEventListener("message",this._boundMessageEvent,!1),window.clearTimeout(this._timer),window.document.body.removeChild(this._frame),this._timer=null,this._frame=null,this._boundMessageEvent=null},t.prototype._timeout=function(){a.default.debug("IFrameWindow._timeout"),this._error("Frame window timed out")},t.prototype._message=function(t){if(a.default.debug("IFrameWindow._message"),this._timer&&t.origin===this._origin&&t.source===this._frame.contentWindow){var e=t.data;e?this._success({url:e}):this._error("Invalid response from frame")}},t.notifyParent=function(t){a.default.debug("IFrameWindow.notifyParent"),window.parent&&window!==window.parent&&(t=t||window.location.href,t&&(a.default.debug("posting url message to parent"),window.parent.postMessage(t,location.protocol+"//"+location.host)))},s(t,[{key:"promise",get:function(){return this._promise}},{key:"_origin",get:function(){return location.protocol+"//"+location.host}}]),t}();e.default=h,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=function(){function t(e){var n=e.id_token,r=e.session_state,s=e.access_token,o=e.token_type,a=e.scope,u=e.profile,h=e.expires_at,c=e.state;i(this,t),this.id_token=n,this.session_state=r,this.access_token=s,this.token_type=o,this.scope=a,this.profile=u,this.expires_at=h,this.state=c}return t.prototype.toStorageString=function(){return a.default.debug("User.toStorageString"),JSON.stringify({id_token:this.id_token,session_state:this.session_state,access_token:this.access_token,token_type:this.token_type,scope:this.scope,profile:this.profile,expires_at:this.expires_at})},t.fromStorageString=function(e){return a.default.debug("User.fromStorageString"),new t(JSON.parse(e))},s(t,[{key:"expires_in",get:function(){if(this.expires_at){var t=parseInt(Date.now()/1e3);return this.expires_at-t}}},{key:"expired",get:function(){var t=this.expires_in;if(void 0!==t)return t<=0}},{key:"scopes",get:function(){return(this.scope||"").split(" ")}}]),t}();e.default=u,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=n(1),u=r(a),h=n(36),c=r(h),f=n(38),l=r(f),d=function(t){function e(n){i(this,e);var r=s(this,t.call(this,n));return r._userLoaded=new l.default("User loaded"),r._userUnloaded=new l.default("User unloaded"),r._silentRenewError=new l.default("Silent renew error"),r._userSignedOut=new l.default("User signed out"),r._userSessionChanged=new l.default("User session changed"),r}return o(e,t),e.prototype.load=function(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];u.default.debug("UserManagerEvents.load"),t.prototype.load.call(this,e),n&&this._userLoaded.raise(e)},e.prototype.unload=function(){u.default.debug("UserManagerEvents.unload"),t.prototype.unload.call(this),this._userUnloaded.raise()},e.prototype.addUserLoaded=function(t){this._userLoaded.addHandler(t)},e.prototype.removeUserLoaded=function(t){this._userLoaded.removeHandler(t)},e.prototype.addUserUnloaded=function(t){this._userUnloaded.addHandler(t)},e.prototype.removeUserUnloaded=function(t){this._userUnloaded.removeHandler(t)},e.prototype.addSilentRenewError=function(t){this._silentRenewError.addHandler(t)},e.prototype.removeSilentRenewError=function(t){this._silentRenewError.removeHandler(t)},e.prototype._raiseSilentRenewError=function(t){u.default.debug("UserManagerEvents._raiseSilentRenewError",t.message),this._silentRenewError.raise(t)},e.prototype.addUserSignedOut=function(t){this._userSignedOut.addHandler(t)},e.prototype.removeUserSignedOut=function(t){this._userSignedOut.removeHandler(t)},e.prototype._raiseUserSignedOut=function(t){u.default.debug("UserManagerEvents._raiseUserSignedOut"),this._userSignedOut.raise(t)},e.prototype.addUserSessionChanged=function(t){this._userSessionChanged.addHandler(t)},e.prototype.removeUserSessionChanged=function(t){this._userSessionChanged.removeHandler(t)},e.prototype._raiseUserSessionChanged=function(t){u.default.debug("UserManagerEvents._raiseUserSessionChanged"),this._userSessionChanged.raise(t)},e}(c.default);e.default=d,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(37),u=r(a),h=60,c=function(){function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.accessTokenExpiringNotificationTime,r=void 0===n?h:n,s=e.accessTokenExpiringTimer,o=void 0===s?new u.default("Access token expiring"):s,a=e.accessTokenExpiredTimer,c=void 0===a?new u.default("Access token expired"):a;i(this,t),this._accessTokenExpiringNotificationTime=r,this._accessTokenExpiring=o,this._accessTokenExpired=c}return t.prototype.load=function(t){if(o.default.debug("AccessTokenEvents.load"),this._cancelTimers(),t.access_token){var e=t.expires_in;if(o.default.debug("access token present, remaining duration:",e),e>0){var n=e-this._accessTokenExpiringNotificationTime;n<=0&&(n=1),o.default.debug("registering expiring timer in:",n),this._accessTokenExpiring.init(n)}var r=e+1;o.default.debug("registering expired timer in:",r),this._accessTokenExpired.init(r)}},t.prototype.unload=function(){o.default.debug("AccessTokenEvents.unload"),this._cancelTimers()},t.prototype._cancelTimers=function(){o.default.debug("canceling existing access token timers"),this._accessTokenExpiring.cancel(),this._accessTokenExpired.cancel()},t.prototype.addAccessTokenExpiring=function(t){this._accessTokenExpiring.addHandler(t)},t.prototype.removeAccessTokenExpiring=function(t){this._accessTokenExpiring.removeHandler(t)},t.prototype.addAccessTokenExpired=function(t){this._accessTokenExpired.addHandler(t)},t.prototype.removeAccessTokenExpired=function(t){this._accessTokenExpired.removeHandler(t)},t}();e.default=c,t.exports=e.default},function(t,e,n){"use strict";
function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),u=n(1),h=r(u),c=n(5),f=r(c),l=n(38),d=r(l),g=5,p=function(t){function e(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:f.default.timer;i(this,e);var o=s(this,t.call(this,n));return o._timer=r,o._nowFunc=function(){return Date.now()/1e3},o}return o(e,t),e.prototype.init=function(t){this.cancel(),t<=0&&(t=1),t=parseInt(t),h.default.debug("Timer.init timer "+this._name+" for duration:",t),this._expiration=this.now+t;var e=g;t<e&&(e=t),this._timerHandle=this._timer.setInterval(this._callback.bind(this),1e3*e)},e.prototype.cancel=function(){this._timerHandle&&(h.default.debug("Timer.cancel: ",this._name),this._timer.clearInterval(this._timerHandle),this._timerHandle=null)},e.prototype._callback=function(){var e=this._expiration-this.now;h.default.debug("Timer._callback; "+this._name+" timer expires in:",e),this._expiration<=this.now&&(this.cancel(),t.prototype.raise.call(this))},a(e,[{key:"now",get:function(){return parseInt(this._nowFunc())}}]),e}(d.default);e.default=p,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=function(){function t(e){i(this,t),this._name=e,this._callbacks=[]}return t.prototype.addHandler=function(t){this._callbacks.push(t)},t.prototype.removeHandler=function(t){var e=this._callbacks.findIndex(function(e){return e===t});e>=0&&this._callbacks.splice(e,1)},t.prototype.raise=function(){o.default.debug("Raising event: "+this._name);var t=!0,e=!1,n=void 0;try{for(var r,i=this._callbacks[Symbol.iterator]();!(t=(r=i.next()).done);t=!0){var s=r.value;s.apply(void 0,arguments)}}catch(t){e=!0,n=t}finally{try{!t&&i.return&&i.return()}finally{if(e)throw n}}},t}();e.default=a,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=function(){function t(e){i(this,t),this._userManager=e,this._userManager.events.addAccessTokenExpiring(this._tokenExpiring.bind(this)),this._userManager.getUser().then(function(t){}).catch(function(t){o.default.error("Error from getUser:",t.message)})}return t.prototype._tokenExpiring=function(){var t=this;o.default.debug("SilentRenewService automatically renewing access token"),this._userManager.signinSilent().then(function(t){o.default.debug("Silent token renewal successful")},function(e){o.default.error("Error from signinSilent:",e.message),t._userManager.events._raiseSilentRenewError(e)})},t}();e.default=a,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u=n(41),h=r(u),c=function(){function t(e){var n=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:h.default;if(i(this,t),!e)throw a.default.error("No user manager passed to SessionMonitor"),new Error("userManager");this._userManager=e,this._CheckSessionIFrameCtor=r,this._userManager.events.addUserLoaded(this._start.bind(this)),this._userManager.events.addUserUnloaded(this._stop.bind(this)),this._userManager.getUser().then(function(t){t&&n._start(t)}).catch(function(t){a.default.error("SessionMonitor ctor; error from getUser:",t.message)})}return t.prototype._start=function(t){var e=this,n=t.session_state;n&&(this._sub=t.profile.sub,this._sid=t.profile.sid,a.default.debug("SessionMonitor._start; session_state:",n,", sub:",this._sub),this._checkSessionIFrame?this._checkSessionIFrame.start(n):this._metadataService.getCheckSessionIframe().then(function(t){if(t){a.default.debug("Initializing check session iframe");var r=e._client_id,i=e._checkSessionInterval;e._checkSessionIFrame=new e._CheckSessionIFrameCtor(e._callback.bind(e),r,t,i),e._checkSessionIFrame.start(n)}else a.default.warn("No check session iframe found in the metadata")}).catch(function(t){a.default.error("Error from getCheckSessionIframe:",t.message)}))},t.prototype._stop=function(){a.default.debug("SessionMonitor._stop"),this._sub=null,this._sid=null,this._checkSessionIFrame&&this._checkSessionIFrame.stop()},t.prototype._callback=function(){var t=this;a.default.debug("SessionMonitor._callback"),this._userManager.querySessionStatus().then(function(e){var n=!0;e?e.sub===t._sub?(n=!1,t._checkSessionIFrame.start(e.session_state),e.sid===t._sid?a.default.debug("Same sub still logged in at OP, restarting check session iframe; session_state:",e.session_state):(a.default.debug("Same sub still logged in at OP, session state has changed, restarting check session iframe; session_state:",e.session_state),t._userManager.events._raiseUserSessionChanged())):a.default.debug("Different subject signed into OP:",e.sub):a.default.debug("Subject no longer signed into OP"),n&&(a.default.debug("SessionMonitor._callback; raising signed out event"),t._userManager.events._raiseUserSignedOut())}).catch(function(e){a.default.debug("Error calling queryCurrentSigninSession; raising signed out event",e.message),t._userManager.events._raiseUserSignedOut()})},s(t,[{key:"_settings",get:function(){return this._userManager.settings}},{key:"_metadataService",get:function(){return this._userManager.metadataService}},{key:"_client_id",get:function(){return this._settings.client_id}},{key:"_checkSessionInterval",get:function(){return this._settings.checkSessionInterval}}]),t}();e.default=c,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=2e3,u=function(){function t(e,n,r,s){i(this,t),this._callback=e,this._client_id=n,this._url=r,this._interval=s||a;var o=r.indexOf("/",r.indexOf("//")+2);this._frame_origin=r.substr(0,o),this._frame=window.document.createElement("iframe"),this._frame.style.display="none",this._frame.src=r,window.document.body.appendChild(this._frame),this._boundMessageEvent=this._message.bind(this),window.addEventListener("message",this._boundMessageEvent,!1)}return t.prototype._message=function(t){t.origin===this._frame_origin&&t.source===this._frame.contentWindow&&("error"===t.data?(o.default.error("error message from check session op iframe"),this.stop()):"changed"===t.data?(o.default.debug("changed message from check session op iframe"),this.stop(),this._callback()):o.default.debug(t.data+" message from check session op iframe"))},t.prototype.start=function(t){var e=this;this._session_state!==t&&(o.default.debug("CheckSessionIFrame.start"),this.stop(),this._session_state=t,this._timer=window.setInterval(function(){e._frame.contentWindow.postMessage(e._client_id+" "+e._session_state,e._frame_origin)},this._interval))},t.prototype.stop=function(){o.default.debug("CheckSessionIFrame.stop"),this._session_state=null,this._timer&&(window.clearInterval(this._timer),this._timer=null)},t}();e.default=u,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=r(s),a=n(7),u=r(a),h=n(5),c=r(h),f="access_token",l=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c.default.XMLHttpRequest,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:u.default;if(i(this,t),!e)throw o.default.error("No settings provided"),new Error("No settings provided.");this._settings=e,this._XMLHttpRequestCtor=n,this._metadataService=new r(this._settings)}return t.prototype.revoke=function(t,e){var n=this;if(o.default.debug("TokenRevocationClient.revoke"),!t)throw o.default.error("No accessToken provided"),new Error("No accessToken provided.");return this._metadataService.getRevocationEndpoint().then(function(r){if(r){var i=n._settings.client_id,s=n._settings.client_secret;return n._revoke(r,i,s,t)}if(e)throw o.default.error("Revocation not supported"),new Error("Revocation not supported")})},t.prototype._revoke=function(t,e,n,r){var i=this;return o.default.debug("Calling revocation endpoint"),new Promise(function(s,a){var u=new i._XMLHttpRequestCtor;u.open("POST",t),u.onload=function(){o.default.debug("HTTP response received, status",u.status),200===u.status?s():a(Error(u.statusText+" ("+u.status+")"))};var h="client_id="+encodeURIComponent(e);n&&(h+="&client_secret="+encodeURIComponent(n)),h+="&token_type_hint="+encodeURIComponent(f),h+="&token="+encodeURIComponent(r),u.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),u.send(h)})},t}();e.default=l,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=(r(s),n(44)),a=r(o),u=function(){function t(){i(this,t)}return t.prototype.prepare=function(t){var e=new a.default(t);return Promise.resolve(e)},t}();e.default=u,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}return function(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}}(),o=n(1),a=r(o),u="location=no,toolbar=no,zoom=no",h="_blank",c=function(){function t(e){var n=this;i(this,t),a.default.debug("CordovaPopupWindow.ctor"),this._promise=new Promise(function(t,e){n._resolve=t,n._reject=e}),this.features=e.popupWindowFeatures||u,this.target=e.popupWindowTarget||h,this.redirect_uri=e.startUrl,a.default.debug("redirect_uri: "+this.redirect_uri)}return t.prototype._isInAppBrowserInstalled=function(t){return["cordova-plugin-inappbrowser","cordova-plugin-inappbrowser.inappbrowser","org.apache.cordova.inappbrowser"].some(function(e){return t.hasOwnProperty(e)})},t.prototype.navigate=function(t){if(a.default.debug("CordovaPopupWindow.navigate"),t&&t.url){if(!window.cordova)return this._error("cordova is undefined");var e=window.cordova.require("cordova/plugin_list").metadata;if(this._isInAppBrowserInstalled(e)===!1)return this._error("InAppBrowser plugin not found");this._popup=cordova.InAppBrowser.open(t.url,this.target,this.features),this._popup?(a.default.debug("popup successfully created"),this._exitCallbackEvent=this._exitCallback.bind(this),this._loadStartCallbackEvent=this._loadStartCallback.bind(this),this._popup.addEventListener("exit",this._exitCallbackEvent,!1),this._popup.addEventListener("loadstart",this._loadStartCallbackEvent,!1)):this._error("Error opening popup window")}else this._error("No url provided");return this.promise},t.prototype._loadStartCallback=function(t){0===t.url.indexOf(this.redirect_uri)&&this._success({url:t.url})},t.prototype._exitCallback=function(t){this._error(t)},t.prototype._success=function(t){this._cleanup(),a.default.debug("Successful response from cordova popup window"),this._resolve(t)},t.prototype._error=function(t){this._cleanup(),a.default.error(t),this._reject(new Error(t))},t.prototype._cleanup=function(){a.default.debug("CordovaPopupWindow._cleanup"),this._popup&&(this._popup.removeEventListener("exit",this._exitCallbackEvent,!1),this._popup.removeEventListener("loadstart",this._loadStartCallbackEvent,!1),this._popup.close()),this._popup=null},s(t,[{key:"promise",get:function(){return this._promise}}]),t}();e.default=c,t.exports=e.default},function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{default:t}}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var s=n(1),o=(r(s),n(44)),a=r(o),u=function(){function t(){i(this,t)}return t.prototype.prepare=function(t){t.popupWindowFeatures="hidden=yes";var e=new a.default(t);return Promise.resolve(e)},t}();e.default=u,t.exports=e.default}])});

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(35);
exports.encode = exports.stringify = __webpack_require__(36);


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect;
(function (Reflect) {
    "use strict";
    var hasOwn = Object.prototype.hasOwnProperty;
    // feature test for Symbol support
    var supportsSymbol = typeof Symbol === "function";
    var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
    var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
    var HashMap;
    (function (HashMap) {
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        // create an object in dictionary mode (a.k.a. "slow" mode in v8)
        HashMap.create = supportsCreate
            ? function () { return MakeDictionary(Object.create(null)); }
            : supportsProto
                ? function () { return MakeDictionary({ __proto__: null }); }
                : function () { return MakeDictionary({}); };
        HashMap.has = downLevel
            ? function (map, key) { return hasOwn.call(map, key); }
            : function (map, key) { return key in map; };
        HashMap.get = downLevel
            ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
            : function (map, key) { return map[key]; };
    })(HashMap || (HashMap = {}));
    // Load global or shim versions of Map, Set, and WeakMap
    var functionPrototype = Object.getPrototypeOf(Function);
    var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
    var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
    var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
    var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
    // [[Metadata]] internal slot
    // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
    var Metadata = new _WeakMap();
    /**
      * Applies a set of decorators to a property of a target object.
      * @param decorators An array of decorators.
      * @param target The target object.
      * @param propertyKey (Optional) The property key to decorate.
      * @param attributes (Optional) The property descriptor for the target key.
      * @remarks Decorators are applied in reverse order.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Example = Reflect.decorate(decoratorsArray, Example);
      *
      *     // property (on constructor)
      *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Object.defineProperty(Example, "staticMethod",
      *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
      *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
      *
      *     // method (on prototype)
      *     Object.defineProperty(Example.prototype, "method",
      *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
      *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
      *
      */
    function decorate(decorators, target, propertyKey, attributes) {
        if (!IsUndefined(propertyKey)) {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsObject(target))
                throw new TypeError();
            if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                throw new TypeError();
            if (IsNull(attributes))
                attributes = undefined;
            propertyKey = ToPropertyKey(propertyKey);
            return DecorateProperty(decorators, target, propertyKey, attributes);
        }
        else {
            if (!IsArray(decorators))
                throw new TypeError();
            if (!IsConstructor(target))
                throw new TypeError();
            return DecorateConstructor(decorators, target);
        }
    }
    Reflect.decorate = decorate;
    // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
    // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
    /**
      * A default metadata decorator factory that can be used on a class, class member, or parameter.
      * @param metadataKey The key for the metadata entry.
      * @param metadataValue The value for the metadata entry.
      * @returns A decorator function.
      * @remarks
      * If `metadataKey` is already defined for the target and target key, the
      * metadataValue for that key will be overwritten.
      * @example
      *
      *     // constructor
      *     @Reflect.metadata(key, value)
      *     class Example {
      *     }
      *
      *     // property (on constructor, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticProperty;
      *     }
      *
      *     // property (on prototype, TypeScript only)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         property;
      *     }
      *
      *     // method (on constructor)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         static staticMethod() { }
      *     }
      *
      *     // method (on prototype)
      *     class Example {
      *         @Reflect.metadata(key, value)
      *         method() { }
      *     }
      *
      */
    function metadata(metadataKey, metadataValue) {
        function decorator(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                throw new TypeError();
            OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        return decorator;
    }
    Reflect.metadata = metadata;
    /**
      * Define a unique metadata entry on the target.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param metadataValue A value that contains attached metadata.
      * @param target The target object on which to define metadata.
      * @param propertyKey (Optional) The property key for the target.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     Reflect.defineMetadata("custom:annotation", options, Example);
      *
      *     // property (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
      *
      *     // property (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
      *
      *     // method (on constructor)
      *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
      *
      *     // method (on prototype)
      *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
      *
      *     // decorator factory as metadata-producing annotation.
      *     function MyAnnotation(options): Decorator {
      *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
      *     }
      *
      */
    function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    Reflect.defineMetadata = defineMetadata;
    /**
      * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasMetadata = hasMetadata;
    /**
      * Gets a value indicating whether the target object has the provided metadata key defined.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function hasOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.hasOwnMetadata = hasOwnMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getMetadata = getMetadata;
    /**
      * Gets the metadata value for the provided metadata key on the target object.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function getOwnMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
    }
    Reflect.getOwnMetadata = getOwnMetadata;
    /**
      * Gets the metadata keys defined on the target object or its prototype chain.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getMetadataKeys(Example.prototype, "method");
      *
      */
    function getMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryMetadataKeys(target, propertyKey);
    }
    Reflect.getMetadataKeys = getMetadataKeys;
    /**
      * Gets the unique metadata keys defined on the target object.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns An array of unique metadata keys.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.getOwnMetadataKeys(Example);
      *
      *     // property (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
      *
      */
    function getOwnMetadataKeys(target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        return OrdinaryOwnMetadataKeys(target, propertyKey);
    }
    Reflect.getOwnMetadataKeys = getOwnMetadataKeys;
    /**
      * Deletes the metadata entry from the target object with the provided key.
      * @param metadataKey A key used to store and retrieve metadata.
      * @param target The target object on which the metadata is defined.
      * @param propertyKey (Optional) The property key for the target.
      * @returns `true` if the metadata entry was found and deleted; otherwise, false.
      * @example
      *
      *     class Example {
      *         // property declarations are not part of ES6, though they are valid in TypeScript:
      *         // static staticProperty;
      *         // property;
      *
      *         constructor(p) { }
      *         static staticMethod(p) { }
      *         method(p) { }
      *     }
      *
      *     // constructor
      *     result = Reflect.deleteMetadata("custom:annotation", Example);
      *
      *     // property (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
      *
      *     // property (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
      *
      *     // method (on constructor)
      *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
      *
      *     // method (on prototype)
      *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
      *
      */
    function deleteMetadata(metadataKey, target, propertyKey) {
        if (!IsObject(target))
            throw new TypeError();
        if (!IsUndefined(propertyKey))
            propertyKey = ToPropertyKey(propertyKey);
        var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        if (!metadataMap.delete(metadataKey))
            return false;
        if (metadataMap.size > 0)
            return true;
        var targetMetadata = Metadata.get(target);
        targetMetadata.delete(propertyKey);
        if (targetMetadata.size > 0)
            return true;
        Metadata.delete(target);
        return true;
    }
    Reflect.deleteMetadata = deleteMetadata;
    function DecorateConstructor(decorators, target) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsConstructor(decorated))
                    throw new TypeError();
                target = decorated;
            }
        }
        return target;
    }
    function DecorateProperty(decorators, target, propertyKey, descriptor) {
        for (var i = decorators.length - 1; i >= 0; --i) {
            var decorator = decorators[i];
            var decorated = decorator(target, propertyKey, descriptor);
            if (!IsUndefined(decorated) && !IsNull(decorated)) {
                if (!IsObject(decorated))
                    throw new TypeError();
                descriptor = decorated;
            }
        }
        return descriptor;
    }
    function GetOrCreateMetadataMap(O, P, Create) {
        var targetMetadata = Metadata.get(O);
        if (IsUndefined(targetMetadata)) {
            if (!Create)
                return undefined;
            targetMetadata = new _Map();
            Metadata.set(O, targetMetadata);
        }
        var metadataMap = targetMetadata.get(P);
        if (IsUndefined(metadataMap)) {
            if (!Create)
                return undefined;
            metadataMap = new _Map();
            targetMetadata.set(P, metadataMap);
        }
        return metadataMap;
    }
    // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
    function OrdinaryHasMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return true;
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryHasMetadata(MetadataKey, parent, P);
        return false;
    }
    // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
    function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return false;
        return ToBoolean(metadataMap.has(MetadataKey));
    }
    // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
    function OrdinaryGetMetadata(MetadataKey, O, P) {
        var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
        if (hasOwn)
            return OrdinaryGetOwnMetadata(MetadataKey, O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (!IsNull(parent))
            return OrdinaryGetMetadata(MetadataKey, parent, P);
        return undefined;
    }
    // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
    function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return undefined;
        return metadataMap.get(MetadataKey);
    }
    // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
    function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
        metadataMap.set(MetadataKey, MetadataValue);
    }
    // 3.1.6.1 OrdinaryMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
    function OrdinaryMetadataKeys(O, P) {
        var ownKeys = OrdinaryOwnMetadataKeys(O, P);
        var parent = OrdinaryGetPrototypeOf(O);
        if (parent === null)
            return ownKeys;
        var parentKeys = OrdinaryMetadataKeys(parent, P);
        if (parentKeys.length <= 0)
            return ownKeys;
        if (ownKeys.length <= 0)
            return parentKeys;
        var set = new _Set();
        var keys = [];
        for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
            var key = ownKeys_1[_i];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
            var key = parentKeys_1[_a];
            var hasKey = set.has(key);
            if (!hasKey) {
                set.add(key);
                keys.push(key);
            }
        }
        return keys;
    }
    // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
    // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
    function OrdinaryOwnMetadataKeys(O, P) {
        var keys = [];
        var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
        if (IsUndefined(metadataMap))
            return keys;
        var keysObj = metadataMap.keys();
        var iterator = GetIterator(keysObj);
        var k = 0;
        while (true) {
            var next = IteratorStep(iterator);
            if (!next) {
                keys.length = k;
                return keys;
            }
            var nextValue = IteratorValue(next);
            try {
                keys[k] = nextValue;
            }
            catch (e) {
                try {
                    IteratorClose(iterator);
                }
                finally {
                    throw e;
                }
            }
            k++;
        }
    }
    // 6 ECMAScript Data Typ0es and Values
    // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
    function Type(x) {
        if (x === null)
            return 1 /* Null */;
        switch (typeof x) {
            case "undefined": return 0 /* Undefined */;
            case "boolean": return 2 /* Boolean */;
            case "string": return 3 /* String */;
            case "symbol": return 4 /* Symbol */;
            case "number": return 5 /* Number */;
            case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
            default: return 6 /* Object */;
        }
    }
    // 6.1.1 The Undefined Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
    function IsUndefined(x) {
        return x === undefined;
    }
    // 6.1.2 The Null Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
    function IsNull(x) {
        return x === null;
    }
    // 6.1.5 The Symbol Type
    // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
    function IsSymbol(x) {
        return typeof x === "symbol";
    }
    // 6.1.7 The Object Type
    // https://tc39.github.io/ecma262/#sec-object-type
    function IsObject(x) {
        return typeof x === "object" ? x !== null : typeof x === "function";
    }
    // 7.1 Type Conversion
    // https://tc39.github.io/ecma262/#sec-type-conversion
    // 7.1.1 ToPrimitive(input [, PreferredType])
    // https://tc39.github.io/ecma262/#sec-toprimitive
    function ToPrimitive(input, PreferredType) {
        switch (Type(input)) {
            case 0 /* Undefined */: return input;
            case 1 /* Null */: return input;
            case 2 /* Boolean */: return input;
            case 3 /* String */: return input;
            case 4 /* Symbol */: return input;
            case 5 /* Number */: return input;
        }
        var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
        var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
        if (exoticToPrim !== undefined) {
            var result = exoticToPrim.call(input, hint);
            if (IsObject(result))
                throw new TypeError();
            return result;
        }
        return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
    }
    // 7.1.1.1 OrdinaryToPrimitive(O, hint)
    // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
    function OrdinaryToPrimitive(O, hint) {
        if (hint === "string") {
            var toString_1 = O.toString;
            if (IsCallable(toString_1)) {
                var result = toString_1.call(O);
                if (!IsObject(result))
                    return result;
            }
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        else {
            var valueOf = O.valueOf;
            if (IsCallable(valueOf)) {
                var result = valueOf.call(O);
                if (!IsObject(result))
                    return result;
            }
            var toString_2 = O.toString;
            if (IsCallable(toString_2)) {
                var result = toString_2.call(O);
                if (!IsObject(result))
                    return result;
            }
        }
        throw new TypeError();
    }
    // 7.1.2 ToBoolean(argument)
    // https://tc39.github.io/ecma262/2016/#sec-toboolean
    function ToBoolean(argument) {
        return !!argument;
    }
    // 7.1.12 ToString(argument)
    // https://tc39.github.io/ecma262/#sec-tostring
    function ToString(argument) {
        return "" + argument;
    }
    // 7.1.14 ToPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-topropertykey
    function ToPropertyKey(argument) {
        var key = ToPrimitive(argument, 3 /* String */);
        if (IsSymbol(key))
            return key;
        return ToString(key);
    }
    // 7.2 Testing and Comparison Operations
    // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
    // 7.2.2 IsArray(argument)
    // https://tc39.github.io/ecma262/#sec-isarray
    function IsArray(argument) {
        return Array.isArray
            ? Array.isArray(argument)
            : argument instanceof Object
                ? argument instanceof Array
                : Object.prototype.toString.call(argument) === "[object Array]";
    }
    // 7.2.3 IsCallable(argument)
    // https://tc39.github.io/ecma262/#sec-iscallable
    function IsCallable(argument) {
        // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
        return typeof argument === "function";
    }
    // 7.2.4 IsConstructor(argument)
    // https://tc39.github.io/ecma262/#sec-isconstructor
    function IsConstructor(argument) {
        // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
        return typeof argument === "function";
    }
    // 7.2.7 IsPropertyKey(argument)
    // https://tc39.github.io/ecma262/#sec-ispropertykey
    function IsPropertyKey(argument) {
        switch (Type(argument)) {
            case 3 /* String */: return true;
            case 4 /* Symbol */: return true;
            default: return false;
        }
    }
    // 7.3 Operations on Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-objects
    // 7.3.9 GetMethod(V, P)
    // https://tc39.github.io/ecma262/#sec-getmethod
    function GetMethod(V, P) {
        var func = V[P];
        if (func === undefined || func === null)
            return undefined;
        if (!IsCallable(func))
            throw new TypeError();
        return func;
    }
    // 7.4 Operations on Iterator Objects
    // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
    function GetIterator(obj) {
        var method = GetMethod(obj, iteratorSymbol);
        if (!IsCallable(method))
            throw new TypeError(); // from Call
        var iterator = method.call(obj);
        if (!IsObject(iterator))
            throw new TypeError();
        return iterator;
    }
    // 7.4.4 IteratorValue(iterResult)
    // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
    function IteratorValue(iterResult) {
        return iterResult.value;
    }
    // 7.4.5 IteratorStep(iterator)
    // https://tc39.github.io/ecma262/#sec-iteratorstep
    function IteratorStep(iterator) {
        var result = iterator.next();
        return result.done ? false : result;
    }
    // 7.4.6 IteratorClose(iterator, completion)
    // https://tc39.github.io/ecma262/#sec-iteratorclose
    function IteratorClose(iterator) {
        var f = iterator["return"];
        if (f)
            f.call(iterator);
    }
    // 9.1 Ordinary Object Internal Methods and Internal Slots
    // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
    // 9.1.1.1 OrdinaryGetPrototypeOf(O)
    // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
    function OrdinaryGetPrototypeOf(O) {
        var proto = Object.getPrototypeOf(O);
        if (typeof O !== "function" || O === functionPrototype)
            return proto;
        // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
        // Try to determine the superclass constructor. Compatible implementations
        // must either set __proto__ on a subclass constructor to the superclass constructor,
        // or ensure each class has a valid `constructor` property on its prototype that
        // points back to the constructor.
        // If this is not the same as Function.[[Prototype]], then this is definately inherited.
        // This is the case when in ES6 or when using __proto__ in a compatible browser.
        if (proto !== functionPrototype)
            return proto;
        // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
        var prototype = O.prototype;
        var prototypeProto = prototype && Object.getPrototypeOf(prototype);
        if (prototypeProto == null || prototypeProto === Object.prototype)
            return proto;
        // If the constructor was not a function, then we cannot determine the heritage.
        var constructor = prototypeProto.constructor;
        if (typeof constructor !== "function")
            return proto;
        // If we have some kind of self-reference, then we cannot determine the heritage.
        if (constructor === O)
            return proto;
        // we have a pretty good guess at the heritage.
        return constructor;
    }
    // naive Map shim
    function CreateMapPolyfill() {
        var cacheSentinel = {};
        var arraySentinel = [];
        var MapIterator = (function () {
            function MapIterator(keys, values, selector) {
                this._index = 0;
                this._keys = keys;
                this._values = values;
                this._selector = selector;
            }
            MapIterator.prototype["@@iterator"] = function () { return this; };
            MapIterator.prototype[iteratorSymbol] = function () { return this; };
            MapIterator.prototype.next = function () {
                var index = this._index;
                if (index >= 0 && index < this._keys.length) {
                    var result = this._selector(this._keys[index], this._values[index]);
                    if (index + 1 >= this._keys.length) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    else {
                        this._index++;
                    }
                    return { value: result, done: false };
                }
                return { value: undefined, done: true };
            };
            MapIterator.prototype.throw = function (error) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                throw error;
            };
            MapIterator.prototype.return = function (value) {
                if (this._index >= 0) {
                    this._index = -1;
                    this._keys = arraySentinel;
                    this._values = arraySentinel;
                }
                return { value: value, done: true };
            };
            return MapIterator;
        }());
        return (function () {
            function Map() {
                this._keys = [];
                this._values = [];
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            }
            Object.defineProperty(Map.prototype, "size", {
                get: function () { return this._keys.length; },
                enumerable: true,
                configurable: true
            });
            Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
            Map.prototype.get = function (key) {
                var index = this._find(key, /*insert*/ false);
                return index >= 0 ? this._values[index] : undefined;
            };
            Map.prototype.set = function (key, value) {
                var index = this._find(key, /*insert*/ true);
                this._values[index] = value;
                return this;
            };
            Map.prototype.delete = function (key) {
                var index = this._find(key, /*insert*/ false);
                if (index >= 0) {
                    var size = this._keys.length;
                    for (var i = index + 1; i < size; i++) {
                        this._keys[i - 1] = this._keys[i];
                        this._values[i - 1] = this._values[i];
                    }
                    this._keys.length--;
                    this._values.length--;
                    if (key === this._cacheKey) {
                        this._cacheKey = cacheSentinel;
                        this._cacheIndex = -2;
                    }
                    return true;
                }
                return false;
            };
            Map.prototype.clear = function () {
                this._keys.length = 0;
                this._values.length = 0;
                this._cacheKey = cacheSentinel;
                this._cacheIndex = -2;
            };
            Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
            Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
            Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
            Map.prototype["@@iterator"] = function () { return this.entries(); };
            Map.prototype[iteratorSymbol] = function () { return this.entries(); };
            Map.prototype._find = function (key, insert) {
                if (this._cacheKey !== key) {
                    this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                }
                if (this._cacheIndex < 0 && insert) {
                    this._cacheIndex = this._keys.length;
                    this._keys.push(key);
                    this._values.push(undefined);
                }
                return this._cacheIndex;
            };
            return Map;
        }());
        function getKey(key, _) {
            return key;
        }
        function getValue(_, value) {
            return value;
        }
        function getEntry(key, value) {
            return [key, value];
        }
    }
    // naive Set shim
    function CreateSetPolyfill() {
        return (function () {
            function Set() {
                this._map = new _Map();
            }
            Object.defineProperty(Set.prototype, "size", {
                get: function () { return this._map.size; },
                enumerable: true,
                configurable: true
            });
            Set.prototype.has = function (value) { return this._map.has(value); };
            Set.prototype.add = function (value) { return this._map.set(value, value), this; };
            Set.prototype.delete = function (value) { return this._map.delete(value); };
            Set.prototype.clear = function () { this._map.clear(); };
            Set.prototype.keys = function () { return this._map.keys(); };
            Set.prototype.values = function () { return this._map.values(); };
            Set.prototype.entries = function () { return this._map.entries(); };
            Set.prototype["@@iterator"] = function () { return this.keys(); };
            Set.prototype[iteratorSymbol] = function () { return this.keys(); };
            return Set;
        }());
    }
    // naive WeakMap shim
    function CreateWeakMapPolyfill() {
        var UUID_SIZE = 16;
        var keys = HashMap.create();
        var rootKey = CreateUniqueKey();
        return (function () {
            function WeakMap() {
                this._key = CreateUniqueKey();
            }
            WeakMap.prototype.has = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.has(table, this._key) : false;
            };
            WeakMap.prototype.get = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? HashMap.get(table, this._key) : undefined;
            };
            WeakMap.prototype.set = function (target, value) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                table[this._key] = value;
                return this;
            };
            WeakMap.prototype.delete = function (target) {
                var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                return table !== undefined ? delete table[this._key] : false;
            };
            WeakMap.prototype.clear = function () {
                // NOTE: not a real clear, just makes the previous data unreachable
                this._key = CreateUniqueKey();
            };
            return WeakMap;
        }());
        function CreateUniqueKey() {
            var key;
            do
                key = "@@WeakMap@@" + CreateUUID();
            while (HashMap.has(keys, key));
            keys[key] = true;
            return key;
        }
        function GetOrCreateWeakMapTable(target, create) {
            if (!hasOwn.call(target, rootKey)) {
                if (!create)
                    return undefined;
                Object.defineProperty(target, rootKey, { value: HashMap.create() });
            }
            return target[rootKey];
        }
        function FillRandomBytes(buffer, size) {
            for (var i = 0; i < size; ++i)
                buffer[i] = Math.random() * 0xff | 0;
            return buffer;
        }
        function GenRandomBytes(size) {
            if (typeof Uint8Array === "function") {
                if (typeof crypto !== "undefined")
                    return crypto.getRandomValues(new Uint8Array(size));
                if (typeof msCrypto !== "undefined")
                    return msCrypto.getRandomValues(new Uint8Array(size));
                return FillRandomBytes(new Uint8Array(size), size);
            }
            return FillRandomBytes(new Array(size), size);
        }
        function CreateUUID() {
            var data = GenRandomBytes(UUID_SIZE);
            // mark as random - RFC 4122 § 4.4
            data[6] = data[6] & 0x4f | 0x40;
            data[8] = data[8] & 0xbf | 0x80;
            var result = "";
            for (var offset = 0; offset < UUID_SIZE; ++offset) {
                var byte = data[offset];
                if (offset === 4 || offset === 6 || offset === 8)
                    result += "-";
                if (byte < 16)
                    result += "0";
                result += byte.toString(16).toLowerCase();
            }
            return result;
        }
    }
    // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
    function MakeDictionary(obj) {
        obj.__ = undefined;
        delete obj.__;
        return obj;
    }
    // patch global Reflect
    (function (__global) {
        if (typeof __global.Reflect !== "undefined") {
            if (__global.Reflect !== Reflect) {
                for (var p in Reflect) {
                    if (hasOwn.call(Reflect, p)) {
                        __global.Reflect[p] = Reflect[p];
                    }
                }
            }
        }
        else {
            __global.Reflect = Reflect;
        }
    })(typeof global !== "undefined" ? global :
        typeof self !== "undefined" ? self :
            Function("return this;")());
})(Reflect || (Reflect = {}));
//# sourceMappingURL=Reflect.js.map
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(45), __webpack_require__(51)))

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(13)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(23);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__(24);

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};
for (var key in styles) {
  clientOverlay.style[key] = styles[key];
}

var ansiHTML = __webpack_require__(12);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
ansiHTML.setColors(colors);

var Entities = __webpack_require__(25).AllHtmlEntities;
var entities = new Entities();

exports.showProblems =
function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
};

exports.clear =
function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
};

var problemColors = {
  errors: colors.red,
  warnings: colors.yellow
};

function problemType (type) {
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "http://webpack.github.io/docs/hot-module-replacement-with-webpack.html"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { ignoreUnaccepted: true };

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(12);

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(37);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(39);

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(46);

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(5);

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(59);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(7);

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(1))(8);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(11);
__webpack_require__(10);
module.exports = __webpack_require__(9);


/***/ })
/******/ ]);
//# sourceMappingURL=main-client.js.map