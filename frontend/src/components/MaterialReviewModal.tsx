import React, { useState } from 'react';
import type { MaterialUploadData } from '../types';

// 物料审核Modal - 运营人员 + 老板双重审核
interface MaterialReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOperatorPass: (comment: string) => void;
  onOperatorReject: (reason: string) => void;
  onBossPass: (comment: string) => void;
  onBossReject: (reason: string) => void;
  materialData: MaterialUploadData | null;
  currentReviewer: 'operator' | 'boss';
}

export const MaterialReviewModal: React.FC<MaterialReviewModalProps> = ({
  isOpen,
  onClose,
  onOperatorPass,
  onOperatorReject,
  onBossPass,
  onBossReject,
  materialData,
  currentReviewer
}) => {
  const [mode, setMode] = useState<'pass' | 'reject'>('pass');
  const [comment, setComment] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  if (!isOpen || !materialData) return null;

  const isOperator = currentReviewer === 'operator';
  const title = isOperator ? '运营人员审核' : '老板审核';
  const color = isOperator ? 'from-blue-600 to-blue-700' : 'from-purple-600 to-purple-700';

  const handleSubmit = () => {
    if (mode === 'pass') {
      if (isOperator) {
        onOperatorPass(comment);
      } else {
        onBossPass(comment);
      }
    } else {
      if (isOperator) {
        onOperatorReject(rejectReason);
      } else {
        onBossReject(rejectReason);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* 头部 */}
          <div className={`bg-gradient-to-r ${color} px-6 py-4 flex justify-between items-center`}>
            <div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-white text-sm opacity-80">请审核物料上传内容</p>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">✕</button>
          </div>

          {/* 内容区 */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                💡 请仔细审核以下物料内容，确认无误后点击通过。如有问题请拒绝并填写原因。
              </p>
            </div>

            {/* 基础信息 */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">📝 基础信息</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500">应用名称</div>
                  <div className="font-medium">{materialData.appName}</div>
                </div>
                <div>
                  <div className="text-gray-500">应用包名</div>
                  <div className="font-medium">{materialData.packageName}</div>
                </div>
                <div>
                  <div className="text-gray-500">应用类型</div>
                  <div className="font-medium">{materialData.appType}</div>
                </div>
                <div>
                  <div className="text-gray-500">版本号</div>
                  <div className="font-medium">{materialData.versionName}</div>
                </div>
              </div>
            </div>

            {/* 物料详情 */}
            {materialData.materials && materialData.materials.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-2">🖼️ 物料详情</h4>
                {materialData.materials.map((material, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <div className="font-medium text-blue-600 mb-3">
                      {material.languageName || material.language}
                      {idx === 0 && <span className="text-xs text-gray-400 ml-2">(默认语言)</span>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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
                        <div>{material.isGP上架 ? `是 (${material.gpLink})` : '否'}</div>
                      </div>
                    </div>

                    {/* 物料图片预览 */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">应用图标</div>
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {material.icon ? (
                            <img src={material.icon} alt="图标" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-gray-400">❌</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">置顶大图</div>
                        <div className="w-full h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          {material.heroImage ? (
                            <img src={material.heroImage} alt="置顶大图" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-gray-400">❌</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">详情截图 ({material.screenshots?.length || 0}张)</div>
                        <div className="flex gap-1">
                          {material.screenshots?.slice(0, 3).map((src, sIdx) => (
                            <img 
                              key={sIdx}
                              src={src} 
                              alt={`截图${sIdx + 1}`}
                              className="w-8 h-8 object-cover rounded border"
                            />
                          ))}
                          {(material.screenshots?.length || 0) === 0 && (
                            <span className="text-gray-400 text-xs">无</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 产品详情和更新说明 */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-gray-500">产品详情</div>
                          <div className="text-xs text-gray-700">{material.productDetail || '-'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">更新说明</div>
                          <div className="text-xs text-gray-700">{material.updateDescription || '-'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 审核操作区 */}
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">{title} - 操作</h4>
              
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setMode('pass')}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    mode === 'pass' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ✅ 通过
                </button>
                <button
                  onClick={() => setMode('reject')}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    mode === 'reject' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ❌ 拒绝
                </button>
              </div>
              
              {mode === 'pass' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    审核备注 (可选)
                  </label>
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
                    placeholder="请输入拒绝原因，以便申请人修改..."
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
              onClick={handleSubmit}
              disabled={mode === 'reject' && !rejectReason.trim()}
              className={`px-6 py-2 rounded-lg text-white font-medium ${
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
