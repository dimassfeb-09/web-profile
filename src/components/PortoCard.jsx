import React from "react";

function PortoCard(props) {

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const onClickUrl = (url) => {
        return () => openInNewTab(url)
    }

    return <div
        className="h-96 w-96 bg-gradient-to-r from-primaryColor to-sky-300  text-white flex flex-col justify-between rounded-xl border-2">
        <img
            src={`/assets/img/${props.image}`}
            alt="Skill List"
            className="bg-fixed h-[70%] w-full rounded-r-lg rounded-l-lg"
        />
        <div className="p-2 h-[30%]">
            <span className="font-bold text-lg">{props.title}</span>
            <div className="border-red-500">
                {
                    props.techs?.map((item, i) => <span>{item}. </span>)
                }
            </div>
        </div>

        <div className="p-2 flex text-black gap-2 hover:cursor-pointer">
            {
                props.github ? <div className="px-2 py-1 bg-white rounded-sm text-sm hover:bg-black hover:text-white"
                                    onClick={onClickUrl(props.github)}>Github
                </div> : <></>
            }
            {
                props.playstore ? <div className="px-2 py-1 bg-white rounded-sm text-sm hover:bg-black hover:text-white"
                                       onClick={onClickUrl(props.playstore)}>Playstore
                </div> : <></>
            }
        </div>
    </div>;
}

export default PortoCard;
