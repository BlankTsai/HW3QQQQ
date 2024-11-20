import React, { useState } from 'react';
import axios from "axios"; // 引入 axios
import './Translator.css'; // 引入 CSS

const QuoteGenerator = () => {
  const [advice, setAdvice] = useState(''); // 狀態以存儲建議
  const [translatedText, setTranslatedText] = useState(''); // 狀態以存儲翻譯結果
  const [language, setLanguage] = useState('zh'); // 預設翻譯語言為中文

  const fetchAdvice = () => {
    axios
      .get("https://api.adviceslip.com/advice")
      .then((response) => {
        const { advice } = response.data.slip;
        setAdvice(advice); // 更新建議狀態
        translateText(advice); // 獲取建議後立即翻譯
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const translateText = (text) => {
    // 使用翻譯 API 進行翻譯
    axios
      .post("https://api.example.com/translate", { // 替換為實際的翻譯 API
        text: text,
        targetLanguage: language,
      })
      .then((response) => {
        setTranslatedText(response.data.translatedText); // 更新翻譯結果
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (advice) {
      translateText(advice); // 語言改變時重新翻譯
    }
  };

  return (
    <div className="container">
      <h2 className="text-center text-black mb-8 text-2xl">Quote Generator and Translator</h2>
      
      <div className="row1">
        <button 
          type="button" 
          onClick={fetchAdvice} // 按鈕用於獲取建議
          className="btn"
        >
          Get Advice
        </button>
      </div>

      {/* 顯示建議 */}
      {advice && (
        <div className="row2">
          <h3 className="text-lg font-semibold">Advice:</h3>
          <p className="outputText">{advice}</p>
        </div>
      )}

      {/* 語言選擇 */}
      <div className="row2">
        <select value={language} onChange={handleLanguageChange}>
          <option value="zh">中文</option>
          <option value="en">English</option>
          {/* 可以添加更多語言選項 */}
        </select>
      </div>

      {/* 顯示翻譯結果 */}
      {translatedText && (
        <div className="row2">
          <h3 className="text-lg font-semibold">Translated Advice:</h3>
          <textarea className="outputText" value={translatedText} readOnly />
        </div>
      )}
    </div>
  );
};

export default QuoteGenerator;