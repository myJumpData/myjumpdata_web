import classNames from "classnames";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useMatch } from "react-router-dom";

export default function AdminNav() {
  const route = useSelector((state: any) => state.route);
  const user = useSelector((state: any) => state.user);
  const currentRoute = useMatch("/admin/*");
  const { t } = useTranslation();

  if (!user?.roles?.includes("admin") || !currentRoute) {
    return <Fragment></Fragment>;
  }

  const adminRoutes = [
    {
      name: t("common:nav_home"),
      key: "home",
      current: currentRoute?.params["*"] === "",
    },
    {
      name: t("common:nav_users"),
      key: "users",
      current: currentRoute?.params["*"]?.match(new RegExp("users(.*)")),
    },
    {
      name: t("common:nav_club"),
      key: "club",
      current: currentRoute?.params["*"]?.match(new RegExp("club(.*)")),
    },
    {
      name: t("common:nav_freestyle"),
      key: "freestyle",
      current: currentRoute?.params["*"]?.match(new RegExp("freestyle(.*)")),
    },
    {
      name: t("common:nav_localization"),
      key: "localization",
      current: currentRoute?.params["*"]?.match(new RegExp("localization(.*)")),
    },
  ];

  return (
    <div className="min-w-[10rem] pl-2 text-black  dark:text-white">
      <div className="flex flex-row md:flex-col">
        <Link to="/admin" className="py-2 px-4 text-lg font-bold">
          {t<string>("common:nav_admin")}
        </Link>
        <div className="flex flex-row overflow-y-auto md:flex-col">
          {adminRoutes.map((item: any) => (
            <Link
              key={item.name}
              to={`/admin/${item.key}`}
              className={classNames(
                "rounded-t-2xl py-2 px-4 md:rounded-l-2xl md:rounded-tr-none",
                { "bg-white dark:bg-black": item.current }
              )}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
