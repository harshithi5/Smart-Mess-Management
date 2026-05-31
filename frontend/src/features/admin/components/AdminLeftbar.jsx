import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../auth/AdminAuthContext";
import Logo from "../../../assets/logo.svg";
import Home from "../../../assets/home.svg";
import Menu from "../../../assets/food.svg";
import Ratings from "../../../assets/graph.svg";
import Wastage from "../../../assets/food1.svg";
import Complaint from "../../../assets/complaint2.svg";
import Notification from "../../../assets/notification.svg";
import Logout from "../../../assets/logout.svg";

function NavItem({ icon, label, onClick }) {
  return (
    <div className="flex items-end gap-3 cursor-pointer group w-max" onClick={onClick}>
      <img src={icon} alt="" className="h-6 w-6 object-contain group-hover:brightness-0 group-hover:grayscale transition-all" />
      <div className="text-zinc-600 text-lg group-hover:text-black transition-all">{label}</div>
    </div>
  );
}

function AdminLeftbar() {
  const navigate = useNavigate();
  const { logoutAdmin } = useAdminAuth();

  return (
    <div className="h-full w-full bg-white p-10 flex flex-col items-center gap-20">
      <div className="flex items-center gap-2 w-full">
        <img src={Logo} className="h-12" alt="Mess Diary logo" />
        <div>
          <div className="text-2xl font-semibold">Mess Diary</div>
          <div className="text-xs text-[#5352ed] font-medium">Admin</div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        <NavItem icon={Home} label="Overview" onClick={() => navigate("/admin/dashboard")} />
        <NavItem icon={Menu} label="Menu" onClick={() => navigate("/admin/dashboard/menu")} />
        <NavItem icon={Ratings} label="Ratings" onClick={() => navigate("/admin/dashboard/ratings")} />
        <NavItem icon={Wastage} label="Wastage" onClick={() => navigate("/admin/dashboard/wastage")} />
        <NavItem icon={Complaint} label="Complaints" onClick={() => navigate("/admin/dashboard/complaints")} />
        <NavItem icon={Notification} label="Notifications" onClick={() => navigate("/admin/dashboard/notifications")} />
        <NavItem icon={Logout} label="Logout" onClick={logoutAdmin} />
      </div>
    </div>
  );
}

export default AdminLeftbar;
