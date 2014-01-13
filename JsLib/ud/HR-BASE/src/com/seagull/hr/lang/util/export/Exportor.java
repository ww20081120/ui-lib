/*
 * 文 件 名:  Exportor.java
 * 版    权:  Huawei Technologies Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  <描述>
 * 修 改 人:  wangwei-nj
 * 修改时间:  2013-1-18
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.seagull.hr.lang.util.export;

import java.io.ByteArrayOutputStream;
import java.util.Collection;

/**
 * <一句话功能简述>
 * <功能详细描述>
 * 
 * @author  wangwei-nj
 * @version  [版本号, 2013-1-18]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public interface Exportor {
    
    /**
     * 没有您想导出的记录。
     */
    String EXPORT_NULL_RECORD = "export.record.null";
    
    /**
     * 记录过多
     */
    String EXPORT_FULL_RECORD = "export.record.full";
    
    /**
     * 最大记录
     */
    long MAX_RECORDS = 50000;
    
    /**
     * 设置元数据
     * @author wangwei-nj
     * @see [类、类#方法、类#成员]
     */
    void setMetadata(Metadata metadata);
    
    /**
     * <一句话功能简述>
     * <功能详细描述>
     * @return
     * @author wangwei-nj
     * @see [类、类#方法、类#成员]
     */
    ByteArrayOutputStream export(Collection<?> datas) ;
}
