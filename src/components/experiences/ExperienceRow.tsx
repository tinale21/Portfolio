"use client";

import { motion } from "framer-motion";
import { Experience } from "./experiences-data";

export function ExperienceRow({ title, company, mobileCompany, date, location }: Experience) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-1 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
    >
      <div>
        <p className="font-sans text-[16px] font-medium text-black">{title}</p>
        <p className="mt-1 font-sans text-[16px] font-light text-[#7F7F7F]">
          {mobileCompany ? (
            <>
              <span className="lg:hidden">{mobileCompany}</span>
              <span className="hidden lg:inline">{company}</span>
            </>
          ) : (
            company
          )}
        </p>
      </div>
      <div className="sm:text-right">
        <p className="font-sans text-[16px] font-light text-[#7F7F7F]">{date}</p>
        <p className="mt-1 font-sans text-[16px] font-light text-[#7F7F7F]">{location}</p>
      </div>
    </motion.div>
  );
}
