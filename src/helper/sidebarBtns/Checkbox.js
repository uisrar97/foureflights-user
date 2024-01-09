import React from "react";

function Checkbox(props) {
  const handleChange = (event) => {
    props.handle(event);
  };
  return (
    <div className="form-group form-check m-0">
      <input
        type="checkbox"
        className={
          props.airline
            ? "form-check-input airline-checkbox"
            : "form-check-input"
        }
        onChange={handleChange}
        id={props.name}
        name={props.name}
        value={props.value}
        checked={props.checked}
      />
      <i htmlFor={props.name} />
      <label
        className={
          props.airline || props.stopfilter
            ? "form-check-label airlinename-size"
            : "form-check-label"
        }
        htmlFor={props.name}
      >
        {props.title}
      </label>
    </div>
  );
}

export default Checkbox;
