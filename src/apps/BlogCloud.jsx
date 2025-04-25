import React, { useEffect, useState, useRef } from "react"
import { Formik, Form, ErrorMessage, Field } from "formik"
import * as Yup from "yup"
import { ErrorHandler } from "../utils/ErrorHandler"
import * as d3 from "d3"
import cloud from "d3-cloud"
import { convert } from "html-to-text"
import kuromoji from "kuromoji"
import TinySegmenter from "tiny-segmenter"

const validate = Yup.object({
    url_: Yup.string().max(100, "URLにしては長すぎます").required("URLを入力して下さい")
})

// 日本語の複合語を検出する関数
// この関数は日本語のテキストを分割した結果から、意味のある複合語を構築します
// 形態素解析だけでは捉えられない複合的な概念や専門用語などを検出するために使用します
const detectJapaneseCompoundWords = (segments) => {
    const compounds = [];
    const minSegmentLength = 2;
    
    for (let i = 0; i < segments.length - 1; i++) {
        // 2つの連続するセグメントを結合
        if (segments[i].length >= minSegmentLength && segments[i+1].length >= minSegmentLength) {
            compounds.push(segments[i] + segments[i+1]);
        }
        
        // 3つの連続するセグメントを結合（より長い複合語）
        if (i < segments.length - 2 && 
            segments[i].length >= minSegmentLength && 
            segments[i+1].length >= minSegmentLength &&
            segments[i+2].length >= minSegmentLength) {
            compounds.push(segments[i] + segments[i+1] + segments[i+2]);
        }
    }
    
    return compounds;
};

// テキストを解析し単語の出現頻度をカウントする関数
// この関数は入力されたテキストを解析し、重要な単語とその出現頻度を抽出します
// 1. テキストを形態素解析し、意味のある単語（主に名詞、動詞、形容詞）を抽出
// 2. 日本語と英語の両方に対応し、それぞれに適した処理を実施
// 3. 複合語の検出や冗長な単語のフィルタリングを行い、質の高いワードクラウドデータを生成
const countWords = (text, removeWords = "") => {
    return new Promise((resolve, reject) => {
        // 除外する単語のリストを作成
        // ストップワードは意味的に重要度が低い単語や、頻出するが情報価値の低い単語を含みます
        // 以下のリストには以下のようなカテゴリの単語が含まれています:
        // - 英語の冠詞、前置詞、接続詞などの機能語
        // - 日本語の助詞、助動詞、接続詞など
        // - 一般的な動詞の活用形（する、ある、なる等）
        // - 短い単語や数字のみの単語
        // - ワードクラウドの中で意味をなさない単独の接尾辞や接頭辞
        const stopWords = new Set([
            // 英語のストップワード
            "a", "an", "the", "and", "or", "but", "if", "because", "as", "what",
            "while", "of", "to", "in", "for", "on", "by", "with", "at", "from",
            "up", "about", "into", "over", "after", "beneath", "under", "above",
            // 日本語のストップワード
            "です", "ます", "ない", "いる", "する", "れる", "られる", "など",
            "から", "まで", "って", "した", "して", "くる", "なる", "ある",
            "よう", "より", "この", "これ", "それ", "あれ", "どれ", "、", "。",
            "の", "は", "が", "に", "を", "で", "と", "も", "や", "へ", "だ",
            "けど", "しか", "たり", "ながら", "ため", "など", "について", 
            "テキスト", "ツール", "できる", "できます", "ため", "こと", "もの",
            "それぞれ", "ところ", "ほど", "とき", "どの", "どち", "どれ",
            "ただ", "また", "または", "および", "ならびに", "かつ", "つまり", "すなわち",
            // 短いひらがな語や一般的な活用語尾
            "でき", "られ", "れて", "して", "した", "され", "れた", "せる", 
            "れる", "とし", "もの", "ます", "まし", "です", "ござ", "おり",
            "ある", "なる", "いる", "える", "われ", "あっ", "なっ", "いっ",
            "くる", "いく", "ゆく", "しい", "ない", "たい", "べき", "そう",
            "より", "かな", "たち", "など", "くに", "とは", "ては", "では",
            "にて", "とも", "ども", "すれ", "れば", "ずに", "ぬよ", "にも",
            "その", "あの", "この", "どの", "いわ", "まさ", "ほぼ", "ほと", 
            "すぎ", "だけ", "まで", "から", "より", "なお", "または",
            "および", "たり", "だり", "中", "内", "外", "間", "上", "下",
            // 単独で意味をなさない部分的な語
            "的", "性", "化", "者", "用", "別", "式", "型", "向け", "状", "たち",
            "さん", "様", "方", "氏", "君", "ら", "国", "人", "物",
            // 数字だけの場合も除外
            ...[...Array(10)].map((_, i) => i.toString()),
            ...removeWords.split(" ").filter(word => word.trim() !== "")
        ]);

        // 日本語の語尾パターン（活用形など）
        // 動詞や形容詞の語尾として頻出するパターン
        // これらは単独では意味をなさないため、語尾だけの単語は除外する必要があります
        const japaneseEndings = [
            "する", "します", "した", "される", "させる", "できる", "せる", "れる",
            "られる", "なる", "ます", "ました", "です", "でした", "だった", "ている",
            "ていた", "ていく", "てくる", "ていただく", "ておく", "てある", "ない", "ません"
        ];
        
        // 語尾パターンをチェックする関数
        const hasVerbEnding = (word) => {
            return japaneseEndings.some(ending => word.endsWith(ending));
        };

        // TinySegmenterによる日本語分かち書き
        const segmentWithTiny = (text) => {
            const segmenter = new TinySegmenter();
            // 分かち書き実行
            const segments = segmenter.segment(text);
            
            // 単語のフィルタリング
            const filteredSegments = segments.filter(word => {
                // 短すぎる単語は除外
                if (word.length < 2) return false;
                
                // ひらがなのみで構成された2文字の単語は除外（助詞や語尾の可能性が高い）
                if (word.length === 2 && /^[\p{Script=Hiragana}]+$/u.test(word)) return false;
                
                // ストップワードは除外
                if (stopWords.has(word)) return false;
                
                // 数字だけの文字列は除外
                if (/^\d+$/.test(word)) return false;
                
                // 語尾パターンのみの単語は除外
                if (hasVerbEnding(word) && word.length < 4) return false;
                
                return true;
            });
            
            // 複合語の検出（3文字以上の意味のある単語から構成される複合語のみ）
            const compounds = [];
            const minLength = 3;
            
            for (let i = 0; i < filteredSegments.length - 1; i++) {
                // 連続する単語が両方とも条件を満たす場合のみ複合語を生成
                if (filteredSegments[i].length >= minLength && 
                    filteredSegments[i+1].length >= minLength &&
                    !hasVerbEnding(filteredSegments[i]) &&
                    !hasVerbEnding(filteredSegments[i+1])) {
                    
                    // 複合語を生成
                    const compound = filteredSegments[i] + filteredSegments[i+1];
                    if (compound.length >= minLength * 2 && !stopWords.has(compound)) {
                        compounds.push(compound);
                    }
                    
                    // 3単語の複合語も検討
                    if (i < filteredSegments.length - 2 && 
                        filteredSegments[i+2].length >= minLength &&
                        !hasVerbEnding(filteredSegments[i+2])) {
                        
                        const compound3 = filteredSegments[i] + filteredSegments[i+1] + filteredSegments[i+2];
                        if (compound3.length >= minLength * 3 && !stopWords.has(compound3)) {
                            compounds.push(compound3);
                        }
                    }
                }
            }
            
            return [...filteredSegments, ...compounds];
        };

        // 英語の単語を抽出
        const extractEnglishWords = (text) => {
            return text.toLowerCase()
                .replace(/[^\p{L}\p{N}\s]/gu, '') // 文字と数字以外を削除
                .split(/\s+/)
                .filter(word => word.length > 2 && !stopWords.has(word) && !/^\d+$/.test(word));
        };

        try {
            // kuromojiの初期化（ブラウザ環境用の設定）
            kuromoji.builder({ dicPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict' })
                .build((err, tokenizer) => {
                    let wordList = [];
                    
                    // kuromoji形態素解析器の初期化に失敗した場合、TinySegmenterだけを使用
                    if (err) {
                        console.info("kuromojiの初期化に失敗しました。TinySegmenterで代替します:", err);
                        
                        // TinySegmenterで日本語を分割
                        const japaneseWords = segmentWithTiny(text);
                        
                        // 英語の単語を抽出
                        const englishWords = extractEnglishWords(text);
                        
                        // 日本語と英語の単語を結合
                        wordList = [...japaneseWords, ...englishWords];
                    } else {
                        try {
                            // kuromoji形態素解析の実行
                            const tokens = tokenizer.tokenize(text);
                            
                            // 形態素解析結果から意味のある単語を抽出
                            const meaningfulWords = tokens
                                .filter(token => {
                                    const pos = token.pos; // 品詞
                                    const posDetail = token.pos_detail_1; // 品詞詳細
                                    const surface = token.surface_form; // 表層形
                                    
                                    // 単語長チェック
                                    if (surface.length < 2) return false;
                                    
                                    // ひらがなのみの2文字単語は除外
                                    if (surface.length === 2 && /^[\p{Script=Hiragana}]+$/u.test(surface)) return false;
                                    
                                    // 名詞、動詞、形容詞、副詞など意味のある品詞を抽出
                                    return (
                                        // 名詞（数詞、代名詞、接尾辞などを除く）
                                        (pos === '名詞' && 
                                         posDetail !== '数' && 
                                         posDetail !== '代名詞' && 
                                         posDetail !== '接尾' && 
                                         posDetail !== '非自立' &&
                                         surface.length >= 2) || 
                                        // 動詞（自立かつ長さチェック）
                                        (pos === '動詞' && posDetail === '自立' && surface.length >= 3) ||
                                        // 形容詞（自立）
                                        (pos === '形容詞' && posDetail === '自立' && surface.length >= 2) ||
                                        // 副詞（長さチェック）
                                        (pos === '副詞' && surface.length >= 2)
                                    );
                                })
                                .map(token => token.basic_form || token.surface_form)
                                .filter(word => 
                                    word.length > 1 && 
                                    !stopWords.has(word.toLowerCase()) && 
                                    !/^\d+$/.test(word) &&
                                    !hasVerbEnding(word)
                                );
                            
                            // kuromoji分析結果と複合語を取得
                            const kuromojiWords = [...meaningfulWords];
                            
                            // 名詞の連続を検出して複合語を生成
                            for (let i = 0; i < tokens.length - 1; i++) {
                                // 両方が名詞で、単独の名詞としても意味がある場合
                                if (tokens[i].pos === '名詞' && tokens[i+1].pos === '名詞' &&
                                    tokens[i].surface_form.length >= 2 && tokens[i+1].surface_form.length >= 2) {
                                    
                                    const compound = (tokens[i].basic_form || tokens[i].surface_form) + 
                                                    (tokens[i+1].basic_form || tokens[i+1].surface_form);
                                    
                                    if (compound.length >= 4 && !stopWords.has(compound)) {
                                        kuromojiWords.push(compound);
                                    }
                                    
                                    // 3つの連続する名詞も複合語として抽出
                                    if (i < tokens.length - 2 && tokens[i+2].pos === '名詞' && 
                                        tokens[i+2].surface_form.length >= 2) {
                                        
                                        const compound3 = (tokens[i].basic_form || tokens[i].surface_form) + 
                                                        (tokens[i+1].basic_form || tokens[i+1].surface_form) +
                                                        (tokens[i+2].basic_form || tokens[i+2].surface_form);
                                        
                                        if (compound3.length >= 6 && !stopWords.has(compound3)) {
                                            kuromojiWords.push(compound3);
                                        }
                                    }
                                }
                            }
                            
                            // TinySegmenterの結果も取得（補完的に利用）
                            const tinySegments = segmentWithTiny(text);
                            
                            // 英語の単語も抽出
                            const englishWords = extractEnglishWords(text);
                            
                            // すべての単語リストを結合
                            wordList = [...kuromojiWords, ...tinySegments.filter(word => word.length >= 3), ...englishWords];
                        } catch (tokenizeErr) {
                            console.error("トークン化エラー:", tokenizeErr);
                            
                            // エラーが発生した場合はTinySegmenterだけを使用
                            const japaneseWords = segmentWithTiny(text);
                            const englishWords = extractEnglishWords(text);
                            wordList = [...japaneseWords, ...englishWords];
                        }
                    }
                    
                    // 単語の出現頻度をカウント
                    const wordCount = {};
                    wordList.forEach(word => {
                        if (wordCount[word]) {
                            wordCount[word]++;
                        } else {
                            wordCount[word] = 1;
                        }
                    });
                    
                    // 1文字の単語と2文字のひらがなのみの単語を除外（追加フィルタリング）
                    const filteredWordCount = Object.entries(wordCount)
                        .filter(([word, count]) => {
                            if (word.length < 2) return false;
                            if (word.length === 2 && /^[\p{Script=Hiragana}]+$/u.test(word)) return false;
                            return true;
                        })
                        .sort((a, b) => b[1] - a[1]);
                    
                    // [単語, 頻度] の形式で返す
                    resolve(filteredWordCount);
                });
        } catch (err) {
            console.error("単語分割エラー:", err);
            
            // エラー発生時はTinySegmenterのみで処理
            const segmenter = new TinySegmenter();
            const segments = segmenter.segment(text)
                .filter(word => {
                    // 単語のフィルタリング
                    if (word.length < 2) return false;
                    if (word.length === 2 && /^[\p{Script=Hiragana}]+$/u.test(word)) return false;
                    if (stopWords.has(word)) return false;
                    if (/^\d+$/.test(word)) return false;
                    return true;
                });
            
            const englishWords = extractEnglishWords(text);
            const allWords = [...segments, ...englishWords];
            
            // 単語の出現頻度をカウント
            const wordCount = {};
            allWords.forEach(word => {
                if (wordCount[word]) {
                    wordCount[word]++;
                } else {
                    wordCount[word] = 1;
                }
            });
            
            // [単語, 頻度] の形式に変換してソート
            resolve(Object.entries(wordCount)
                .filter(([word, count]) => word.length >= 3 || (word.length === 2 && /[\p{Script=Han}\p{Script=Katakana}]/u.test(word)))
                .sort((a, b) => b[1] - a[1])
            );
        }
    });
}

// テキストデータをデモ用に生成する関数
const generateDemoText = () => {
    // 行頭のスペースを削除し、各文をより明確に区切ります
    return `ワードクラウドはテキストデータの視覚化手法として広く使用されています。
このツールはウェブページやブログの内容を分析し、頻出する単語をビジュアルに表示します。
よく使われる単語ほど大きく表示され、テキストの内容を一目で把握することができます。
データの視覚化は情報の理解を助け、パターンや傾向を素早く認識するのに役立ちます。
ワードクラウド生成ツールはマーケティングやコンテンツ分析、研究など様々な分野で活用されています。
単語の出現頻度をカウントし、その結果を視覚的に表現することでテキストデータの特徴を捉えることができます。
日本語や英語など様々な言語に対応し、多様なテキストデータを分析できます。
クラウドコンピューティングの発展により、大量のテキストデータをリアルタイムで処理することが可能になりました。
自然言語処理技術の進歩により、より高度なテキスト分析が行えるようになっています。
このツールはユーザーが入力したURLからテキストを抽出し、単語の出現頻度を分析します。
除外したい単語を指定することで、より意味のあるワードクラウドを生成できます。
視覚化されたデータはダウンロードして他の文書やプレゼンテーションで利用することができます。
情報可視化はデータ分析において重要な役割を果たしています。
ビッグデータ時代には効率的な情報処理と理解が求められます。
ワードクラウドは情報の全体像をすばやく把握するために便利なツールです。`;
}

const generateWordCloud = async (values, actions, setLoading, setError) => {
    const showPng = document.getElementById("showPng");
    const imgURL = document.getElementById("imageURL");
    const showWords = document.getElementById("showWords");
    
    // 表示エリアをリセット
    if (showWords) {
        showWords.style.display = "none";
        while (showWords.firstChild) {
            showWords.removeChild(showWords.lastChild);
        }
    }
    if (showPng) {
        while (showPng.firstChild) {
            showPng.removeChild(showPng.lastChild);
        }
        while (imgURL.firstChild) {
            imgURL.removeChild(imgURL.lastChild);
        }
    }

    // エラーメッセージをリセット
    setError("");

    try {
        let text;
        
        if (values.url_ === "demo") {
            // デモモードの場合はサンプルテキストを使用
            text = generateDemoText();
        } else {
            // 実際のURLからコンテンツを取得
            try {
                // CORS対応のためAllorigins.winを使用（より安定したCORSプロキシ）
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(values.url_)}`;
                const response = await fetch(proxyUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTPエラー: ${response.status}`);
                }
                
                const html = await response.text();
                
                // HTMLからテキストを抽出
                text = convert(html, {
                    wordwrap: false,
                    selectors: [
                        { selector: 'a', options: { ignoreHref: true } },
                        { selector: 'img', format: 'skip' }
                    ]
                });
            } catch (error) {
                console.error("データ取得エラー:", error);
                setError(`ページの取得に失敗しました: ${error.message || "不明なエラー"}`);
                setLoading(false);
                return;
            }
        }
        
        // 単語の出現頻度をカウント
        const words = await countWords(text, values.remove_ || "");
        
        if (words.length === 0) {
            setError("テキストから単語を抽出できませんでした。別のURLを試してください。");
            setLoading(false);
            return;
        }
        
        const wordCloudData = words.slice(0, 150).map(([text, value]) => ({
            text,
            value
        }));
        
        // D3 Cloudを使用してワードクラウドを生成
        const width = 800;
        const height = 600;
        
        // 新しいキャンバスを作成
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // 背景色を設定
        ctx.fillStyle = "#f8f9fa";
        ctx.fillRect(0, 0, width, height);
        
        // ワードクラウドを生成
        cloud()
            .size([width, height])
            .words(wordCloudData)
            .padding(5)
            .rotate(() => (Math.random() < 0.5 ? 0 : 90))
            .font("'Noto Sans JP', sans-serif")
            .fontSize(d => Math.sqrt(d.value) * 8 + 10)
            .on("end", words => {
                // ワードクラウドの描画
                ctx.translate(width / 2, height / 2);
                
                const colors = [
                    "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
                    "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
                ];
                
                words.forEach((word, i) => {
                    const fontSize = word.size;
                    ctx.font = `${fontSize}px 'Noto Sans JP', sans-serif`;
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.textAlign = "center";
                    ctx.save();
                    ctx.translate(word.x, word.y);
                    ctx.rotate(word.rotate * Math.PI / 180);
                    ctx.fillText(word.text, 0, 0);
                    ctx.restore();
                });
                
                // 画像をPNG形式で取得
                const imgPath = canvas.toDataURL("image/png");
                
                // トップ10の単語を取得
                const top10Words = words.slice(0, 10).map(word => ({
                    text: word.text, 
                    value: word.value
                }));
                
                // 画像要素の作成
                let imgElement = document.createElement('img');
                imgElement.alt = 'ワードクラウド画像';
                imgElement.src = imgPath;
                imgElement.className = 'word-cloud-image';
                
                // ダウンロードリンクの作成
                let ahrefElement = document.createElement("a");
                ahrefElement.innerText = "画像をダウンロード";
                ahrefElement.href = imgPath;
                ahrefElement.download = "word_cloud.png";
                ahrefElement.className = 'download-link';
                
                // ワードリストの作成
                const h3 = document.createElement('h3');
                h3.innerText = "よく使われている単語";
                const uldiv = document.createElement('div');
                uldiv.className = "wordsList";
                
                top10Words.forEach(word => {
                    const div = document.createElement('div');
                    div.className = "wordsList-row";
                    const div1 = document.createElement('div');
                    const div2 = document.createElement('div');
                    div1.className = "word-title";
                    div2.className = "word-numbers";
                    div1.innerText = `${word.text} :`;
                    div2.innerText = `${word.value}回`;
                    div.appendChild(div1);
                    div.appendChild(div2);
                    uldiv.appendChild(div);
                });
                
                // 作成した要素を配置
                setLoading(false);
                showWords.appendChild(h3);
                showWords.appendChild(uldiv);
                showPng.appendChild(imgElement);
                imgURL.appendChild(ahrefElement);
                showWords.style.display = "block";
                
                // URLがデモでない場合のみフォームをリセット
                if (values.url_ !== "demo") {
                    actions.resetForm({
                        values: {
                            url_: "",
                            remove_: "",
                        }
                    });
                }
            })
            .start();
            
    } catch (err) {
        console.error("エラー発生:", err);
        setLoading(false);
        setError(`エラーが発生しました: ${err.message || "不明なエラー"}`);
        ErrorHandler(err);
    }
}

const BlogCloud = ({ transferPage }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    useEffect(() => {
        transferPage();
    }, []);
    
    return (
        <div className="blogcloud-container">
            <div className="blogcloud-header">
                <h1>ワードクラウド生成ツール</h1>
                <p className="blogcloud-description">
                    ブログやウェブページの内容から単語の出現頻度を分析し、視覚的なワードクラウドを作成します。
                    頻繁に使用される単語ほど大きく表示されるため、コンテンツの傾向を一目で把握できます。
                </p>
            </div>
            
            <div className="blogcloud-content">
                <div className="blogcloud-form-container">
                    <Formik
                        initialValues={{
                            "url_": "",
                            "remove_": "",
                        }}
                        validationSchema={validate}
                        onSubmit={(values, actions) => {
                            setLoading(true);
                            generateWordCloud(values, actions, setLoading, setError);
                        }}
                    >
                        <Form className="cloud-form">
                            <div className="input-group">
                                <label htmlFor="url-input">URLを入力してください</label>
                                <Field
                                    id="url-input"
                                    name="url_"
                                    type="text"
                                    placeholder="https://"
                                    className="form-control"
                                />
                                <div className="text-danger error-message">
                                    <ErrorMessage name="url_" />
                                </div>
                                <p className="form-helper">
                                    サンプルを見るには「demo」と入力してください
                                </p>
                            </div>
                            
                            <div className="input-group">
                                <label htmlFor="remove-input">除外したい単語（スペース区切り）</label>
                                <Field
                                    id="remove-input"
                                    name="remove_"
                                    type="text"
                                    placeholder="例: です ます など"
                                    className="form-control"
                                />
                            </div>
                            
                            <button type="submit" className="generate-button" disabled={loading}>
                                {loading ? (
                                    <span>処理中...</span>
                                ) : (
                                    <>
                                        <span className="button-icon">⚡️</span> ワードクラウドを生成
                                    </>
                                )}
                            </button>
                        </Form>
                    </Formik>
                </div>
                
                <div className="showcase" id="blogShowCase">
                    {error && <div className="error-banner">{error}</div>}
                    {loading && <div className="blink loading-text">画像生成中...</div>}
                    <div id="showPng" className="wordcloud-display"></div>
                    <div id="imageURL" className="download-area"></div>
                    <div id="showWords" className="words-list"></div>
                </div>
            </div>
        </div>
    );
}

export default BlogCloud