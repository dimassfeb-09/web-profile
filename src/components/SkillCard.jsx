import React from "react";

function SkillCard(props) {
  return (
    <div className="flex items-center bg-white h-32 w-72 justify-center border shadow-md rounded-lg">
      <img
        src={`/assets/img/${props.image}`}
        alt="Skill List"
        className="h-24 p-2"
      />
    </div>
  );
}

export default SkillCard;
