/**
 * 
 */
package com.ted.xplatform.pojo.common;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;

//import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;
import com.ted.xplatform.pojo.base.LogicAuditEntity;

/**
 * @author ghost
 * 附件表。所有的附件都存放在这里,基类。需要继承.
 */
@Entity
@Table(name = "attachment")
//@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
//@DiscriminatorColumn(name = "table_name", discriminatorType = DiscriminatorType.STRING)
//@DiscriminatorValue("attachment")
@EntityListeners({ org.springframework.data.jpa.domain.support.AuditingEntityListener.class })
public class Attachment extends LogicAuditEntity {
    private static final long serialVersionUID = 7857055935114900696L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    //@GenericGenerator(name = "system-uuid", strategy = "native")
    @Column(name = "attach_id", length = 32, nullable = false, updatable = false)
    protected Long            attachId;                               //唯一主键

    @Column(name = "type_code", length = 32, nullable = false, updatable = false)
    protected String          typeCode;                               //种类,对应属于谁的附件

    @Column(name = "foreign_id", length = 32, nullable = false, updatable = false)
    protected Long            foreignId;                              //外键

    @Column(name = "file_name", length = 90)
    protected String          fileName;                               //文件的原名

    @Column(name = "file_path", length = 255)
    protected String          filePath;                               //实际保存路径

    @Column(name = "file_size")
    protected Long            fileSize;                               //文件大小

    @Column(name = "file_type")
    protected String          fileType;                               //种类

    public Long getAttachId() {
        return attachId;
    }

    public void setAttachId(Long attachId) {
        this.attachId = attachId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

}
