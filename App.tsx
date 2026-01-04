import './global.css';
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Store,
  Users,
  ArrowRightLeft,
  CalendarDays,
  Flower
} from 'lucide-react-native';

// 型とロジックのインポート
import {
  スタッフ,
  相性ルール,
  週間スケジュール,
  曜日一覧,
  和の色,
  曜日設定
} from './src/logic/types';
import { 自動シフト生成 } from './src/logic/services/shiftLogic';

// 画面のインポート
import StoreSettings from './src/screens/StoreSettings/StoreSettings';
import StaffList from './src/screens/StaffList/StaffList';
import Rules from './src/screens/Rules/Rules';
import ShiftTable from './src/screens/ShiftTable/ShiftTable';

const App: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [全スタッフ, set全スタッフ] = useState<スタッフ[]>([]);
  const [全ルール, set全ルール] = useState<相性ルール[]>([]);
  const [スケジュール, setスケジュール] = useState<週間スケジュール | null>(null);
  const [店舗スケジュール, set店舗スケジュール] = useState<曜日設定[]>([]);
  const [activeTab, setActiveTab] = useState<'Store' | 'Staff' | 'Rules' | 'Shift'>('Store');
  const [展開中のスタッフID, set展開中のスタッフID] = useState<string | null>(null);

  // 初期データ構築
  useEffect(() => {
    const 初期店舗設定: 曜日設定[] = 曜日一覧.map(曜日 => ({
      曜日,
      定休日: false,
      営業時間帯: [{ 開始: 9, 終了: 21, 最小人数: 5, 最大人数: 6 }]
    }));
    set店舗スケジュール(初期店舗設定);

    const 名字 = ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤'];
    const 名前 = ['健太', '美咲', '拓海', '結衣', '大輔', '陽菜', '直樹', 'さくら', '翔太', '七海'];

    const 初期スタッフ: スタッフ[] = Array.from({ length: 10 }).map((_, i) => ({
      id: (i + 1).toString(),
      名前: `${名字[i]} ${名前[i]}`,
      色: 和の色[i % 和の色.length],
      役割: 'パートタイム',
      勤務設定: 曜日一覧.map(曜日 => ({
        曜日,
        出勤可能: true,
        可能時間帯: [{ 開始: 9, 終了: 21, 最小人数: 0, 最大人数: 0 }]
      }))
    }));
    set全スタッフ(初期スタッフ);
  }, []);

  const スタッフ追加 = () => {
    const 新ID = (全スタッフ.length + 1).toString();
    const 新: スタッフ = {
      id: 新ID,
      名前: `新スタッフ ${新ID}`,
      色: 和の色[全スタッフ.length % 和の色.length],
      役割: 'パートタイム',
      勤務設定: 曜日一覧.map(曜日 => ({ 曜日, 出勤可能: true, 可能時間帯: [{ 開始: 9, 終了: 21, 最小人数: 0, 最大人数: 0 }] }))
    };
    set全スタッフ([...全スタッフ, 新]);
    set展開中のスタッフID(新.id);
  };

  const シフト生成実行 = () => {
    const 結果 = 自動シフト生成(全スタッフ, 全ルール, 店舗スケジュール);
    setスケジュール(結果);
    setActiveTab('Shift');
  };

  const スタッフ総時間 = useMemo(() => {
    if (!スケジュール) return {};
    const stats: Record<string, number> = {};
    スケジュール.シフトリスト.forEach(枠 => {
      const duration = 枠.終了時間 - 枠.開始時間;
      枠.担当者IDリスト.forEach(id => {
        stats[id] = (stats[id] || 0) + duration;
      });
    });
    return stats;
  }, [スケジュール]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Store':
        return <StoreSettings 店舗スケジュール={店舗スケジュール} set店舗スケジュール={set店舗スケジュール} />;
      case 'Staff':
        return <StaffList
          全スタッフ={全スタッフ}
          set全スタッフ={set全スタッフ}
          展開中のスタッフID={展開中のスタッフID}
          set展開中のスタッフID={set展開中のスタッフID}
          スタッフ追加={スタッフ追加}
        />;
      case 'Rules':
        return <Rules 全スタッフ={全スタッフ} 全ルール={全ルール} set全ルール={set全ルール} />;
      case 'Shift':
        return <ShiftTable スケジュール={スケジュール} 全スタッフ={全スタッフ} スタッフ総時間={スタッフ総時間} />;
    }
  };

  const NavButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => {
    const isActive = activeTab === id;
    return (
      <TouchableOpacity
        className={`items-center gap-1 p-2 rounded-xl min-w-[60px] ${isActive ? 'bg-white/10' : ''
          } ${!isTablet ? 'py-1.5 min-w-[70px]' : ''}`}
        onPress={() => setActiveTab(id)}
      >
        <Icon size={isTablet ? 24 : 20} color={isActive ? '#cddc39' : '#b0bec5'} />
        <Text
          className={`text-[10px] font-bold ${isActive ? 'text-[#cddc39]' : 'text-[#b0bec5]'
            } ${!isTablet ? 'text-[9px]' : ''}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-slate-50">
        <SafeAreaView className="bg-green-600">
          <View className="h-[60px] bg-green-600 flex-row items-center justify-between px-4">
            <View className="flex-row items-center gap-2">
              <View className="bg-lime-300 p-1 rounded-lg">
                <Flower size={20} color="#37474f" />
              </View>
              <Text className="text-white text-xl font-black">シフトAI</Text>
            </View>
            <TouchableOpacity
              className="bg-lime-300 px-4 py-2 rounded-xl active:opacity-80"
              onPress={シフト生成実行}
            >
              <Text className="text-[#37474f] font-black text-sm">AI生成</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View className="flex-1 flex-row">
          {isTablet && (
            <View className="w-20 bg-[#37474f] py-5 items-center gap-5">
              <NavButton id="Store" icon={Store} label="設定" />
              <NavButton id="Staff" icon={Users} label="名簿" />
              <NavButton id="Rules" icon={ArrowRightLeft} label="相性" />
              <NavButton id="Shift" icon={CalendarDays} label="表" />
            </View>
          )}

          <View className="flex-1 bg-white">
            {renderContent()}
          </View>
        </View>

        {!isTablet && (
          <SafeAreaView className="bg-[#37474f]">
            <View className="h-[60px] bg-[#37474f] flex-row justify-around items-center px-2">
              <NavButton id="Store" icon={Store} label="設定" />
              <NavButton id="Staff" icon={Users} label="名簿" />
              <NavButton id="Rules" icon={ArrowRightLeft} label="相性" />
              <NavButton id="Shift" icon={CalendarDays} label="表" />
            </View>
          </SafeAreaView>
        )}
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
