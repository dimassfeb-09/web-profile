type propsExperience = {
  title: string;
  position: string;
  started: string;
  ended: string;
  description?: string[] | null;
};

export default function CardExperiences(props: propsExperience) {
  const { title, position, started, ended, description } = props;

  return (
    <div className="flex w-3/4 md:w-1/2">
      <div className="border-2 border-secondary/60"></div>
      <div className="ml-3 text-xl">
        <div className="absolute h-5 w-5 rounded-full bg-secondary -translate-x-6 translate-y-7"></div>
        <div>
          <h4 className="font-bold mt-[1.5rem]">{title}</h4>
          <h5 className="italic text-lg">
            {position} | {started} - {ended}
          </h5>
        </div>
        {description ? (
          <div className="bg-stone-400/20 p-2 mt-5 rounded-lg text-lg">
            <ol className="list-item text-justify">
              {description?.map((val) => (
                <li>{val}</li>
              ))}
            </ol>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
