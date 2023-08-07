import { GitHub, Preview, Shop, WidthWide } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";

function CardPortfolio(props: Portfolio) {
  const { image_path, playstore, title, github, tech, demo_live } = props;

  return (
    <div className="flex flex-col p-3 gap-2 bg-white border-2 border-slate-300 border-grey hover:scale-105 ">
      <img src={image_path} className="aspect-video" alt={image_path} />
      <hr />
      <div className="h-full justify-between flex flex-col gap-4 ">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-ellipsis">{title}</div>
          <div className="flex">
            {tech.map((v) => {
              return (
                <div className="group/tooltip" key={v}>
                  <img
                    src={`assets/svg/${v}.svg`}
                    height={20}
                    width={20}
                    className="mr-2"
                    alt={`${v.toUpperCase()}`}
                  />
                  <span className="group-hover/tooltip:opacity-100 bg-gray-800 px-2 py-1 text-sm text-gray-100 rounded-md absolute opacity-0 -translate-x-3 -translate-y-14">
                    {v}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex">
          {playstore ? (
            <a href={playstore} target="_blank" className="mr-3">
              <div className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-black text-black transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-black hover:text-white">
                <Shop /> Playstore
              </div>
            </a>
          ) : (
            <div></div>
          )}

          <a href={github} target="_blank" className="group mr-3">
            <div className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-black text-black transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-black hover:text-white">
              <GitHub />
              Github
            </div>
          </a>

          {demo_live ? (
            <a href={demo_live} target="_blank" className="mr-3">
              <div className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-black text-black transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-black hover:text-white">
                <Preview /> Demo
              </div>
            </a>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardPortfolio;
