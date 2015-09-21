(function($) {
	// 判断浏览器是否支持上传
	if (!window.File || !window.Blob || !window.FileReader || !window.FormData) {
		$("#selectBtn").attr("title", "您的浏览器不支持上传，请用IE10+、Chrome30+和Firefox33+。");
		$("#uploadFile").attr("disabled", true);
		$("#uploadBtn").attr("disabled", true);
		return;
	} else {
		$("#uploadFile").attr("disabled", false);
		$("#uploadBtn").attr("disabled", true);
	}

	var files;
	$("#uploadFile").change(function() {
		files = $(this)[0].files;
		// 限制每次只能上传一个广告
		if (!files.length) {
			alert("请选择广告上传。");
			return false;
		} else if (files.length > 1) {
			alert("请每次选择一个广告。");
			return false;
		}

		var ad = files[0];
		// 判断上传的文件的格式是否符合要求
		var matches = ad.name.match(/wmv|mpg|mpeg|mp4|mkv|avi|flv|mts/);
		if (!matches) {
			alert("广告建议是wmv, mpg, mpeg, mp4, mkv, avi, flv, mts格式，文件'" + ad.name + "'不是指定格式，请重新上传。");
			return false;
		}
		// 判断上传文件的大小是否符合要求
		if (ad.size > 20 * 1024 * 1024) {
			alert("广告建议20MB以内，文件'" + ad.name + "'超过规定大小，请重新上传。");
			return false;
		}

		$("#fileName").text(files[0].name);
		$("#fileName").show();
		$("#uploadBtn").attr("disabled", false);
	});

	// 鸿瑞云视频的域名
	var videoApiDomain = "https://video.cloudak47.com";

	// 上传广告的请求路径
	var uploadUrl = videoApiDomain + "/ad/upload.api";

	$("#uploadBtn").click(
			function() {
				$.ocv.postFile(uploadUrl, {}, files[0], function(data) {
					if (0 == data.statusCode) {
						$("#fileName").hide();
						$("#adTable").show();
						$("#uploadBtn").attr("disabled", true);
						var time = convertTimeToString(data.duration);
						var size = Math.round(data.size / (1024 * 1024));
						var ad = $("<tr><td>" + data.id + "</td><td>" + data.name + "</td><td>" + data.status
								+ "</td><td>" + time + "</td><td>" + size + "MB</td></tr>");
						ad.appendTo($("#ad"));
						alert("广告上传成功！");
					} else {
						alert("上传失败,errorCode:" + data.statusCode);
					}
				});

			});

	// 时间转换
	function convertTimeToString(inputTime) {
		var time = Math.floor(inputTime);
		var minute = time / 60;
		var minuteStr = minute.toString();
		minuteStr = minuteStr.split(".");
		minuteStr = minuteStr[0];

		var second = time % 60;
		if (second < 10) {
			second = "0" + second;
		}
		if (minuteStr < 10) {
			minuteStr = "0" + minuteStr;
		}
		return "00:" + minuteStr + ":" + second;
	}

})(jQuery);