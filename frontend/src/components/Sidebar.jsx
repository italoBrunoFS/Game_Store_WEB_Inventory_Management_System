import React from "react";
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaUserCircle, FaSignOutAlt, FaUserTie } from "react-icons/fa";
import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
      isParent: true,
    },
    {
      name: "Produtos",
      path: "/admin-dashboard/products",
      icon: <FaBox />,
      isParent: false,
    },
    {
      name: "Compras",
      path: "/admin-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: "Clientes",
      path: "/admin-dashboard/clients",
      icon: <FaUsers />,
      isParent: false,
    },
    {
      name: "Perfil",
      path: "/admin-dashboard/profile",
      icon: <FaUserCircle />,
      isParent: false,
    },
    {
      name: "Logout",
      path: "/admin-dashboard/logout",
      icon: <FaSignOutAlt />,
      isParent: false,
    },
  ];

  if (user?.role === "Gerente") {
    menuItems.splice(4, 0, {
      name: "Funcionários",
      path: "/admin-dashboard/employees",
      icon: <FaUserTie />,
      isParent: false,
    });
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white w-16 md:w-64 fixed">
      <div className="h-16 flex items-center justify-center">
        <span className="hidden md:block text-xl font-bold">GameHouse</span>
        <span className="md:hidden text-xl font-bold">IMS</span>
      </div>

      <div>
        <ul className="space-y-2 p-2">
          {menuItems.map((item) => {
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.isParent}
                  className={({ isActive }) =>
                    `${
                      isActive ? "bg-gray-700 " : ""
                    }flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition duration-200`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="hidden md:block">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
