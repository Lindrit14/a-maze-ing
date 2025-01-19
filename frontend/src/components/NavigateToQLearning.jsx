import React from "react";
import { useNavigate } from "react-router-dom";

function NavigateToQlearning() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/qlearning")}>Go to Q-learning Runner</button>
  );
}

export default NavigateToQlearning;
