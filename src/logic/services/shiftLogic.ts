
import { スタッフ, 相性ルール, 週間スケジュール, シフト枠, 曜日設定, 曜日一覧 } from "../types";

export const 自動シフト生成 = (
  全スタッフ: スタッフ[],
  ルール: 相性ルール[],
  店舗スケジュール: 曜日設定[]
): 週間スケジュール => {
  const 生成されたシフト: シフト枠[] = [];
  
  for (const 曜日名 of 曜日一覧) {
    const 設定 = 店舗スケジュール.find(s => s.曜日 === 曜日名);
    if (!設定 || 設定.定休日) continue;

    for (const 範囲 of 設定.営業時間帯) {
      // 営業時間を3時間ずつの管理しやすいブロックに分割して人員配置
      // (店舗の要望に合わせて調整可能)
      const ブロックサイズ = 3;
      let 現在 = 範囲.開始;
      const 目標終了 = 範囲.終了;

      while (現在 < 目標終了) {
        const 枠終了 = Math.min(現在 + ブロックサイズ, 目標終了);
        const 最小 = 範囲.最小人数;
        const 最大 = 範囲.最大人数;

        // この時間帯に出勤可能なスタッフを抽出
        const 候補者 = 全スタッフ.filter(s => {
          const 勤務設定 = s.勤務設定.find(k => k.曜日 === 曜日名);
          if (!勤務設定 || !勤務設定.出勤可能) return false;
          // 可能時間帯に含まれているかチェック
          return 勤務設定.可能時間帯.some(p => p.開始 <= 現在 && p.終了 >= 枠終了);
        });

        let 選択ID: string[] = [];
        
        // 候補者をシャッフル
        const シャッフル候補 = [...候補者].sort(() => Math.random() - 0.5);

        // 人数制限（最大人数）までスタッフを選択
        for (const 候補 of シャッフル候補) {
          if (選択ID.length >= 最大) break;

          let 配置可 = true;
          for (const 既存ID of 選択ID) {
            const 禁止 = ルール.find(r => 
              r.タイプ === '一緒にしない' &&
              ((r.スタッフID1 === 候補.id && r.スタッフID2 === 既存ID) ||
               (r.スタッフID1 === 既存ID && r.スタッフID2 === 候補.id))
            );
            if (禁止) {
              配置可 = false;
              break;
            }
          }

          if (配置可) 選択ID.push(候補.id);
        }

        // 最小人数に満たない場合は、相性を一旦無視してでも補充を試みる（現場優先）
        if (選択ID.length < 最小) {
          const 未選択候補 = シャッフル候補.filter(c => !選択ID.includes(c.id));
          for (const 候補 of 未選択候補) {
            if (選択ID.length >= 最小) break;
            選択ID.push(候補.id);
          }
        }

        生成されたシフト.push({
          曜日: 曜日名,
          開始時間: 現在,
          終了時間: 枠終了,
          担当者IDリスト: 選択ID
        });

        現在 = 枠終了;
      }
    }
  }

  return { シフトリスト: 生成されたシフト };
};
