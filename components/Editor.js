// import { createDemoApp } from 'polotno/polotno-app';
import { observer } from "mobx-react-lite";
import React, { useState, useEffect, useRef } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { setTranslations } from "polotno/config";
import { getTranslations } from "polotno/config";

import { createStore } from "polotno/model/store";
const store = createStore();
const page = store.addPage();

// page.addElement({
//   x: 50,
//   y: 50,
//   type: 'text',
//   fill: 'black',
//   text: 'hello',
// });

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";

const RemoveBg = observer(({ store, element, elements }) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const [error, setError] = useState(null);
  const [removeBgOutputs, setRemoveBgOutputs] = useState(null);
  console.log(element.src);
  // remove bg
  const removeBg = async (element) => {
    if (typeof window === "undefined") return; // 确保在客户端环境中运行
    const response = await fetch("/api/replacebg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        input: {
          image: element? element.src: ''
        },
      }),
    });
    let removeBgOutputs = await response.json();
    if (response.status !== 200) {
      setError(removeBgOutputs.detail);
      return;
    }
    setRemoveBgOutputs(removeBgOutputs);

    while (
      removeBgOutputs.status !== "succeeded" &&
      removeBgOutputs.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/replacebg/" + removeBgOutputs.id);
      removeBgOutputs = await response.json();
      if (response.status !== 200) {
        setError(removeBgOutputs.detail);
        return;
      }
      console.log({ removeBgOutputs });
      setRemoveBgOutputs(removeBgOutputs);
      if(removeBgOutputs.output) {
        element.set({
          src: removeBgOutputs.output,
        })
      }
    }
  };
  return (null
  );
});

const Editor = ({ value = 50, step = ".1", height = null, children }) => {
  useEffect(() => {
    // 手动翻译
    setTranslations({
      sidePanel: {
        text: "text",
        templates: "templates",
        myFonts: "myFonts",
      },
    });
    console.log(store);
  }, []);
  return (
    <div>
      <PolotnoContainer
        style={{
          width: "100vw",
          height: "calc( 100vh - 64px )",
        }}
      >
        <SidePanelWrap>
          <SidePanel store={store} />
        </SidePanelWrap>
        <WorkspaceWrap>
          <Toolbar
            store={store}
            downloadButtonEnabled
            components={{
              ImageRemoveBackground: RemoveBg,
            }}
          />
          <Workspace store={store} />
          <ZoomButtons store={store} />
        </WorkspaceWrap>
      </PolotnoContainer>
    </div>
  );
};

export default Editor;
