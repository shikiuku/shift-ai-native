
export type 役割 = '学生' | '主婦' | 'フルタイム' | 'パートタイム' | 'その他';

export interface 時間範囲 {
  開始: number; // 0-30 (24時以降は+24)
  終了: number;
  最小人数: number;
  最大人数: number;
}

export interface 曜日設定 {
  曜日: string;
  定休日: boolean;
  営業時間帯: 時間範囲[];
}

export interface スタッフ勤務設定 {
  曜日: string;
  出勤可能: boolean;
  可能時間帯: 時間範囲[];
}

export interface 相性ルール {
  スタッフID1: string;
  スタッフID2: string;
  タイプ: '一緒にする' | '一緒にしない';
}

export interface スタッフ {
  id: string;
  名前: string;
  色: string;
  役割: 役割;
  勤務設定: スタッフ勤務設定[];
}

export interface シフト枠 {
  曜日: string;
  開始時間: number;
  終了時間: number;
  担当者IDリスト: string[];
}

export interface 週間スケジュール {
  シフトリスト: シフト枠[];
}

export const 曜日一覧 = [
  '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'
];

export const 和の色 = [
  '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', 
  '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', 
  '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', 
  '#795548', '#9E9E9E', '#607D8B', '#004D40', '#D32F2F'
];

export const 時間ラベル = (時間: number) => {
  if (時間 < 24) return `${時間}:00`;
  return `翌${時間 - 24}:00`;
};
