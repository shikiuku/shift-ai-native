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
├── App.tsx             # メインエントリ・状態管理・ナビゲーション
├── app.json            # Expo 設定
├── package.json        # 依存関係
├── src/
│   ├── logic/          # ビジネスロジック
│   │   ├── types.ts    # 型定義
│   │   └── services/   # AI生成アルゴリズム等
│   ├── screens/        # 各画面（フォルダごとに構成要素を分離）
│   │   ├── StoreSettings/
│   │   │   ├── StoreSettings.tsx
│   │   │   └── components/
│   │   ├── StaffList/
│   │   │   ├── StaffList.tsx
│   │   │   └── components/
│   │   ├── Rules/
│   │   │   ├── Rules.tsx
│   │   │   └── components/
│   │   └── ShiftTable/
│   │       ├── ShiftTable.tsx
│   │       └── components/
│   └── components/     # 全体共通コンポーネント
└── assets/             # 画像・アイコン等の静的ファイル
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
