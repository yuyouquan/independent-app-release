// 申请流程单类型
export interface Application {
  id: string;
  shuttleName: string; // 班车名称
  tosVersion: string; // tOS版本
  apkStatus: 'success' | 'rejected' | 'processing' | 'total';
  applicant: string; // 申请人
  applyTime: string; // 申请时间
  status: 'processing' | 'completed' | 'rejected';
}

// 待办事项类型
export interface Todo {
  id: string;
  shuttleName: string;
  appName: string;
  node: string;
  nodeStatus: string;
  handler: string;
  rejectReason?: string;
}

// APK发布流程类型
export interface APKProcess {
  id: string;
  appIcon: string;
  appName: string;
  packageName: string;
  versionCode: string;
  status: 'processing' | 'completed' | 'failed';
  currentNode: number;
  nodes: ProcessNode[];
}

// 流程节点
export interface ProcessNode {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  operator?: string;
  operatorTime?: string;
  rejectReason?: string;
}

// 看板数据
export interface KanbanData {
  shuttleCount: number;
  productCount: number;
  processingCount: number;
  completedCount: number;
}
