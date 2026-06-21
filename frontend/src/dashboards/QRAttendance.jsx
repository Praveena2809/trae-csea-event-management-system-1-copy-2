import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Html5Qrcode } from "html5-qrcode";
import { api } from "../services/api";
import { useLocation } from "react-router-dom";
export default function QRAttendance() {
  const regionId = "qr-reader";
  const scannerRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [last, setLast] = useState(null);
  const location = useLocation();

const {
  subeventId,
  sessionNumber,
} = location.state || {};

console.log(
  "Subevent:",
  subeventId,
  "Session:",
  sessionNumber
);

  useEffect(() => {
    return () => {
      try {
        scannerRef.current?.stop?.();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  const start = async () => {
    if (running) return;
    const scanner = new Html5Qrcode(regionId);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          try {
            const parsed = JSON.parse(decodedText);
            const qrToken = parsed.qrToken;
            if (!qrToken) throw new Error("Invalid QR payload");

            const { data } = await api.post(
              "/registrations/attendance/scan",
              {
                qrToken,
                sessionNumber,
              }
            );
            
            setLast(data.registration);
            toast.success("Attendance marked");
          } catch (err) {
            toast.error(err?.response?.data?.message || err.message || "Scan failed");
          }
        }
      );
      setRunning(true);
    } catch (err) {
      toast.error("Camera permission / scanner error");
    }
  };

  const stop = async () => {
    try {
      await scannerRef.current?.stop();
      await scannerRef.current?.clear();
    } catch (e) {
      // ignore
    }
    setRunning(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">QR Attendance</h3>
          <p className="text-sm text-green-600">
  Session: {sessionNumber}
</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Scan participant QR to mark attendance.</p>
        </div>
        <div className="flex gap-2">
          {!running ? (
            <button onClick={start} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Start Scanner
            </button>
          ) : (
            <button onClick={stop} className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900">
              Stop
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
          <div id={regionId} />
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="font-semibold text-slate-900 dark:text-white">Last scan</p>
          {last ? (
            <div className="mt-2 text-sm text-slate-700 dark:text-slate-200">
              <p>Registration: {last._id}</p>
              <p>Status: {last.status}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">No scans yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

