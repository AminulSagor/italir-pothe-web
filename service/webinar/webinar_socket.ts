import { io, type Socket } from "socket.io-client";

import { service_URL } from "@/config/env";
import { getToken } from "@/utils/cookies_util";

export const webinarSocketUrl = `${service_URL.replace(/\/$/, "")}/webinars`;

export const createWebinarSocket = (): Socket => {
  const token = getToken();

  return io(webinarSocketUrl, {
    transports: ["websocket"],
    autoConnect: false,
    auth: token ? { token } : undefined,
    extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
