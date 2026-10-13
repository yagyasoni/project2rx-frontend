// Temperature Logs API (uses the shared axios instance, so token refresh just works)
import api from "@/lib/api";
import type { SavedLog } from "@/app/temperature-logs/history";

type SaveBody = Pick<SavedLog, "setup" | "rows" | "calibration">;

export const listLogs = async (): Promise<SavedLog[]> =>
  (await api.get("/api/temperature-logs")).data.logs;

export const saveLog = async (body: SaveBody): Promise<SavedLog> =>
  (await api.put("/api/temperature-logs", body)).data.log;

export const deleteLog = async (id: string): Promise<void> => {
  await api.delete(`/api/temperature-logs/${id}`);
};
