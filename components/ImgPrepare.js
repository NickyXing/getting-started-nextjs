import React, { useState, useEffect, useRef } from 'react';

const CompareImage = ({ value = 50, step = '.1', height = null, children }) => {
  const [width, setWidth] = useState(null);
  const [compareWidth, setCompareWidth] = useState(value);
  const containerRef = useRef(null);

  useEffect(() => {
    setWidth(getContainerWidth());
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setCompareWidth(value);
  }, [value]);

  const handleInput = (e) => {
    setCompareWidth(e.target.value);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('input'));
    }
  };

  const handleResize = () => {
    const w = getContainerWidth();
    if (w === width) return;
    setWidth(w);
  };

  const getContainerWidth = () => {
    return containerRef.current ? window.getComputedStyle(containerRef.current, null).getPropertyValue('width') : null;
  };

  return (
    <div className="com_container" ref={containerRef}>
      <div className="compare-wrapper">
        <div className="compare compare_bg">
          <div className="compare__content" style={{ width: width, height: height ? `${height}px` : '100%' }}>
            <div>{children[0]}</div>
          </div>
          <div className="handle-wrap" style={{ left: `calc(${compareWidth + '%'} - var(--handle-line-width) / 2)` }}>
            <div className="handle">
              <svg className="handle__arrow handle__arrow--l feather feather-chevron-left" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <svg className="handle__arrow handle__arrow--r feather feather-chevron-right" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <span className="handle-line"></span>
          </div>
          <div className="compare-overlay" style={{ width: `calc(${compareWidth + '%'})` }}>
            <div className="compare-overlay__content" style={{ width: width }}>
              <div>{children[1]}</div>
            </div>
          </div>
        </div>
        <input type="range" min="0" max="100" step={step} className="compare__range" value={compareWidth} onChange={handleInput} tabIndex="-1" />
      </div>
    </div>
  );
};

export default CompareImage;