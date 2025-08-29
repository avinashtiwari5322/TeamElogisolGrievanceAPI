// src/controllers/requestFetchController.js
const { sql } = require('../interface/db');

async function fetchUserRequests(req, res) {
  const { userId, page = 1, pageSize = 10 } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required.' });
  }
  const offset = (page - 1) * pageSize;
  try {
    // Get total count
    const countResult = await sql.query`SELECT COUNT(*) AS total FROM UserRequest WHERE UserId = ${userId} AND DelMark = 0`;
    const total = countResult.recordset[0].total;
    // Fetch paginated requests
    const result = await sql.query`
      SELECT RM.RequestId, RM.Subject, RM.Message, RM.Remark, RM.PriorityId, PM.PriorityName,
             RM.StatusId, SM.StatusName, RM.IsActive, RM.DelMark, RM.CreatedBy, UM.UserName AS CreatedByUserName, RM.CreatedOn, RM.UpdatedBy, RM.UpdatedOn,
             RM.RequestTypeId, RTM.RequestType
      FROM UserRequest UR
      INNER JOIN REQUEST_MASTER RM ON UR.RequestId = RM.RequestId
      LEFT JOIN PRIORITY_MASTER PM ON RM.PriorityId = PM.PriorityId
      LEFT JOIN STATUS_MASTER SM ON RM.StatusId = SM.StatusId
      LEFT JOIN REQUEST_TYPE_MASTER RTM ON RM.RequestTypeId = RTM.RequestTypeId
      LEFT JOIN USER_MASTER UM ON RM.CreatedBy = UM.UserId
      WHERE UR.UserId = ${userId} AND UR.DelMark = 0
      ORDER BY RM.CreatedOn DESC
      OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY
    `;
    const requests = result.recordset.map(r => ({
      RequestId: r.RequestId,
      Subject: r.Subject,
      Message: r.Message,
      Remark: r.Remark,
      PriorityId: r.PriorityId,
      Priority: r.PriorityName,
      StatusId: r.StatusId,
      Status: r.StatusName,
      IsActive: r.IsActive,
      DelMark: r.DelMark,
      CreatedBy: r.CreatedByUserName || r.CreatedBy,
      CreatedOn: r.CreatedOn,
      UpdatedBy: r.UpdatedBy,
      UpdatedOn: r.UpdatedOn,
      RequestTypeId: r.RequestTypeId,
      RequestType: r.RequestType
    }));
    res.json({
      success: true,
      total,
      page,
      pageSize,
      requests
    });
  } catch (err) {
    console.error('Error fetching user requests:', err);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

module.exports = { fetchUserRequests };
