import { Laptop } from "@mui/icons-material";

type propsCard = {
  title: string;
  className: string;
};

export default function CardDevelopment(props: propsCard) {
  return (
    <div className="w-48 h-16 border-2 rounded-xl flex justify-center items-center gap-2 bg-white">
      <div
        className={`h-10 w-10 border-2 rounded-full flex justify-center items-center ${props.className} text-white`}
      >
        <Laptop />
      </div>
      <div>
        <h4 className="font-bold text-sm">{props.title}</h4>
        <span className="text-xs">3 Projects</span>
      </div>
    </div>
  );
}
