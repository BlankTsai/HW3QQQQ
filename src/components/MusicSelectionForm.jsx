import React, { useState } from 'react';
import axios from "axios"; // 引入 axios
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import './Translator.css'; // 引入 CSS

const MusicSelectionForm = ({ songs }) => {
  const [advice, setAdvice] = useState(''); // 狀態以存儲建議
  const [translatedText, setTranslatedText] = useState('Translation'); // 狀態以存儲翻譯結果
  const navigate = useNavigate(); // 使用 useNavigate

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

  const translateText = async (text) => {
    if (!text) return;

    const url = 
      `https://microsoft-translator-text-api3.p.rapidapi.com/translate?to=zh-Hant&from=en&textType=plain`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': "1a7588ea89msh583747bb627c967p16e6c7jsn4c9032e9b975",
        'x-rapidapi-host': 'microsoft-translator-text-api3.p.rapidapi.com'
      },
      body: JSON.stringify([{ Text: text }])
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      const translation = result[0].translations[0].text;
      setTranslatedText(translation); // 更新翻譯結果
    } catch (error) {
      console.log(error);
      alert("Please Try Again! Some Error Occurred at your side");
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

      {/* 顯示翻譯結果 */}
      {translatedText && (
        <div className="row2">
          <h3 className="text-lg font-semibold">Translated Advice:</h3>
          <p className="outputText">{translatedText}</p>
        </div>
      )}

      {/* 回上一頁按鈕 */}
      <div className="row2">
        <button 
          onClick={() => navigate(-1)} // 使用 navigate(-1) 返回上一頁
          className="btn"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MusicSelectionForm;