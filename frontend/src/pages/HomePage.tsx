import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApplications, mockTodos, mockKanbanData, shuttleOptions, tosVersionOptions, apkStatusOptions } from '../data/mockData';
import type { KanbanData } from '../types';

// 状态颜色映射
const statusColors = {
  success: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  processing: 'bg-blue-100 text-blue-800',
  total: 'bg-gray-100 text-gray-800',
};

// 状态显示映射
const statusLabels = {
  success: '成功',
  rejected: '拒绝',
  processing: '进行中',
  total: '总数',
};

// 申请列表组件
const ApplicationList: React.FC<{ onViewDetail: (id: string) => void }> = ({ onViewDetail }) => {
  const [searchShuttle, setSearchShuttle] = useState('');
  const [searchTos, setSearchTos] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchApplicant, setSearchApplicant] = useState('');

  const filteredApps = mockApplications.filter((app) => {
    return (
      (searchShuttle === '' || app.shuttleName.includes(searchShuttle)) &&
      (searchTos === '' || app.tosVersion.includes(searchTos)) &&
      (searchStatus === '' || app.apkStatus === searchStatus) &&
      (searchApplicant === '' || app.applicant.includes(searchApplicant))
    );
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">独立三方应用发布流程申请列表</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => alert('申请功能开发中...')}
        >
          新建申请
        </button>
      </div>

      {/* 筛选条件 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchShuttle}
          onChange={(e) => setSearchShuttle(e.target.value)}
        >
          <option value="">全部班车</option>
          {shuttleOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchTos}
          onChange={(e) => setSearchTos(e.target.value)}
        >
          <option value="">全部tOS版本</option>
          {tosVersionOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">全部状态</option>
          {apkStatusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="申请人"
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={searchApplicant}
          onChange={(e) => setSearchApplicant(e.target.value)}
        />
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班车名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">tOS版本</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APK状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请人</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">申请时间</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.shuttleName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.tosVersion}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.apkStatus]}`}>
                    {app.apkStatus === 'success' && '✅ '}
                    {app.apkStatus === 'rejected' && '❌ '}
                    {app.apkStatus === 'processing' && '🔵 '}
                    {statusLabels[app.apkStatus]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applicant}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applyTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => onViewDetail(app.id)}
                  >
                    查看详情
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 待办组件
const TodoSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">待办事项</h2>
      <div className="space-y-4">
        {mockTodos.map((todo) => (
          <div key={todo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">{todo.shuttleName}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-medium text-gray-900">{todo.appName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">节点:</span>
                  <span className="text-blue-600">{todo.node}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${todo.nodeStatus === '待处理' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                    {todo.nodeStatus}
                  </span>
                </div>
                {todo.rejectReason && (
                  <div className="mt-2 text-sm text-red-600">
                    拒绝原因: {todo.rejectReason}
                  </div>
                )}
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                去处理
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 看板组件
const KanbanSection: React.FC = () => {
  const data = mockKanbanData as KanbanData;
  
  const kanbanItems = [
    { title: '班车数量', value: data.shuttleCount, color: 'bg-blue-500' },
    { title: '产品数量', value: data.productCount, color: 'bg-green-500' },
    { title: '进行中', value: data.processingCount, color: 'bg-yellow-500' },
    { title: '已完成', value: data.completedCount, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">看板概览</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kanbanItems.map((item, idx) => (
          <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center">
            <div className={`${item.color} text-white rounded-lg py-2 px-4 mb-2`}>
              {item.title}
            </div>
            <div className="text-3xl font-bold text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 首页主组件
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewDetail = (id: string) => {
    navigate(`/application/${id}`);
  };

  return (
    <div className="space-y-6">
      <ApplicationList onViewDetail={handleViewDetail} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodoSection />
        <KanbanSection />
      </div>
    </div>
  );
};

export default HomePage;
