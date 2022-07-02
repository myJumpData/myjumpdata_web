import classNames from "classnames";
import { lazy, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaInstagram } from "react-icons/fa";
import { HiCog, HiUser } from "react-icons/hi";
import { IoIosList, IoIosTimer, IoMdPeople } from "react-icons/io";
import { IoAppsOutline, IoMusicalNotes } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useMatch } from "react-router-dom";
import FooterNav from "../components/FooterNav";
import Navbar from "../components/Navbar";
import useBreakpoint from "../hooks/useBreakpoint";
import { getUserSearch } from "../service/users.service";
import Alert from "./Alert";
import Player from "./Player";

const AdminNav = lazy(() => import("./AdminNav"));

export default function Wrapper({ children }: { children: ReactNode }) {
  const user = useSelector((state: any) => state.user);
  const route = useMatch("*")?.params["*"] + "X";
  const currentRoute = useMatch("*");
  const { t } = useTranslation();

  const [image, setImage] = useState<null | string>(null);

  const breakpoint = useBreakpoint();
  const isSmall = breakpoint === "xs" || breakpoint === "sm";

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      getUserSearch(user.username).then((response) => {
        setImage(response.data.picture ?? "");
      });
    }
  }, [user]);

  return (
    <div
      className={classNames(
        "flex min-h-screen flex-col overflow-x-hidden bg-gray-100 dark:bg-gray-900",
        { "pb-12": !(route === "live") }
      )}
    >
      <Player />
      <Navbar
        bottom={
          Object.keys(user).length !== 0
            ? [
                ...(user?.roles?.includes("admin")
                  ? [
                      {
                        name: t("common:nav_admin"),
                        to: "/admin",
                        icon: <IoAppsOutline />,
                        current: currentRoute?.params["*"]?.match(
                          new RegExp("admin(.*)")
                        ),
                      },
                    ]
                  : []),
                {
                  name: t("common:nav_groups"),
                  icon: <IoMdPeople />,
                  to: "/group",
                  current: currentRoute?.params["*"]?.match(
                    new RegExp("group(.*)")
                  ),
                },
                {
                  name: t("common:nav_speeddata"),
                  to: "/speeddata/own",
                  icon: <IoIosTimer />,
                  current: currentRoute?.params["*"] === "speeddata/own",
                },
                {
                  name: t("common:nav_freestyle"),
                  to: "/freestyle/own",
                  icon: <IoIosList />,
                  current: currentRoute?.params["*"]?.match(
                    new RegExp("freestyle/own(.*)")
                  ),
                },
                {
                  name: t("common:nav_player"),
                  to: "/player",
                  icon: <IoMusicalNotes />,
                  current: currentRoute?.params["*"] === "player",
                },
                {
                  name: t("common:nav_profile"),
                  to: `/u/${user.username}`,
                  current:
                    currentRoute?.params["*"] === "settings" ||
                    currentRoute?.params["*"]?.match(new RegExp("u/(.*)")),
                  icon: (
                    <img
                      src={
                        image ||
                        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                      }
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                      height="2rem"
                      width="2rem"
                    />
                  ),
                },
              ]
            : []
        }
        navigation={
          !isSmall
            ? [
                {
                  name: t("common:nav_home"),
                  to: "/",
                  current: currentRoute?.params["*"] === "",
                },
                ...(Object.keys(user).length === 0
                  ? [
                      {
                        name: t("common:nav_login"),
                        to: "/login",
                        current: currentRoute?.params["*"] === "login",
                      },
                      {
                        name: t("common:nav_signup"),
                        to: "/register",
                        current: currentRoute?.params["*"] === "register",
                      },
                    ]
                  : [
                      {
                        name: t("common:nav_speeddata"),
                        to: "/speeddata/own",
                        current: currentRoute?.params["*"] === "speeddata/own",
                      },
                      {
                        name: t("common:nav_freestyle"),
                        to: "/freestyle/own",
                        current: currentRoute?.params["*"]?.match(
                          new RegExp("freestyle/own(.*)")
                        ),
                      },
                      {
                        name: t("common:nav_player"),
                        to: "/player",
                        current: currentRoute?.params["*"] === "player",
                      },
                      {
                        name: t("common:nav_groups"),
                        to: "/group",
                        current: currentRoute?.params["*"]?.match(
                          new RegExp("group(.*)")
                        ),
                      },
                      ...(user?.roles?.includes("admin")
                        ? [
                            {
                              name: t("common:nav_admin"),
                              to: "/admin",
                              current: currentRoute?.params["*"]?.match(
                                new RegExp("admin(.*)")
                              ),
                            },
                          ]
                        : []),
                    ]),
              ]
            : []
        }
        dropdown={
          Object.keys(user).length > 0 && !isSmall
            ? [
                {
                  icon: <HiUser />,
                  name: t("common:nav_profile"),
                  to: `/u/${user.username}`,
                },
                {
                  icon: <HiCog />,
                  name: t("common:nav_settings"),
                  to: "/settings",
                },
              ]
            : []
        }
        dropdownButton={
          !isSmall && Object.keys(user).length > 0 ? (
            <img
              src={
                image ||
                "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
              }
              alt="Profile"
              className="h-8 w-8 rounded-full object-cover"
              height="2rem"
              width="2rem"
            />
          ) : undefined
        }
        action={
          !!currentRoute?.params["*"]?.match(new RegExp("u/(.*)"))
            ? { name: t("common:nav_settings"), to: "/settings" }
            : isSmall && Object.keys(user).length === 0
            ? currentRoute?.params["*"] === "register" ||
              currentRoute?.params["*"] === ""
              ? {
                  name: t("common:nav_login"),
                  to: "/login",
                }
              : {
                  name: t("common:nav_signup"),
                  to: "/register",
                }
            : undefined
        }
      />
      <div className="flex h-full w-full grow flex-col md:flex-row">
        <AdminNav />
        <div className="min-w-0 grow rounded-tl-3xl bg-white p-4 text-black dark:bg-black dark:text-white sm:p-8">
          <div className="mb-auto flex flex-col space-y-8">
            <Alert />
            {children}
          </div>
        </div>
      </div>
      {route === "live" ? null : (
        <FooterNav
          social={[
            {
              link: "https://instagram.com/myJumpData",
              icon: <FaInstagram />,
              name: "Instagram",
            },
          ]}
          links={[
            {
              heading: t("common:nav_trust_legal"),
              links: [
                {
                  name: t("common:nav_terms"),
                  to: "/terms",
                },
                {
                  name: t("common:nav_legal"),
                  to: "/legal",
                },
              ],
            },
          ]}
        />
      )}
    </div>
  );
}
