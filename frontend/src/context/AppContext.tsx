import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Application, APKProcess, ProcessNode } from '../types';

// 应用Context类型
interface AppContextType {
  applications: Application[];
  currentProcess: APKProcess | null;
  updateProcessNode: (processId: string, nodeIndex: number, updates: Partial<ProcessNode>) => void;
  advanceNode: (processId: string) => void;
  rollbackNode: (processId: string, targetIndex: number, rejectReason?: string) => void;
}

// 创建Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// 初始APK流程数据
const initialProcess: APKProcess = {
  id: '1',
  appIcon: 'https://via.placeholder.com/80',
  appName: 'WhatsApp',
  packageName: 'com.whatsapp',
  versionCode: '2.26.1.15',
  status: 'processing',
  currentNode: 2,
  nodes: [
    { name: '通道发布申请', status: 'completed', operator: '张三', operatorTime: '2026-02-28 10:00' },
    { name: '通道发布审核', status: 'processing', operator: '审核人A' },
    { name: '物料上传', status: 'pending' },
    { name: '物料审核', status: 'pending' },
    { name: '应用上架', status: 'pending' },
    { name: '业务内测', status: 'pending' },
    { name: '灰度监控', status: 'pending' },
  ],
};

// Provider组件
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentProcess, setCurrentProcess] = useState<APKProcess | null>(initialProcess);
  
  // 模拟申请数据
  const [applications] = useState<Application[]>([
    { id: '1', shuttleName: '班车-20260228-001', tosVersion: 'tOS 16.1.0', apkStatus: 'processing', applicant: '张三', applyTime: '2026-02-28 10:30:00', status: 'processing' },
    { id: '2', shuttleName: '班车-20260227-003', tosVersion: 'tOS 16.0.5', apkStatus: 'success', applicant: '李四', applyTime: '2026-02-27 15:20:00', status: 'completed' },
    { id: '3', shuttleName: '班车-20260227-002', tosVersion: 'tOS 16.0.5', apkStatus: 'rejected', applicant: '王五', applyTime: '2026-02-27 09:15:00', status: 'rejected' },
  ]);

  // 更新节点状态
  const updateProcessNode = (processId: string, nodeIndex: number, updates: Partial<ProcessNode>) => {
    setCurrentProcess(prev => {
      if (!prev || prev.id !== processId) return prev;
      const newNodes = [...prev.nodes];
      newNodes[nodeIndex] = { ...newNodes[nodeIndex], ...updates };
      return { ...prev, nodes: newNodes };
    });
  };

  // 推进到下一节点
  const advanceNode = (processId: string) => {
    setCurrentProcess(prev => {
      if (!prev || prev.id !== processId) return prev;
      const currentIndex = prev.currentNode;
      if (currentIndex >= prev.nodes.length - 1) return prev;
      
      const newNodes = [...prev.nodes];
      newNodes[currentIndex] = { ...newNodes[currentIndex], status: 'completed' };
      
      const nextIndex = currentIndex + 1;
      newNodes[nextIndex] = { 
        ...newNodes[nextIndex], 
        status: 'processing',
        operator: '当前处理人',
        operatorTime: new Date().toLocaleString('zh-CN')
      };
      
      return { 
        ...prev, 
        nodes: newNodes, 
        currentNode: nextIndex,
        status: nextIndex === prev.nodes.length - 1 ? 'completed' : 'processing'
      };
    });
  };

  // 回退到指定节点
  const rollbackNode = (processId: string, targetIndex: number, rejectReason?: string) => {
    setCurrentProcess(prev => {
      if (!prev || prev.id !== processId) return prev;
      
      const newNodes = [...prev.nodes];
      
      // 当前节点标记为拒绝
      newNodes[prev.currentNode] = { 
        ...newNodes[prev.currentNode], 
        status: 'rejected',
        rejectReason
      };
      
      // 目标节点重置为进行中
      newNodes[targetIndex] = {
        ...newNodes[targetIndex],
        status: 'processing',
        operator: undefined,
        operatorTime: undefined,
        rejectReason: undefined
      };
      
      // 中间的节点重置为pending
      for (let i = targetIndex + 1; i < prev.currentNode; i++) {
        newNodes[i] = {
          ...newNodes[i],
          status: 'pending',
          rejectReason: undefined
        };
      }
      
      return { ...prev, nodes: newNodes, currentNode: targetIndex };
    });
  };

  return (
    <AppContext.Provider value={{ 
      applications, 
      currentProcess, 
      updateProcessNode, 
      advanceNode,
      rollbackNode 
    }}>
      {children}
    </AppContext.Provider>
  );
};

// 自定义Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export default AppProvider;
