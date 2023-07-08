import React from "react";

function SkillCard(props) {
    return (
        <div
            className="flex items-center bg-white h-36 w-72 sm:h-44 sm:w-96 md:h-36 md:w-80 lg:w-96 lg:h-44 justify-center border shadow-md rounded-lg">
            <img
                src={`/assets/img/${props.image}`}
                alt="Skill List"
                className="h-24 p-2"
            />
        </div>
    );
}

export default SkillCard;
