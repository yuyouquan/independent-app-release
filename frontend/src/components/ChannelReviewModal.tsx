import React, { useState } from 'react';
import type { ChannelApplyData } from '../types';

// 通道发布审核Modal - 展示申请内容并审核
interface ChannelReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPass: (comment: string) => void;
  onReject: (reason: string) => void;
  applyData: ChannelApplyData | null;
}

export const ChannelReviewModal: React.FC<ChannelReviewModalProps> = ({
  isOpen,
  onClose,
  onPass,
  onReject,
  applyData
}) => {
  const [mode, setMode] = useState<'pass' | 'reject'>('pass');
  const [comment, setComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen || !applyData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">通道发布审核</h3>
            <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
          </div>

          {/* 内容区 - 展示申请详情 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                💡 请审核以下申请内容，确认后点击通过或拒绝。
              </p>
            </div>

            {/* 基础信息 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">📝 基础信息</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">应用名称</div>
                  <div className="font-medium">{applyData.appName}</div>
                </div>
                <div>
                  <div className="text-gray-500">应用包名</div>
                  <div className="font-medium">{applyData.packageName}</div>
                </div>
                <div>
                  <div className="text-gray-500">应用类型</div>
                  <div className="font-medium">{applyData.appType}</div>
                </div>
                <div>
                  <div className="text-gray-500">版本号</div>
                  <div className="font-medium">{applyData.versionName}</div>
                </div>
                <div>
                  <div className="text-gray-500">应用分类</div>
                  <div className="font-medium">{applyData.appCategory}</div>
                </div>
                <div>
                  <div className="text-gray-500">系统应用</div>
                  <div className="font-medium">{applyData.isSystemApp ? '是' : '否'}</div>
                </div>
                <div>
                  <div className="text-gray-500">是否过滤印度</div>
                  <div className="font-medium">{applyData.filterIndia ? '是' : '否'}</div>
                </div>
                <div>
                  <div className="text-gray-500">APK地址</div>
                  <div className="font-medium text-blue-600 truncate">{applyData.apkUrl}</div>
                </div>
              </div>
            </div>

            {/* 发布范围 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">🌍 发布范围</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">发布国家类型</div>
                  <div className="font-medium">
                    {applyData.countryType === 'all' ? '全部国家' : 
                     applyData.countryType === 'include' ? '包含以下国家' : '不包含以下国家'}
                  </div>
                  {applyData.countries && applyData.countries.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">{applyData.countries.join(', ')}</div>
                  )}
                </div>
                <div>
                  <div className="text-gray-500">发布品牌类型</div>
                  <div className="font-medium">
                    {applyData.brandType === 'all' ? '全部品牌' : 
                     applyData.brandType === 'include' ? '包含以下品牌' : '不包含以下品牌'}
                  </div>
                  {applyData.brands && applyData.brands.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">{applyData.brands.join(', ')}</div>
                  )}
                </div>
                <div>
                  <div className="text-gray-500">发布机型类型</div>
                  <div className="font-medium">
                    {applyData.deviceType === 'all' ? '全部机型' : 
                     applyData.deviceType === 'include' ? '包含以下机型' : '不包含以下机型'}
                  </div>
                  {applyData.devices && applyData.devices.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">{applyData.devices.join(', ')}</div>
                  )}
                </div>
                <div>
                  <div className="text-gray-500">内测机型类型</div>
                  <div className="font-medium">
                    {applyData.betaDeviceType === 'all' ? '全部机型' : 
                     applyData.betaDeviceType === 'include' ? '包含以下机型' : '不包含以下机型'}
                  </div>
                  {applyData.betaDevices && applyData.betaDevices.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">{applyData.betaDevices.join(', ')}</div>
                  )}
                </div>
                <div>
                  <div className="text-gray-500">适用安卓版本</div>
                  <div className="font-medium">
                    {applyData.androidVersionType === 'all' ? '全部版本' : 
                     applyData.androidVersionType === 'include' ? '包含以下版本' : '不包含以下版本'}
                  </div>
                  {applyData.androidVersions && applyData.androidVersions.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">{applyData.androidVersions.join(', ')}</div>
                  )}
                </div>
                <div>
                  <div className="text-gray-500">适用tOS版本</div>
                  <div className="font-medium">
                    {applyData.tosVersionType === 'all' ? '全部版本' : 
                     applyData.tosVersionType === 'include' ? '包含以下版本' : '不包含以下版本'}
                  </div>
                  {applyData.tosVersions && applyData.tosVersions.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1">{applyData.tosVersions.join(', ')}</div>
                  )}
                </div>
              </div>
            </div>

            {/* PA更新配置 */}
            {applyData.isPAUpdate && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">📊 PA应用更新配置</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">灰度量级(天)</div>
                    <div className="font-medium text-green-600">{applyData.grayScaleLevel?.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">生效时间</div>
                    <div className="font-medium">
                      {applyData.effectiveTime?.start} - {applyData.effectiveTime?.end}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 物料信息 */}
            {applyData.materials && applyData.materials.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">🖼️ 物料信息</h4>
                {applyData.materials.map((material, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="font-medium text-blue-600 mb-2">
                      {material.languageName || material.language}
                      {idx === 0 && <span className="text-xs text-gray-400 ml-2">(默认)</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-gray-500">应用名称</div>
                        <div>{material.appName || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">一句话描述</div>
                        <div className="truncate">{material.shortDescription || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">关键词</div>
                        <div>{material.keywords?.join(', ') || '-'}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">GP上架</div>
                        <div>{material.isGP上架 ? '是' : '否'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 审核操作区 */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">✅ 审核操作</h4>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setMode('pass')}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    mode === 'pass' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✅ 审核通过
                </button>
                <button
                  onClick={() => setMode('reject')}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    mode === 'reject' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ❌ 审核拒绝
                </button>
              </div>
              
              {mode === 'pass' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">审核备注 (可选)</label>
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
          </div>

          {/* 底部按钮 */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
              取消
            </button>
            <button
              onClick={() => {
                if (mode === 'pass') {
                  onPass(comment);
                } else {
                  onReject(rejectReason);
                }
              }}
              disabled={mode === 'reject' && !rejectReason.trim()}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                mode === 'pass' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
