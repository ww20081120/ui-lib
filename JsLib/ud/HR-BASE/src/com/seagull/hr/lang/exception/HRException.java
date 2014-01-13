/*
 * 文 件 名:  HRException.java
 * 版    权:  Huawei Technologies Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  <描述>
 * 修 改 人:  wangkai
 * 修改时间:  2014-1-13
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.seagull.hr.lang.exception;

/**
 * <一句话功能简述>
 * 
 * @author  wangkai
 * @version  [版本号, 2014-1-13]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public class HRException extends Exception {
    
    /**
     * 注释内容
     */
    private static final long serialVersionUID = 7950629317537008205L;
    
    public HRException() {
        
    }
    
    public HRException(String msg) {
        super(msg);
    }
    
    public HRException(Throwable t) {
        super(t);
    }
    
    public HRException(String msg, Throwable t) {
        super(msg, t);
    }
}
