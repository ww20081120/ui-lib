/*
 * 文 件 名:  FiledTransfer.java
 * 版    权:  Huawei Technologies Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  <描述>
 * 修 改 人:  wangwei-nj
 * 修改时间:  2013-1-18
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.seagull.hr.lang.util.export;

/**
 * <一句话功能简述>
 * <功能详细描述>
 * 
 * @author  wangwei-nj
 * @version  [版本号, 2013-1-18]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public interface FiledTransfer {
    /**
     * transfer value
     * @param filed filed
     * @param value value
     * @return value
     * @author wangwei-nj
     * @see [类、类#方法、类#成员]
     */
    Object transferValue(Object value);
    
    /**
     * 获取属性名
     * @return 属性名
     * @author wangwei-nj
     * @see [类、类#方法、类#成员]
     */
    String getFiledName();
}
