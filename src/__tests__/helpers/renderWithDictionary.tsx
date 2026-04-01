import { render, type RenderOptions } from "@testing-library/react";
import { DictionaryProvider } from "@/components/DictionaryProvider";
import en from "@/app/[lang]/dictionaries/en.json";

export function renderWithDict(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <DictionaryProvider dictionary={en} lang="en">
        {children}
      </DictionaryProvider>
    ),
    ...options,
  });
}

export { en };
