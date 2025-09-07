// src/controllers/requestController.js
const { sql } = require('../interface/db');
const fs = require('fs');
const path = require('path');

async function saveUserRequest(req, res) {
  const {
    subject,
    message,
    requestTypeId,
    priorityId,
    userId,
    companyId,
    attachments
  } = req.body;

  if (!subject || !message || !requestTypeId || !priorityId || !userId || !companyId) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }

  const transaction = new sql.Transaction();
  try {
    await transaction.begin();
    const request = new sql.Request(transaction);

    // Insert into REQUEST_MASTER
    const insertRequest = new sql.Request(transaction);
    insertRequest.input('subject', sql.VarChar(255), subject);
    insertRequest.input('message', sql.Text, message);
    insertRequest.input('priorityId', sql.Int, priorityId);
    insertRequest.input('statusId', sql.Int, 1);
    insertRequest.input('isActive', sql.Bit, 1);
    insertRequest.input('delMark', sql.Bit, 0);
    insertRequest.input('createdBy', sql.Int, userId);
    insertRequest.input('requestTypeId', sql.Int, requestTypeId);
    const requestInsert = await insertRequest.query(
      'INSERT INTO REQUEST_MASTER (Subject, Message, PriorityId, StatusId, IsActive, DelMark, CreatedBy, CreatedOn, RequestTypeId) VALUES (@subject, @message, @priorityId, @statusId, @isActive, @delMark, @createdBy, GETDATE(), @requestTypeId); SELECT SCOPE_IDENTITY() AS RequestId;'
    );
    const requestId = requestInsert.recordset[0].RequestId;

    // Insert into UserRequest
    const insertUserRequest = new sql.Request(transaction);
    insertUserRequest.input('userId', sql.Int, userId);
    insertUserRequest.input('requestId', sql.Int, requestId);
    insertUserRequest.input('companyId', sql.Int, companyId);
    insertUserRequest.input('isActive', sql.Bit, 1);
    insertUserRequest.input('delMark', sql.Bit, 0);
    insertUserRequest.input('createdBy', sql.Int, userId);
    await insertUserRequest.query(
      'INSERT INTO UserRequest (UserId, RequestId, CompanyId, IsActive, DelMark, CreatedBy, CreatedOn) VALUES (@userId, @requestId, @companyId, @isActive, @delMark, @createdBy, GETDATE());'
    );

    // Handle attachments
    if (attachments && Array.isArray(attachments)) {
      for (const file of attachments) {
        const insertAttachment = new sql.Request(transaction);
        insertAttachment.input('requestId', sql.Int, requestId);
        insertAttachment.input('fileName', sql.VarChar(100), file.fileName);
        insertAttachment.input('filePath', sql.VarChar(sql.MAX), file.base64);
        insertAttachment.input('isActive', sql.Bit, 1);
        insertAttachment.input('delMark', sql.Bit, 0);
        insertAttachment.input('createdBy', sql.Int, userId);
        await insertAttachment.query(
          'INSERT INTO ATTACHMENT_MASTER (RequestId, FileName, FilePath, IsActive, DelMark, CreatedBy, CreatedOn) VALUES (@requestId, @fileName, @filePath, @isActive, @delMark, @createdBy, GETDATE());'
        );
      }
    }

    await transaction.commit();
    res.json({ success: true, message: 'Request saved successfully.', requestId });
  } catch (err) {
    await transaction.rollback();
    console.error('Error saving request:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { saveUserRequest };
