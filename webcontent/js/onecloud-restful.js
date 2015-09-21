(function($) {
	// 计算签名sign的url, 需要用户自己配置, 必填，请参考demo的webcontent/WEB-INF/web.xml文件中关于SignServlet的配置
	var signUrl = '/html5/sign';
	
	/**
	 * 计算参数签名sign函数, 成功后调callback
	 */
	var getSign = function(formData, callback) {
		$.post(signUrl, formData)
			.done(function(data, status) {
				callback($.extend({}, formData, data));
			});
	};
	
	var get = function(url, formData, success, fail) {
		getSign(formData, function(ret) {
			$.get(url, ret, "json")
				.done(success)
				.fail(fail);
		});
	};

	var post = function(url, formData, success, fail) {
		getSign(formData, function(ret) {
			$.post(url, ret, "json")
				.done(success)
				.fail(fail);
		});
	};
	
	/**
	 * post file through FormData
	 */
	var postFile = function(url, formData, file, success, xhr, fail) {
		getSign(formData, function(ret) {
			var postData = new FormData();
			for (var key in ret) {
				postData.append(key, ret[key]);
			}
			postData.append('file', file);
			var defaultSettings = {
				url: url,
				type: "post",
				data: postData,
				processData: false,
				contentType: false,
				xhr: xhr,
				dataType: "json"
			};
			$.ajax(defaultSettings)
				.done(success)
				.fail(fail);
		});
	};
	
	$.ocv = {
		get: get,
		post: post,
		postFile: postFile
	}
})($);