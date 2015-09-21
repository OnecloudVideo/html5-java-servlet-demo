(function($) {
	$("#name").val("");
	$("#link").val("");
	$("#position").val("");
	$("#onlineDate").val("");
	$("#offlineDate").val("");

	// 鸿瑞云视频的域名
	var videoApiDomain = "https://video.cloudak47.com";

	// 列出广告素材的请求路径
	var listAdUrl = videoApiDomain + "/ad/list.api";

	// 列出投放分类目录的请求路径
	var listCatalogUrl = videoApiDomain + "/catalog/list.api";

	// 投放广告的请求路径
	var applyAdUrl = videoApiDomain + "/advertising/add.api";

	// 下线广告的请求路径
	var offlineUrl = videoApiDomain + "/advertising/offline.api";

	getAd();
	getClassify();

	var catalogIds = [];
	var param = {};
	var applyId;
	$("#applyAdBtn").click(
			function() {
				// 选中的分类目录
				$("input[type=checkbox]").each(function(i) {
					if ($(this).prop("checked")) {
						catalogIds.push($(this).val());
					}
				});

				param.adId = $("select[name=adId]").val();
				param.name = $("#name").val();
				param.link = $("#link").val();
				param.position = $("#position").val();
				param.onlineDate = $("#onlineDate").val();
				param.catalogIds = catalogIds.toString();
				param.offlineDate = $("#offlineDate").val();

				// 判断信息是否完整
				if (param.adId == "" || param.name == "" || param.position == "" || param.onlineDate == ""
						|| param.offlineDate == "" || catalogIds.length == 0) {
					alert("信息不完整，请重新填写");
				} else {
					//广告上线
					$.ocv.post(applyAdUrl, param, function(data, status) {
						if (0 == data.statusCode) {
							alert("广告投放成功");
							$("#onlineBefore").hide();
							$("#applyAdBtn").hide();
							$("#onlineAfter").show();
							$("#offlineBtn").show();
							applyId = data.id;
							var ad = $("<tr><td>" + data.id + "</td><td>" + data.adId + "</td><td>" + data.name
									+ "</td><td>" + data.position + "</td><td>" + data.status + "</td><td>"
									+ data.onlineDate + "</td><td>" + data.offlineDate + "</td><td>" + data.link
									+ "</td><td>" + data.catalogIds + "</td></tr>");
							ad.appendTo($("#onlineSuccess"));
						} else {
							alert("投放失败,errorCode:" + data.statusCode);
						}
					});
				}
			});

	$("#offlineBtn").click(function() {
		//广告下线
		$.ocv.post(offlineUrl, {
			"id" : applyId
		}, function(data) {
			if (data.statusCode == 0) {
				alert("下线成功");
			} else {
				alert("下线失败:errorCode:" + data.statusCode);
			}
		});
	});

	//列出广告素材
	function getAd() {
		$.ocv.get(listAdUrl, {
			"status" : "AUDIT_SUCCESS"
		}, function(data) {
			if (data.statusCode == 0) {
				var adList = data.adList;
				var $select = $("select[name=adId]");
				for (var index = 0, ad; ad = adList[index++];) {
					$select.append("<option value='" + ad.id + "'>" + ad.name + "</option>");
				}
			} else {
				$("select[name=adId]").append("<option value=''>查询广告失败</option>");
			}
		});
	}

	//列出分类目录
	function getClassify() {
		$.ocv.get(listCatalogUrl, {}, function(data) {
			if (data.statusCode == 0) {
				var catalogs = data.catalogs;
				for (var index = 0, cata; cata = catalogs[index++];) {
					var catalog = $("<input type='checkbox' id='catalog" + cata.id + "' value='" + cata.id
							+ "'><label for='catalog" + cata.id + "'>" + cata.name + "</label><br>");
					catalog.appendTo($("#catalogs"));
				}
			} else {
				alert("查询分类目录失败");
			}
		});
	}

})(jQuery);