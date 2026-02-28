const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const dbPath = path.join(dataDir, 'app-publish.json');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化数据库（JSON文件）
let db = {
  applications: [],
  apk_processes: [],
  process_nodes: [],
  materials: [],
  operation_history: []
};

// 加载现有数据
if (fs.existsSync(dbPath)) {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    db = JSON.parse(data);
    console.log('数据库加载成功');
  } catch (e) {
    console.log('数据库初始化');
  }
} else {
  console.log('数据库初始化');
}

// 保存数据库
const saveDb = () => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
};

// 模拟SQL的封装 - 支持链式调用 (prepare().all() / .get() / .run())
const dbApi = {
  prepare: (sql) => {
    return {
      all: (params = []) => {
        return dbApi.all(sql, params);
      },
      get: (params = []) => {
        return dbApi.get(sql, params);
      },
      run: (params = []) => {
        return dbApi.run(sql, params);
      }
    };
  },
  
  // 查询所有
  all: (sql, params = []) => {
    // 简化实现：根据SQL解析查询
    if (sql.includes('FROM applications')) {
      let results = [...db.applications];
      
      if (sql.includes('shuttle_name LIKE')) {
        const param = params.shift();
        results = results.filter(a => a.shuttle_name.includes(param.replace(/%/g, '')));
      }
      if (sql.includes('tos_version =')) {
        results = results.filter(a => a.tos_version === params.shift());
      }
      if (sql.includes('apk_status =')) {
        results = results.filter(a => a.apk_status === params.shift());
      }
      if (sql.includes('applicant LIKE')) {
        const param = params.shift();
        results = results.filter(a => a.applicant.includes(param.replace(/%/g, '')));
      }
      if (sql.includes('status =')) {
        results = results.filter(a => a.status === params.shift());
      }
      
      return results.sort((a, b) => new Date(b.apply_time) - new Date(a.apply_time));
    }
    
    if (sql.includes('FROM apk_processes')) {
      if (sql.includes('application_id =')) {
        return db.apk_processes.filter(p => p.application_id === params[0]);
      }
      return db.apk_processes;
    }
    
    if (sql.includes('FROM process_nodes')) {
      if (sql.includes('process_id =')) {
        return db.process_nodes.filter(n => n.process_id === params[0]).sort((a, b) => a.node_index - b.node_index);
      }
      if (sql.includes('WHERE id =')) {
        return db.process_nodes.filter(n => n.id === params[0]);
      }
      return db.process_nodes;
    }
    
    if (sql.includes('FROM materials')) {
      if (sql.includes('process_id =')) {
        return db.materials.filter(m => m.process_id === params[0]);
      }
      return db.materials;
    }
    
    if (sql.includes('FROM operation_history')) {
      let results = [...db.operation_history];
      if (sql.includes('process_id =')) {
        results = results.filter(h => h.process_id === params[0]);
      }
      return results.sort((a, b) => new Date(b.action_time) - new Date(a.action_time));
    }
    
    return [];
  },
  
  // 查询单条
  get: (sql, params = []) => {
    const results = dbApi.all(sql, params);
    return results[0] || null;
  },
  
  // 执行插入/更新/删除
  run: (sql, params = []) => {
    // 解析INSERT语句
    if (sql.includes('INSERT INTO applications')) {
      const id = params[0];
      const application = {
        id,
        shuttle_name: params[1],
        tos_version: params[2],
        apk_status: params[3],
        applicant: params[4],
        apply_time: params[5],
        status: params[6],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.applications.push(application);
      saveDb();
      return { changes: 1 };
    }
    
    if (sql.includes('INSERT INTO apk_processes')) {
      const id = params[0];
      const process = {
        id,
        application_id: params[1],
        app_name: params[2],
        package_name: params[3],
        version_code: params[4],
        app_type: params[5],
        app_category: params[6],
        apk_url: params[7],
        test_report_url: params[8],
        is_system_app: params[9],
        publish_country_type: params[10],
        publish_country_detail: params[11],
        publish_brand: params[12],
        publish_model: params[13],
        test_model: params[14],
        android_version: params[15],
        filter_india: params[16],
        is_pa_update: params[17],
        gray_scale_level: params[18],
        effective_time: params[19],
        status: params[20],
        current_node: params[21] || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.apk_processes.push(process);
      saveDb();
      return { changes: 1 };
    }
    
    if (sql.includes('INSERT INTO process_nodes')) {
      const id = params[0];
      const node = {
        id,
        process_id: params[1],
        node_index: params[2],
        node_name: params[3],
        status: params[4],
        operator: params[5],
        operator_time: params[6],
        reject_reason: params[7],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.process_nodes.push(node);
      saveDb();
      return { changes: 1 };
    }
    
    if (sql.includes('INSERT INTO materials')) {
      const id = params[0];
      const material = {
        id,
        process_id: params[1],
        app_name: params[2],
        short_description: params[3],
        product_detail: params[4],
        update_notes: params[5],
        keywords: params[6],
        app_icon_url: params[7],
        hero_image_url: params[8],
        screenshots: params[9],
        is_gp_upload: params[10],
        gp_link: params[11],
        status: params[12],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.materials.push(material);
      saveDb();
      return { changes: 1 };
    }
    
    if (sql.includes('INSERT INTO operation_history')) {
      const id = params[0];
      const history = {
        id,
        process_id: params[1],
        operator: params[2],
        action: params[3],
        detail: params[4],
        node_name: params[5],
        action_time: new Date().toISOString()
      };
      db.operation_history.push(history);
      saveDb();
      return { changes: 1 };
    }
    
    // UPDATE语句
    if (sql.includes('UPDATE applications')) {
      const id = params[params.length - 1];
      const idx = db.applications.findIndex(a => a.id === id);
      if (idx !== -1) {
        if (sql.includes('apk_status')) {
          db.applications[idx].apk_status = params[0];
        }
        if (sql.includes('status')) {
          db.applications[idx].status = params[0];
        }
        db.applications[idx].updated_at = new Date().toISOString();
        saveDb();
        return { changes: 1 };
      }
    }
    
    if (sql.includes('UPDATE apk_processes')) {
      const id = params[params.length - 1];
      const idx = db.apk_processes.findIndex(p => p.id === id);
      if (idx !== -1) {
        if (sql.includes('current_node')) {
          db.apk_processes[idx].current_node = params[0];
        }
        if (sql.includes('status')) {
          db.apk_processes[idx].status = params[0];
        }
        db.apk_processes[idx].updated_at = new Date().toISOString();
        saveDb();
        return { changes: 1 };
      }
    }
    
    if (sql.includes('UPDATE process_nodes')) {
      const id = params[params.length - 1];
      const idx = db.process_nodes.findIndex(n => n.id === id);
      if (idx !== -1) {
        if (sql.includes('status')) {
          db.process_nodes[idx].status = params[0];
        }
        if (sql.includes('operator')) {
          db.process_nodes[idx].operator = params[0];
        }
        if (sql.includes('operator_time')) {
          db.process_nodes[idx].operator_time = params[0];
        }
        if (sql.includes('reject_reason')) {
          db.process_nodes[idx].reject_reason = params[0];
        }
        db.process_nodes[idx].updated_at = new Date().toISOString();
        saveDb();
        return { changes: 1 };
      }
    }
    
    if (sql.includes('UPDATE materials')) {
      const processId = params[params.length - 1];
      const idx = db.materials.findIndex(m => m.process_id === processId);
      if (idx !== -1) {
        const fields = ['app_name', 'short_description', 'product_detail', 'update_notes', 'keywords', 'app_icon_url', 'hero_image_url', 'screenshots', 'is_gp_upload', 'gp_link', 'status'];
        fields.forEach((field, i) => {
          if (sql.includes(field)) {
            db.materials[idx][field] = params[i];
          }
        });
        db.materials[idx].updated_at = new Date().toISOString();
        saveDb();
        return { changes: 1 };
      }
    }
    
    return { changes: 0 };
  },
  
  // 初始化节点数据
  initNodes: (processId, nodes) => {
    nodes.forEach((nodeName, index) => {
      const existingNode = db.process_nodes.find(n => n.process_id === processId && n.node_index === index);
      if (!existingNode) {
        db.process_nodes.push({
          id: 'node-' + processId + '-' + index,
          process_id: processId,
          node_index: index,
          node_name: nodeName,
          status: index === 0 ? 'processing' : 'pending',
          operator: null,
          operator_time: null,
          reject_reason: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    });
    saveDb();
  }
};

console.log('数据库初始化完成');

module.exports = dbApi;
