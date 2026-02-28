const express = require('express');
const router = express.Router();
const db = require('../data/db');

// 生成UUID
const generateId = () => {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

// ============ 申请单API ============

// 获取所有申请单
router.get('/applications', (req, res) => {
  try {
    const { shuttle, tosVersion, apkStatus, applicant, status } = req.query;
    
    let sql = 'SELECT * FROM applications WHERE 1=1';
    const params = [];
    
    if (shuttle) {
      sql += ' AND shuttle_name LIKE ?';
      params.push(`%${shuttle}%`);
    }
    if (tosVersion) {
      sql += ' AND tos_version = ?';
      params.push(tosVersion);
    }
    if (apkStatus) {
      sql += ' AND apk_status = ?';
      params.push(apkStatus);
    }
    if (applicant) {
      sql += ' AND applicant LIKE ?';
      params.push(`%${applicant}%`);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY apply_time DESC';
    
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个申请单
router.get('/applications/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM applications WHERE id = ?');
    const row = stmt.get(req.params.id);
    
    if (!row) {
      return res.status(404).json({ success: false, error: '申请单不存在' });
    }
    
    // 获取关联的APK流程
    const apkStmt = db.prepare('SELECT * FROM apk_processes WHERE application_id = ?');
    const apkProcesses = apkStmt.all(req.params.id);
    
    res.json({ success: true, data: { ...row, apkProcesses } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建申请单
router.post('/applications', (req, res) => {
  try {
    const { shuttleName, tosVersion, applicant } = req.body;
    const id = generateId();
    const applyTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    const stmt = db.prepare(`
      INSERT INTO applications (id, shuttle_name, tos_version, apk_status, applicant, apply_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, shuttleName, tosVersion, 'processing', applicant, applyTime, 'processing');
    
    // 记录操作历史
    const historyId = generateId();
    const historyStmt = db.prepare(`
      INSERT INTO operation_history (id, process_id, operator, action, detail, node_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    historyStmt.run(historyId, id, applicant, '创建申请', `创建了班车申请: ${shuttleName}`, '通道发布申请');
    
    res.json({ success: true, data: { id, shuttleName, tosVersion, applicant, applyTime } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ APK流程API ============

// 获取APK流程列表
router.get('/processes', (req, res) => {
  try {
    const { applicationId, status } = req.query;
    
    let sql = 'SELECT * FROM apk_processes WHERE 1=1';
    const params = [];
    
    if (applicationId) {
      sql += ' AND application_id = ?';
      params.push(applicationId);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);
    
    // 获取每个流程的节点信息
    const processes = rows.map(row => {
      const nodeStmt = db.prepare('SELECT * FROM process_nodes WHERE process_id = ? ORDER BY node_index');
      const nodes = nodeStmt.all(row.id);
      return { ...row, nodes };
    });
    
    res.json({ success: true, data: processes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取单个APK流程详情
router.get('/processes/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM apk_processes WHERE id = ?');
    const row = stmt.get(req.params.id);
    
    if (!row) {
      return res.status(404).json({ success: false, error: '流程不存在' });
    }
    
    // 获取节点信息
    const nodeStmt = db.prepare('SELECT * FROM process_nodes WHERE process_id = ? ORDER BY node_index');
    const nodes = nodeStmt.all(req.params.id);
    
    // 获取物料信息
    const materialStmt = db.prepare('SELECT * FROM materials WHERE process_id = ?');
    const material = materialStmt.get(req.params.id);
    
    // 获取操作历史
    const historyStmt = db.prepare('SELECT * FROM operation_history WHERE process_id = ? ORDER BY action_time DESC');
    const history = historyStmt.all(req.params.id);
    
    res.json({ success: true, data: { ...row, nodes, material, history } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 创建APK流程
router.post('/processes', (req, res) => {
  try {
    const { 
      applicationId, appName, packageName, versionCode, appType, appCategory,
      apkUrl, isSystemApp, publishCountryType, publishCountryDetail,
      publishBrand, publishModel, testModel, androidVersion, tosVersion,
      filterIndia, isPAUpdate, grayScaleLevel, effectiveTime, applicant
    } = req.body;
    
    const id = generateId();
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    const stmt = db.prepare(`
      INSERT INTO apk_processes (
        id, application_id, app_name, package_name, version_code, app_type, app_category,
        apk_url, is_system_app, publish_country_type, publish_country_detail,
        publish_brand, publish_model, test_model, android_version, tos_version,
        filter_india, is_pa_update, gray_scale_level, effective_time, status, current_node
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, applicationId, appName, packageName, versionCode, appType, appCategory,
      apkUrl, isSystemApp, publishCountryType, JSON.stringify(publishCountryDetail),
      JSON.stringify(publishBrand), JSON.stringify(publishModel), JSON.stringify(testModel),
      androidVersion, tosVersion, filterIndia, isPAUpdate, grayScaleLevel ? parseInt(grayScaleLevel) : null,
      effectiveTime, 'processing', 0
    );
    
    // 初始化7个流程节点
    const nodeNames = [
      '通道发布申请', '通道发布审核', '物料上传', '物料审核', 
      '应用上架', '业务内测', '灰度监控'
    ];
    
    const nodeStmt = db.prepare(`
      INSERT INTO process_nodes (id, process_id, node_index, node_name, status)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    nodeNames.forEach((name, index) => {
      const nodeId = generateId();
      const status = index === 0 ? 'completed' : (index === 1 ? 'processing' : 'pending');
      const operator = index === 0 ? applicant : null;
      const operatorTime = index === 0 ? currentTime : null;
      
      nodeStmt.run(nodeId, id, index, name, status);
      
      // 更新节点的操作人和时间
      if (operator) {
        const updateStmt = db.prepare(`
          UPDATE process_nodes SET operator = ?, operator_time = ? WHERE id = ?
        `);
        updateStmt.run(operator, operatorTime, nodeId);
      }
    });
    
    // 记录操作历史
    const historyId = generateId();
    const historyStmt = db.prepare(`
      INSERT INTO operation_history (id, process_id, operator, action, detail, node_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    historyStmt.run(historyId, id, applicant, '创建流程', `创建了APK发布流程: ${appName}`, '通道发布申请');
    
    res.json({ success: true, data: { id, appName, packageName, versionCode } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 更新APK流程节点状态
router.put('/processes/:id/nodes/:nodeIndex', (req, res) => {
  try {
    const { status, operator, rejectReason } = req.body;
    const { id, nodeIndex } = req.params;
    const operatorTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    // 更新节点状态
    const updateNodeStmt = db.prepare(`
      UPDATE process_nodes 
      SET status = ?, operator = ?, operator_time = ?, reject_reason = ?, updated_at = ?
      WHERE process_id = ? AND node_index = ?
    `);
    
    updateNodeStmt.run(status, operator, operatorTime, rejectReason || null, operatorTime, id, parseInt(nodeIndex));
    
    // 如果审核通过，推进到下一节点
    if (status === 'completed') {
      const nextNodeIndex = parseInt(nodeIndex) + 1;
      const checkNextStmt = db.prepare('SELECT COUNT(*) as count FROM process_nodes WHERE process_id = ? AND node_index = ?');
      const nextNodeExists = checkNextStmt.get(id, nextNodeIndex);
      
      if (nextNodeExists && nextNodeExists.count > 0) {
        const nextStmt = db.prepare(`
          UPDATE process_nodes SET status = 'processing', updated_at = ? WHERE process_id = ? AND node_index = ?
        `);
        nextStmt.run(operatorTime, id, nextNodeIndex);
        
        // 更新流程当前节点
        const updateProcessStmt = db.prepare('UPDATE apk_processes SET current_node = ?, updated_at = ? WHERE id = ?');
        updateProcessStmt.run(nextNodeIndex, operatorTime, id);
      } else {
        // 所有节点完成
        const updateProcessStmt = db.prepare('UPDATE apk_processes SET status = ?, updated_at = ? WHERE id = ?');
        updateProcessStmt.run('completed', operatorTime, id);
      }
    } else if (status === 'rejected') {
      // 审核拒绝，回退到前一节点
      const prevNodeIndex = Math.max(0, parseInt(nodeIndex) - 1);
      const prevStmt = db.prepare(`
        UPDATE process_nodes SET status = 'processing', updated_at = ? WHERE process_id = ? AND node_index = ?
      `);
      prevStmt.run(operatorTime, id, prevNodeIndex);
      
      // 更新流程当前节点
      const updateProcessStmt = db.prepare('UPDATE apk_processes SET current_node = ?, updated_at = ? WHERE id = ?');
      updateProcessStmt.run(prevNodeIndex, operatorTime, id);
    }
    
    // 记录操作历史
    const nodeNameStmt = db.prepare('SELECT node_name FROM process_nodes WHERE process_id = ? AND node_index = ?');
    const nodeInfo = nodeNameStmt.get(id, parseInt(nodeIndex));
    
    const historyId = generateId();
    const historyStmt = db.prepare(`
      INSERT INTO operation_history (id, process_id, operator, action, detail, node_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const action = status === 'completed' ? '审核通过' : '审核拒绝';
    const detail = status === 'completed' ? `节点审核通过` : `审核拒绝: ${rejectReason}`;
    historyStmt.run(historyId, id, operator, action, detail, nodeInfo?.node_name);
    
    res.json({ success: true, message: '节点状态更新成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ 物料API ============

// 创建/更新物料
router.post('/materials', (req, res) => {
  try {
    const { 
      processId, appName, shortDescription, productDetail, updateNotes,
      keywords, appIconUrl, heroImageUrl, screenshots, isGPUpload, gpLink, applicant
    } = req.body;
    
    // 检查是否已存在物料
    const checkStmt = db.prepare('SELECT id FROM materials WHERE process_id = ?');
    const existing = checkStmt.get(processId);
    
    const currentTime = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    if (existing) {
      // 更新物料
      const updateStmt = db.prepare(`
        UPDATE materials SET
          app_name = ?, short_description = ?, product_detail = ?, update_notes = ?,
          keywords = ?, app_icon_url = ?, hero_image_url = ?, screenshots = ?,
          is_gp_upload = ?, gp_link = ?, status = ?, updated_at = ?
        WHERE process_id = ?
      `);
      
      updateStmt.run(
        appName, shortDescription, productDetail, updateNotes,
        JSON.stringify(keywords), appIconUrl, heroImageUrl, JSON.stringify(screenshots),
        isGPUpload, gpLink, 'pending', currentTime, processId
      );
    } else {
      // 创建物料
      const id = generateId();
      const insertStmt = db.prepare(`
        INSERT INTO materials (
          id, process_id, app_name, short_description, product_detail, update_notes,
          keywords, app_icon_url, hero_image_url, screenshots, is_gp_upload, gp_link, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      insertStmt.run(
        id, processId, appName, shortDescription, productDetail, updateNotes,
        JSON.stringify(keywords), appIconUrl, heroImageUrl, JSON.stringify(screenshots),
        isGPUpload, gpLink, 'pending'
      );
    }
    
    // 更新物料上传节点状态为完成
    const nodeStmt = db.prepare(`
      UPDATE process_nodes SET status = 'completed', operator = ?, operator_time = ?, updated_at = ?
      WHERE process_id = ? AND node_name = '物料上传'
    `);
    nodeStmt.run(applicant, currentTime, currentTime, processId);
    
    // 推进到物料审核节点
    const nextNodeStmt = db.prepare(`
      UPDATE process_nodes SET status = 'processing', updated_at = ?
      WHERE process_id = ? AND node_name = '物料审核'
    `);
    nextNodeStmt.run(currentTime, processId);
    
    // 更新流程当前节点
    const updateProcessStmt = db.prepare('UPDATE apk_processes SET current_node = 3, updated_at = ? WHERE id = ?');
    updateProcessStmt.run(currentTime, processId);
    
    // 记录操作历史
    const historyId = generateId();
    const historyStmt = db.prepare(`
      INSERT INTO operation_history (id, process_id, operator, action, detail, node_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    historyStmt.run(historyId, processId, applicant, '上传物料', '上传了应用物料', '物料上传');
    
    res.json({ success: true, message: '物料保存成功' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ 待办事项API ============

// 获取待办列表
router.get('/todos', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        a.shuttle_name as shuttleName,
        p.app_name as appName,
        n.node_name as node,
        CASE n.status WHEN 'pending' THEN '待处理' WHEN 'processing' THEN '进行中' ELSE n.status END as nodeStatus,
        n.operator as handler,
        n.reject_reason as rejectReason,
        a.id
      FROM applications a
      JOIN apk_processes p ON p.application_id = a.id
      JOIN process_nodes n ON n.process_id = p.id
      WHERE n.status IN ('pending', 'processing')
      ORDER BY a.apply_time DESC
    `);
    
    const rows = stmt.all();
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ 看板数据API ============

// 获取看板统计数据
router.get('/kanban', (req, res) => {
  try {
    // 班车数量
    const shuttleStmt = db.prepare('SELECT COUNT(DISTINCT shuttle_name) as count FROM applications');
    const shuttleCount = shuttleStmt.get().count;
    
    // 产品数量
    const productStmt = db.prepare('SELECT COUNT(DISTINCT app_name) as count FROM apk_processes');
    const productCount = productStmt.get().count;
    
    // 进行中数量
    const processingStmt = db.prepare("SELECT COUNT(*) as count FROM apk_processes WHERE status = 'processing'");
    const processingCount = processingStmt.get().count;
    
    // 已完成数量
    const completedStmt = db.prepare("SELECT COUNT(*) as count FROM apk_processes WHERE status = 'completed'");
    const completedCount = completedStmt.get().count;
    
    res.json({
      success: true,
      data: {
        shuttleCount,
        productCount,
        processingCount,
        completedCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取灰度监控数据
router.get('/gray-scale/:processId', (req, res) => {
  try {
    const { processId } = req.params;
    
    // 模拟灰度监控数据
    const grayScaleData = {
      processId,
      totalUsers: Math.floor(Math.random() * 100000) + 10000,
      activeUsers: Math.floor(Math.random() * 50000) + 5000,
      crashRate: (Math.random() * 2).toFixed(2),
      avgResponseTime: Math.floor(Math.random() * 500) + 100,
      errorCount: Math.floor(Math.random() * 50),
      dailyTrend: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        users: Math.floor(Math.random() * 10000) + 1000,
        sessions: Math.floor(Math.random() * 50000) + 5000
      })),
      regionData: [
        { region: '尼日利亚', users: Math.floor(Math.random() * 30000) + 5000 },
        { region: '肯尼亚', users: Math.floor(Math.random() * 20000) + 3000 },
        { region: '加纳', users: Math.floor(Math.random() * 15000) + 2000 },
        { region: '坦桑尼亚', users: Math.floor(Math.random() * 10000) + 1000 },
        { region: '其他', users: Math.floor(Math.random() * 20000) + 2000 }
      ]
    };
    
    res.json({ success: true, data: grayScaleData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
