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

## 2. プロジェクト構造 (Project Structure)
- `App.tsx`: エントリポイントおよびナビゲーション管理。
- `src/components/`: 再利用可能なUIコンポーネント。
- `src/screens/`: 各画面（店舗設定、スタッフ、ルール、シフト表）。
- `src/logic/`: AI（自動生成）の中核ロジック（移植予定）。
- `app.json`: Expo 設定ファイル。
- `project_ai_rules.md`: AI開発ルール。

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
