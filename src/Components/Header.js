import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const navigateUI = () => {
    if (window.location.pathname == "/prompt") {
      navigate("/upload");
    } else {
      navigate("/prompt");
    }
  };
  return (
    <div spacing={12}>
      <div
        item
        xs={12}
        display="flex"
        className="text-center"
        justifyContent="center"
      >
        <div>
          <p className="mt-0 text-blue">
            <i>
              The Private & Secure Gen AI App for Medical Affairs.&nbsp;
              <span className="learn-more" onClick={() => navigate("/faq")}>
                Learn more
              </span>
            </i>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
