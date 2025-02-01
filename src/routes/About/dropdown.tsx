import { useState, useRef, useEffect } from "react";
import { TechType } from "../../components/technology";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
    options: TechType[];
    onSelect: (option: TechType | null) => void;
}

export function Dropdown({ options, onSelect }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<TechType | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: TechType | null) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block w-36" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="py-2 px-4 rounded flex justify-between w-full h-full text-left shadow-lg transition-colors duration-300 hover:bg-white/5 active:bg-purple-700/20"
                type="button"
            >
                {selectedOption || "All"}
                <ChevronDown />
            </button>

            {isOpen && (
                <div
                    className="absolute z-10 w-full mt-2 rounded-md shadow-lg focus:outline-none bg-black/70"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                    style={{
                        backdropFilter: "blur(10px)",
                    }}
                >
                    <div className="py-1" role="none">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className="group block w-full text-left px-4 py-2 text-sm hover:bg-white/5
                                "
                                role="menuitem"
                                tabIndex={-1}
                            >
                                <span
                                    className="bg-gradient-to-r from-white to-purple-500 
                                bg-[length:300%_150%] bg-left group-hover:bg-right 
                                transition-all duration-300 text-transparent bg-clip-text"
                                >
                                    {option}
                                </span>
                            </button>
                        ))}
                        <button
                            onClick={() => handleOptionClick(null)}
                            className="group block w-full text-left px-4 py-2 text-sm  hover:bg-white/5 hover:text-white/90"
                            role="menuitem"
                            tabIndex={-1}
                        >
                            <span
                                className="bg-gradient-to-r from-pink-500 to-white
                                bg-[length:300%_150%] bg-right group-hover:bg-left 
                                transition-all duration-300 text-transparent bg-clip-text"
                            >
                                All
                            </span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
