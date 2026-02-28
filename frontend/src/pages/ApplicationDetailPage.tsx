import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAPKProcess, mockApplications } from '../data/mockData';
import { apk制品List } from '../components/CreateApplicationModal';
import type { APKProcess, ProcessNode } from '../types';

// 添加应用Modal
const AddAppModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (app: { name: string; packageName: string; version: string }) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [selectedApk, setSelectedApk] = useState('');
  
  if (!isOpen) return null;
  
  const selectedApkData = apk制品List.find(a => a.id === selectedApk);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">添加应用到当前班车</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                选择APK制品 <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedApk}
                onChange={(e) => setSelectedApk(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">请选择APK</option>
                {apk制品List.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            {selectedApkData && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <div className="text-gray-500 mb-1">应用信息</div>
                <div>名称: {selectedApkData.name.split('_')[0]}</div>
                <div>版本: {selectedApkData.name.split('_')[1]?.replace('.apk', '')}</div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">取消</button>
            <button
              onClick={() => {
                if (selectedApkData) {
                  onAdd({
                    name: selectedApkData.name.split('_')[0],
                    packageName: 'com.example.' + selectedApkData.name.split('_')[0].toLowerCase(),
                    version: selectedApkData.name.split('_')[1]?.replace('.apk', '') || '1.0.0'
                  });
                  onClose();
                }
              }}
              disabled={!selectedApk}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              添加
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 飞书通知模拟函数
const sendFeishuNotification = (type: 'pass' | 'reject', data: {
  appName: string;
  nodeName: string;
  operator: string;
  comment?: string;
  rejectReason?: string;
}) => {
  const time = new Date().toLocaleString('zh-CN');
  const messages = {
    pass: [
      `📢 【审核通过通知】`,
      `应用: ${data.appName}`,
      `节点: ${data.nodeName}`,
      `审核人: ${data.operator}`,
      `时间: ${time}`,
      data.comment ? `备注: ${data.comment}` : ''
    ].filter(Boolean).join('\n'),
    reject: [
      `📢 【审核拒绝通知】`,
      `应用: ${data.appName}`,
      `节点: ${data.nodeName}`,
      `审核人: ${data.operator}`,
      `时间: ${time}`,
      `❌ 拒绝原因: ${data.rejectReason}`,
      `⚠️ 请修改后重新提交`
    ].filter(Boolean).join('\n')
  };
  console.log('飞书通知发送:', messages[type]);
  alert(messages[type]);
};

// 回退节点映射（审核拒绝时回退到哪个节点）
const getRollbackNodeIndex = (currentNodeIndex: number): number => {
  const rollbackMap: Record<number, number> = {
    1: 0,  // 通道发布审核拒绝 → 回退到通道发布申请
    3: 2,  // 物料审核拒绝 → 回退到物料上传
    4: 3,  // 应用上架拒绝 → 可退回物料审核
    5: 4,  // 业务内测拒绝 → 可退回应用上架
    6: 5,  // 灰度监控拒绝 → 可退回业务内测
  };
  return rollbackMap[currentNodeIndex] ?? currentNodeIndex - 1;
};

// 审核操作Modal
const AuditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onPass: (comment: string) => void;
  onReject: (reason: string) => void;
  nodeName: string;
}> = ({ isOpen, onClose, onPass, onReject, nodeName }) => {
  const [mode, setMode] = useState<'pass' | 'reject'>('pass');
  const [comment, setComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">审核操作 - {nodeName}</h3>
          </div>
          <div className="p-6">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setMode('pass')}
                className={`flex-1 py-2 rounded-lg ${
                  mode === 'pass' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                ✅ 审核通过
              </button>
              <button
                onClick={() => setMode('reject')}
                className={`flex-1 py-2 rounded-lg ${
                  mode === 'reject' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                ❌ 审核拒绝
              </button>
            </div>
            {mode === 'pass' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">审核备注</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="可选填写审核备注..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  拒绝原因 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="请输入拒绝原因..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">取消</button>
            <button
              onClick={() => {
                if (mode === 'pass') {
                  onPass(comment);
                } else {
                  onReject(rejectReason);
                }
              }}
              disabled={mode === 'reject' && !rejectReason.trim()}
              className={`px-4 py-2 rounded-lg text-white ${
                mode === 'pass' ? 'bg-green-600' : 'bg-red-600'
              } disabled:opacity-50`}
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 流程节点组件
const ProcessNodeItem: React.FC<{ node: ProcessNode; index: number; isActive: boolean }> = ({ node, index, isActive }) => {
  const statusStyles = {
    pending: 'bg-gray-100 text-gray-400',
    processing: 'bg-blue-100 text-blue-600 ring-2 ring-blue-500',
    completed: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600',
  };

  return (
    <div className={`flex items-center ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${statusStyles[node.status]}`}>
        {node.status === 'completed' ? '✓' : node.status === 'rejected' ? '✗' : index + 1}
      </div>
      <div className="ml-3">
        <div className="text-sm font-medium text-gray-900">{node.name}</div>
        {node.operator && (
          <div className="text-xs text-gray-500">
            {node.operator} {node.operatorTime && `• ${node.operatorTime}`}
          </div>
        )}
        {node.rejectReason && (
          <div className="text-xs text-red-600 mt-1">拒绝原因: {node.rejectReason}</div>
        )}
      </div>
    </div>
  );
};

// APK卡片组件
const APKCard: React.FC<{ process: APKProcess; onAudit: (processId: string, nodeIndex: number) => void; onViewPipeline: (id: string) => void }> = ({ process, onAudit, onViewPipeline }) => {
  const currentNode = process.nodes[process.currentNode];
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-2xl">📱</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{process.appName}</h3>
            <span className={`px-2 py-0.5 rounded text-xs ${
              process.status === 'completed' ? 'bg-green-100 text-green-800' :
              process.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }`}>
              {process.status === 'completed' ? '已完成' : process.status === 'processing' ? '进行中' : '失败'}
            </span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            包名: {process.packageName} | 版本: {process.versionCode}
          </div>
        </div>
        <button onClick={() => onViewPipeline(process.id)} className="text-blue-600 hover:text-blue-900 text-sm">
          查看详情
        </button>
      </div>
      
      {/* 流程进度 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">流程进度</div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {process.nodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <ProcessNodeItem node={node} index={idx} isActive={idx === process.currentNode} />
              {idx < process.nodes.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-200 mx-2 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* 审核操作按钮 - 仅当前处理人可见 */}
      {currentNode && currentNode.status === 'processing' && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={() => onAudit(process.id, process.currentNode)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            审核操作
          </button>
        </div>
      )}
    </div>
  );
};

// 申请详情页主组件
const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditNodeIndex, setAuditNodeIndex] = useState(0);
  const [showAddAppModal, setShowAddAppModal] = useState(false);

  // 查找对应的申请数据
  const application = mockApplications.find(app => app.id === id) || mockApplications[0];
  const apkProcess = mockAPKProcess;

  const handleViewPipeline = (id: string) => navigate(`/pipeline/${id}`);

  const handleAudit = (_processId: string, nodeIndex: number) => {
    setAuditNodeIndex(nodeIndex);
    setShowAuditModal(true);
  };

  const handleAddApp = (app: { name: string; packageName: string; version: string }) => {
    alert(`✅ 应用添加成功！\n\n应用: ${app.name}\n包名: ${app.packageName}\n版本: ${app.version}\n\n📢 飞书通知已发送给: 申请人${application.applicant}`);
  };

  const handleAuditPass = (comment: string) => {
    // 审核通过逻辑 - 推进到下一节点
    const currentNodeName = apkProcess.nodes[auditNodeIndex]?.name || '';
    
    alert(`✅ 审核通过！\n\n节点: ${currentNodeName}\n备注: ${comment || '无'}\n\n📝 流程将自动推进到下一节点\n\n📢 飞书通知已发送给: 申请人${application.applicant}`);
    
    sendFeishuNotification('pass', {
      appName: apkProcess.appName,
      nodeName: currentNodeName,
      operator: '当前审核人',
      comment
    });
    setShowAuditModal(false);
  };

  const handleAuditReject = (reason: string) => {
    const currentNode = apkProcess.nodes[auditNodeIndex];
    const currentNodeName = currentNode?.name || '';
    const rollbackNode = getRollbackNodeIndex(auditNodeIndex);
    const rollbackNodeName = apkProcess.nodes[rollbackNode]?.name || '上一节点';
    
    alert(`❌ 审核拒绝！\n\n节点: ${currentNodeName}\n拒绝原因: ${reason}\n\n↩️ 流程将回退到: ${rollbackNodeName}\n\n📢 飞书通知已发送给: 申请人${application.applicant}`);
    
    sendFeishuNotification('reject', {
      appName: apkProcess.appName,
      nodeName: currentNodeName,
      operator: '当前审核人',
      rejectReason: reason
    });
    setShowAuditModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button
        className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        onClick={() => navigate('/')}
      >
        ← 返回首页
      </button>

      {/* 基础信息卡片 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">申请详情</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-500">班车名称</div>
            <div className="font-medium text-gray-900">{application.shuttleName}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">tOS版本</div>
            <div className="font-medium text-gray-900">{application.tosVersion}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">申请人</div>
            <div className="font-medium text-gray-900">{application.applicant}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">申请时间</div>
            <div className="font-medium text-gray-900">{application.applyTime}</div>
          </div>
        </div>
      </div>

      {/* 应用卡片列表 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">应用列表</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="搜索应用..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700" onClick={() => setShowAddAppModal(true)}>
              添加应用
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <APKCard process={apkProcess} onAudit={handleAudit} onViewPipeline={handleViewPipeline} />
        </div>

        {/* 分页 */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50" disabled>上一页</button>
            <span className="text-sm text-gray-600">1 / 1</span>
            <button className="px-3 py-1 border rounded text-sm disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>

      <AuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        onPass={handleAuditPass}
        onReject={handleAuditReject}
        nodeName={apkProcess.nodes[auditNodeIndex]?.name || '审核'}
      />
      <AddAppModal
        isOpen={showAddAppModal}
        onClose={() => setShowAddAppModal(false)}
        onAdd={handleAddApp}
      />
    </div>
  );
};

export default ApplicationDetailPage;
