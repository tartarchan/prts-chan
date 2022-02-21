import { useState, useEffect, useContext } from "react";
import AppContext from "../AppContext";
import Daily_buttons from "./Daily_buttons";
import Perma_buttons from "./Perma_buttons";
import Selected_options from "./Selected_options";

export default function CC_buttons({
  mapConfig,
  setMultiplier,
  setSpecialMods,
}) {
  const { languageContext, device } = useContext(AppContext);
  const [language] = languageContext;

  let ccConfig = require(`../../cc_config/${mapConfig.config}.json`);
  const [selected, setSelected] = useState([{}]);
  const [totalRisk, setTotalRisk] = useState(0);
  const [toggleRankColor, setToggleRankColor] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const categoryArr = [];
    for (const category of ccConfig) {
      if (!categoryArr.includes(category.category)) {
        categoryArr.push(category.category);
      }
    }
    setSelected(
      categoryArr.map((ele) => {
        return {
          category: ele,
          selected: false,
          option: "",
          tooltip: "",
          target: "",
          effect: [],
        };
      })
    );
  }, []);

  const handleClick = (category, name, tooltip, target, effect, rank) => {
    //   console.log("name",name)
    //   console.log("category", category)
    //   console.log(selected)
    const categoryIndex = -1;
    for (let i = 0; i < selected.length; i++) {
      //check if button has been selected before
      if (selected[i].category === category) {
        categoryIndex = i;
      }
      if (selected[i].option === name) {
        setSelected(
          selected.map((item, index) => {
            if (index === i) {
              return {
                category: item.category,
                selected: false,
                option: "",
                target: "",
                tooltip: "",
                effect: [],
                rank: 0,
              };
            } else {
              return item;
            }
          })
        );
        return;
      }
    }
    // if button has not been selected before
    // console.log("here")
    setSelected(
      selected.map((item, index) => {
        if (index === categoryIndex) {
          return {
            category: item.category,
            selected: true,
            option: name,
            tooltip: tooltip,
            target: target,
            effect: effect,
            rank: rank,
          };
        } else {
          return item;
        }
      })
    );
  };

  const toggleOptionColor = (category, name) => {
    for (const item of selected) {
      if (item.category === category) {
        if (item.option === name) {
          return "bg-blue-500";
        } else if (item.selected) {
          return "bg-rose-600";
        } else {
          return "";
        }
      }
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "bg-gray-500";
      case 2:
        return "bg-gray-800";
      case 3:
        return "bg-red-800";
    }
  };

  useEffect(() => {
    const multiplier = {
      ALL: { hp: 1, atk: 1, def: 1, mdef: 0, aspd: 1, ms: 1, weight: 0 },
    };
    const other_mods = {};
    for (const category of selected) {
      if (category.selected) {
        if (!multiplier[category.target]) {
          multiplier[category.target] = {
            hp: 1,
            atk: 1,
            def: 1,
            mdef: 0,
            aspd: 1,
            ms: 1,
            weight: 0,
          };
        }
        for (const effect in category.effect) {
          if (effect !== "special") {
            if (category.effect[effect][0] === "%") {
              multiplier[category.target][effect] +=
                parseInt(category.effect[effect].slice(1)) / 100;
            } else {
              multiplier[category.target][effect] = category.effect[effect];
            }
          } else {
            other_mods[category.target] = category.effect[effect];
          }
        }
      }
    }
    setSpecialMods(other_mods);
    setMultiplier(multiplier);
    setTotalRisk(selected.reduce((prev, curr) => prev + (curr.rank ?? 0), 0));
  }, [selected]);

  const resetSelected = () => {
    setSelected(
      selected.map((item) => {
        return {
          category: item.category,
          selected: false,
          option: "",
          target: "",
          tooltip: "",
          effect: [],
          rank: 0,
        };
      })
    );
  };

  return (
    <>
      {mapConfig.ccType === "perma" ? (
        <div>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`text-xs font-semibold text-center py-1 px-2 border rounded-lg ${
              showGrid ? "bg-gray-400" : "border-gray-400"
            }`}
          >
            Toggle Grids
          </button>
          <button
            onClick={() => setToggleRankColor(!toggleRankColor)}
            className={`text-xs font-semibold text-center py-1 px-2 border rounded-lg ${
              toggleRankColor ? "bg-gray-400" : "border-gray-400"
            }`}
          >
            Toggle Color
          </button>
        </div>
      ) : null}

      {mapConfig.ccType === "perma" ? (
        <Perma_buttons
          ccConfig={ccConfig}
          handleClick={handleClick}
          toggleOptionColor={toggleOptionColor}
          getRankColor={getRankColor}
          language={language}
          showGrid={showGrid}
          toggleRankColor={toggleRankColor}
        />
      ) : (
        <Daily_buttons
          ccConfig={ccConfig}
          handleClick={handleClick}
          toggleOptionColor={toggleOptionColor}
          getRankColor={getRankColor}
          language={language}
        />
      )}
      <Selected_options selected={selected} />
      <div className="flex flex-wrap border border-gray-800 w-full h-[50px] max-w-[900px] py-2 select-none place-items-center bg-[#292929]">
        <div
          className="flex flex-wrap bg-white border rounded border-gray-800 mx-1 px-1 h-[80%] cursor-pointer active:bg-gray-400"
          onClick={resetSelected}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentcolor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <p className="font-semibold">クリア</p>
        </div>
        <div className="flex flex-wrap flex-col px-2 h-[110%] border-r-2 border-r-black leading-[16px] text-white">
          <div className="w-full">
            <p className="text-[10px] ">危機等級</p>
          </div>
          <div className="w-full">
            <p className="text-right text-[20px]">{totalRisk}</p>
          </div>
        </div>
      </div>
    </>
  );
}