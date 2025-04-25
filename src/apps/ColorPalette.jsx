import React, { useState, useEffect, useMemo } from 'react';
import { setTitleAndDescriptions } from '../utils/setTitleAndDescriptions';
import summaryCard from '../media/sns-big-summary.png';

const ColorPalette = ({ transferPage }) => {
  const [baseColor, setBaseColor] = useState('#4287f5');
  const [palettes, setPalettes] = useState({
    complementary: [],
    analogous: [],
    triadic: [],
    monochromatic: []
  });
  const [copied, setCopied] = useState('');
  const [monoParams, setMonoParams] = useState({
    lightnessRange: 30,
    saturationRange: 30
  });
  const [hexError, setHexError] = useState('');
  
  // ページが読み込まれたときにタイトルと説明を設定
  useEffect(() => {
    transferPage();
    setTitleAndDescriptions(
      'カラーパレットジェネレーター | 配色ツール',
      'ウェブデザインに最適なカラーパレットを自動生成。調和の取れた色の組み合わせを簡単に作成できます。',
      'article',
      'https://tools.itc-app.site/color-palette',
      summaryCard
    );
  }, []);
  
  // 色相環におけるHSL値から色を計算するヘルパー関数
  const calculateHarmony = () => {
    // 16進数からHSLに変換
    let r = parseInt(baseColor.slice(1, 3), 16) / 255;
    let g = parseInt(baseColor.slice(3, 5), 16) / 255;
    let b = parseInt(baseColor.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // 無彩色の場合
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    // 各配色パターンを計算
    const complementary = [
      baseColor,
      hslToHex((h + 180) % 360, s, l)
    ];
    
    const analogous = [
      hslToHex((h + 330) % 360, s, l),
      baseColor,
      hslToHex((h + 30) % 360, s, l)
    ];
    
    const triadic = [
      baseColor,
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 240) % 360, s, l)
    ];
    
    const monochromatic = [
      hslToHex(h, s, Math.max(0, l - monoParams.lightnessRange)),
      baseColor,
      hslToHex(h, s, Math.min(100, l + monoParams.lightnessRange)),
      hslToHex(h, Math.max(0, s - monoParams.saturationRange), l),
      hslToHex(h, Math.min(100, s + monoParams.saturationRange), l)
    ];
    
    setPalettes({
      complementary,
      analogous,
      triadic,
      monochromatic
    });
  };
  
  // HSL値を16進数カラーコードに変換
  const hslToHex = useMemo(() => {
    const cache = {};
    return (h, s, l) => {
      const key = `${h}-${s}-${l}`;
      if (cache[key]) {
        return cache[key];
      }
      
      h /= 360;
      s /= 100;
      l /= 100;
      
      let r, g, b;
      
      if (s === 0) {
        r = g = b = l; // 無彩色の場合
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      
      const toHex = x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      cache[key] = hexColor;
      return hexColor;
    };
  }, []);
  
  // カラーをクリップボードにコピー
  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color).then(() => {
      setCopied(color);
      setTimeout(() => setCopied(''), 2000);
    });
  };
  
  // 基本色が変わったらパレットを再計算
  useEffect(() => {
    calculateHarmony();
  }, [baseColor, monoParams]);
  
  // カラーサンプルを表示
  const ColorSample = ({ color }) => (
    <div 
      className="color-sample" 
      style={{ 
        backgroundColor: color,
        cursor: 'pointer',
        width: '100%',
        height: '60px',
        borderRadius: '4px',
        margin: '5px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isLightColor(color) ? 'black' : 'white',
        transition: 'transform 0.2s'
      }}
      onClick={() => copyToClipboard(color)}
      title="クリックしてカラーコードをコピー"
    >
      <span>{color.toUpperCase()}</span>
      {copied === color && (
        <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>✓ コピーしました</span>
      )}
    </div>
  );
  
  // 明るい色かどうかを判断（テキスト色を決めるため）
  const isLightColor = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  };
  
  return (
    <div className="color-palette-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 className="text-center mb-4">カラーパレットジェネレーター</h1>
      
      <div className="base-color-selector mb-5">
        <label htmlFor="base-color" className="form-label">基本色を選択してください：</label>
        <div className="d-flex align-items-center">
          <input 
            type="color" 
            id="base-color" 
            value={baseColor} 
            onChange={(e) => setBaseColor(e.target.value)} 
            className="form-control me-3" 
            style={{ width: '60px', height: '40px', padding: '2px' }}
          />
          <input 
            type="text" 
            value={baseColor} 
            onChange={(e) => {
              const val = e.target.value;
              if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
                setBaseColor(val);
                setHexError('');
              } else if (val.length === 7) {
                // 無効な16進数コードの場合はエラーメッセージを表示
                setHexError('無効な16進数カラーコードです');
              }
            }} 
            className={`form-control ${hexError ? 'is-invalid' : ''}`} 
            placeholder="#RRGGBB"
            style={{ maxWidth: '120px' }}
          />
          {hexError && (
            <div className="invalid-feedback">
              {hexError}
            </div>
          )}
        </div>
      </div>
      
      {/* モノクロマティックパレットの設定 */}
      <div className="mono-settings mb-4">
        <h5>モノクロマティックパレット設定</h5>
        <div className="mb-3">
          <label htmlFor="lightness-range" className="form-label">明度範囲: {monoParams.lightnessRange}</label>
          <input
            type="range"
            className="form-range"
            id="lightness-range"
            min="10"
            max="50"
            value={monoParams.lightnessRange}
            onChange={(e) => setMonoParams({...monoParams, lightnessRange: parseInt(e.target.value)})}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="saturation-range" className="form-label">彩度範囲: {monoParams.saturationRange}</label>
          <input
            type="range"
            className="form-range"
            id="saturation-range"
            min="10"
            max="50"
            value={monoParams.saturationRange}
            onChange={(e) => setMonoParams({...monoParams, saturationRange: parseInt(e.target.value)})}
          />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h3>補色</h3>
              <p className="mb-0 text-muted">色相環上で180度反対の色</p>
            </div>
            <div className="card-body">
              {palettes.complementary.map((color, index) => (
                <ColorSample key={index} color={color} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h3>類似色</h3>
              <p className="mb-0 text-muted">色相環上で隣接する色</p>
            </div>
            <div className="card-body">
              {palettes.analogous.map((color, index) => (
                <ColorSample key={index} color={color} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h3>トライアド</h3>
              <p className="mb-0 text-muted">色相環上で120度間隔の3色</p>
            </div>
            <div className="card-body">
              {palettes.triadic.map((color, index) => (
                <ColorSample key={index} color={color} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h3>モノクロマティック</h3>
              <p className="mb-0 text-muted">同じ色相で明度と彩度が異なる色</p>
            </div>
            <div className="card-body">
              {palettes.monochromatic.map((color, index) => (
                <ColorSample key={index} color={color} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="usage-tips mt-3 mb-5">
        <h4>使い方</h4>
        <ul>
          <li>好きな基本色を選択すると、自動的に調和の取れた色の組み合わせが表示されます</li>
          <li>色のサンプルをクリックすると、そのカラーコードがコピーされます</li>
          <li>補色：ウェブサイトのアクセントカラーに最適です</li>
          <li>類似色：優しい印象のデザインに向いています</li>
          <li>トライアド：バランスの良い鮮やかなデザインに</li>
          <li>モノクロマティック：洗練された落ち着いたデザインに</li>
        </ul>
      </div>
    </div>
  );
};

export default ColorPalette;