/*
 * 文 件 名:  Metadata.java
 * 版    权:  Huawei Technologies Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  <描述>
 * 修 改 人:  wangkai
 * 修改时间:  2014-1-13
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.seagull.hr.lang.util.export;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.apache.commons.beanutils.BeanUtils;

/**
 * <一句话功能简述>
 * <功能详细描述>
 * 
 * @author wangkai
 * @version  [版本号, 2014-1-13]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public class Metadata {
    private Class<?> clazz;
    
    private String[] fileds;
    
    private String[] filedAlias;
    
    private Set<String> i18nFileds;
    
    private Map<String, FiledTransfer> transferMap = new HashMap<String, FiledTransfer>();
    
    /** <默认构造函数>
     */
    public Metadata(Class<?> clazz) {
        super();
        this.clazz = clazz;
    }
    
    /**
     * <一句话功能简述>
     * <功能详细描述>
     * @param obj obj
     * @return Object[]
     * @throws ServiceException ServiceException
     * @author wangkai
     * @see [类、类#方法、类#成员]
     */
    public Object[] getValues(Object obj)  {
        Object[] values = null;
        if (obj != null) {
            values = new Object[fileds.length];
            try {
                for (int i = 0; i < fileds.length; i++) {
                    Object value = BeanUtils.getProperty(obj, fileds[i]);
                    
                    FiledTransfer transfer = transferMap.get(fileds[i]);
                    
                    if (transfer != null) {
                        value = transfer.transferValue(value);
                    }
                    
                    if (value == null) {
                        value = "";
                    }
                    else if (i18nFileds != null && i18nFileds.contains(fileds[i])) {
                        value = value.toString();
                    }
                    values[i] = value;
                }
            }
            catch (Exception e) {
            }
        }
        return values;
    }
    
    /**
     * 添加需要国际化的字段
     * @param filed filed
     * @author wangkai
     * @see [类、类#方法、类#成员]
     */
    public void addI18nFiled(String... filed) {
        if (i18nFileds == null) {
            i18nFileds = new HashSet<String>();
        }
        
        if (filed != null) {
            for (String fed : filed) {
                i18nFileds.add(fed);
            }
        }
    }
    
    /**
     * 添加转换
     * @param transfers transfers
     * @author wangkai
     * @see [类、类#方法、类#成员]
     */
    public void addTransfer(FiledTransfer... transfers) {
        if (transfers != null) {
            for (FiledTransfer transfer : transfers) {
                transferMap.put(transfer.getFiledName(), transfer);
            }
        }
    }
    
    public Class<?> getClazz() {
        return clazz;
    }
    
    public void setClazz(Class<?> clazz) {
        this.clazz = clazz;
    }
    
    public String[] getFileds() {
        return fileds;
    }
    
    public void setFileds(String[] fileds) {
        this.fileds = fileds;
    }
    
    public String[] getFiledAlias() {
        return filedAlias;
    }
    
    public void setFiledAlias(String[] filedAlias) {
        this.filedAlias = filedAlias;
    }
}
