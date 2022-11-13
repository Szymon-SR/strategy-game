import React, { useState } from "react"


function AttackPopup(props) {
    const [sliderValue, setSliderValue] = useState(1);
  
    const changeSlider = (event) => {
      setSliderValue(parseInt(event.target.value));
    };
  
    function handleSendIt() {
      console.log(typeof sliderValue)
      props.handlePlayerActions({ type: "move", source_id: props.sourceId, target_id: props.targetId, count: sliderValue });
      setSliderValue(1);
      props.popupOff();
    }
  
    return (
      <div className="modal">
        <div className="modal_content">
  
          <p>Send soldiers</p>
          <div className="slider-panel">
            <input
              type="range"
              onChange={changeSlider}
              min={1}
              max={props.availableSoldiers}
              step={1}
              className="attack-slider"
              value={sliderValue}
            ></input>
            <p>{sliderValue}</p>
          </div>
          <div className="popup-buttons">
            <button className="attack-close" onClick={props.popupOff}>
              Cancel
            </button>
            <button className="attack-confirm" onClick={handleSendIt}>
              Send It
            </button>
          </div>
        </div>
      </div>
    );
  }

  export { AttackPopup };