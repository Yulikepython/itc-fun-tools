# itc-fun-tools

## 概要

Fun Tools は、React と Django を使用して構築された便利なツール集です。以下のアプリケーションが含まれています：

### アプリ一覧

1. **無料のワードクラウドアプリ**

   - **概要**: 記事で多用されているワードを抜き出し、ワードクラウド画像を生成します。
   - **リンク**: `/blog-cloud`

2. **QR コード作成**

   - **概要**: 任意の文字列を QR コードに変換します。
   - **リンク**: `/qrmaker`

3. **西暦と和暦の変換**

   - **概要**: 西暦と和暦を相互に変換します。
   - **リンク**: `/yearConverter`

4. **ランダム文字列生成**

   - **概要**: ランダムな文字列を生成します。
   - **リンク**: `/get-random-string`

5. **ワードカウンター**

   - **概要**: テキストの文字数をカウントします。
   - **リンク**: `/wordcounter`

6. **ハッシュ化ツール**

   - **概要**: HMAC SHA256 を使用して文字列をハッシュ化します。
   - **リンク**: `/hashapp`

7. **プライバシーポリシーテンプレート生成**

   - **概要**: ドメイン名を入力してプライバシーポリシーの雛形を生成します。
   - **リンク**: `/privacy-policy-maker`

8. **バイト数カウントツール**

   - **概要**: テキストをバイト数に変換して表示します。
   - **リンク**: `/byte-counter`

9. **JSON Formatter**

   - **概要**: JSON 文字列を整形します。
   - **リンク**: `/json-prettier`

10. **ポモドーロ・タイマー**
    - **概要**: 作業効率を高めるためのタイマー。
    - **リンク**: `/pomodoro-timer`

## アプリケーションの追加方法

新しいアプリケーションを追加する際は、以下の手順に従ってください：

1. **アプリケーションの作成**:

   - `src/apps/`ディレクトリに新しいアプリケーションのコンポーネントファイルを作成します。
   - 必要に応じて、`src/static/scss/`にスタイルファイルを追加します。

2. **lazyLoader への追加**:

   - `src/utils/lazyLoader.js`に新しいアプリケーションをインポートし、エクスポートを追加します。
   - 例:
     ```javascript
     export const NewApp = lazy(() => import("../apps/NewApp"));
     ```

3. **ルートの設定**:

   - `src/App.jsx`に新しいルートを追加します。
   - 例:
     ```jsx
     <Route
       exact
       path="new-app-path"
       element={<lazyLoader.NewApp transferPage={transferPage} />}
     />
     ```

4. **アプリ一覧への追加**:

   - `src/pages/appsList.js`に新しいアプリケーションの情報を追加します。
   - 例:
     ```javascript
     {
         appName: "新しいアプリ名",
         icon: "bi bi-new-icon",
         linkTo: "/new-app-path",
         color: "#newcolor",
         description: "新しいアプリの概要",
         searchq: "検索用キーワード",
         id: "newappid",
     }
     ```

5. **テストと確認**:
   - アプリケーションが正しく動作することを確認してください。

## 開発環境のセットアップ

1. 必要な依存関係をインストールします。

   ```bash
   npm install
   ```

2. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

3. ビルドを実行する場合:
   ```bash
   npm run build
   ```

## ライセンス

このプロジェクトは MIT ライセンスの下で提供されています。詳細は`LICENSE`ファイルを参照してください。
