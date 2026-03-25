interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-container">
      <input
        type="search"
        id="search-input"
        placeholder="Search by title, description, or code..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
