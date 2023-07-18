import { Shop, GitHub } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";

function CardPortfolio(props: {
  title: string;
  imgPath: string;
  playstore?: string;
  tech: string[];
  github: string;
}) {
  const { imgPath, playstore, title, github, tech } = props;

  return (
    <div className="group/source flex flex-col p-3 gap-2 bg-white border border-grey hover:bg-[#161515] hover:text-white">
      <LazyLoadImage height={300} src={imgPath} alt={imgPath} />
      <hr />
      <div className="h-[20%] flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-ellipsis">{title}</div>
          <div className="flex">
            {
              tech.map((v)=> {
                return <div className="mr-1" key={v}>{v}</div>;
              })
            }
          </div>
        </div>
        <div className="flex text-white">
          {playstore ? (
            <a href={playstore} target="_blank" className="mr-1">
              <div className="flex items-center gap-2 py-1 px-2 border bg-black hover:bg-blue-500 group-hover/source:text-white group-hover/source:border">
                <Shop></Shop> Playstore
              </div>
            </a>
          ) : (
            <div></div>
          )}
          <a href={github} target="_blank">
            <div className="flex items-center gap-2 py-1 px-2 border bg-black hover:bg-blue-500 group-hover/source:text-white group-hover/source:border">
              <GitHub></GitHub>Github
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default CardPortfolio;
