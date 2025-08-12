import React from "react";

import { TabsSide, TabsSideContent, TabsSideList, TabsSideTrigger } from "@/components/ui/tabs-side";

import { SettingAccount } from "./account/setting-account";

export function SettingsBoard({ defaultTab = "account" }: { defaultTab?: "account" | "personalization" }) {
  return (
    <div className="flex flex-col gap-4">
      <TabsSide defaultValue={defaultTab}>
        <TabsSideList className="px-2">
          <TabsSideTrigger value="account">Account</TabsSideTrigger>
          <TabsSideTrigger value="personalization">Personalization</TabsSideTrigger>
        </TabsSideList>
        <TabsSideContent value="account" className="h-[440px] overflow-auto px-4">
          <SettingAccount />
        </TabsSideContent>
        <TabsSideContent value="personalization" className="h-[440px] overflow-auto px-4">
          Tell us about yourself
        </TabsSideContent>
      </TabsSide>
    </div>
  );
}
