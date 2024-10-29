import { hexToRgbInt } from "@/lib/utils";

export const setLightColor = async ({
  flow,
  deviceId,
  model,
}: {
  flow: number;
  deviceId: string;
  model: string;
}): Promise<void> => {
  console.log("Starting setLightColor function");

  const COLORS = {
    red: hexToRgbInt("#ff0000"),
    purple: hexToRgbInt("#3e24d4"),
    green: hexToRgbInt("#18f523"),
    blue: hexToRgbInt("#0d47a1"),
    default: hexToRgbInt("#fa7d00"),
  };

  console.log("Determining color based on flow value");
  let color;
  if (flow > 2.5) {
    color = COLORS.red;
  } else if (flow > 1.5) {
    color = COLORS.purple;
  } else if (flow > 0.8334) {
    color = COLORS.green;
  } else if (flow > 0.4167) {
    color = COLORS.blue;
  } else {
    color = COLORS.default;
  }

  console.log(`Selected color: ${color}`);

  const payload = {
    requestId: "unique-request-id",
    payload: {
      sku: model,
      device: deviceId,
      capability: {
        type: "devices.capabilities.color_setting",
        instance: "colorRgb",
        value: color,
      },
    },
  };

  console.log("Payload prepared:", payload);

  const headers = {
    "Content-Type": "application/json",
    "Govee-API-Key": process.env.GOVEE_API_KEY || "",
  };

  console.log("Sending request to Govee API");

  try {
    const response = await fetch(
      "https://openapi.api.govee.com/router/api/v1/device/control",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      console.log("Light color set successfully.");
    } else {
      const errorText = await response.text();
      console.error(
        `Failed to set light color. Status code: ${response.status}. Response: ${errorText}`
      );
    }
  } catch (error) {
    console.error("Error setting light color:", error);
  }
};
