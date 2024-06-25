import React, { createContext, useContext, useEffect, useState } from "react";
import apiService from "./services/appServices";
const BackgroundContext = createContext();
export const useBackgroundColor = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error(
      "useBackgroundColor must be used within a BackgroundProvider"
    );
  }
  return context;
};

export const BackgroundProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState("main-bg-linear");

  const setNewBackgroundColor = (color) => {
    setBackgroundColor(color);
  };

  const [historyList, setHistoryList] = useState({});
  const [h_session_id, setH_session_id] = useState("");
  const [isUpdate, setIsUpdate] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiService("config", "POST", {
          email: localStorage.getItem("email"),
        });
        setHistoryList(result.data?.history_list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (localStorage.getItem("email") != null) fetchData();
  }, [isUpdate]);

  return (
    <BackgroundContext.Provider
      value={{
        backgroundColor,
        setNewBackgroundColor,
        historyList,
        setHistoryList,
        h_session_id,
        setH_session_id,
        setIsUpdate,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};
