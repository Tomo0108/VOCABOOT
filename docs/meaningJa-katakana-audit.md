# meaningJa におけるカタカナ表記の調査

データ: `src/data/toeic/words.enriched.generated.ts`（自動抽出）

## 調査の見方

- **カタカナのみ**: 和訳に**漢字もひらがなも含まれない**行。英語をカタカナにしただけの「訳」に見えやすい（学習用には和語・漢語の併記が望ましいケースが多い）。
- **3文字以上のカタカナ連続を含む**: 業界用語として定着している語（エレベーター、コンプライアンス等）も多く、**すべてが不適切という意味ではない**。

## 1. カタカナのみの meaningJa（95 件）

| term | meaningJa |
|------|-----------|
| allergy | アレルギー |
| audition | オーディション |
| backpack | リュックサック |
| balcony | バルコニー |
| barbecue | バーベキュー |
| basketball | バスケットボール |
| bench | ベンチ |
| brake | ブレーキ |
| brochure | パンフレット |
| buffet | ビュッフェ |
| butter | バター |
| cab | タクシー |
| café | カフェ |
| cart | カート |
| cartridge | カートリッジ |
| centimeter | センチメートル |
| cheeseburger | チーズバーガー |
| clipboard | クリップボード |
| concierge | コンシェルジュ |
| cookie | クッキー |
| cooler | クーラーボックス |
| coordinator | コーディネーター |
| cord | コード、ケーブル |
| crane | クレーン |
| desktop | デスクトップパソコン |
| dessert | デザート |
| diamond | ダイヤモンド |
| documentary | ドキュメンタリー |
| donut | ドーナツ |
| elephant | ゾウ |
| elevator | エレベーター |
| entrée | メインディッシュ |
| escalator | エスカレーター |
| ferry | フェリー |
| flyer | チラシ |
| folder | フォルダ |
| franchise | フランチャイズ |
| gardening | ガーデニング |
| guitar | ギター |
| headset | ヘッドセット |
| heater | ヒーター |
| hybrid | ハイブリッド |
| intern | インターン |
| internship | インターンシップ |
| journalism | ジャーナリズム |
| journalist | ジャーナリスト |
| keyboard | キーボード |
| kit | キット、セット |
| laptop | ノートパソコン |
| leaflet | チラシ、リーフレット |
| letterhead | レターヘッド |
| lever | レバー |
| lifestyle | ライフスタイル |
| lobby | ロビー |
| logo | ロゴ |
| lounge | ラウンジ |
| microphone | マイク |
| motel | モーテル |
| motorcycle | オートバイ |
| newsletter | ニュースレター |
| orientation | オリエンテーション |
| pamphlet | パンフレット |
| parachute | パラシュート |
| parade | パレード |
| picnic | ピクニック |
| pizza | ピザ |
| platform | プラットフォーム、ホーム |
| portfolio | ポートフォリオ |
| poster | ポスター |
| pyramid | ピラミッド |
| questionnaire | アンケート |
| ribbon | リボン、テープ |
| robot | ロボット |
| safari | サファリ |
| sauce | ソース |
| scanner | スキャナー |
| shuttle | シャトルバス |
| simulation | シミュレーション |
| smartphone | スマートフォン |
| spreadsheet | スプレッドシート |
| startup | スタートアップ |
| supermarket | スーパーマーケット |
| sweater | セーター |
| symposium | シンポジウム |
| terrace | テラス |
| timeline | タイムライン、スケジュール |
| trophy | トロフィー |
| tuxedo | タキシード |
| webpage | ウェブページ |
| website | ウェブサイト |
| whale | クジラ |
| wool | ウール |
| workbook | ワークブック |
| workshop | ワークショップ |
| yoga | ヨガ |

## 2. 3文字以上のカタカナ列を含む meaningJa（272 件・重複除く）

和語・漢字と併記されているものが大半。必要に応じて個別に表現を見直す。

| term | 検出カタカナ | meaningJa |
|------|-------------|-------------|
| accent | アクセント | アクセント、なまり |
| accessory | アクセサリー | 付属品、アクセサリー |
| adapter | アダプター | 変換アダプター |
| advisor | アドバイザー | 顧問、アドバイザー |
| allergy | アレルギー | アレルギー |
| amateur | アマチュア | アマチュア、素人 |
| amenity | アメニティ | 設備、アメニティ |
| announcer | アナウンサー | アナウンサー、司会者 |
| antique | アンティーク | 骨董品、アンティークの |
| arc | アーチ | 弧、アーチ |
| archive | アーカイブ | 保管庫、アーカイブする |
| auction | オークション | 競売、オークション |
| audition | オーディション | オーディション |
| auditorium | ホール | 講堂、ホール |
| backpack | リュックサック | リュックサック |
| badge | バッジ | 名札、バッジ |
| bakery | ベーカリー | パン屋、ベーカリー |
| balcony | バルコニー | バルコニー |
| barbecue | バーベキュー | バーベキュー |
| basket | バスケット | かご、バスケット |
| basketball | バスケットボール | バスケットボール |
| bathroom | トイレ | 洗面所、トイレ |
| battery | バッテリー | 電池、バッテリー |
| bench | ベンチ | ベンチ |
| bonus | ボーナス | 賞与、ボーナス |
| booklet | パンフレット | 小冊子、パンフレット |
| booth | ブース | ブース、小間 |
| brainstorm | ブレインストーミング | ブレインストーミングする |
| brake | ブレーキ | ブレーキ |
| brochure | パンフレット | パンフレット |
| broker | ブローカー | 仲介業者、ブローカー |
| buffet | ビュッフェ | ビュッフェ |
| businessman | ビジネスマン | 実業家、ビジネスマン |
| butter | バター | バター |
| cab | タクシー | タクシー |
| cabinet | キャビネット | 棚、キャビネット |
| café | カフェ | カフェ |
| cafeteria | カフェテリア | 社員食堂、カフェテリア |
| calendar | カレンダー | カレンダー、予定表 |
| campus | キャンパス | キャンパス、構内 |
| cancellation | キャンセル | 取り消し、キャンセル |
| candy | キャンディー | キャンディー、お菓子 |
| captain | キャプテン | 船長、機長、キャプテン |
| cart | カート | カート |
| carton | ボール, パック | 段ボール箱、紙パック |
| cartridge | カートリッジ | カートリッジ |
| casual | カジュアル | カジュアルな、普段着の |
| caterer | ケータリング | ケータリング業者 |
| centimeter | センチメートル | センチメートル |
| checkout | チェックアウト | チェックアウト、精算 |
| cheeseburger | チーズバーガー | チーズバーガー |
| chef | シェフ | シェフ、料理長 |
| clinic | クリニック | クリニック、診療所 |
| clipboard | クリップボード | クリップボード |
| closet | クローゼット | 収納棚、クローゼット |
| compact | コンパクト | コンパクトな、小型の |
| compartment | スペース | 区画、収納スペース |
| compliance | コンプライアンス | 遵守、コンプライアンス |
| concierge | コンシェルジュ | コンシェルジュ |
| conditioner | コンディショナー | コンディショナー、空調装置 |
| condominium | マンション | マンション、分譲住宅 |
| container | コンテナ | 容器、コンテナ |
| continental | ヨーロッパ | 大陸の、ヨーロッパ風の |
| cookie | クッキー | クッキー |
| cooler | クーラーボックス | クーラーボックス |
| coordinator | コーディネーター | コーディネーター |
| copier | コピー | コピー機 |
| cord | コード, ケーブル | コード、ケーブル |
| cordless | コードレス | コードレスの |
| counselor | カウンセラー | カウンセラー、顧問 |
| coupon | クーポン | クーポン、割引券 |
| crane | クレーン | クレーン |
| cruise | クルーズ | クルーズ、巡航 |
| cushion | クッション | クッション、緩衝材 |
| customize | カスタマイズ | カスタマイズする |
| debit | デビット | 口座引き落とし、デビット |
| deck | デッキ | デッキ、甲板 |
| delicate | デリケート | 繊細な、デリケートな |
| deluxe | デラックス | 豪華な、デラックスの |
| desktop | デスクトップパソコン | デスクトップパソコン |
| dessert | デザート | デザート |
| dial | ダイヤル | ダイヤルする |
| diamond | ダイヤモンド | ダイヤモンド |
| diner | ダイナー | 食事客、ダイナー |
| diploma | ディプロマ | 卒業証書、ディプロマ |
| dock | ドック | 埠頭、ドック |
| documentary | ドキュメンタリー | ドキュメンタリー |
| documentation | ドキュメント | 書類、ドキュメント |
| donut | ドーナツ | ドーナツ |
| doorman | ドアマン | ドアマン、玄関係 |
| download | ダウンロード | ダウンロードする |
| drawback | デメリット | 欠点、デメリット |
| drill | ドリル | ドリル、訓練 |
| drum | ドラム | ドラム缶、太鼓 |
| dynamic | ダイナミック | ダイナミックな、活発な |
| elegant | エレガント | 上品な、エレガントな |
| elevator | エレベーター | エレベーター |
| entrée | メインディッシュ | メインディッシュ |
| escalator | エスカレーター | エスカレーター |
| facilitator | ファシリテーター | 進行役、ファシリテーター |
| feedback | フィードバック | フィードバック、意見 |
| ferry | フェリー | フェリー |
| festival | フェスティバル | 祭り、フェスティバル |
| fiction | フィクション | フィクション、小説 |
| flair | センス | 才能、センス |
| flyer | チラシ | チラシ |
| folder | フォルダ | フォルダ |
| format | フォーマット | 形式、フォーマット |
| forum | フォーラム | フォーラム、会議 |
| franchise | フランチャイズ | フランチャイズ |
| freelance | フリーランス | フリーランスの |
| full-time | フルタイム | フルタイムの |
| gadget | ガジェット | ガジェット、小道具 |
| gallery | ギャラリー | ギャラリー、画廊 |
| gardening | ガーデニング | ガーデニング |
| gourmet | グルメ | グルメ、美食家 |
| graphic | グラフィック | グラフィックの |
| gratuity | チップ | チップ、心付け |
| greenhouse | グリーンハウス | 温室、グリーンハウス |
| guideline | ガイドライン | ガイドライン、指針 |
| guitar | ギター | ギター |
| handbook | ハンドブック | ハンドブック、手引書 |
| harassment | ハラスメント | ハラスメント、嫌がらせ |
| hardware | ハードウェア | ハードウェア、金物 |
| headline | ヘッドライン | 見出し、ヘッドライン |
| headset | ヘッドセット | ヘッドセット |
| heater | ヒーター | ヒーター |
| highlight | ハイライト | 強調する、ハイライト |
| hike | ハイキング | 値上がり、ハイキング |
| hospitality | ホスピタリティ | おもてなし、ホスピタリティ |
| host | ホスト | 主催する、ホスト |
| hybrid | ハイブリッド | ハイブリッド |
| icon | アイコン | アイコン、象徴 |
| indicator | インジケーター | 指標、インジケーター |
| inflation | インフレーション | インフレーション、物価上昇 |
| infrastructure | インフラ | インフラ、基盤 |
| innovation | イノベーション | 革新、イノベーション |
| inspiration | インスピレーション | インスピレーション、刺激 |
| installation | インストール | 設置、インストール |
| instructor | インストラクター | インストラクター、講師 |
| interactive | インタラクティブ | インタラクティブな、双方向の |
| interior | インテリア | 内側、インテリア |
| intern | インターン | インターン |
| internship | インターンシップ | インターンシップ |
| itinerary | スケジュール | 旅程、スケジュール |
| jewelry | アクセサリー | 宝飾品、アクセサリー |
| journalism | ジャーナリズム | ジャーナリズム |
| journalist | ジャーナリスト | ジャーナリスト |
| keyboard | キーボード | キーボード |
| kit | キット, セット | キット、セット |
| landmark | ランドマーク | 目印、ランドマーク |
| laptop | ノートパソコン | ノートパソコン |
| layout | レイアウト | レイアウト、配置 |
| leaflet | チラシ, リーフレット | チラシ、リーフレット |
| leather | レザー | 革、レザー |
| legacy | レガシー | 遺産、レガシー |
| leisure | レジャー | 余暇、レジャー |
| letterhead | レターヘッド | レターヘッド |
| lever | レバー | レバー |
| lifestyle | ライフスタイル | ライフスタイル |
| linen | リネン | リネン、麻製品 |
| literacy | リテラシー | 識字能力、リテラシー |
| lobby | ロビー | ロビー |
| log | ログイン | 記録する、ログイン |
| loop | ループ | ループ、輪 |
| lounge | ラウンジ | ラウンジ |
| loyalty | ロイヤルティ | 忠誠心、ロイヤルティ |
| maintenance | メンテナンス | メンテナンス、維持 |
| marking | マーキング | 採点、マーキング |
| mentor | メンター | メンター、指導者 |
| metaphor | メタファー | 比喩、メタファー |
| microphone | マイク | マイク |
| milestone | マイルストーン | マイルストーン、重要な節目 |
| mineral | ミネラル | ミネラル、鉱物 |
| monitor | モニター | モニターする、監視する |
| monument | モニュメント | 記念碑、モニュメント |
| mortgage | ローン | 住宅ローン |
| motel | モーテル | モーテル |
| motorcycle | オートバイ | オートバイ |
| motto | モットー | モットー、標語 |
| navigation | ナビゲーション | 航行、ナビゲーション |
| newsletter | ニュースレター | ニュースレター |
| odds | オッズ | 見込み、オッズ |
| orientation | オリエンテーション | オリエンテーション |
| outlet | コンセント | 販売店、コンセント |
| packaging | パッケージング | 梱包、パッケージング |
| pamphlet | パンフレット | パンフレット |
| panel | パネル | パネル、委員会 |
| parachute | パラシュート | パラシュート |
| parade | パレード | パレード |
| partnership | パートナーシップ | パートナーシップ、共同経営 |
| penalty | ペナルティ | 罰則、ペナルティ |
| personnel | スタッフ | 人事、スタッフ |
| photographer | カメラマン | カメラマン、写真家 |
| picnic | ピクニック | ピクニック |
| pilot | パイロット | パイロット、試験的な |
| plantation | プランテーション | 農園、プランテーション |
| platform | プラットフォーム, ホーム | プラットフォーム、ホーム |
| portfolio | ポートフォリオ | ポートフォリオ |
| poster | ポスター | ポスター |
| premium | プレミアム | プレミアム、割増料金 |
| processor | プロセッサー | プロセッサー、処理装置 |
| profile | プロフィール | プロフィール、輪郭 |
| pyramid | ピラミッド | ピラミッド |
| questionnaire | アンケート | アンケート |
| rack | ラック | ラック、棚 |
| radiator | ラジエーター | ラジエーター、暖房器具 |
| recyclable | リサイクル | リサイクル可能な |
| recycle | リサイクル | リサイクルする |
| reminder | リマインダー | リマインダー、催促 |
| rental | レンタル | 賃貸、レンタル |
| ribbon | リボン, テープ | リボン、テープ |
| rivalry | ライバル | ライバル関係、競争 |
| robot | ロボット | ロボット |
| rotation | ローテーション | ローテーション、交代 |
| royalty | ロイヤリティ | ロイヤリティ、使用料 |
| safari | サファリ | サファリ |
| salon | サロン | サロン、美容室 |
| sauce | ソース | ソース |
| scanner | スキャナー | スキャナー |
| seafood | シーフード | 魚介類、シーフード |
| sector | セクター | 部門、セクター |
| serial | シリアル | 連続の、シリアル番号 |
| session | セッション | セッション、会期 |
| setup | セットアップ | セットアップ、設定 |
| shuttle | シャトルバス | シャトルバス |
| sidebar | サイドバー | 余談、サイドバー |
| simulation | シミュレーション | シミュレーション |
| sketch | スケッチ | スケッチ、下書き |
| slogan | スローガン | スローガン、標語 |
| smartphone | スマートフォン | スマートフォン |
| snack | スナック | 軽食、スナック |
| socket | ソケット | ソケット、差し込み口 |
| spam | スパム, メール | スパム、迷惑メール |
| sponsorship | スポンサーシップ | スポンサーシップ、後援 |
| spotlight | スポットライト | スポットライト、注目 |
| spreadsheet | スプレッドシート | スプレッドシート |
| squad | チーム | チーム、班 |
| stainless | ステンレス | 錆びない、ステンレスの |
| staple | ホチキス | 主要なもの、ホチキスで留める |
| startup | スタートアップ | スタートアップ |
| storage | ストレージ | 保管、ストレージ |
| suite | スイート | スイート、一連 |
| supermarket | スーパーマーケット | スーパーマーケット |
| sweater | セーター | セーター |
| symposium | シンポジウム | シンポジウム |
| tablet | タブレット | タブレット端末 |
| tenant | テナント | テナント、借家人 |
| terminal | ターミナル | ターミナル、終点 |
| terrace | テラス | テラス |
| timeline | タイムライン, スケジュール | タイムライン、スケジュール |
| tournament | トーナメント | トーナメント、大会 |
| trophy | トロフィー | トロフィー |
| tutorial | チュートリアル | チュートリアル、入門書 |
| tuxedo | タキシード | タキシード |
| upgrade | アップグレード | アップグレードする |
| vaccination | ワクチン | ワクチン接種 |
| van | ワゴン | バン、ワゴン車 |
| vendor | ベンダー | ベンダー、販売業者 |
| virtual | バーチャル | 仮想の、バーチャルな |
| virtually | バーチャル | 実質的に、バーチャルで |
| volunteer | ボランティア | ボランティアする |
| voucher | バウチャー | バウチャー、証票 |
| waist | ウエスト | 腰、ウエスト |
| webpage | ウェブページ | ウェブページ |
| website | ウェブサイト | ウェブサイト |
| wellness | ウェルネス | 健康、ウェルネス |
| whale | クジラ | クジラ |
| wireless | ワイヤレス | ワイヤレスの、無線 |
| wool | ウール | ウール |
| workbook | ワークブック | ワークブック |
| workshop | ワークショップ | ワークショップ |

---

再生成: `node scripts/scan-katakana-in-meanings.mjs`
