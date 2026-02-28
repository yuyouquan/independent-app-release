import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 模拟灰度监控数据
const mockGrayScaleData = {
  totalUsers: 85632,
  activeUsers: 42356,
  crashRate: 0.42,
  avgResponseTime: 256,
  errorCount: 12,
  dailyTrend: [
    { date: '2026-02-25', users: 32100, sessions: 45600 },
    { date: '2026-02-26', users: 35800, sessions: 52100 },
    { date: '2026-02-27', users: 38900, sessions: 58400 },
    { date: '2026-02-28', users: 41200, sessions: 62300 },
    { date: '2026-02-29', users: 42356, sessions: 65100 },
    { date: '2026-03-01', users: 43500, sessions: 67800 },
  ],
  regionData: [
    { region: '尼日利亚', users: 28500, percentage: 33.3 },
    { region: '肯尼亚', users: 18200, percentage: 21.2 },
    { region: '加纳', users: 12400, percentage: 14.5 },
    { region: '坦桑尼亚', users: 8900, percentage: 10.4 },
    { region: '其他', users: 17632, percentage: 20.6 },
  ],
  versionDistribution: [
    { version: 'v2.26.1.15', users: 68500, percentage: 80.0 },
    { version: 'v2.26.1.14', users: 12300, percentage: 14.4 },
    { version: 'v2.26.1.13', users: 4832, percentage: 5.6 },
  ],
  performanceMetrics: {
    appLaunch: 1.2,
    pageLoad: 2.8,
    apiResponse: 0.45,
    memoryUsage: 156,
    batteryImpact: 'low',
  }
};

// 统计卡片组件
const StatCard: React.FC<{ title: string; value: string | number; icon: string; trend?: string; color: string }> = ({
  title, value, icon, trend, color
}) => (
  <div className="bg-white rounded-lg shadow p-4 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-900 mt-1">{value}</div>
        {trend && (
          <div className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend} 较昨日
          </div>
        )}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </div>
);

// 趋势图组件（简单实现）
const TrendChart: React.FC<{ data: Array<{ date: string; users: number }>; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...data.map(d => d.users));
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>
      <div className="flex items-end gap-1 h-32">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              style={{ height: `${(item.users / maxValue) * 100}%` }}
              title={`${item.date}: ${item.users} 用户`}
            />
            <div className="text-xs text-gray-400 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
              {item.date.slice(5)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 地区分布组件
const RegionDistribution: React.FC<{ data: Array<{ region: string; users: number; percentage: number }> }> = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h4 className="text-sm font-medium text-gray-700 mb-4">📍 地区分布</h4>
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700">{item.region}</span>
            <span className="text-gray-500">{item.users.toLocaleString()} ({item.percentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 性能指标组件
const PerformanceMetrics: React.FC<{ metrics: typeof mockGrayScaleData.performanceMetrics }> = ({ metrics }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h4 className="text-sm font-medium text-gray-700 mb-4">⚡ 性能指标</h4>
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500">应用启动</div>
        <div className="text-lg font-semibold text-green-600">{metrics.appLaunch}s</div>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500">页面加载</div>
        <div className="text-lg font-semibold text-green-600">{metrics.pageLoad}s</div>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500">API响应</div>
        <div className="text-lg font-semibold text-green-600">{metrics.apiResponse}s</div>
      </div>
      <div className="text-center p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500">内存占用</div>
        <div className="text-lg font-semibold text-yellow-600">{metrics.memoryUsage}MB</div>
      </div>
    </div>
  </div>
);

// 版本分布组件
const VersionDistribution: React.FC<{ data: Array<{ version: string; users: number; percentage: number }> }> = ({ data }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h4 className="text-sm font-medium text-gray-700 mb-4">📱 版本分布</h4>
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-mono ${
              idx === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {item.version}
            </span>
            {idx === 0 && <span className="text-xs text-green-600">最新</span>}
          </div>
          <div className="text-sm text-gray-500">{item.users.toLocaleString()} ({item.percentage}%)</div>
        </div>
      ))}
    </div>
  </div>
);

// 灰度监控详情页
const GrayScaleMonitorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof mockGrayScaleData | null>(null);

  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      setData(mockGrayScaleData);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        无法加载灰度监控数据
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 返回按钮 */}
      <button
        className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
        onClick={() => navigate(-1)}
      >
        ← 返回流水线详情
      </button>

      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">📊 灰度监控面板</h2>
          <p className="text-sm text-gray-500 mt-1">应用: WhatsApp | 版本: v2.26.1.15</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            🟢 灰度中
          </span>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            调整灰度量级
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="总用户数" 
          value={data.totalUsers.toLocaleString()} 
          icon="👥" 
          trend="+5.2%"
          color="#3B82F6"
        />
        <StatCard 
          title="活跃用户" 
          value={data.activeUsers.toLocaleString()} 
          icon="✅" 
          trend="+3.8%"
          color="#10B981"
        />
        <StatCard 
          title="崩溃率" 
          value={`${data.crashRate}%`} 
          icon="💥" 
          trend="-0.1%"
          color="#EF4444"
        />
        <StatCard 
          title="平均响应时间" 
          value={`${data.avgResponseTime}ms`} 
          icon="⚡" 
          trend="-12ms"
          color="#F59E0B"
        />
      </div>

      {/* 趋势图和地区分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={data.dailyTrend} title="📈 用户增长趋势 (近7天)" />
        <RegionDistribution data={data.regionData} />
      </div>

      {/* 性能指标和版本分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceMetrics metrics={data.performanceMetrics} />
        <VersionDistribution data={data.versionDistribution} />
      </div>

      {/* 错误监控 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-700">🚨 错误监控</h4>
          <span className="text-sm text-gray-500">近24小时</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">错误类型</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">发生次数</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">影响用户</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">严重程度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">NullPointerException</td>
                <td className="px-4 py-2 text-sm text-gray-500">5</td>
                <td className="px-4 py-2 text-sm text-gray-500">23</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">中等</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">NetworkException</td>
                <td className="px-4 py-2 text-sm text-gray-500">4</td>
                <td className="px-4 py-2 text-sm text-gray-500">18</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">低</span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 text-sm text-gray-900">OutOfMemoryError</td>
                <td className="px-4 py-2 text-sm text-gray-500">3</td>
                <td className="px-4 py-2 text-sm text-gray-500">45</td>
                <td className="px-4 py-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">高</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 操作日志 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-4">📋 灰度操作日志</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <span className="text-gray-400">2026-03-01 10:00</span>
            <span>系统自动提升灰度量级至 50%</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <span className="text-gray-400">2026-02-28 14:00</span>
            <span>人工确认通过，进入灰度监控阶段</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <span className="text-gray-400">2026-02-28 10:00</span>
            <span>应用上架审核通过</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrayScaleMonitorPage;
