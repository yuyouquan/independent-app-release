import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAPKProcess } from '../data/mockData';

// 历史记录类型
interface HistoryRecord {
  id: string;
  actionTime: string;
  operator: string;
  action: string;
  detail: string;
  nodeName: string;
}

// 模拟历史记录数据 - 按应用分开的流水线的历史
const mockPipelineHistory: Record<string, HistoryRecord[]> = {
  'apk-001': [
    { id: '1', actionTime: '2026-02-28 10:30:00', operator: '张三', action: '提交申请', detail: '提交了通道发布申请', nodeName: '通道发布申请' },
    { id: '2', actionTime: '2026-02-28 10:35:00', operator: '系统', action: '自动分配', detail: '分配给审核人A进行通道发布审核', nodeName: '通道发布审核' },
    { id: '3', actionTime: '2026-02-28 11:00:00', operator: '审核人A', action: '审核通过', detail: '通道发布审核通过，进入物料上传阶段', nodeName: '通道发布审核' },
    { id: '4', actionTime: '2026-02-28 14:20:00', operator: '张三', action: '上传物料', detail: '上传了应用图标、置顶大图、详情截图', nodeName: '物料上传' },
    { id: '5', actionTime: '2026-02-28 14:25:00', operator: '系统', action: '自动分配', detail: '分配给审核人B进行物料审核', nodeName: '物料审核' },
  ],
};

// 流程节点组件
const ProcessNodeItem: React.FC<{ node: any; index: number; isActive: boolean }> = ({ node, index, isActive }) => {
  const statusStyles = {
    pending: 'bg-gray-100 text-gray-400',
    processing: 'bg-blue-100 text-blue-600 ring-2 ring-blue-500',
    completed: 'bg-green-100 text-green-600',
    rejected: 'bg-red-100 text-red-600',
  };

  return (
    <div className={`flex items-center ${isActive ? 'opacity-100' : 'opacity-60'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${statusStyles[node.status as keyof typeof statusStyles]}`}>
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

// 流水线详情页主组件
const PipelineDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const apkProcess = mockAPKProcess;
  const historyRecords = mockPipelineHistory[id || 'apk-001'] || [];
  
  const currentNode = apkProcess.nodes[apkProcess.currentNode];
  const isGrayScaleNode = currentNode?.name === '灰度监控';

  const handleGoToGrayScaleMonitor = () => {
    navigate(`/gray-scale/${id || 'apk-001'}`);
  };

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button
        className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        onClick={() => navigate(-1)}
      >
        ← 返回申请详情
      </button>

      {/* 应用基本信息 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📱</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{apkProcess.appName}</h2>
              <span className={`px-2 py-0.5 rounded text-xs ${
                apkProcess.status === 'completed' ? 'bg-green-100 text-green-800' :
                apkProcess.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {apkProcess.status === 'completed' ? '已完成' : apkProcess.status === 'processing' ? '进行中' : '失败'}
              </span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              包名: {apkProcess.packageName} | 版本: {apkProcess.versionCode}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              应用ID: {id}
            </div>
          </div>
        </div>
      </div>

      {/* 流水线流程图 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">流水线流程</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {apkProcess.nodes.map((node, idx) => (
            <React.Fragment key={idx}>
              <ProcessNodeItem node={node} index={idx} isActive={idx === apkProcess.currentNode} />
              {idx < apkProcess.nodes.length - 1 && (
                <div className="w-12 h-0.5 bg-gray-200 mx-2 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 历史操作记录 - 这里是每个应用独立的记录 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 流水线操作历史</h3>
        <div className="space-y-3">
          {historyRecords.length > 0 ? (
            historyRecords.map((record) => (
              <div key={record.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-24 flex-shrink-0">
                  <div className="text-xs text-gray-500">{record.actionTime}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{record.operator}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">{record.action}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{record.detail}</div>
                  <div className="text-xs text-gray-400 mt-1">节点: {record.nodeName}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
             暂无操作记录
            </div>
          )}
        </div>
      </div>

      {/* 当前节点详情 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">当前节点详情</h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-medium">
                {currentNode?.name || '未知节点'}
              </span>
              <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-xs">进行中</span>
            </div>
            {isGrayScaleNode && (
              <button 
                onClick={handleGoToGrayScaleMonitor}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2"
              >
                📊 进入灰度监控
              </button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            {isGrayScaleNode ? '点击查看灰度监控数据面板' : '等待处理...'}
          </div>
          {currentNode?.operator && (
            <div className="text-xs text-gray-500 mt-2">
              处理人: {currentNode.operator}
              {currentNode.operatorTime && ` | 时间: ${currentNode.operatorTime}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PipelineDetailPage;
