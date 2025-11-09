"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { FiPlusCircle, FiBarChart2, FiLogOut, FiLogIn } from "react-icons/fi";

export default function Navbar() {
  const { token, logout } = useAppContext();
  const pathname = usePathname();

  // Don't render navbar on login and register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <Link
            href="/prescriptions"
            className="text-base sm:text-xl font-bold text-gray-900 hover:text-gray-700"
          >
            PrescriptionApp
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            {token ? (
              <>
                <Link
                  href="/prescriptions/create"
                  className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 flex items-center gap-1 sm:gap-2"
                >
                  <FiPlusCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Create Prescription</span>
                  <span className="sm:hidden">Create</span>
                </Link>
                <Link
                  href="/report"
                  className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 flex items-center gap-1 sm:gap-2"
                >
                  <FiBarChart2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span>Report</span>
                </Link>
                <button
                  onClick={logout}
                  className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base bg-gray-900 text-white hover:bg-gray-700 border border-gray-900 flex items-center gap-1 sm:gap-2"
                >
                  <FiLogOut size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-base bg-gray-900 text-white hover:bg-gray-700 border border-gray-900 flex items-center gap-1 sm:gap-2"
              >
                <FiLogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
