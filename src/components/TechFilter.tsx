import { useState, useEffect } from "react";
import Chip from "./Chip";
import { Button } from "./ui/button";
import { FilterIcon } from "lucide-react";

interface Tech {
  name: string;
}

interface TechFilterProps {
  techs: Tech[];
  selectedTech: (selected: string[]) => void;
}

const TechFilter: React.FC<TechFilterProps> = ({ techs, selectedTech }) => {
  // Initialize selectedTechs as an empty array
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Handle selecting or deselecting a chip
  const handleSelectChip = (tech: string) => {
    setSelectedTechs(
      (prevSelected) =>
        prevSelected.includes(tech)
          ? prevSelected.filter((selected) => selected !== tech) // Deselect
          : [...prevSelected, tech] // Select
    );
  };

  // Toggle the filter dropdown
  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Notify the parent component of the selected techs
  useEffect(() => {
    selectedTech(selectedTechs);
  }, [selectedTechs, selectedTech]);

  // Clear all selected technologies
  const handleClearAll = () => {
    setSelectedTechs([]);
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <Button
          className="flex gap-2 justify-center items-center"
          variant={isOpen ? "noShadow" : "default"}
          onClick={handleIsOpen}
        >
          Filter
          <FilterIcon className="h-4" />
        </Button>
        {isOpen && (
          <Button
            variant="danger"
            className="text-white"
            onClick={handleClearAll}
          >
            Clear
          </Button>
        )}
      </div>
      {isOpen && (
        <>
          <div className="flex flex-wrap mt-5">
            {techs.map((tech) => (
              <Chip
                key={tech.name}
                label={tech.name}
                isSelected={selectedTechs.includes(tech.name)}
                onSelect={() => handleSelectChip(tech.name)}
              />
            ))}
          </div>

          <div className="mt-5">
            <strong>Showing: </strong>
            {selectedTechs.length > 0 ? selectedTechs.join(", ") : "All"}
          </div>
        </>
      )}
    </div>
  );
};

export default TechFilter;
