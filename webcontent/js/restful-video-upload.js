/*
 * File Name  : restful-video-upload.js
 * Authors    : lunjz*
 * Stage      : Ratification
 * Created    : Dec 4, 2014 11:24:59 AM
 * Copyright  : Copyright © 2009 OneCloud Co., Ltd.  All rights reserved.
 *
 * This software is the confidential and proprietary information of 
 * OneCloud Co., Ltd. ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with OneCloud.
 */

var VideoUpload = (function($) {
	'use strict';

	/**
	 * for IE, empty console.log
	 */
	var console = window.console || {
		log : function(log) {
			// empty
		}
	};

	// 基本配置
	var settings = {
		// 选择文件的按钮id, 必填, the <input type='file'> element, #uploadFile
		fileElement : '',

		// 上传文件列表的id, 必填, #fileQueue
		queueId : '',

		// 浏览文件按钮名称, 可选
		buttonText : '浏览',

		// 浏览文件按钮样式, 可选
		buttonClass : '',

		// 文件UI模板, 必填
		template : '',

		// 限制上传文件的大小, 单位字节, 默认200MB。建议不要过大，文件过大会造成合并文件超时。
		limitSize : 200 * 1024 * 1024,

		// 上传文件块的大小, 单位字节, 默认2MB
		chunkSize : 2 * 1024 * 1024,

		// 鸿瑞云视频接受的文件上传的格式。用户可以配置为这个集合的子集，不能添加其他格式。
		accept : [ '.avi', '.flv', '.mp4', '.mpeg', '.mpg', '.wmv', '.mkv', '.mts', '.wav', '.flac', '.ape', '.mp3',
				'.wma', '.m4a', '.aac' ],

		/*
		 * 设置上传文件的分类id, 可选, 没有指定则为'默认'分类。可以利用鸿瑞云视频关于分类的restful api查询分类的id。
		 * 若在初始化时不确定，可以在uploader中调用setCatalogId()设置。
		 */
		catalogId : '',

		// 选择文件后触发
		onSelect : function() {
		},

		// 更新文件上传进度
		onProgress : function(fileItem, percentage) {
		},

		// 文件上传成功后触发
		onUploadComplete : function(fileItem) {
		},

		// 文件列表上传完成后触发
		onQueueComplete : function() {
		},

		// 文件开始扫描时触发
		onStart : function(fileItem) {
		},

		// 文件扫描完，正式开始上传时触发
		onUploadStart : function(fileItem) {
		},

		// 文件上传出错时触发
		onUploadError : function(fileItem) {
		}
	}; // end of settings

	// 鸿瑞云视频的域名
	var videoApiDomain = "https://video.cloudak47.com";

	// 默认配置, 不可修改
	var defaultSettings = {

		// 鸿瑞云视频断点续传的restful api
		// 查询文件是否已经初始化
		listUrl : videoApiDomain + "/video/multipartUpload/list.api",

		// 初始化断点续传
		initUrl : videoApiDomain + "/video/multipartUpload/init.api",

		// 上传文件分块
		uploadPartUrl : videoApiDomain + "/video/multipartUpload/uploadPart.api",

		// 查询已经上传成功的文件分块
		getPartsUrl : videoApiDomain + "/video/multipartUpload/getParts.api",

		// 上传完成, 通知鸿瑞云视频合并文件
		completeUrl : videoApiDomain + "/video/multipartUpload/complete.api",

		// 删除错误文件分片
		deletePartsUrl : videoApiDomain + '/video/multipartUpload/deleteParts.api',

		// 查询分类
		getClassifyUrl : videoApiDomain + "/catalog/list.api",

		// 上传文件的引用数组, 内部变量,
		fileItemQueue : []
	};

	var Uploader = {
		init : function(options) {

			$.extend(settings, options, defaultSettings);

			// 设置浏览文件按钮的样式
			var $fileElement = $(settings.fileElement);
			var $wrapper = $('<span/>', {
				'class' : 'pispower_video_upload_wrapper'
			});
			var $button = $('<label/>', {
				'id' : 'video_upload_wrapper_button',
				'class' : 'pispower_video_upload_button',
				'for' : $fileElement.attr('id')
			});

			$button.text(settings.buttonText);
			$button.addClass(settings.buttonClass);
			$fileElement.addClass('pispower_video_upload_invisible');
			$fileElement.attr("multiple", "");
			$fileElement.wrap($wrapper);
			$fileElement.before($button);

			/*
			 * 监听选择文件按钮的change事件 在加入文件队列前, 检查文件的大小和格式, 若有文件不符合规定, 则不予上传
			 */
			$fileElement.unbind("change").change(function() {
				var $this = $(this);
				var $fileInput = $this[0];
				if ($fileInput.files.length > 5) {
					alert("一次只能上传5个文件，请减少上传的文件。");
					$this.val("");
					return false;
				}

				var hasError = false, msg = "";
				for (var fileIndex = 0, file; file = $fileInput.files[fileIndex++];) {
					if (file.size > settings.limitSize) {
						msg += handlers.onSelectError(file.name, 'FILE_TOO_BIG');
						hasError = true;
					}
					if (file.size == 0) {
						msg += handlers.onSelectError(file.name, 'FILE_ZERO');
						hasError = true;
					}
					var matches = file.name.toLowerCase().match(/(\.[^.]+)$/);
					var ext = matches && matches[1] || "";
					if ($.inArray(ext, settings.accept) < 0) {
						msg += handlers.onSelectError(file.name, 'FORMAT_NOT_SUPPORT');
						hasError = true;
					}
				}
				if (hasError) {
					alert(msg);
					$this.val("");
					return false;
				}

				if ($fileInput.files.length > 0) {
					handlers.onSelect($fileInput);
				}
				$this.val("");
			});

			// 判断浏览器是否支持html5的File api
			if (window.File && window.Blob && window.FileReader && window.FormData && Uint8Array.prototype.subarray) {
				return HTML5Uploader;
			} else {
				$button.attr("title", "你的浏览器不支持HTML5上传，请使用IE 10+、Chrome 11+和Firefox 4+。");
				$fileElement.attr("disabled", "");
				return NoUploader;
			}
		}
	}; // end of Uploader

	var HTML5Uploader = {
		upload : function() {
			handlers.onStart();
		},
		// 设置上传文件的分类id, 可选, 没有指定则为'默认'分类。
		setCatalogId : function(catalogId) {
			settings.catalogId = catalogId;
		},
		// 查询分类, 查询成功后回调success，查询失败则回调fail
		getClassify : function(success, fail) {
			$.ocv.get(settings.getClassifyUrl, {}, function(data) {
				if (data.statusCode == 0) {
					success(data);
				} else {
					// console.log("get classify fail");
					fail();
				}
			});
		}
	}

	var NoUploader = {
		upload : function() {
			// empty
		}
	}

	var handlers = {
		/**
		 * 选择文件后, 展示文件列表, 并将文件加入队列
		 */
		onSelect : function($fileInput) {
			var now = new Date();
			for (var fileIndex = 0, file; file = $fileInput.files[fileIndex++];) {
				var fileSize = Math.round(file.size / 1024);
				var suffix = 'KB';
				if (fileSize > 1024) {
					fileSize = Math.round(fileSize / 1024);
					suffix = 'MB';
				}
				var fileSizeParts = fileSize.toString().split('.');
				fileSize = fileSizeParts[0];
				if (fileSizeParts.length > 1) {
					fileSize += '.' + fileSizeParts[1].substr(0, 2);
				}
				fileSize += suffix;

				var fileItem = {};
				fileItem.fileItemId = "videoUploadFileItem-" + now.getTime() + fileIndex;
				fileItem.fileName = file.name;
				fileItem.fileSize = fileSize;
				fileItem.nativeFile = file;

				settings.fileItemQueue.push(fileItem);

				var template = settings.template;
				for ( var d in fileItem) {
					template = template.replace(new RegExp('\\$' + d, 'g'), fileItem[d]);
				}

				$(settings.queueId).append(template);
			}
			settings.onSelect();
		},
		/**
		 * 更新上传文件进度
		 */
		onProgress : function(fileItem, percentage) {
			settings.onProgress(fileItem, percentage);
		},
		/**
		 * 每当文件上传成功后, 删除文件上传信息, 显示上传完成, 若文件队列还有文件, 继续上传
		 */
		onUploadComplete : function(fileItem) {
			settings.onUploadComplete(fileItem);
			fileItem = null;
			this.onStart();
		},
		/**
		 * 当所有文件上传完成后, 清空文件列表
		 */
		onQueueComplete : function() {
			settings.fileItemQueue = [];
			settings.onQueueComplete();
		},
		/**
		 * 单个文件开始上传
		 */
		onStart : function() {
			if (settings.fileItemQueue.length > 0) {
				var fileItem = settings.fileItemQueue.shift();
				settings.onStart(fileItem);
				md5sum(fileItem, uploadFile);
			} else {
				this.onQueueComplete();
			}
		},
		/**
		 * 单个文件扫描完，正式开始上传
		 */
		onUploadStart : function(fileItem) {
			settings.onUploadStart(fileItem);
		},
		/**
		 * 上传文件时出错, 删除文件上传信息, 显示上传出错
		 */
		onUploadError : function(fileItem) {
			settings.onUploadError(fileItem);
			fileItem = null;
			this.onStart();
		},
		/**
		 * 取消上传
		 */
		onCancel : function() {
			settings.fileItemQueue = [];
			// TODO
		},
		/**
		 * 处理选择文件出错的情况
		 */
		onSelectError : function(fileName, errorCode) {
			var msg = "";
			switch (errorCode) {
			case 'FILE_TOO_BIG':
				msg = "文件：" + fileName + "超过200MB，请使用FTP上传。";
				break;
			case 'FILE_ZERO':
				msg = "文件：" + fileName + "大小为0，请上传正确的文件。";
				break;
			case 'FORMAT_NOT_SUPPORT':
				msg = "请选择以下格式的文件：\n" + settings.accept.toString();
				break;
			}
			return msg;
		}
	}; // end of handlers

	/**
	 * html5分割文件
	 */
	function sliceFile(file, start, end) {
		return (file.slice || file.mozSlice || file.webkitSlice).call(file, start, end, file.type);
	}

	/**
	 * 计算文件的md5值, 成功后调success
	 */
	function md5sum(fileItem, success) {
		var file = fileItem.nativeFile;
		// console.log(file.name + ", " + file.size);
		var spark = new SparkMD5.ArrayBuffer();
		var fileReader = new FileReader();

		var chunkSize = 20 * 1024 * 1024;
		var chunks = Math.ceil(file.size / chunkSize);
		var currentChunk = 0;
		var $fileItem = $('#' + fileItem.fileItemId);

		// 以append的方式计算文件的md5值
		fileReader.onload = function(e) {
			spark.append(e.target.result);
			currentChunk++;
			if (currentChunk < chunks) {
				readNext();
			} else {
				var md5String = spark.end();
				// console.log("md5 : " + md5String);
				spark.destroy();
				fileReader = null;
				$fileItem = null;
				handlers.onUploadStart(fileItem);
				success(fileItem, md5String);
			}
		}

		function readNext() {
			var begin = currentChunk * chunkSize;
			var end = ((begin + chunkSize) > file.size) ? file.size : (begin + chunkSize);
			fileReader.readAsArrayBuffer(sliceFile(file, begin, end));
		}

		readNext();
	}

	/**
	 * 文件分块信息对象，记录文件分块的序号和md5值。 根据鸿瑞云视频断点续传的api, 每上传完一个文件分块,
	 * 即会返回一个partKey和partMD5用以标识这个分块和验证上传的文件分块是否正确。 但并不会返回这个分块的序号,
	 * 因此用户需要自己记录分块的序号。同时，上传成功后，要记录这个分块的partKey。
	 */
	function ChunkInfo(md5, partNum) {
		this.md5 = md5;
		this.partNum = partNum;
	}

	/**
	 * 上传之前，保存分块的序号和md5值。
	 */
	function uploadFile(fileItem, md5String) {
		var file = fileItem.nativeFile;
		var chunks = Math.ceil(file.size / settings.chunkSize);

		var chunkIndex = 0;
		// 文件分块队列，保存每个文件分块的上传信息
		var chunkArray = [];
		// 上传完成的文件信息队列
		var uploadInfoStorage = [];

		var sliceFileReader = new FileReader();

		// 计算各分块的md5值
		sliceFileReader.onload = function(e) {
			var md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
			var chunkInfo = new ChunkInfo(md5, chunkIndex);
			chunkArray.push(chunkInfo);
			chunkIndex++;

			if (chunkIndex < chunks) {
				readNextChunk();
			} else {
				sliceFileReader = null;
				startUpload();
			}
		};

		function readNextChunk() {
			var begin = chunkIndex * settings.chunkSize;
			var end = ((begin + settings.chunkSize) > file.size) ? file.size : (begin + settings.chunkSize);
			sliceFileReader.readAsArrayBuffer(sliceFile(file, begin, end));
		}

		readNextChunk();

		/**
		 * 断点续传之前, 查询这个文件是否已经初始化。若是, 则进一步查询文件上传的进度进行续传; 否则, 进行初始化上传
		 */
		function startUpload() {
			// console.log(chunkArray);
			$.ocv.get(settings.listUrl, {
				fileMD5Equal : md5String
			}, function(data) {
				// console.log(data);
				if (data.multipartUploads.length == 0) {
					initUpload();
				} else if (data.multipartUploads.length == 1) {
					fileItem.uploadId = data.multipartUploads[0].uploadId;
					continueUpload();
				} else {
					// console.log("continue upload same files");
				}
			});
		}

		/**
		 * 初始化断点续传, 鸿瑞云视频会返回一个uploadId, 用以标识本次上传 初始化成功后随即上传
		 */
		function initUpload() {
			$.ocv.post(settings.initUrl, {
				fileName : file.name,
				fileMD5 : md5String
			}, function(data) {
				if (data.uploadId) {
					fileItem.uploadId = data.uploadId;
					uploadChunk();
				} else {
					handlers.onUploadError(fileItem);
				}
			});
		}

		/**
		 * XXX should upload in queue
		 */
		function updateTransferProgress() {
			var obj = {};
			var uploadedBytes = 0;
			obj.updateProgress = function(e) {
				if (e.lengthComputable) {
					var percentage = ((uploadedBytes + e.loaded) / file.size) * 100;
					handlers.onProgress(fileItem, percentage);
				}
			};
			obj.addUploaded = function(uploaded) {
				uploadedBytes += uploaded;
			}
			return obj;
		}

		var progressUpdater = updateTransferProgress();

		var serverInfo = [];

		/**
		 * 计算上次断开的分块进行续传
		 */
		function continueUpload() {
			$.ocv.get(settings.getPartsUrl, {
				uploadId : fileItem.uploadId
			}, function(data) {
				if (data.statusCode != 0) {
					handlers.onUploadError(fileItem);
					return false;
				}
				// 从鸿瑞云视频查询上传完成的分块，与本地文件分块比较，找到断开的那个分块的序号
				serverInfo = data.uploadedParts;
				// console.log("uploaded parts..." + serverInfo);
				if (!serverInfo.length) {
					uploadChunk();
					return;
				}
				// 记录服务器上错误的 partKey，有可能是因为上传到一半，有可能是因为改变了大小导致不一致。
				var errorParts = $.map(serverInfo, function(ele) {
					return ele.partKey;
				});

				// console.log(serverInfo);
				var parts = [];
				for (var k = 0, clen = chunkArray.length; k < clen; k++) {
					for (var j = 0, slen = serverInfo.length; j < slen; j++) {
						var serverChunk = serverInfo[j];
						if (serverChunk.partMD5 == chunkArray[k].md5
						// 服务器 1 base, 当前算法 0 base
						&& serverChunk.partNumber == (chunkArray[k].partNum + 1)) {
							chunkArray[k].partKey = serverInfo[j].partKey;
							uploadInfoStorage.push(chunkArray[k]);
							// 如果服务器上的正确，从错误里删除
							errorParts = $.map(errorParts, function(ele) {
								if (ele != serverChunk.partKey)
									return ele;
							});
							break;
						}
						if (j == slen - 1) {
							parts.push(chunkArray[k]);
						}
					}
				}

				// 删除错误的块
				if (errorParts.length) {
//					console.log("erro parts..." + errorParts);
					var partKeys = errorParts.toString();
					$.ocv.post(settings.deletePartsUrl, {
						partKeys : partKeys,
					}, function(data) {
						if (data.statusCode != 0) {
							handlers.onUploadError(fileItem);
							return false;
						}

						chunkArray = parts;
						if (chunkArray.length) {
							progressUpdater.addUploaded(uploadInfoStorage.length * settings.chunkSize);
							uploadChunk();
						} else {
							uploadComplete();
						}
					});
				} else {
					chunkArray = parts;
					if (chunkArray.length) {
						progressUpdater.addUploaded(uploadInfoStorage.length * settings.chunkSize);
						uploadChunk();
					} else {
						uploadComplete();
					}
				}
			});
		}

		/**
		 * 上传一块。 每上传完一块，鸿瑞云视频会返回接收到的文件分块的md5，然后判断与刚才上传的文件分块是否一致。
		 * 若一致，则表明分块上传成功；否则，将分块重新放回队列中。
		 * 同时鸿瑞云视频会返回文件分块的partKey，必须要记录下来，用于最后合并文件的验证。
		 */
		function uploadChunk() {
			var chunkInfo = chunkArray.shift();
			var currentChunk = chunkInfo.partNum;

			var begin = currentChunk * settings.chunkSize;
			var end = ((begin + settings.chunkSize) > file.size) ? file.size : (begin + settings.chunkSize);

			$.ocv.postFile(settings.uploadPartUrl, {
				uploadId : fileItem.uploadId,
				partNumber : currentChunk + 1	// 鸿瑞云视频的分块序号是从1开始，而这里是从0开始，因此要+1
			}, sliceFile(file, begin, end), function(data) {
				if (data.statusCode != 0) {
					handlers.onUploadError(fileItem);
					return false;
				}

				if (data.partMD5 != chunkInfo.md5) {
					chunkArray.push(chunkInfo);
				} else {
					chunkInfo.partKey = data.partKey;
					uploadInfoStorage.push(chunkInfo);
					progressUpdater.addUploaded(settings.chunkSize);
				}
				// 若队列还有分块，则继续上传
				if (chunkArray.length > 0) {
					uploadChunk();
				} else {
					// console.log(uploadInfoStorage);
					uploadComplete();
				}
			}, function() {
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener('progress', progressUpdater.updateProgress, false);
				return xhr;
			});
		}// end of uploadChunk()

		/**
		 * 所有分块上传完成后, 将所有文件分块的信息传给鸿瑞云视频，通知鸿瑞云视频对所有文件分块进行验证, 验证通过后合并文件, 至此, 本次上传成功,
		 * 视频转码自动开始。如果分块文件验证不通过, 则上传失败。//TODO 合并超时
		 */
		function uploadComplete() {
			var completeParas = {
				uploadId : fileItem.uploadId
			};
			if (settings.catalogId) {
				completeParas.catalogId = settings.catalogId;
			}
			for (var e = 0, info; info = uploadInfoStorage[e++];) {
				var partNum = info.partNum + 1;
				completeParas["part" + partNum] = info.partKey;
			}
			$.ocv.post(settings.completeUrl, completeParas, function(data) {
				var json = $.parseJSON(data);
				if (json.statusCode != 0) {
					handlers.onUploadError(fileItem);
					return false;
				}
				handlers.onUploadComplete(fileItem);
			});
		}
	} // end of uploadFile

	return Uploader;
})($);
