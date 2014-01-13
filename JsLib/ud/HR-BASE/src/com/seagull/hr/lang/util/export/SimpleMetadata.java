/*
 * 文 件 名:  SimpleMetadata.java
 * 版    权:  Huawei Technologies Co., Ltd. Copyright YYYY-YYYY,  All rights reserved
 * 描    述:  <描述>
 * 修 改 人:  wangwei-nj
 * 修改时间:  2013-1-18
 * 跟踪单号:  <跟踪单号>
 * 修改单号:  <修改单号>
 * 修改内容:  <修改内容>
 */
package com.seagull.hr.lang.util.export;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * <一句话功能简述>
 * <功能详细描述>
 * 
 * @author  wangwei-nj
 * @version  [版本号, 2013-1-18]
 * @see  [相关类/方法]
 * @since  [产品/模块版本]
 */
public class SimpleMetadata extends Metadata {
    
    /** <默认构造函数>
     */
    public SimpleMetadata(Class<?> clazz) {
        super(clazz);
        
        Field[] fields = clazz.getDeclaredFields();
        
        List<String> canHanderFiledList = new ArrayList<String>();
        for (Field filed : fields) {
            if (isTypeCanHandle(filed)) {
                canHanderFiledList.add(filed.getName());
            }
        }
        Collections.sort(canHanderFiledList);
        this.setFiledAlias(canHanderFiledList.toArray(new String[canHanderFiledList.size()]));
        this.setFileds(this.getFiledAlias());
    }
    
    private boolean isTypeCanHandle(Field field) {
        return (field.getModifiers() & Modifier.FINAL) != Modifier.FINAL;
    }
}
