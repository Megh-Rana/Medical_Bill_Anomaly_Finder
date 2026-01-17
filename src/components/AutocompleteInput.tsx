import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { cn } from "./ui/utils";

interface AutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function AutocompleteInput({
    value,
    onChange,
    placeholder,
    className
}: AutocompleteInputProps) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fetch suggestions from backend
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (value.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            try {
                const url = `https://mbaf-backend.onrender.com/medicines/search?q=${encodeURIComponent(value)}`;

                const response = await fetch(url);

                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data);
                    setShowSuggestions(data.length > 0);
                }
            } catch (error) {
                console.error("AutocompleteInput: Failed to fetch suggestions:", error);
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [value]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
                break;
            case "Enter":
                e.preventDefault();
                if (selectedIndex >= 0) {
                    onChange(suggestions[selectedIndex]);
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                }
                break;
            case "Escape":
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={className}
                autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
                <div
                    className="fixed z-[9999] mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto"
                    style={{
                        top: wrapperRef.current ? wrapperRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
                        left: wrapperRef.current ? wrapperRef.current.getBoundingClientRect().left + window.scrollX : 0,
                        width: wrapperRef.current ? wrapperRef.current.getBoundingClientRect().width : 'auto',
                        minWidth: '300px'
                    }}
                >
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className={cn(
                                "px-3 py-2 cursor-pointer text-sm transition-colors",
                                index === selectedIndex
                                    ? "bg-accent text-accent-foreground"
                                    : "hover:bg-muted"
                            )}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
