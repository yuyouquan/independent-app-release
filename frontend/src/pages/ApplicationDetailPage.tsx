import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAPKProcess, mockApplications } from '../data/mockData';
import type { APKProcess, ProcessNode } from '../types';

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
const APKCard: React.FC<{ process: APKProcess }> = ({ process }) => {
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
    </div>
  );
};

// 申请详情页主组件
const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');

  // 查找对应的申请数据
  const application = mockApplications.find(app => app.id === id) || mockApplications[0];
  const apkProcess = mockAPKProcess;

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
          <APKCard process={apkProcess} />
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
    </div>
  );
};

export default ApplicationDetailPage;
