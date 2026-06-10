# Works Layout Tool

イラスト実績公開用の画像を、登録済みテンプレートに流し込んでPNG書き出しするブラウザアプリです。

## 場所

このアプリは次のディレクトリにあります。

```text
works-layout-tool
```

## 起動方法

開発用サーバーで動かします。

```powershell
cd path\to\works-layout-tool
npm run dev
```

起動後、ブラウザで開くURL:

```text
http://127.0.0.1:5180
```

すでに別のViteサーバーが動いている場合は、`5181` など別ポートになることがあります。その場合はターミナルに表示されたURLを開いてください。

## 終了方法

`npm run dev` を実行しているターミナルで `Ctrl + C` を押します。

## ビルド確認

変更後に壊れていないか確認するコマンドです。

```powershell
npm run build
```

成功すると `dist/` が作られます。

## 公開方法

このプロジェクトは GitHub Pages で公開する想定です。

読み込んだ画像はブラウザ内だけで処理されます。画像ファイルをサーバーへアップロードする仕組みはありません。

### GitHub Pagesで公開する

このリポジトリには `.github/workflows/deploy.yml` が入っています。

GitHubにpushすると、GitHub Actions が自動で次を実行します。

- `npm ci`
- `npm run build`
- `dist/` を GitHub Pages に公開

初回公開手順:

1. GitHubで新しいリポジトリを作成します。
2. リポジトリ名は `works-layout-tool` などにします。
3. READMEや.gitignoreはGitHub側では追加しません。
4. ローカルで次を実行します。

```powershell
cd path\to\works-layout-tool
git remote add origin https://github.com/<GitHubユーザー名>/works-layout-tool.git
git branch -M main
git push -u origin main
```

5. GitHubのリポジトリ画面で `Settings` -> `Pages` を開きます。
6. `Build and deployment` の `Source` が `GitHub Actions` になっていることを確認します。
7. `Actions` タブで `Deploy to GitHub Pages` が成功すると、PagesのURLが発行されます。

公開URLは通常、次の形になります。

```text
https://<GitHubユーザー名>.github.io/works-layout-tool/
```

### Netlify Dropで一時公開する場合

GitHubを使わずに一時公開したい場合は、`npm run build` 後の `dist/` フォルダ、または `works-layout-tool-dist.zip` を Netlify Drop にドラッグします。

```text
https://app.netlify.com/drop
```

## 主な仕様

- 複数画像を読み込み、キャンバス上でドラッグ移動できます。
- 画像の四隅ハンドルで拡大縮小できます。
- 複数レイヤーの並び替え、削除、選択ができます。
- PNGとして書き出せます。
- 画像サイズは `X 横長`、`X 縦長`、`X 正方形`、`Instagram` から選べます。
- 右パネルは `レイヤー`、`文字`、`背景` の3タブ構成です。
- iPad/スマホ幅ではキャンバス右上の `設定` ボタンから、同じタブ内容をポップアップで開きます。
- アプリ画面右下に `Created by MacmazawaRinko` の制作者クレジットを表示します。
- 制作者クレジットはアプリUIだけに表示され、書き出しPNGには入りません。

## プリセット

- `Clean Frame`
- `Editorial Dark`
- `Soft Poster`
- `Pastel Wave`
- `Pastel Solid`

`Pastel Solid` は濃い背景、白い映画枠風の上下帯、太めの白点線グリッド、白文字を前提にしたプリセットです。

## 背景機能

背景タブでは、グリッドと装飾を調整できます。

グリッド:

- なし
- 波線
- 直線
- 点線
- ドット
- 縦縞
- 横縞
- 斜線

調整項目:

- 色
- 太さ
- 細かさ
- 不透明度
- 揺らぎ
- 回転

装飾:

- バツ
- 紙吹雪
- 円
- 三角
- ドット
- キラキラ
- ひし形
- 雲

調整項目:

- 表示オン/オフ
- 不透明度
- サイズ
- 配置シード
- サイズゆらぎ

## 文字機能

- 文字の表示/完全非表示を切り替えできます。
- 文字位置は上/下を切り替えできます。
- タイトル、補足、表記を編集できます。
- Google Fontsを含む複数フォントを選べます。
- `Pastel Wave` と `Pastel Solid` は文字位置が枠や帯に被らないよう個別調整されています。

## レイヤー効果

選択した画像レイヤーに対して、以下を設定できます。

- 透過PNGのシルエットに沿った背景色
- 背景オフセット
- 枠線の表示/非表示
- 枠線色
- シャドウの表示/非表示
- シャドウ色
- シャドウ不透明度

選択レイヤーの効果を全レイヤーへ適用するボタンもあります。

## 編集時の注意

日本語UI文字列を含むため、PowerShellの `Set-Content` などでファイル全体を書き戻すと文字化けする可能性があります。

編集するときは、UTF-8を維持するエディタか、差分編集を使ってください。

主な実装ファイル:

```text
src/main.jsx
src/styles.css
```
