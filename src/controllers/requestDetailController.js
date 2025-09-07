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
             RM.RequestTypeId, RTM.RequestType,
             UR.CompanyId, CM.CompanyName
      FROM REQUEST_MASTER RM
      LEFT JOIN PRIORITY_MASTER PM ON RM.PriorityId = PM.PriorityId AND PM.IsActive = 1 AND PM.DelMark = 0
      LEFT JOIN STATUS_MASTER SM ON RM.StatusId = SM.StatusId AND SM.IsActive = 1 AND SM.DelMark = 0
      LEFT JOIN REQUEST_TYPE_MASTER RTM ON RM.RequestTypeId = RTM.RequestTypeId AND RTM.IsActive = 1 AND RTM.DelMark = 0
      LEFT JOIN USER_MASTER UM ON RM.CreatedBy = UM.UserId AND UM.IsActive = 1 AND UM.DelMark = 0
      LEFT JOIN UserRequest UR ON UR.RequestId = RM.RequestId AND UR.IsActive = 1 AND UR.DelMark = 0
      LEFT JOIN COMPANY_MASTER CM ON UR.CompanyId = CM.CompanyId AND CM.IsActive = 1 AND CM.DelMark = 0
      WHERE RM.RequestId = ${requestId} AND RM.IsActive = 1 AND RM.DelMark = 0
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
