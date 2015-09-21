<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=uft-8">
<title>鸿瑞云视频 上传广告</title>
<link type="text/css" rel="stylesheet" href="<c:url value='/css/default.css' />" />
<link type="text/css" rel="stylesheet" href="<c:url value='/css/videoupload.css' />" />
</head>
<body>
	<div class="con_box">
		<h1>
			鸿瑞云视频  HTML5 上传 广告 <a href="<c:url value='/index.jsp'/>" class="btn_back fr">返回</a>
		</h1>
		<p class="line"></p>
		<h2>DEMO操作说明</h2>
		<p>这个 DEMO 演示如何不通过您的服务器，在您的网页上直接将文件上传到“鸿瑞云视频 ”。请参照以下步骤操作：</p>
		<p>1、点击“选择上传文件”按钮。</p>
		<p>2、在弹出的窗口选择文件。</p>
		<p>3、点击“开始上传”选择需要上传的文件，上传完成后提示上传成功。</p>
		<p>4、请访问鸿瑞云视频 来查看你上传的广告文件。</p>
		<h2>DEMO演示</h2>
		<input type="file" id="uploadFile" name="file" class="pispower_video_upload_invisible" /> <label id="selectBtn"
			class="pispower_video_upload_button but_add" for="uploadFile"> 选择上传文件 </label><label id="fileName"></label>
		<button type="button" id="uploadBtn" class="but_add txt_right">开始上传</button>
		
		<table id="adTable" width="100%" border="0" cellspacing="0" cellpadding="0" class="table2" style="display:none;">
			<thead id="ad">
				<tr>
					<th>id</th>
					<th>name</th>
					<th>status</th>
					<th>duration</th>
					<th>size</th>		
				</tr>		
			</thead>
		</table>
		
		<br />
		<div class="con_box_logo"></div>

	</div>
	<script type="text/javascript" src="<c:url value="/js/jquery-1.11.1.min.js" />"></script>
	<script type="text/javascript" src="<c:url value="/js/spark-md5.min.js" />"></script>
	<script type="text/javascript" src="<c:url value="/js/onecloud-restful.js" />"></script>
	<script type="text/javascript" src="<c:url value="/js/upload-ad.js" />"></script>

</body>
</html>