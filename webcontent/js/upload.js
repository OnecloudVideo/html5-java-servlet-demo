/*
 * File Name  : upload.js
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

(function($) {
	
	var uploadFileNumber = 0;
	/**
	 * 初始化VideoUpload
	 */
	var uploader = VideoUpload.init({
		// 计算签名sign的url, 请参考demo的webcontent/WEB-INF/web.xml文件中关于SignServlet的配置
		signUrl : '/html5/sign',
		
		// 浏览文件的按钮id, the <input type='file'> element, #uploadFile
		fileElement : '#uploadFile',
		
		// 上传文件列表的id, #fileQueue
		queueId : '#fileQueue',
		
		// 浏览文件按钮名称
		buttonText : '选择上传文件',
		
		// 浏览文件按钮样式
		buttonClass : 'but_add',
		
		// 文件UI模板, $fileItemId, $fileName, $fileSize是文件属性变量
		template : "<tr id='$fileItemId'>\
					<td>$fileName<div class='pispower_upload_progress'>\
					    <div class='pispower_upload_progress_bar'></div></div></td>\
					<td width='25%'>$fileSize</td>\
					<td class='status' width='25%'>等待</td></tr>",
		
		// 上传文件的分类id, 可选, 没有指定则为'默认'分类。可以利用亦云视频关于分类的restful api查询分类的id
		//catalogId : '',
		
		/**
		 * 上传开始, 更新状态为扫描
		 */			
		onStart: function(fileItem) {
			$('#' + fileItem.fileItemId).find(".status").text("扫描");
		},
		
		/**
		 * 扫描完成，开始正式上传
		 */
		onUploadStart : function(fileItem) {
			$('#' + fileItem.fileItemId).find(".status").text('上传中');
		},
		
		/**
		 * 更新进度。实时更新上传文件进度，更新状态为上传中。这里使用默认提供的上传进度条样式。
		 */
		onProgress : function(fileItem, percentage) {
			$('#' + fileItem.fileItemId).find(".pispower_upload_progress_bar").css('width', percentage + '%');
		},
		
		/**
		 * 上传成功，更新状态为完成。
		 */
		onUploadComplete : function(fileItem) {
			$('#' + fileItem.fileItemId).find(".status").text('完成');
			$("#uploadFileNumber").text(++uploadFileNumber);
		},
		
		/**
		 * 上传失败，更新状态为上传失败。
		 */
		onUploadError : function(fileItem) {
			$('#' + fileItem.fileItemId).find(".status").text('上传失败');
		}
	});
	
	/**
	 * 查询用户的分类
	 */
	uploader.getClassify(function(data) {
		var catalogs = data.catalogs;
		var $select = $("select[name=catalogId]");
		for (var index = 0, cata; cata = catalogs[index++];) {
			$select.append("<option value='"+cata.id+"'>"+cata.name+"</option>");
		}
	}, function(){
		$("select[name=catalogId]").append("<option value=''>查询分类失败</option>");
	});
	
	$('#upload').click(function() {
		uploader.setCatalogId($("select[name=catalogId]").val());
		uploader.upload();
	});
})($);