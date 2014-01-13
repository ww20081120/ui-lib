/*
 * 文 件 名:  ExcelExportor.java
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
import java.util.Collection;
import java.util.Iterator;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableImage;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import org.apache.commons.beanutils.BeanUtils;

/**
 * <一句话功能简述>
 * <功能详细描述>
 * 
 * @author  wangkai
 * @version  [版本号, 2014-1-13]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public class ExcelExportor extends AbstractExportor {
    
    private static final String SHEET_NAME = "Sheet1";
    
    /**
     * 图片开始列
     */
    private static final int CHART_START_ROW = 0;
    
    /**
     * 图片之间距离
     */
    private static final int CHART_SPACE_ROW = 2;
    
    /**
     * 图片宽度占的单元格
     */
    private static final int CHART_WIDTH_NUM = 15;
    
    /**
     * 图片高度占的单元格
     */
    private static final int CHART_HEIGHT_NUM = 30;
    
    private String sheetName;
    
    private String[] dataHeaders;
    
    private String[] dataFields;
    
    /**
     * <默认构造函数>
     */
    public ExcelExportor() {
        this(SHEET_NAME);
    }
    
    /** <默认构造函数>
     */
    public ExcelExportor(String sheetName) {
        super();
        this.sheetName = sheetName;
    }
    
    /** {@inheritDoc} */
    public ByteArrayOutputStream export(Collection<?> datas)  {
        if (datas.isEmpty()) {
            return null;
        }
        else if (datas.size() > MAX_RECORDS) {
            return null;
        }
        
        if (getMetadata() == null) {
            setMetadata(new SimpleMetadata(datas.iterator().next().getClass()));
        }
        
        DataOutputStream out = null;
        ByteArrayOutputStream bout = null;
        WritableWorkbook bookout = null;
        try {
            bout = new ByteArrayOutputStream();
            out = new DataOutputStream(bout);
            bookout = Workbook.createWorkbook(out);
            
            WritableSheet sheet = bookout.createSheet(sheetName, 0);
            
            appendHeader(sheet);
            
            Iterator<?> iterators = datas.iterator();
            int index = 1;
            while (iterators.hasNext()) {
                appendBody(iterators.next(), sheet, index);
                index++;
            }
            bookout.write();
        }
        catch (Exception e) {
        }
        finally {
            if (out != null) {
                try {
                    out.close();
                }
                catch (Exception e) {
                }
            }
            if (bookout != null) {
                try {
                    bookout.close();
                }
                catch (Exception e) {
                }
            }
        }
        return bout;
    }
    
    public ByteArrayOutputStream exportChartAndData(Collection<?> datas, ByteArrayOutputStream[] chartStreams)
         {
        DataOutputStream out = null;
        ByteArrayOutputStream bout = null;
        WritableWorkbook book = null;
        try {
            bout = new ByteArrayOutputStream();
            out = new DataOutputStream(bout);
            book = Workbook.createWorkbook(out);
            
            WritableSheet sheet = book.createSheet(sheetName, 0);
            int line = 0;
            
            appendDataHeader(sheet, line);
            line++;
            Iterator<?> iterator = datas.iterator();
            while (iterator.hasNext()) {
                appendDataBody(iterator.next(), sheet, line);
                line++;
            }
            
            line = line + 4;
            
            for (ByteArrayOutputStream chartStream : chartStreams) {
                if (null != chartStream) {
                    line = appendChart(sheet, chartStream, line);
                }
            }
            
            book.write();
        }
        catch (Exception e) {
        }
        finally {
            if (out != null) {
                try {
                    out.close();
                }
                catch (Exception e) {
                }
            }
            if (book != null) {
                try {
                    book.close();
                }
                catch (Exception e) {
                }
            }
        }
        
        return bout;
    }
    
    private void appendHeader(WritableSheet sheet) {
        String[] headers = getMetadata().getFiledAlias();
        try {
            for (int i = 0; i < headers.length; i++) {
                Label label = new Label(i, 0, headers[i]);
                sheet.addCell(label);
            }
        }
        catch (Exception e) {
        }
        
    }
    
    private void appendDataHeader(WritableSheet sheet, int line)  {
        try {
            for (int i = 0; i < dataHeaders.length; i++) {
                //TODO 
                Label label = new Label(i, line, dataHeaders[i]);
                sheet.addCell(label);
            }
        }
        catch (Exception e) {
        }
        
    }
    
    private int appendChart(WritableSheet sheet, ByteArrayOutputStream chartStream, int line)  {
        
        byte[] imgBytes = chartStream.toByteArray();
        WritableImage img = new WritableImage(CHART_START_ROW, line, CHART_WIDTH_NUM, CHART_HEIGHT_NUM, imgBytes);
        sheet.addImage(img);
        
        return line + CHART_HEIGHT_NUM + CHART_SPACE_ROW;
    }
    
    private void appendDataBody(Object data, WritableSheet sheet, int line)  {
        String value = "";
        try {
            for (int i = 0; i < dataFields.length; i++) {
                value = BeanUtils.getProperty(data, dataFields[i]);
                Label label = new Label(i, line, null == value ? "" : value);
                sheet.addCell(label);
            }
        }
        catch (Exception e) {
        }
    }
    
    private void appendBody(Object data, WritableSheet sheet, int index)  {
        Object[] records = getMetadata().getValues(data);
        if (records != null) {
            try {
                for (int i = 0; i < records.length; i++) {
                    Label label = new Label(i, index, records[i].toString());
                    sheet.addCell(label);
                }
            }
            catch (Exception e) {
               
            }
        }
    }
    
    public String[] getDataHeaders() {
        return dataHeaders;
    }
    
    public void setDataHeaders(String[] dataHeaders) {
        this.dataHeaders = dataHeaders;
    }
    
    public String[] getDataFields() {
        return dataFields;
    }
    
    public void setDataFields(String[] dataFields) {
        this.dataFields = dataFields;
    }
    
}
