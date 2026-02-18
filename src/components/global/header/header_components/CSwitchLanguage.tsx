import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import CDropdown from "@/components/reusable/CDropDown";
import DropdownType from "@/types/DropdownType";

export const LanguageSwitcher: FunctionComponent = () => {
  const router = useRouter();
  const { locales, asPath } = router;
  const [list, setList] = useState<Array<DropdownType>>([]);

  useEffect(() => {
    const setup = () => {
      let newList: Array<DropdownType> | undefined = locales?.map<DropdownType>(
        (e) => ({ id: e, value: languageNames[e] })
      );
      if (newList != undefined) {
        setList(newList);
      }
    };
    setup();
  }, []);

  const languageNames: { [key: string]: string } = {
    en: "English",
    hi: "Hindi",
  };

  if (!locales) {
    return null;
  }

  const onLanguageChange = (e: string) => {
    router.push(asPath, asPath, { locale: e });
  };

  return (
    <CDropdown
      title="Switch language"
      list={list}
      returnValue={(e) => onLanguageChange(e)}
    />
  );
};
