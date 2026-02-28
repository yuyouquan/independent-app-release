import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAPKProcess, mockApplications } from '../data/mockData';
import type { APKProcess, ProcessNode } from '../types';

// 历史记录类型
interface HistoryRecord {
  id: string;
  actionTime: string;
  operator: string;
  action: string;
  detail: string;
}

// 模拟历史记录数据
const mockHistoryRecords: HistoryRecord[] = [
  { id: '1', actionTime: '2026-02-28 10:30:00', operator: '张三', action: '提交申请', detail: '提交了通道发布申请' },
  { id: '2', actionTime: '2026-02-28 10:35:00', operator: '系统', action: '自动分配', detail: '分配给审核人A进行通道发布审核' },
  { id: '3', actionTime: '2026-02-28 11:00:00', operator: '审核人A', action: '审核通过', detail: '通道发布审核通过，进入物料上传阶段' },
  { id: '4', actionTime: '2026-02-28 14:20:00', operator: '张三', action: '上传物料', detail: '上传了应用图标、置顶大图、详情截图' },
];

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
const APKCard: React.FC<{ process: APKProcess; onAudit: (processId: string, nodeIndex: number) => void }> = ({ process, onAudit }) => {
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
        <button className="text-blue-600 hover:text-blue-900 text-sm">
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
  const [historyRecords] = useState<HistoryRecord[]>(mockHistoryRecords);

  // 查找对应的申请数据
  const application = mockApplications.find(app => app.id === id) || mockApplications[0];
  const apkProcess = mockAPKProcess;

  const handleAudit = (_processId: string, nodeIndex: number) => {
    setAuditNodeIndex(nodeIndex);
    setShowAuditModal(true);
  };

  const handleAuditPass = (comment: string) => {
    alert(`审核通过！备注: ${comment || '无'}\n\n✅ 飞书通知：申请人张三\n📝 流程将自动推进到下一节点`);
    setShowAuditModal(false);
  };

  const handleAuditReject = (reason: string) => {
    alert(`审核拒绝！\n❌ 拒绝原因: ${reason}\n\n📝 流程将回退，申请人需重新修改`);
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
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              添加应用
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <APKCard process={apkProcess} onAudit={handleAudit} />
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

      {/* 历史操作记录 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">历史操作记录</h2>
        <div className="space-y-3">
          {historyRecords.map((record) => (
            <div key={record.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-20 text-xs text-gray-500">{record.actionTime}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{record.operator}</span>
                  <span className="text-blue-600 text-sm">{record.action}</span>
                </div>
                <div className="text-sm text-gray-600">{record.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 审核操作Modal */}
      <AuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        onPass={handleAuditPass}
        onReject={handleAuditReject}
        nodeName={apkProcess.nodes[auditNodeIndex]?.name || '审核'}
      />
    </div>
  );
};

export default ApplicationDetailPage;
