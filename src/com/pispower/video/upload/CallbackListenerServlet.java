/*
 * File Name  : CallbackListenerServlet.java
 * Authors    : lunjz*
 * Stage      : Ratification
 * Created    : Dec 4, 2014 3:41:44 PM
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
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.*;

import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

/**
 * 用于监听回调，鸿瑞云视频目前在三种情况下会回调：
 * 1 转码成功
 * 2 转码失败
 * 3 断点续传失败
 *
 */
public class CallbackListenerServlet extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	private final Logger log = Logger.getLogger(this.getClass());
	
	/**
	 * 鸿瑞云视频以get的方式回调用户
	 */
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
		throws ServletException, IOException
	{
		acceptCallback(req, resp);
	}
	
	/**
	 * 这里只是简单地列出回调带上的参数，转码成功回调的参数有：
	 * 签名sign(用于验证回调参数)、回调类型notifyEventType、
	 * 视频代码embedCodes、videoName、videoId。
	 * 用户可以依据这些参数结合实际地开发自己的应用。
	 */
	private void acceptCallback(HttpServletRequest req, HttpServletResponse resp)
		throws IOException
	{
		JSONObject json = new JSONObject();
		Enumeration<String> parameterNames = req.getParameterNames();
		while (parameterNames.hasMoreElements())
		{
			String parameterName = parameterNames.nextElement();
			String parameter = req.getParameter(parameterName);
			json.put(parameterName, parameter);
		}
		
		log.debug("sign : " + json.get("sign"));
		log.debug("embedCodes : " + json.get("embedCodes"));
		log.debug("videoName : " + json.get("videoName"));
		log.debug("videoId : " + json.get("videoId"));
		log.debug("notifyEventType : " + json.get("notifyEventType"));
		log.debug("message : " + json.get("message"));
		
		// 返回yes，通知鸿瑞云视频已经回调成功
		PrintWriter writer = resp.getWriter();
		writer.print("yes");
		writer.close();
	}
	
}
