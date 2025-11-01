import React from "react";
import { Role } from "../../timeline-entry";

interface TimelineTabsProps {
  activeRole: Role;
  onRoleChange: (role: Role) => void;
}

export const TimelineTabs: React.FC<TimelineTabsProps> = ({
  activeRole,
  onRoleChange,
}) => {
  return (
    <div className="flex gap-4 mb-8 justify-center md:justify-start">
      <button
        onClick={() => onRoleChange("bauträger")}
        className={`px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
          activeRole === "bauträger"
            ? "bg-gradient-to-br from-[#f9c74f]/30 to-[#d4af3a]/30 backdrop-blur-lg border-2 border-[#f9c74f]/50 text-[#f9c74f] shadow-[0_0_24px_rgba(249,199,79,0.2),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(249,199,79,0.3),_0_0_4px_rgba(249,199,79,0.3),_0_16px_68px_rgba(249,199,79,0.1),_0_1px_0_rgba(249,199,79,0.2)_inset] transform scale-105"
            : "bg-gradient-to-br from-[#51646f]/20 to-[#41535c]/20 backdrop-blur-lg border border-[#51646f]/30 text-neutral-300 hover:border-[#f9c74f]/30 hover:text-[#f9c74f] shadow-[0_0_24px_rgba(81,100,111,0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(81,100,111,0.04)]"
        }`}
      >
        Für Bauträger
      </button>
      <button
        onClick={() => onRoleChange("dienstleister")}
        className={`px-6 py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${
          activeRole === "dienstleister"
            ? "bg-gradient-to-br from-[#f9c74f]/30 to-[#d4af3a]/30 backdrop-blur-lg border-2 border-[#f9c74f]/50 text-[#f9c74f] shadow-[0_0_24px_rgba(249,199,79,0.2),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(249,199,79,0.3),_0_0_4px_rgba(249,199,79,0.3),_0_16px_68px_rgba(249,199,79,0.1),_0_1px_0_rgba(249,199,79,0.2)_inset] transform scale-105"
            : "bg-gradient-to-br from-[#51646f]/20 to-[#41535c]/20 backdrop-blur-lg border border-[#51646f]/30 text-neutral-300 hover:border-[#f9c74f]/30 hover:text-[#f9c74f] shadow-[0_0_24px_rgba(81,100,111,0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(81,100,111,0.04)]"
        }`}
      >
        Für Dienstleister
      </button>
    </div>
  );
};

