// src/controllers/requestDetailController.js
const { sql } = require('../interface/db');

async function getRequestDetail(req, res) {
  const { requestId } = req.params;
  if (!requestId) {
    return res.status(400).json({ success: false, message: 'requestId is required.' });
  }
  try {
    const result = await sql.query`
      SELECT RM.RequestId, RM.Subject, RM.Message, RM.Remark, RM.PriorityId, PM.PriorityName,
             RM.StatusId, SM.StatusName, RM.IsActive, RM.DelMark, RM.CreatedBy, UM.UserName AS CreatedByUserName, RM.CreatedOn, RM.UpdatedBy, RM.UpdatedOn,
             RM.RequestTypeId, RTM.RequestType
      FROM REQUEST_MASTER RM
      LEFT JOIN PRIORITY_MASTER PM ON RM.PriorityId = PM.PriorityId
      LEFT JOIN STATUS_MASTER SM ON RM.StatusId = SM.StatusId
      LEFT JOIN REQUEST_TYPE_MASTER RTM ON RM.RequestTypeId = RTM.RequestTypeId
      LEFT JOIN USER_MASTER UM ON RM.CreatedBy = UM.UserId
      WHERE RM.RequestId = ${requestId}
    `;
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }
    const request = result.recordset[0];
    // Fetch attachments
    const attachmentsResult = await sql.query`SELECT AttachmentId, FileName, FilePath FROM ATTACHMENT_MASTER WHERE RequestId = ${requestId} AND DelMark = 0 AND IsActive = 1`;
    request.attachments = attachmentsResult.recordset;
    res.json({ success: true, request });
  } catch (err) {
    console.error('Error fetching request detail:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { getRequestDetail };
