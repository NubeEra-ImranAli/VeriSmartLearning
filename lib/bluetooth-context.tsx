import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import {
  scanAndSelectDevice,
  connectToDevice,
  disconnectDevice,
  sendCommand as btSendCommand,
  isConnected as btIsConnected,
  isBluetoothSupported,
  BluetoothDevice,
} from "@/lib/bluetooth";

interface BluetoothContextValue {
  device: BluetoothDevice | null;
  isConnected: boolean;
  isScanning: boolean;
  isSupported: boolean;
  error: string | null;
  scanAndConnect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendCommand: (command: string) => Promise<boolean>;
  clearError: () => void;
}

const BluetoothContext = createContext<BluetoothContextValue | null>(null);

export function BluetoothProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [connected, setConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSupported = useMemo(() => isBluetoothSupported(), []);

  const scanAndConnect = useCallback(async () => {
    setError(null);
    setIsScanning(true);
    try {
      const selectedDevice = await scanAndSelectDevice();
      if (!selectedDevice) {
        setIsScanning(false);
        return;
      }

      setDevice(selectedDevice);
      await connectToDevice(selectedDevice);
      setConnected(true);

      selectedDevice.device.addEventListener(
        "gattserverdisconnected",
        () => {
          setConnected(false);
          setDevice(null);
        }
      );
    } catch (err: any) {
      setError(err.message || "Failed to connect");
      setConnected(false);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await disconnectDevice();
    } catch {}
    setDevice(null);
    setConnected(false);
    setError(null);
  }, []);

  const sendCommandHandler = useCallback(
    async (command: string): Promise<boolean> => {
      setError(null);
      try {
        await btSendCommand(command);
        return true;
      } catch (err: any) {
        setError(err.message || "Failed to send command");
        return false;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({
      device,
      isConnected: connected,
      isScanning,
      isSupported,
      error,
      scanAndConnect,
      disconnect,
      sendCommand: sendCommandHandler,
      clearError,
    }),
    [
      device,
      connected,
      isScanning,
      isSupported,
      error,
      scanAndConnect,
      disconnect,
      sendCommandHandler,
      clearError,
    ]
  );

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
}

export function useBluetooth() {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error("useBluetooth must be used within BluetoothProvider");
  }
  return context;
}
