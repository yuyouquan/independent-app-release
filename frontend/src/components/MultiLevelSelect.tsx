import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

interface MultiLevelSelectProps {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export const MultiLevelSelect: React.FC<MultiLevelSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = '请选择',
  label,
  required = false,
  error,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(value)) {
      newExpanded.delete(value);
    } else {
      newExpanded.add(value);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleOption = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter(v => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const renderOptions = (opts: Option[], level = 0) => {
    return opts.map((opt) => (
      <div key={opt.value} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center justify-between py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">
          <label className={`flex items-center flex-1 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <input
              type="checkbox"
              checked={value.includes(opt.value)}
              onChange={() => !disabled && toggleOption(opt.value)}
              disabled={disabled}
              className="mr-2 rounded"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
          {opt.children && opt.children.length > 0 && (
            <button
              onClick={(e) => !disabled && toggleExpand(opt.value, e)}
              disabled={disabled}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              {expandedNodes.has(opt.value) ? '▼' : '▶'}
            </button>
          )}
        </div>
        {opt.children && expandedNodes.has(opt.value) && (
          <div>{renderOptions(opt.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const selectedLabels = options.reduce((acc: string[], opt) => {
    const findSelected = (o: Option): string[] => {
      if (value.includes(o.value)) return [o.label];
      if (o.children) {
        return o.children.flatMap(findSelected);
      }
      return [];
    };
    return [...acc, ...findSelected(opt)];
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`border rounded-lg px-3 py-2 cursor-pointer min-h-[42px] flex items-center flex-wrap gap-1 ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${isOpen && !disabled ? 'ring-2 ring-blue-500' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        {selectedLabels.length > 0 ? (
          selectedLabels.map((l, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
              {l}
            </span>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {renderOptions(options)}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default MultiLevelSelect;
