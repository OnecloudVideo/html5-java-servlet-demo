/*
 * File Name  : SignServlet.java
 * Authors    : lunjz*
 * Stage      : Ratification
 * Created    : Dec 4, 2014 11:17:33 AM
 * Copyright  : Copyright © 2009 OneCloud Co., Ltd.  All rights reserved.
 *
 * This software is the confidential and proprietary information of 
 * OneCloud Co., Ltd. ("Confidential Information").  You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with OneCloud.
 */

package com.pispower.video.upload;

import java.io.IOException;
import java.io.PrintWriter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.*;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

/**
 * 这个类用于计算签名。
 * 每次rest请求都必须带上签名sign，以验证身份和保证参数的正确。
 * 根据鸿瑞云视频restfult api的规则计算签名，并返回accessKey、time和sign。
 *
 */
public class SignServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	private final Logger log = Logger.getLogger(this.getClass());
	
	/**
	 * 用户在鸿瑞云视频上的access key和access secret，请参考开发者支持页面。
	 */
	private final static String ACCESS_KEY = "";
	
	private final static String ACCESS_SECRET = "";
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
		throws ServletException, IOException
	{
		Enumeration<String> parameterNames = req.getParameterNames();
		
		/**
		 * 将request的参数put到treeMap，参数名按自然语言顺序排序。
		 * 注意，如果参数名相同会覆盖。
		 */
		Map<String, String> sortParameterMap = new TreeMap<String, String>();
		
		while (parameterNames.hasMoreElements())
		{
			String parameterName = parameterNames.nextElement();
			String parameter = req.getParameter(parameterName);
			log.debug("parameterName : " + parameterName + ", " + "parameter : " + parameter);
			sortParameterMap.put(parameterName, parameter);
		}
		
		/**
		 * 将access key和time都put到treeMap中
		 */
		Date now = new Date();
		sortParameterMap.put("accessKey", ACCESS_KEY);
		sortParameterMap.put("time", String.valueOf(now.getTime()));
		log.debug("sorted parameter map : " + sortParameterMap);
		
		JSONObject json = new JSONObject();
		json.accumulate("accessKey", ACCESS_KEY);
		json.accumulate("time", now.getTime());
		json.accumulate("sign", getSign(sortParameterMap));
		
		outputData(resp, json);
	}

	/**
	 * 将access secret放在参数串的前后，计算签名sign
	 */
	private String getSign(Map<String, String> parameters)
	{
		StringBuilder sb = new StringBuilder();
		sb.append(ACCESS_SECRET);
		Set<String> keySet = parameters.keySet();
		for (String key : keySet)
		{
			sb.append(key);
			sb.append(parameters.get(key));
		}
		sb.append(ACCESS_SECRET);
		String parameterString = sb.toString();
		log.debug("parameter string : " + parameterString);
		
		StringBuilder md5builder = new StringBuilder();
		try
		{
			// 将MD5值转换为16进制字符显示
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.update(parameterString.getBytes());
			byte[] result = messageDigest.digest();
			for (byte b : result)
			{
				if (b >= 0 && b < 16)
				{
					md5builder.append('0');
				}
				md5builder.append(Integer.toHexString(b & 0xff));
			}
			log.debug("message digest : " + md5builder.toString());
		}
		catch (NoSuchAlgorithmException e)
		{
			log.error("get sign fail", e);
		}
		
		return md5builder.toString();
	}
	
	/**
	 * 以json格式返回数据
	 */
	private void outputData(HttpServletResponse resp, JSONObject json)
		throws IOException
	{
		resp.setCharacterEncoding("utf-8");
		resp.setContentType("application/json");
		PrintWriter writer = resp.getWriter();
		writer.print(json.toString());
		writer.close();
	}
	
}
