import { Experience } from "./experiences-data";

export function ExperienceRow({ title, company, date, location }: Experience) {
  return (
    <div className="flex flex-col gap-1 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div>
        <p className="font-sans text-[16px] font-medium text-black">{title}</p>
        <p className="mt-1 font-sans text-[16px] font-light text-[#7F7F7F]">{company}</p>
      </div>
      <div className="sm:text-right">
        <p className="font-sans text-[16px] font-light text-[#7F7F7F]">{date}</p>
        <p className="mt-1 font-sans text-[16px] font-light text-[#7F7F7F]">{location}</p>
      </div>
    </div>
  );
}
