<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=uft-8">
<title>鸿瑞云视频  Restful API DEMO</title>
<link type="text/css" rel="stylesheet" href="<c:url value='/css/default.css' />" />
</head>
<body>
	<div class="con_box">
		<h1>鸿瑞云视频  Restful API DEMO</h1>
		<p class="line"></p>
		<h2>1、注意</h2>
		<p>因为“鸿瑞云视频 ” Restful API 需要数字签名认证，所以您必须访问“鸿瑞云视频 ”获得相关accessKey和accessSecret才能正常演示。</p>
		<p>请将获取的 accessKey 和 accessSecret 配置到 utils/cal_sign.jsp 中相应的全局变量中。</p>
		<h2>2、HTML 5 上传 视频</h2>
		<p>该例子演示了您的客户如何将文件不需经过您的服务器直接上传到“鸿瑞云视频 ”。具体的操作步骤请参考内页。</p>
		<p>该例子的代码见 /upload.jsp</p>
		<p class="info_box">
			<a href="upload.jsp">点击进入演示</a>
		</p>
		<h2>3、callback DEMO</h2>
		<p>该例子演示了如何监听鸿瑞云视频 云平台的回调，同时依据回调内容自动生成相关的播放页面。需要实现这点您需要：</p>
		<p>1、您的应用的部署必须能够通过互联网进行访问。假设该应用的域名为：http://www.abc.com</p>
		<p>2、登录“鸿瑞云视频 ”在“开发者支持”的“Restful API”中填入回调地址：http://www.abc.com/callback.jsp</p>
		<p>3、上传一个视频到“鸿瑞云视频 ”，转码完成之后查看您的根目录。</p>
		<p class="info_box">该例子的代码见 /callback.jsp</p>
		<h2>4、HTML 5 上传 广告</h2>
		<p>该例子演示了您的客户如何将广告文件不需经过您的服务器直接上传到“鸿瑞云视频 ”。具体的操作步骤请参考内页。</p>
		<p>该例子的代码见 /upload-ad.jsp</p>
		<p class="info_box">
			<a href="upload-ad.jsp">点击进入演示</a>
		</p>
		<h2>5、HTML 5 投放、下线 广告 </h2>
		<p>该例子演示了您的客户如何不需经过您的服务器直接投放（下线）广告。具体的操作步骤请参考内页。</p>
		<p>该例子的代码见 /apply-ad.jsp</p>
		<p class="info_box">
			<a href="apply-ad.jsp">点击进入演示</a>
		</p>
		<div class="con_box_logo"></div>
	</div>
</body>
</html>