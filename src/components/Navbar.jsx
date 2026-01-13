import { Menu, Plus} from "lucide-react";
import ThemeSwitch from "./Switch";
import { useTheme } from "../context/ThemeContext";
import { useLogout } from "../hooks/mutations";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";


export default function Navbar({ toggleSidebar }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { mutate: logoutMutate, isPending } = useLogout();

  const handleLogout = (e) => {
    e.preventDefault(); // prevent any default behavior
    if (isPending) return; // prevent double clicks

    logoutMutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("pm_user");
        setTimeout(() => navigate("/login"), 500);
      }, 
    
    });
  };

  return (
    <nav
      className={`flex justify-between items-center p-4 shadow-md transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3 ml-auto">
       

          <motion.button
          
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                    disabled={isPending}
                  onClick={handleLogout}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-md transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 hover:bg-gray-700 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-800"
                  }`}
                >
                   
                  {isPending ? "Logging out..." : "Logout"}
                </motion.button>

        
        <ThemeSwitch />
      </div>
    </nav>
  );
}