import { ref, type Ref } from "vue";
import { AddPopup } from "./useDefault";

export type NoticeTone = "info" | "success" | "error";

export type NoticeAction = {
  label: string;
  /** A link to follow, or omit and give `run` instead. */
  href?: string;
  run?: () => void;
};

export type NoticeState = {
  tone: NoticeTone;
  body: string;
  action?: NoticeAction;
};

export const NOTICE: Ref<NoticeState> = ref({ tone: "info", body: "" });

/**
 * Put a one-shot message in front of the user. Replaces the silent failures the
 * menu callbacks used to have - every path now says something.
 */
export const Notify = {
  value: (
    title: string,
    body: string,
    tone: NoticeTone = "info",
    action?: NoticeAction,
  ) => {
    NOTICE.value = { tone, body, action };

    AddPopup.value(
      { title },
      () => import("@/main/components/popup/Notice.vue"),
      true,
    );
  },
  index: "Notify",
};

export const GetNotice = {
  value: NOTICE,
  index: "GetNotice",
};

export const list = {
  index: "notice",
  list: [Notify, GetNotice],
};

export default list;
