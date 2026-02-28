// 多级选择配置
export const countryMultiLevelOptions = [
  { 
    value: 'all', 
    label: '全部', 
    children: [
      { value: 'all_include', label: '全部包含' },
      { value: 'all_exclude', label: '全部不包含' }
    ]
  },
  { 
    value: 'africa', 
    label: '非洲',
    children: [
      { value: 'NG', label: '尼日利亚' },
      { value: 'KE', label: '肯尼亚' },
      { value: 'GH', label: '加纳' },
      { value: 'TZ', label: '坦桑尼亚' },
      { value: 'EG', label: '埃及' },
      { value: 'ZA', label: '南非' }
    ]
  },
  { 
    value: 'middle_east', 
    label: '中东',
    children: [
      { value: 'SA', label: '沙特阿拉伯' },
      { value: 'AE', label: '阿联酋' },
      { value: 'EG', label: '埃及' },
      { value: 'TR', label: '土耳其' }
    ]
  },
  { 
    value: 'asia', 
    label: '亚洲',
    children: [
      { value: 'IN', label: '印度' },
      { value: 'PK', label: '巴基斯坦' },
      { value: 'BD', label: '孟加拉国' },
      { value: 'ID', label: '印尼' },
      { value: 'PH', label: '菲律宾' },
      { value: 'TH', label: '泰国' },
      { value: 'VN', label: '越南' }
    ]
  }
];

export const brandMultiLevelOptions = [
  { 
    value: 'tecno', 
    label: 'Tecno',
    children: [
      { value: 'Tecno-Spark', label: 'Spark系列' },
      { value: 'Tecno-Camon', label: 'Camon系列' },
      { value: 'Tecno-Pova', label: 'Pova系列' },
      { value: 'Tecno-Note', label: 'Note系列' }
    ]
  },
  { 
    value: 'infinix', 
    label: 'Infinix',
    children: [
      { value: 'Infinix-Hot', label: 'Hot系列' },
      { value: 'Infinix-Note', label: 'Note系列' },
      { value: 'Infinix-Zero', label: 'Zero系列' }
    ]
  },
  { 
    value: 'itel', 
    label: 'itel',
    children: [
      { value: 'itel-A', label: 'A系列' },
      { value: 'itel-P', label: 'P系列' }
    ]
  },
  { 
    value: 'other', 
    label: '其他品牌',
    children: [
      { value: 'Oppo', label: 'Oppo' },
      { value: 'Xiaomi', label: 'Xiaomi' },
      { value: 'Samsung', label: 'Samsung' },
      { value: 'Vivo', label: 'Vivo' }
    ]
  }
];

export const modelMultiLevelOptions = [
  {
    value: 'X6841',
    label: 'X6841系列',
    children: [
      { value: 'X6841_H6941', label: 'X6841_H6941' },
      { value: 'X6841_H6941P', label: 'X6841_H6941P' }
    ]
  },
  {
    value: 'X6825',
    label: 'X6825系列',
    children: [
      { value: 'X6825_H6825', label: 'X6825_H6825' },
      { value: 'X6825B_H6825B', label: 'X6825B_H6825B' }
    ]
  },
  {
    value: 'X688B',
    label: 'X688B系列',
    children: [
      { value: 'X688B_X688B', label: 'X688B_X688B' }
    ]
  },
  {
    value: 'INFINIX',
    label: 'Infinix机型',
    children: [
      { value: 'INFINIX-X6837B', label: 'INFINIX-X6837B' },
      { value: 'INFINIX-X6835B', label: 'INFINIX-X6835B' },
      { value: 'INFINIX-X676B', label: 'INFINIX-X676B' }
    ]
  },
  {
    value: 'itel',
    label: 'itel机型',
    children: [
      { value: 'itel-I6611', label: 'itel-I6611' },
      { value: 'itel-I5601', label: 'itel-I5601' }
    ]
  }
];
