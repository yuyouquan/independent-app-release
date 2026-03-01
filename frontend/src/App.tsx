import { useState } from 'react';
import { Search, Plus, Eye, ChevronDown } from 'lucide-react';
import { mockApplications, shuttleOptions, tosVersionOptions, apkStatusOptions, Application } from './data/mockData';

// 状态颜色映射
const statusColors = {
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
};

const statusLabels = {
  success: '成功',
  failed: '拒绝',
  processing: '进行中',
};

function App() {
  const [applications] = useState<Application[]>(mockApplications);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterShuttle, setFilterShuttle] = useState('');
  const [filterTos, setFilterTos] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  // 筛选过滤
  const filteredApps = applications.filter(app => {
    const matchKeyword = searchKeyword === '' || 
      app.shuttleName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      app.applicant.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchShuttle = filterShuttle === '' || app.shuttleName === filterShuttle;
    const matchTos = filterTos === '' || app.tosVersion === filterTos;
    const matchStatus = filterStatus === '' || app.status === filterStatus;
    return matchKeyword && matchShuttle && matchTos && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">独立三方应用发布系统</h1>
              <span className="ml-2 text-xs text-gray-500">v1.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700 text-sm">通知</button>
              <button className="text-gray-500 hover:text-gray-700 text-sm">设置</button>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* 申请列表标题区域 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">独立三方应用发布流程申请列表</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              申请
            </button>
          </div>

          {/* 筛选搜索栏 */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-wrap gap-4 items-center">
              {/* 搜索框 */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索班车名称、申请人..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>

              {/* 班车名称筛选 */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500"
                  value={filterShuttle}
                  onChange={(e) => setFilterShuttle(e.target.value)}
                >
                  <option value="">班车名称</option>
                  {shuttleOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* tOS版本筛选 */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500"
                  value={filterTos}
                  onChange={(e) => setFilterTos(e.target.value)}
                >
                  <option value="">tOS版本</option>
                  {tosVersionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* APK状态筛选 */}
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">APK状态</option>
                  {apkStatusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 重置按钮 */}
              {(searchKeyword || filterShuttle || filterTos || filterStatus) && (
                <button
                  onClick={() => {
                    setSearchKeyword('');
                    setFilterShuttle('');
                    setFilterTos('');
                    setFilterStatus('');
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  重置
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 申请列表表格 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[app.status]}`}>
                      {statusLabels[app.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applicant}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.applyTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-gray-500">暂无数据</div>
          )}
        </div>

        {/* 分页 */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            共 {filteredApps.length} 条记录
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>上一页</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>

      {/* 申请Modal (占位) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">申请独立三方应用发布流程</h3>
            <p className="text-gray-500">申请功能开发中...</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
