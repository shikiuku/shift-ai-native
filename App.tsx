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

  const NavButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <TouchableOpacity
      style={[
        styles.navButton,
        activeTab === id && styles.navButtonActive,
        !isTablet && styles.mobileNavButton
      ]}
      onPress={() => setActiveTab(id)}
    >
      <Icon size={isTablet ? 24 : 20} color={activeTab === id ? '#2e7d32' : '#a5d6a7'} />
      <Text style={[
        styles.navLabel,
        activeTab === id && styles.navLabelActive,
        !isTablet && styles.mobileNavLabel
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.header}>
            <View style={styles.headerLogo}>
              <View style={styles.logoIcon}>
                <Flower size={20} color="#2e7d32" />
              </View>
              <Text style={styles.headerTitle}>シフトAI</Text>
            </View>
            <TouchableOpacity style={styles.generateButton} onPress={シフト生成実行}>
              <Text style={styles.generateButtonText}>AI生成</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.mainLayout}>
          {isTablet && (
            <View style={styles.sidebar}>
              <NavButton id="Store" icon={Store} label="設定" />
              <NavButton id="Staff" icon={Users} label="名簿" />
              <NavButton id="Rules" icon={ArrowRightLeft} label="相性" />
              <NavButton id="Shift" icon={CalendarDays} label="表" />
            </View>
          )}

          <View style={styles.content}>
            {renderContent()}
          </View>
        </View>

        {!isTablet && (
          <SafeAreaView style={styles.bottomTabSafeArea}>
            <View style={styles.bottomTab}>
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
    backgroundColor: '#f1f8e9', // Brighter minty bg
  },
  headerSafeArea: {
    backgroundColor: '#43a047', // Refreshing green
  },
  header: {
    height: 60,
    backgroundColor: '#43a047',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    backgroundColor: '#dce775', // Brighter lime
    padding: 4,
    borderRadius: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  generateButton: {
    backgroundColor: '#dce775',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  generateButtonText: {
    color: '#2e7d32',
    fontWeight: '900',
    fontSize: 14,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 80,
    backgroundColor: '#2e7d32', // Lush Green
    paddingVertical: 20,
    alignItems: 'center',
    gap: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bottomTabSafeArea: {
    backgroundColor: '#2e7d32',
  },
  bottomTab: {
    height: 60,
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    gap: 4,
    padding: 8,
    borderRadius: 12,
    minWidth: 60,
  },
  mobileNavButton: {
    paddingVertical: 6,
    minWidth: 70,
  },
  navButtonActive: {
    backgroundColor: '#dce775',
  },
  navLabel: {
    fontSize: 10,
    color: '#c8e6c9',
    fontWeight: 'bold',
  },
  mobileNavLabel: {
    fontSize: 9,
  },
  navLabelActive: {
    color: '#1b5e20', // Clear dark green for contrast
  },
});

export default App;
