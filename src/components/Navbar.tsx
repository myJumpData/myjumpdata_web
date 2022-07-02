import { Disclosure, Menu, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, ReactElement, ReactNode } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import useBreakpoint from "../hooks/useBreakpoint";

export default function Navbar({
  navigation,
  dropdown,
  dropdownButton,
  bottom,
  action,
}: {
  navigation: { name: string; to: string; current: boolean }[];
  dropdown?: { icon: ReactElement; name: string; to: string }[];
  dropdownButton?: ReactElement;
  bottom: {
    name: string;
    to: string;
    current: boolean;
    icon: ReactNode;
  }[];
  action?: { name: string; to: string };
}) {
  const breakpoint = useBreakpoint();

  return (
    <div className="pb-16">
      {(breakpoint === "xs" || breakpoint === "sm") && bottom.length > 0 ? (
        <div className="text-back fixed bottom-0 z-50 flex w-full justify-around border-t-2 border-gray-500 bg-white dark:bg-black dark:text-white">
          {bottom.map((item, index) => {
            if (!item) {
              return null;
            }
            return (
              <Link
                key={index}
                to={item.to}
                className={classNames(
                  "flex flex-col items-center justify-center px-2 py-2",
                  { "text-yellow-500": item.current }
                )}
              >
                <span className="text-3xl leading-none">{item.icon}</span>
                <span className="pt-2 text-[.75rem] leading-none">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      ) : null}
      <Disclosure
        as="nav"
        className="fixed z-20 w-full bg-gray-100 dark:bg-gray-900"
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
              <div className="relative flex h-16 items-center justify-between">
                {navigation?.length > 0 ? (
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-500/25 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:text-gray-200"
                      aria-label="menu button"
                    >
                      {open ? (
                        <HiX className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <HiMenu className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                ) : null}
                <div
                  className={classNames(
                    "flex flex-1 items-center sm:justify-start",
                    {
                      "justify-center sm:items-stretch": navigation?.length > 0,
                    },
                    { "justify-start": !(navigation?.length > 0) }
                  )}
                >
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                      <img
                        className="h-8 w-auto scale-150"
                        src={Logo}
                        alt="myJumpData"
                        height="2rem"
                        width="2rem"
                      />
                      {navigation?.length > 0 ? null : (
                        <span className="text-2xl font-bold text-black dark:text-white">
                          myJumpData
                        </span>
                      )}
                    </Link>
                  </div>
                  {navigation.length > 0 ? (
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {navigation.map((item, index) => {
                          if (!item) {
                            return null;
                          }
                          return (
                            <Link
                              key={index}
                              to={item.to}
                              className={classNames(
                                {
                                  "bg-gray-500/50 text-black  hover:bg-gray-500/25 dark:text-white":
                                    item.current,
                                },
                                {
                                  "text-gray-700 hover:bg-gray-500/25 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-100":
                                    !item.current,
                                },
                                "whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
                {dropdownButton && dropdown ? (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div className="inset-y-0 flex items-center ring-0">
                        <Menu.Button className="rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-gray-800 dark:focus:ring-offset-white">
                          {dropdownButton}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="max-w-48 absolute right-0 mt-2 origin-top-right rounded-md bg-white py-1 text-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-black dark:text-gray-200">
                          {dropdown.map((e, index) => {
                            if (!e) {
                              return null;
                            }
                            return (
                              <Menu.Item key={index}>
                                {({ active }) => (
                                  <Link
                                    to={e.to}
                                    className={classNames(
                                      {
                                        "bg-gray-100 dark:bg-gray-900": active,
                                      },
                                      "flex items-center justify-start px-4 py-2 text-sm leading-none"
                                    )}
                                  >
                                    <span className="mr-2 text-base">
                                      {e.icon}
                                    </span>
                                    <span>{e.name}</span>
                                  </Link>
                                )}
                              </Menu.Item>
                            );
                          })}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : action ? (
                  <Link
                    to={action.to}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-300/30 hover:text-gray-800 dark:text-gray-200 dark:hover:bg-gray-500/30 dark:hover:text-gray-100"
                  >
                    {action.name}
                  </Link>
                ) : null}
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3">
                {navigation.map((item, index) => {
                  if (!item) {
                    return null;
                  }
                  return (
                    <Disclosure.Button
                      key={index}
                      as={Link}
                      to={item.to}
                      className={classNames(
                        {
                          "bg-gray-300/50 text-black hover:bg-gray-300/75 dark:bg-gray-500/50 dark:text-white dark:hover:bg-gray-500/75":
                            item.current,
                        },
                        {
                          "text-gray-700 hover:bg-gray-300/30 hover:text-gray-800 dark:text-gray-200 dark:hover:bg-gray-500/30 dark:hover:text-gray-100":
                            !item.current,
                        },
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                })}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
