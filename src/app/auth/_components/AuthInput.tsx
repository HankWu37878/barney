import React from "react";


type Props = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

function AuthInput({ label, type, value, setValue }: Props) {
  return (
    <input
      id={label}
      type={type}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      className="w-full rounded-md lg:text-xl text-sm py-4 ml-2 px-2"
      placeholder={label}
    />
  );
}

export default AuthInput;