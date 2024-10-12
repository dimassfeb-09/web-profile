import { Button } from "./ui/button";

interface ChipProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, isSelected, onSelect }) => {
  return (
    <Button
      variant={isSelected ? "noShadow" : "default"}
      onClick={onSelect}
      className={`cursor-pointer rounded-full justify-center gap-2 inline-flex items-center px-4 py-2 m-1 border transition-colors duration-300 
        ${
          isSelected
            ? "bg-mainAccent text-white  border-mainAccent"
            : "bg-main text-white  hover:bg-main "
        }`}
    >
      <img src={`assets/svg/${label}.svg`} alt={label} className="h-5 w-5" />
      {label}
    </Button>
  );
};

export default Chip;
