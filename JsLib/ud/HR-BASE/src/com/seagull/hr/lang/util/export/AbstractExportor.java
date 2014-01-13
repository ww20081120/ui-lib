/*
 * 文 件 名:  AbstractExportor.java
 * 版    权:  Huawei Technologies Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  <描述>
 * 修 改 人:  wangkai
 * 修改时间:  2014-1-13
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.seagull.hr.lang.util.export;

import java.io.IOException;
import java.io.OutputStream;

/**
 * <一句话功能简述>
 * <功能详细描述>
 * 
 * @author  wangkai
 * @version  [版本号, 2014-1-13]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public abstract class AbstractExportor implements Exportor {
    private Metadata metadata;
    
    /** {@inheritDoc} */
    public void setMetadata(Metadata metadata) {
        this.metadata = metadata;
    }
    
    protected void writeBuffer(StringBuffer buffer, OutputStream out) throws IOException {
        if (null != buffer) {
            out.write(buffer.toString().getBytes());
        }
        buffer.setLength(0);
    }
    
    public Metadata getMetadata() {
        return metadata;
    }
    
}
