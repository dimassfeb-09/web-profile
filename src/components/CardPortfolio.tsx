import {GitHub, Shop} from "@mui/icons-material";
import {LazyLoadImage} from "react-lazy-load-image-component";

function CardPortfolio(props: Portfolio) {
    const {image_path, playstore, title, github, tech} = props;

    return (
        <div
            className="flex flex-col p-3 gap-2 bg-white border-2 border-slate-300 border-grey hover:scale-105 ">
            {
                image_path ? <LazyLoadImage height={300} src={image_path} alt={image_path}/> : <div>NO IMAGE</div>
            }
            <hr/>
            <div className="h-[20%] flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <div className="font-bold text-ellipsis">{title}</div>
                    <div className="flex">
                        {tech.map((v) => {
                            return <div className="group/tooltip">
                                <img src={`assets/svg/${v}.svg`} height={20} width={20} className="mr-2"
                                     alt={`${v.toUpperCase()}`}/>
                                <span
                                    className="group-hover/tooltip:opacity-100 bg-gray-800 px-2 py-1 text-sm text-gray-100 rounded-md absolute opacity-0 -translate-x-3 -translate-y-14">{v}</span>
                            </div>;
                        })}
                    </div>
                </div>
                <div className="flex">
                    {playstore ? (<a href={playstore} target="_blank" className="mr-3">
                        <div
                            className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-black text-black transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-black hover:text-white">
                            <Shop/> Playstore
                        </div>
                    </a>) : (
                        <div></div>
                    )}

                    <a href={github} target="_blank" className="group">
                        <div
                            className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-black text-black transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-black hover:text-white">
                            <GitHub/>Github
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default CardPortfolio;

