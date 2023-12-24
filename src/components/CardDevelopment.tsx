type propsCard = {
  title: string;
  className: string;
  icon: any;
};

export default function CardDevelopment(props: propsCard) {
  return (
    <div className="w-56 h-20 sm:w-60 sm:h-20 md:w-96 md:h-28 border-2 rounded-xl flex justify-center items-center gap-2 md:gap-10 bg-white">
      <div
        className={`h-10 w-10 md:w-20 md:h-20 border-2 rounded-full flex justify-center items-center ${props.className} text-white`}
      >
        {props.icon}
      </div>
      <div>
        <h4 className="font-bold text-sm md:text-2xl">{props.title}</h4>
        <span className="text-xs md:text-lg">3 Projects</span>
      </div>
    </div>
  );
}
