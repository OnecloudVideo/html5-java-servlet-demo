<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=uft-8">
<title>鸿瑞云视频投放广告</title>
<link type="text/css" rel="stylesheet" href="<c:url value='/css/default.css' />" />
<link type="text/css" rel="stylesheet" href="<c:url value='/css/videoupload.css' />" />
</head>
<body>
	<div class="con_box">
		<h1>
			鸿瑞云视频 HTML5 投放 广告 <a href="<c:url value='/index.jsp'/>" class="btn_back fr">返回</a>
		</h1>
		<p class="line"></p>
		<h2>DEMO操作说明</h2>
		<p>这个 DEMO 演示如何不通过您的服务器，在您的网页上直接投放广告。请参照以下步骤操作：</p>
		<p>1、填写或选择相关信息（广告名称、广告素材、广告位、上线时间(格式:yyyy-mm-dd)、下线时间、广告投放）。</p>
		<p>2、点击“投放广告”按钮。</p>
		<p>3、投放完成后提示成功，并显示投放信息列表。</p>
		<p>4、点击“下线”按钮，广告下线，下线完成后提示成功。</p>

		<h2>DEMO演示</h2>
		<button type="button" id="applyAdBtn" class="but_add">投放广告</button>
		<button type="button" id="offlineBtn" class="but_add" style="display: none;">下线</button>
		<form>
			<table id="onlineBefore" cellpadding="0" cellspacing="0" class="table2">
				<tr>
					<th>广告名称</th>
					<td><input type="text" id="name" maxlength="22" /> *</td>
				</tr>

				<tr>
					<th>广告素材</th>
					<td><select name="adId" class="select_long"></select>*</td>
				</tr>
				<tr>
					<th>广告位</th>
					<td><select class="select_long" id="position">
							<option value="HEAD">片头</option>
							<option value="END">片尾</option>
					</select>*</td>
				</tr>
				<tr>
					<th>上线时间</th>
					<td><input type="text" id="onlineDate" /> *</td>
				</tr>
				<tr>
					<th>下线时间</th>
					<td><input type="" text id="offlineDate" /> *</td>
				</tr>
				<tr>
					<th>广告链接</th>
					<td><input type="text" id="link" /></td>
				</tr>
				<tr>
					<th>广告投放</th>
					<td id="catalogs"></td>
				</tr>
			</table>
		</form>
		<table id="onlineAfter" width="100%" border="0" cellspacing="0" cellpadding="0" class="table2" style="display: none;">
			<thead id="onlineSuccess">
				<tr>
					<th>id</th>
					<th>adId</th>
					<th>name</th>
					<th>position</th>
					<th>status</th>
					<th>onlineDate</th>
					<th>offlineDate</th>
					<th>link</th>
					<th>catalogIds</th>
				</tr>
			</thead>

		</table>
		<br />
		<div class="con_box_logo"></div>
	</div>

	<script type="text/javascript" src="<c:url value="/js/jquery-1.11.1.min.js" />"></script>
	<script type="text/javascript" src="<c:url value="/js/spark-md5.min.js" />"></script>
	<script type="text/javascript" src="<c:url value="/js/onecloud-restful.js" />"></script>
	<script type="text/javascript" src="<c:url value="/js/apply-ad.js" />"></script>

</body>
</html>