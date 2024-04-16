import Link from "next/link";
import { useState, useEffect } from "react";
import { Dropdown, Space } from "antd/lib";

const Header = ({ value = 50, step = ".1", height = null, children }) => {
  const [user, setUser] = useState(false);
  const [token, setToken] = useState(false);
  const items = [
    {
      key: "1",
      label: (
        <span>
          Email: {user.email}
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          Credits: {user.credits}
        </span>
      ),
    },
    {
      key: "logout",
      danger: true,
      label: "Log out",
    },
  ];
  const dropDownClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };
  useEffect(() => {
    getUser()
    
  }, []);
  const getUser = () => {
    console.log('getuser');
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      let token = localStorage.getItem("token");
      token ? setToken(token) : setToken("");
      user ? setUser(user) : setUser("");
    } catch (error) {
      console.error(error);
    }
  }
  const onOpenChange = (open) => {
    if (open) {
      
      getUser()
    }
  }
  return (
    <header className="fixed z-30 w-full transition-all shadow-md bg-white/50 backdrop-blur-xl">
      <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 md:flex md:items-center md:gap-3">
            <Link className="block text-blue-500" href="/">
              <span className="sr-only">Home</span>
              <img className="w-12 h-12 " src="https://upload.anytools.me/1713169968913logo.png" alt="" />
            </Link>
            <Link href="/" className="text-lg font-bold text-transparent cursor-pointer bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text">
              Fancyimg
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/removebg"
                  >
                    {" "}
                    Remove background{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/upscale"
                  >
                    {" "}
                    Upscale Image{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/imgedit"
                  >
                    {" "}
                    Image Editor{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/pricing"
                  >
                    {" "}
                    Pricing{" "}
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              {!user && (
                <div className="sm:flex sm:gap-4">
                  <Link
                    className="rounded-md bg-gradient-to-r from-blue-500 to-purple-600 px-7 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring active:text-opacity-75"
                    href="/login"
                  >
                    Log in
                  </Link>

                  <div className="hidden sm:flex">
                    <Link
                      className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-indigo-500"
                      href="/signup"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              )}
              {user && user.id && (
                <div className="sm:flex sm:gap-4">
                  <div className="avatar">
                    <Dropdown
                      menu={{
                        items,
                        onClick: dropDownClick
                      }}
                      onOpenChange={onOpenChange}
                    >
                      <Space>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
                          viewBox="0 0 32 32"
                        >
                          <path
                            fill="rgb(79 70 229)"
                            d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5Z"
                          />
                          <path
                            fill="rgb(79 70 229)"
                            d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm7.992 22.926A5.002 5.002 0 0 0 19 20h-6a5.002 5.002 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0Z"
                          />
                        </svg>
                      </Space>
                    </Dropdown>
                  </div>
                </div>
              )}

              <div className="block md:hidden">
                <button className="p-2 text-gray-600 transition bg-gray-100 rounded hover:text-gray-600/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
