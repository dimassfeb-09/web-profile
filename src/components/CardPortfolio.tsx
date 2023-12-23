import { GitHub, Preview, Shop } from "@mui/icons-material";

function CardPortfolio(props: Portfolio) {
  const { image_path, playstore, title, github, tech, demo_live } = props;

  return (
    <div className="flex flex-col p-5 md:mx-0 gap-2 rounded-md bg-white dark:bg-darkColor border-2 dark:border-[1px] duration-300">
      <img src={image_path} className="aspect-video" alt={image_path} />
      <hr />
      <div className="h-full  flex flex-col gap-4 ">
        <div className="flex flex-col gap-2">
          <div className="font-bold text-ellipsis">
            <span>{title}</span>
          </div>
          <div className="flex">
            {tech.map((v, _) => {
              return (
                <>
                  <span className="group/tooltip ml-1 flex justify-center">
                    <span
                      className="hidden group-hover/tooltip:inline-block rounded group-hover/tooltip:absolute
                                -translate-y-6 bg-black text-white text-xs p-1"
                    >
                      {v}
                    </span>
                    <span>
                      <img
                        className="inline-flex"
                        src={`assets/svg/${v}.svg`}
                        height={20}
                        width={20}
                        alt={`${v.toUpperCase()}`}
                      />
                    </span>
                  </span>
                </>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between mt-5">
          <div className="flex text-black dark:text-white">
            {playstore ? (
              <a href={playstore} target="_blank" className="mr-3">
                <div className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-primary dark:border-white transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-secondary hover:text-white">
                  <Shop /> Playstore
                </div>
              </a>
            ) : (
              <div></div>
            )}

            <a href={github} target="_blank" className="group mr-3">
              <div className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-gray-300 dark:border-white transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-secondary hover:text-white">
                <GitHub />
                Github
              </div>
            </a>

            {demo_live ? (
              <a href={demo_live} target="_blank" className="mr-3">
                <div className="flex items-center text-[1rem] gap-2 py-1 px-2 border border-gray-300 dark:border-white transition-colors duration-100 ease-in-out hover:scale-105 hover:bg-secondary hover:text-white">
                  <Preview /> Demo
                </div>
              </a>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardPortfolio;
