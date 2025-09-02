import { createContext, useState } from "react"; 
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
   
  
  const delaypara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const onSent = async (prompt) => {
    setLoading(true);
    setResultData("");
    setPrevPrompts(prev=>[...prev,input])   
    setRecentPrompt(prompt || input);

    try {
      const response = await runChat(prompt || input);

      
      let responseArray = response.split("**");
      let newResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i % 2 === 1) {
          newResponse += `<b>${responseArray[i]}</b>`;
        } else {
          newResponse += responseArray[i];
        }
      }


      let newResponse2 = newResponse.split("*").join("</br>");
      let newResponseArray = newResponse2.split(" ");

      
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delaypara(i, nextWord + " ");
      }

      setPrevPrompts((prev) => [...prev, prompt || input]);
      setShowResult(true);

    } catch (error) {
      console.error("Error in onSent:", error);
    }

    setLoading(false);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
