"use client";

import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type SharedProps = {
  error?: string;
  label: string;
  name: string;
};

type InputProps = SharedProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type TextareaProps = SharedProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

type Props = InputProps | TextareaProps;

export function Input(props: Props) {
  const baseClassName =
    "w-full rounded-[1.4rem] border border-[#e5d2b4] bg-white px-4 py-3.5 text-sm text-[#24190e] outline-none transition focus:border-[#b98a46] focus:ring-4 focus:ring-[#f4e5c9]";

  if (props.multiline) {
    const { error, label, className, multiline: multilineFlag, ...textareaProps } = props;
    void multilineFlag;

    return (
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <textarea
          {...textareaProps}
          className={`${baseClassName} min-h-28 resize-none ${className ?? ""}`}
        />
        {error ? (
          <span className="text-sm font-medium text-rose-600">{error}</span>
        ) : null}
      </label>
    );
  }

  const { error, label, className, multiline: multilineFlag, ...inputProps } = props;
  void multilineFlag;

  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input {...inputProps} className={`${baseClassName} ${className ?? ""}`} />
      {error ? (
        <span className="text-sm font-medium text-rose-600">{error}</span>
      ) : null}
    </label>
  );
}
