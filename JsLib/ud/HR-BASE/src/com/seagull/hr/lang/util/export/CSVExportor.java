/*
 * 文 件 名:  CSVExportor.java
 * 版    权:  Huawei Technologies Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  <描述>
 * 修 改 人:  wangkai
 * 修改时间:  2014-1-13
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.seagull.hr.lang.util.export;

import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
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
public class CSVExportor extends AbstractExportor {
    
    private static final char SPLITOR_RECORDER = ',';
    
    private static final char SPLITOR_LINE = '\n';
    
    private static final char SPLITOR_TABLE = '\t';
    
    /**
     * {@inheritDoc}
     */
    public ByteArrayOutputStream export(Collection<?> datas) {
        if (getMetadata() == null) {
            setMetadata(new SimpleMetadata(datas.iterator().next().getClass()));
        }
        if (datas.isEmpty()) {
            return null;
        }
        else if (datas.size() > MAX_RECORDS) {
            return null;
        }
        
        StringBuffer buffer = new StringBuffer();
        DataOutputStream out = null;
        ByteArrayOutputStream bout = null;
        try {
            bout = new ByteArrayOutputStream();
            out = new DataOutputStream(bout);
            //append header
            appendHeader(buffer, out);
            
            // append body
            for (Object data : datas) {
                appendBody(data, buffer, out);
            }
            
        }
        catch (Exception e) {
        }
        finally {
            if (null != out) {
                try {
                    out.close();
                }
                catch (IOException e) {
                }
            }
        }
        
        return bout;
    }
    
    private void appendHeader(StringBuffer buffer, OutputStream out) throws IOException {
        String[] headers = getMetadata().getFiledAlias();
        for (String header : headers) {
            buffer.append(header).append(SPLITOR_RECORDER);
        }
        buffer.append(SPLITOR_LINE);
        writeBuffer(buffer, out);
    }
    
    private void appendBody(Object data, StringBuffer buffer, OutputStream out) throws IOException {
        Object[] records = getMetadata().getValues(data);
        if (records != null) {
            for (Object cell : records) {
                buffer.append(cell).append(SPLITOR_RECORDER).append(SPLITOR_TABLE);
            }
            buffer.append(SPLITOR_LINE);
            writeBuffer(buffer, out);
        }
        
    }
}
