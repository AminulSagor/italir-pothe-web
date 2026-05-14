interface Props {
  selectedColor: string;
  onChange: (color: string) => void;
}

const colors = ["#DCEBF6", "#F6E8D4", "#DDEEEE", "#EADDF0"];

export default function ColorPicker({ selectedColor, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={`size-10 rounded-full border-2 transition ${
            selectedColor === color ? "border-[#006B3F]" : "border-transparent"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}

      <div className="h-8 w-px bg-[#D8DED7]" />

      <button
        type="button"
        className="rounded-full border border-[#D8DED7] bg-[#F4F6F3] px-5 py-2 text-sm text-[#4D574F]"
      >
        ⛓ CUSTOM
      </button>
    </div>
  );
}
