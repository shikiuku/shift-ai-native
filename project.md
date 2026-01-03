# プロジェクト概要: シフトai (Green Pack) - Mobile Edition

AIを活用した、店舗や職場向けの高度なシフト管理・自動生成システム。
**本バージョンは Expo (React Native) をベースとし、スマホ・タブレットでの利用を最優先に設計されています。**

## 1. 現状の仕様 (Current Specifications)
- **AI自動シフト生成**: スタッフの出勤希望、店舗の必要人数、相性（一緒にする/しない）を考慮した自動生成ロジック。
- **モバイル最適化UI**:
  - スマホでの片手操作、タブレットでの広い画面を活かしたレスポンシブデザイン。
  - 和の色（Green Pack）を基調とした、フラットで目に優しいモダンなデザイン。
  - 影 (Shadow) を使用しないフラットデザインの徹底。
- **スタッフ管理**: モバイルに最適化されたリスト表示とスムーズな詳細設定。
- **シフト表**: 縦横のスクロールに対応し、小さな画面でも情報の視認性を確保。

## 2. ディレクトリ構造 (Project Structure)
```text
シフトai/
├── App.tsx             # メインエントリ・レイアウト切替
├── app.json            # Expo 設定 (iOS BundleID等含む)
├── index.ts            # エントリポイント
├── src/
│   ├── logic/          # ロジック層
│   │   ├── types.ts    # 主要な型定義
│   │   └── services/   
│   │       ├── shiftLogic.ts    # AI自動生成アルゴリズム
│   │       └── geminiService.ts # 将来的なAI連携用
│   ├── screens/        # 各画面
│   │   ├── StoreSettings/ # 店舗・営業時間設定
│   │   │   ├── StoreSettings.tsx
│   │   │   └── components/
│   │   │       ├── DaySettingRow.tsx  # 曜日別設定行
│   │   │       ├── TimeRangeBar.tsx   # インタラクティブ・タイムバー
│   │   │       ├── TimeInputGroup.tsx # 数値入力
│   │   │       └── CountInputGroup.tsx
│   │   ├── StaffList/     # スタッフ名簿・希望設定
│   │   │   ├── StaffList.tsx
│   │   │   └── components/
│   │   │       ├── StaffCard.tsx
│   │   │       └── StaffScheduleGrid.tsx # スタッフ版タイムバー
│   │   ├── Rules/         # 相性ルール設定
│   │   │   ├── Rules.tsx
│   │   │   └── components/
│   │   │       └── RuleItem.tsx
│   │   └── ShiftTable/    # 生成済みシフト表示
│   │       ├── ShiftTable.tsx
│   │       └── components/
│   │           ├── ShiftHeader.tsx
│   │           └── ShiftRow.tsx
│   └── components/     # 共通コンポーネント
└── assets/             # アイコン等の静的アセット
```

## 3. 進捗状況 (Progress)
- [x] Web版（Vite）からの移行決定。
- [/] Expo プロジェクトへの再構築中。
- [ ] モバイル向けUIデザインの移植。
- [ ] レスポンシブレイアウト（スマホ/タブレット）の実装。

## 4. 技術スタック (Tech Stack)
- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Repository**: [shikiuku/shift-ai-native](https://github.com/shikiuku/shift-ai-native)
- **UI/Icons**: Lucide React Native
- **Styling**: React Native StyleSheet (モバイル最適化)
