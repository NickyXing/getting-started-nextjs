import { createDemoApp } from 'polotno/polotno-app';
import React, { useState, useEffect, useRef } from 'react';
// import css styles from blueprint framework (used by polotno)
// if you bundler doesn't support such import you can use css from CDN (see bellow)
import '@blueprintjs/core/lib/css/blueprint.css';
import { setTranslations } from 'polotno/config';
import { getTranslations } from 'polotno/config';

const Editor = ({ value = 50, step = '.1', height = null, children }) => {
  useEffect(() => {
    const { store } = createDemoApp({
      container: document.getElementById('root'),
      key: 'y2B0ODYsGlotb1nqLUvQ', // you can create it here: https://polotno.com/cabinet/
      // you can hide back-link on a paid license
      // but it will be good if you can keep it for Polotno project support
      showCredit: true,
    });
    // setTranslations({
    //   sidePanel: {
    //     text: '文本',
    //     templates: '模板',
    //     myFonts: '自定义字体'
    //   },
    // });
    console.log(getTranslations());
  }, []);
  return(
    <div id="root" style={{ width: '100vw', height: '100vh' }}></div>
  )
}

export default Editor;