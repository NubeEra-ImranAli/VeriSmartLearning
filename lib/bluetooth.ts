import { Platform } from "react-native";

const BLE_SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
const BLE_CHARACTERISTIC_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";

export interface BluetoothDevice {
  id: string;
  name: string;
  device: any;
}

let connectedDevice: any = null;
let characteristic: any = null;
let gattServer: any = null;

function isWebBluetoothAvailable(): boolean {
  if (Platform.OS !== "web") return false;
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

export async function scanAndSelectDevice(): Promise<BluetoothDevice | null> {
  if (!isWebBluetoothAvailable()) {
    throw new Error(
      "Bluetooth is only available in Chrome browser on Android/Desktop. Open this app in Chrome to use Bluetooth."
    );
  }

  try {
    const device = await (navigator as any).bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [BLE_SERVICE_UUID],
    });

    return {
      id: device.id,
      name: device.name || "Unknown Device",
      device,
    };
  } catch (err: any) {
    if (err.name === "NotFoundError") {
      return null;
    }
    throw err;
  }
}

export async function connectToDevice(
  btDevice: BluetoothDevice
): Promise<boolean> {
  try {
    if (gattServer && gattServer.connected) {
      await disconnectDevice();
    }

    const device = btDevice.device;
    gattServer = await device.gatt.connect();

    device.addEventListener("gattserverdisconnected", () => {
      connectedDevice = null;
      characteristic = null;
      gattServer = null;
    });

    try {
      const service = await gattServer.getPrimaryService(BLE_SERVICE_UUID);
      characteristic = await service.getCharacteristic(
        BLE_CHARACTERISTIC_UUID
      );
    } catch {
      const services = await gattServer.getPrimaryServices();
      if (services.length > 0) {
        const chars = await services[0].getCharacteristics();
        if (chars.length > 0) {
          characteristic = chars[0];
        }
      }
    }

    connectedDevice = btDevice;
    return true;
  } catch (err) {
    console.error("Connection failed:", err);
    throw err;
  }
}

export async function disconnectDevice(): Promise<void> {
  try {
    if (gattServer && gattServer.connected) {
      gattServer.disconnect();
    }
  } catch (err) {
    console.error("Disconnect error:", err);
  }
  connectedDevice = null;
  characteristic = null;
  gattServer = null;
}

export async function sendCommand(command: string): Promise<boolean> {
  if (!characteristic) {
    throw new Error("No device connected. Please connect a Bluetooth device first.");
  }

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(command + "\n");
    await characteristic.writeValue(data);
    return true;
  } catch (err) {
    console.error("Send command failed:", err);
    throw err;
  }
}

export function getConnectedDevice(): BluetoothDevice | null {
  return connectedDevice;
}

export function isConnected(): boolean {
  return !!(gattServer && gattServer.connected && characteristic);
}

export function isBluetoothSupported(): boolean {
  return isWebBluetoothAvailable();
}
