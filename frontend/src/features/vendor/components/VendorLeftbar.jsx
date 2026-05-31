import React from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth } from "../../auth/VendorAuthContext";
import Logo from "../../../assets/logo.svg";
import Home from "../../../assets/home.svg";
import QR from "../../../assets/qr1.svg";
import Notification from "../../../assets/notification.svg";
import Complaint from "../../../assets/complaint2.svg";
import Wastage from "../../../assets/food1.svg";
import Logout from "../../../assets/logout.svg";

function NavItem({ icon, label, onClick }) {
  return (
    <div className="flex items-end gap-3 cursor-pointer group w-max" onClick={onClick}>
      <img src={icon} alt="" className="h-6 w-6 object-contain group-hover:brightness-0 group-hover:grayscale transition-all" />
      <div className="text-zinc-600 text-lg group-hover:text-black transition-all">{label}</div>
    </div>
  );
}

function VendorLeftbar() {
  const navigate = useNavigate();
  const { logoutVendor, vendorMess } = useVendorAuth();

  return (
    <div className="h-full w-full bg-white p-10 flex flex-col items-center gap-20">
      <div className="flex items-center gap-2 w-full h-max">
        <img src={Logo} className="h-12" alt="Mess Diary logo" />
        <div>
          <div className="text-2xl font-semibold">Mess Diary</div>
          <div className="text-xs text-[#5352ed] font-medium">{vendorMess?.messName} Vendor</div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-6">
        <NavItem icon={Home} label="Home" onClick={() => navigate("/vendor/dashboard")} />
        <NavItem icon={QR} label="Scanner" onClick={() => navigate("/vendor/dashboard/scanner")} />
        <NavItem icon={Notification} label="Notifications" onClick={() => navigate("/vendor/dashboard/notifications")} />
        <NavItem icon={Complaint} label="Complaints" onClick={() => navigate("/vendor/dashboard/complaints")} />
        <NavItem icon={Wastage} label="Wastage" onClick={() => navigate("/vendor/dashboard/wastage")} />
        <NavItem icon={Logout} label="Logout" onClick={logoutVendor} />
      </div>
    </div>
  );
}

export default VendorLeftbar;
