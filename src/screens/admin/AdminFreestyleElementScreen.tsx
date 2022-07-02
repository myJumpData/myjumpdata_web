import classNames from "classnames";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Flag from "react-world-flags";
import AuthVerify from "../../common/AuthVerify";
import AdminActionBar from "../../components/AdminActionBar";
import Breadcrumb from "../../components/Breadcrumb";
import Button from "../../components/Button";
import { TextInput, TextInputInline } from "../../components/Input";
import { LANGUAGES } from "../../Constants";
import {
  deleteFreestyle,
  getFreestyleElement,
  getFreestyleTranslation,
  updateFreestyleElementGroups,
  updateFreestyleElementKey,
  updateFreestyleElementLevel,
} from "../../service/admin.service";
import { getFreestyle } from "../../service/freestyle.service";

export default function AdminFreestyleElementScreen() {
  useEffect(() => {
    AuthVerify({
      isAdmin: true,
    });
  }, []);
  const params = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [freestyleElementData, setFreestyleElementData] = useState<
    | {
        id: string;
        key: string;
        translation: any;
        compiled: boolean;
        level: string;
        groups: { _id: string; key: string; parent: string }[];
      }
    | undefined
  >();
  const [del, setDel] = useState(false);
  const [translation, setTranslation] = useState<any>({});
  const [newGroup, setNewGroup] = useState<any>();
  const [newGroupValid, setNewGroupValid] = useState<undefined | boolean>();
  const [keyNew, setKeyNew] = useState<undefined | string>();
  const [keyNewValid, setKeyNewValid] = useState<undefined | boolean>();

  const getData = () => {
    getFreestyleElement(params.id as string).then((response: any) => {
      if (response.key === "error.freestyle.notfound") {
        navigate(-1);
      } else {
        setFreestyleElementData(response.data);
        getFreestyleTranslation(response.data?.key).then((res) => {
          setTranslation(res.data);
        });
      }
    });
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setNewGroupValid(undefined);
    if (newGroup) {
      getFreestyle(newGroup).then((res) => {
        if (res.status === 200) {
          setNewGroupValid(res.data.length > 0);
        } else {
          setNewGroupValid(false);
        }
      });
    }
  }, [newGroup]);

  useEffect(() => {
    setKeyNewValid(undefined);
    if (keyNew && keyNew !== "") {
      getFreestyleTranslation(keyNew).then((res) => {
        if (res.status === 200) {
          setTranslation(res.data);
          setKeyNewValid(Object.keys(res.data).length > 0);
        } else {
          setKeyNewValid(false);
        }
      });
    }
  }, [keyNew]);

  return (
    <>
      <AdminActionBar
        text={`${t<string>("common:nav_freestyle")}${
          freestyleElementData
            ? ` - ${freestyleElementData.key
                .split("_")
                .map((item) => t<string>(`freestyle:${item}`))
                .join(" ")}`
            : ""
        }`}
        actions={[
          {
            icon: IoTrash,
            onClick: () => {
              setDel(true);
            },
          },
        ]}
      />
      {freestyleElementData && (
        <>
          <table>
            <tbody>
              <tr>
                <td className="font-bold">id</td>
                <td>{freestyleElementData.id}</td>
              </tr>
              <tr>
                <td className="font-bold">key</td>
                <td>
                  <TextInputInline
                    inputName="elementName"
                    value={freestyleElementData.key}
                    onChange={setKeyNew}
                    valid={keyNewValid}
                    onSubmit={(value) => {
                      if (!keyNewValid) {
                        return;
                      }
                      updateFreestyleElementKey(
                        freestyleElementData.id,
                        value
                      ).then(() => {
                        getData();
                      });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">level</td>
                <td>
                  <TextInputInline
                    inputName="elementName"
                    value={freestyleElementData.level}
                    onSubmit={(value) => {
                      updateFreestyleElementLevel(
                        freestyleElementData.id,
                        value
                      ).then(() => {
                        getData();
                      });
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="font-bold">Compiled</td>
                <td>{freestyleElementData.compiled ? "true" : "false"}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold">Groups</span>
              <span
                className="opacity-75 transition hover:scale-125 hover:opacity-100"
                onClick={() => {
                  setNewGroup("");
                }}
              >
                <FaPlus />
              </span>
            </div>
            {freestyleElementData.groups.map((group) => (
              <div className="my-2 flex items-center" key={group.key}>
                <div
                  className={classNames("grow", {
                    "pr-4": freestyleElementData.groups.length > 1,
                  })}
                >
                  <Breadcrumb
                    data={group.key.split("_")}
                    setState={() => {
                      return;
                    }}
                  />
                </div>
                {freestyleElementData.groups.length > 1 && (
                  <span
                    className="cursor-pointer opacity-75 transition hover:scale-125 hover:opacity-100"
                    onClick={() => {
                      updateFreestyleElementGroups(
                        freestyleElementData.id,
                        freestyleElementData.groups
                          .filter((g) => {
                            return group.key !== g.key;
                          })
                          .map((r) => r.key)
                      ).then(() => {
                        getData();
                        setNewGroupValid(undefined);
                        setNewGroup(undefined);
                      });
                    }}
                  >
                    <IoTrash />
                  </span>
                )}
              </div>
            ))}
            {newGroup !== undefined && (
              <div className="rounded-2xl border-2 border-gray-500/50 p-4">
                <TextInput
                  type="text"
                  stateChange={setNewGroup}
                  value={newGroup}
                  name="Group Key"
                  valid={newGroupValid}
                />
                <Breadcrumb
                  data={newGroupValid ? newGroup.split("_") : []}
                  setState={() => {
                    return;
                  }}
                />
                <Button
                  name="Save"
                  design={newGroupValid ? "success" : "secondary"}
                  onClick={() => {
                    if (!newGroupValid) {
                      return;
                    }
                    updateFreestyleElementGroups(freestyleElementData.id, [
                      ...freestyleElementData.groups.map((e) => e.key),
                      newGroup,
                    ]).then(() => {
                      getData();
                      setNewGroupValid(undefined);
                      setNewGroup(undefined);
                    });
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <span className="font-bold">Translations</span>
            {LANGUAGES.map((lang) => (
              <div
                className="my-2 flex h-8 items-center space-x-2 overflow-hidden rounded-lg bg-gray-500/50 px-4 py-2"
                key={lang}
              >
                <span className="flex h-full w-12 items-center">
                  <Flag code={lang === "en" ? "gb" : lang} />
                </span>

                <span className="px-4 py-2">
                  {(keyNew && keyNew !== ""
                    ? keyNew
                    : // eslint-disable-next-line no-unsafe-optional-chaining
                      freestyleElementData?.key
                  )
                    .split("_")
                    .map((item) => {
                      if (translation[lang]) {
                        return translation[lang][item];
                      }
                      return null;
                    })
                    .join(" ")}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <DelOverlay />
    </>
  );

  function DelOverlay() {
    const navigate = useNavigate();

    return (
      <div
        className={
          "top-0 left-0 flex h-full w-full flex-col justify-center p-4 backdrop-blur backdrop-filter " +
          (del ? "fixed z-50" : "z-0 hidden")
        }
        onClick={() => {
          setDel(false);
        }}
      >
        <div className="mx-auto flex max-w-prose flex-col space-y-4 rounded-lg bg-gray-300/75 p-4 dark:bg-gray-600/75">
          <span className="text-xl font-bold">
            Are you sure you want to delete this Freestyle?
          </span>
          <Button
            name="Delete"
            design="danger"
            onClick={() => {
              if (freestyleElementData) {
                deleteFreestyle(freestyleElementData.id).then((response) => {
                  if (response.status === 200) {
                    setDel(false);
                    navigate(-1);
                  }
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}
