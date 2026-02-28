const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/app-publish.db');
const db = new Database(dbPath);

// 初始化数据库表
db.exec(`
  -- 申请流程单表
  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    shuttle_name TEXT NOT NULL,
    tos_version TEXT NOT NULL,
    apk_status TEXT DEFAULT 'processing',
    applicant TEXT NOT NULL,
    apply_time TEXT NOT NULL,
    status TEXT DEFAULT 'processing',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- APK发布流程表
  CREATE TABLE IF NOT EXISTS apk_processes (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    version_code TEXT NOT NULL,
    app_type TEXT,
    app_category TEXT,
    apk_url TEXT,
    test_report_url TEXT,
    is_system_app TEXT DEFAULT 'no',
    publish_country_type TEXT DEFAULT 'all',
    publish_country_detail TEXT,
    publish_brand TEXT,
    publish_model TEXT,
    test_model TEXT,
    android_version TEXT,
    filter_india TEXT DEFAULT 'no',
    is_pa_update TEXT DEFAULT 'no',
    gray_scale_level INTEGER,
    effective_time TEXT,
    status TEXT DEFAULT 'processing',
    current_node INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id)
  );

  -- 流程节点表
  CREATE TABLE IF NOT EXISTS process_nodes (
    id TEXT PRIMARY KEY,
    process_id TEXT NOT NULL,
    node_index INTEGER NOT NULL,
    node_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    operator TEXT,
    operator_time TEXT,
    reject_reason TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (process_id) REFERENCES apk_processes(id)
  );

  -- 物料表
  CREATE TABLE IF NOT EXISTS materials (
    id TEXT PRIMARY KEY,
    process_id TEXT NOT NULL,
    app_name TEXT,
    short_description TEXT,
    product_detail TEXT,
    update_notes TEXT,
    keywords TEXT,
    app_icon_url TEXT,
    hero_image_url TEXT,
    screenshots TEXT,
    is_gp_upload TEXT DEFAULT 'no',
    gp_link TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (process_id) REFERENCES apk_processes(id)
  );

  -- 操作历史记录表
  CREATE TABLE IF NOT EXISTS operation_history (
    id TEXT PRIMARY KEY,
    process_id TEXT NOT NULL,
    operator TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT,
    node_name TEXT,
    action_time TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (process_id) REFERENCES apk_processes(id)
  );
`);

console.log('数据库初始化完成');

// 导出数据库实例
module.exports = db;
