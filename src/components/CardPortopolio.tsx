import { Shop, GitHub } from "@mui/icons-material";
import { LazyLoadImage } from "react-lazy-load-image-component";

function CardPortopolio(props: {
  title: string;
  imgPath: string;
  playstore?: string;
  github: string;
}) {
  const { imgPath, playstore, title, github } = props;

  return (
    <div className="group/source flex flex-col p-3 gap-2 bg-white border border-grey hover:bg-[#161515] hover:text-white">
      <LazyLoadImage height={300} src={imgPath} alt={imgPath} />
      <hr />
      <div className="h-[20%] flex flex-col gap-1">
        <div className="font-bold text-ellipsis">{title}</div>
        <div className="flex gap-2">
          <div>Flutter</div>
          <div>BloC State Management</div>
          <div>Firebase</div>
        </div>
        <div className="flex gap-2 text-white">
          {playstore ? (
            <a href={playstore} target="_blank">
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

export default CardPortopolio;
