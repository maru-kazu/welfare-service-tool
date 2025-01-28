import React, { useState, useRef, useEffect } from "react";
import {
  AlarmClockCheck,
  Trash2,
  Save,
  Eye,
  RefreshCw,
  Printer,
} from "lucide-react";

function App() {
  const [age, setAge] = useState("");
  const [support, setSupport] = useState("");
  const [insurance, setInsurance] = useState("");
  const [disease, setDisease] = useState("");
  const [nursing, setNursing] = useState("");
  const [result, setResult] = useState("未判定");
  const [explanation, setExplanation] = useState("");
  const [savedData, setSavedData] = useState([]);
  const [showSavedData, setShowSavedData] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageValue = parseInt(age);
    let serviceResult = "利用不可";
    let serviceExplanation = "";

    if (ageValue < 40) {
      if (support === "true") {
        serviceResult = "障害福祉サービスを利用";
        serviceExplanation =
          "40歳未満で障害支援区分があるため、障害福祉サービスを利用できます。";
      } else {
        serviceResult = "利用不可";
        serviceExplanation =
          "40歳未満で障害支援区分がないため、サービスを利用できません。";
      }
    } else if (ageValue >= 40 && ageValue < 65) {
      if (insurance === "false") {
        if (support === "true") {
          serviceResult = "障害福祉サービスを利用";
          serviceExplanation =
            "40-65歳で医療保険未加入かつ障害支援区分があるため、障害福祉サービスを利用できます。";
        } else {
          serviceResult = "利用不可";
          serviceExplanation =
            "40-65歳で医療保険未加入かつ障害支援区分がないため、サービスを利用できません。";
        }
      } else if (disease === "true") {
        if (nursing === "true") {
          serviceResult = "介護保険サービスを利用";
          serviceExplanation =
            "特定疾病があり、要介護認定を受けているため、介護保険サービスを利用できます。";
        } else {
          serviceResult = "訪問介護サービス（介護保険）を利用";
          serviceExplanation =
            "特定疾病があるため、訪問介護サービス（介護保険）を利用できます。";
        }
      } else {
        serviceResult = "利用不可";
        serviceExplanation =
          "40-65歳で医療保険加入かつ特定疾病がないため、サービスを利用できません。";
      }
    } else if (ageValue >= 65) {
      if (nursing === "true") {
        serviceResult = "介護保険サービスを利用";
        serviceExplanation =
          "65歳以上で要介護認定を受けているため、介護保険サービスを利用できます。";
      } else if (support === "true") {
        serviceResult = "障害福祉サービスを利用";
        serviceExplanation =
          "65歳以上で障害支援区分があるため、障害福祉サービスを利用できます。";
      } else {
        serviceResult = "利用不可";
        serviceExplanation =
          "65歳以上で要介護認定と障害支援区分がないため、サービスを利用できません。";
      }
    }

    setResult(serviceResult);
    setExplanation(serviceExplanation);

    // 判定結果を保存
    const data = {
      age,
      support,
      insurance,
      disease,
      nursing,
      result: serviceResult,
      explanation: serviceExplanation,
      timestamp: new Date().toISOString(),
    };

    const updatedSavedData = JSON.parse(
      localStorage.getItem("welfareServiceData") || "[]"
    );
    updatedSavedData.push(data);
    localStorage.setItem(
      "welfareServiceData",
      JSON.stringify(updatedSavedData)
    );
    setSavedData(updatedSavedData);
  };

  const handleDeleteSavedData = (indexToDelete) => {
    const updatedSavedData = savedData.filter(
      (_, index) => index !== indexToDelete
    );
    setSavedData(updatedSavedData);
    localStorage.setItem(
      "welfareServiceData",
      JSON.stringify(updatedSavedData)
    );
  };

  const handleDeleteAllSavedData = () => {
    setSavedData([]);
    localStorage.removeItem("welfareServiceData");
  };

  useEffect(() => {
    // コンポーネントマウント時に保存されたデータを読み込む
    const storedData = JSON.parse(
      localStorage.getItem("welfareServiceData") || "[]"
    );
    setSavedData(storedData);
  }, []);

  const resetForm = () => {
    setAge("");
    setSupport("");
    setInsurance("");
    setDisease("");
    setNursing("");
    setResult("未判定");
    setExplanation("");
  };

  const printPage = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          福祉サービス判定ツール
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              年齢:
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ラジオボタンコンポーネント */}
          {[
            { label: "障害支援区分", state: support, setState: setSupport },
            {
              label: "医療保険加入状況",
              state: insurance,
              setState: setInsurance,
            },
            { label: "特定疾病", state: disease, setState: setDisease },
            { label: "要介護認定", state: nursing, setState: setNursing },
          ].map(({ label, state, setState }) => (
            <div key={label}>
              <label className="block text-gray-700 font-semibold mb-2">
                {label}:
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={label}
                    value="true"
                    checked={state === "true"}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="mr-2"
                  />
                  はい
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={label}
                    value="false"
                    checked={state === "false"}
                    onChange={(e) => setState(e.target.value)}
                    className="mr-2"
                  />
                  いいえ
                </label>
              </div>
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
            >
              <AlarmClockCheck className="mr-2" /> 判定
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
            >
              <RefreshCw className="mr-2" /> リセット
            </button>
          </div>
        </form>

        {/* 結果表示 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-2">
            結果: {result}
          </h2>
          {explanation && (
            <div className="text-gray-700">
              <h3 className="font-semibold">詳細説明:</h3>
              <p>{explanation}</p>
            </div>
          )}
        </div>

        {/* 保存データ管理 */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-800">
              保存された判定結果
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowSavedData(!showSavedData)}
                className="bg-green-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-green-600 transition"
              >
                <Eye className="mr-2" /> {showSavedData ? "非表示" : "表示"}
              </button>
              {savedData.length > 0 && (
                <button
                  onClick={handleDeleteAllSavedData}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center hover:bg-red-600 transition"
                >
                  <Trash2 className="mr-2" /> すべて削除
                </button>
              )}
            </div>
          </div>

          {showSavedData && (
            <div className="max-h-64 overflow-y-auto">
              {savedData.length === 0 ? (
                <p className="text-gray-500 text-center">
                  保存された判定結果はありません
                </p>
              ) : (
                <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="p-2 text-left">年齢</th>
                      <th className="p-2 text-left">結果</th>
                      <th className="p-2 text-left">日時</th>
                      <th className="p-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedData.map((data, index) => (
                      <tr key={index} className="border-b hover:bg-blue-50">
                        <td className="p-2">{data.age}</td>
                        <td className="p-2">{data.result}</td>
                        <td className="p-2">
                          {new Date(data.timestamp).toLocaleString()}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleDeleteSavedData(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* 印刷ボタン */}
        <div className="mt-4 text-center">
          <button
            onClick={printPage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center hover:bg-blue-600"
          >
            <Printer className="mr-2" /> 印刷
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
